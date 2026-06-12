// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import "server-only";
import { Resend } from "resend";
import { getConvexClient } from "../../../lib/convexClient";
import { api } from "convex/_generated/api";

const FROM = "10minCUET <noreply@10minjee.com>";

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

/** Returns the most recent Monday at 00:00 UTC as a Unix timestamp (ms). */
function getWeekStart(): number {
  const now = new Date();
  const day = now.getUTCDay(); // 0 = Sunday, 1 = Monday, …
  const daysToMonday = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() - daysToMonday);
  monday.setUTCHours(0, 0, 0, 0);
  return monday.getTime();
}

function activeHtml(name: string, rankText: string, readinessScore: number): string {
  return `<div style="font-family:sans-serif;max-width:600px;margin:auto">
  <h2 style="color:#f97316">10min<span style="color:#111">JEE</span></h2>
  <p>Hey ${name}! You're on fire this week.</p>
  <p style="font-size:24px;font-weight:900;color:#111">${rankText}</p>
  <p>Your readiness score: <strong>${readinessScore}%</strong></p>
  <a href="https://10minjee.com/topics" style="background:#f97316;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Continue Studying</a>
</div>`;
}

function dormantHtml(name: string): string {
  return `<div style="font-family:sans-serif;max-width:600px;margin:auto">
  <h2 style="color:#f97316">10min<span style="color:#111">JEE</span></h2>
  <p>Hey ${name}, we noticed you haven't studied in a few days.</p>
  <p>A 10-minute session today keeps your JEE prep streak alive.</p>
  <p style="font-size:32px">📚</p>
  <a href="https://10minjee.com/topics" style="background:#f97316;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Resume Studying</a>
</div>`;
}

function atRiskHtml(name: string): string {
  return `<div style="font-family:sans-serif;max-width:600px;margin:auto">
  <h2 style="color:#f97316">10min<span style="color:#111">JEE</span></h2>
  <p>Hey ${name}, we miss you! ❤️</p>
  <p>It's been a week. JEE waits for no one.</p>
  <p>Come back today — we've added 1 free premium day to your account.</p>
  <a href="https://10minjee.com/topics" style="background:#f97316;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Claim Your Free Day</a>
  <p style="color:#888;font-size:12px">Unsubscribe: email support@10minjee.com</p>
</div>`;
}

export async function POST(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const convex = getConvexClient();
  if (!convex) {
    return new Response("Convex unavailable", { status: 503 });
  }

  const weekStart = getWeekStart();

  let users: Array<{
    userId: string;
    email: string;
    name: string;
    segment: "active" | "dormant" | "at-risk";
    rankText?: string;
    readinessScore?: number;
  }>;

  try {
    users = await convex.query(api.retention.getWeeklyQueue, { weekStart });
  } catch (err) {
    console.error("Failed to fetch retention users:", err);
    return new Response("Failed to fetch users from Convex", { status: 503 });
  }

  if (!users || users.length === 0) {
    return Response.json({ sent: 0, skipped: 0 });
  }

  const resend = getResend();
  let sent = 0;
  let skipped = 0;

  // Build batches by segment — up to 100 per Resend batch call
  const BATCH_SIZE = 100;

  const activeBatch: Array<{ from: string; to: string; subject: string; html: string }> = [];
  const dormantBatch: Array<{ from: string; to: string; subject: string; html: string }> = [];
  const atRiskBatch: Array<{ from: string; to: string; subject: string; html: string }> = [];

  // Map userId → segment for logging after send
  const userSegmentMap: Record<string, { userId: string; email: string; segment: string }> = {};

  for (const user of users) {
    if (!user.email) {
      skipped++;
      continue;
    }

    userSegmentMap[user.userId] = {
      userId: user.userId,
      email: user.email,
      segment: user.segment,
    };

    if (user.segment === "active") {
      const rankText = user.rankText ?? "Keep up the great work!";
      const readinessScore = user.readinessScore ?? 0;
      activeBatch.push({
        from: FROM,
        to: user.email,
        subject: `${user.name}, you're on fire this week! 🔥`,
        html: activeHtml(user.name, rankText, readinessScore),
      });
    } else if (user.segment === "dormant") {
      dormantBatch.push({
        from: FROM,
        to: user.email,
        subject: `${user.name}, your JEE prep streak is waiting 📚`,
        html: dormantHtml(user.name),
      });
    } else if (user.segment === "at-risk") {
      atRiskBatch.push({
        from: FROM,
        to: user.email,
        subject: `We miss you, ${user.name} — claim your free premium day ❤️`,
        html: atRiskHtml(user.name),
      });
    } else {
      skipped++;
      delete userSegmentMap[user.userId];
    }
  }

  // Helper to send in batches of 100 and log each
  async function sendAndLog(
    batch: Array<{ from: string; to: string; subject: string; html: string }>,
    segment: string
  ) {
    for (let i = 0; i < batch.length; i += BATCH_SIZE) {
      const chunk = batch.slice(i, i + BATCH_SIZE);
      try {
        await resend.batch.send(chunk);
        sent += chunk.length;

        // Log each sent email to Convex
        await Promise.allSettled(
          chunk.map((msg) => {
            const match = users.find((u) => u.email === msg.to);
            if (!match) return Promise.resolve();
            return convex.mutation(api.retention.logEmailSent, {
              userId: match.userId,
              email: match.email,
              segment,
              weekStart,
              emailType: `weekly-${segment}`,
            });
          })
        );
      } catch (err) {
        console.error(`Failed to send ${segment} batch (offset ${i}):`, err);
        skipped += chunk.length;
      }
    }
  }

  await sendAndLog(activeBatch, "active");
  await sendAndLog(dormantBatch, "dormant");
  await sendAndLog(atRiskBatch, "at-risk");

  return Response.json({ sent, skipped });
}
