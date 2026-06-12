// @ts-nocheck
import "server-only";
import { getConvexClient } from "../../../lib/convexClient";
import { api } from "convex/_generated/api";
import {
  sendWelcomeDay2MockTaken,
  sendWelcomeDay2NoMock,
  sendWelcomeDay7,
} from "../../../lib/email-service";

// Runs every hour via Vercel Cron
// vercel.json: { "path": "/api/cron/scheduled-emails", "schedule": "0 * * * *" }
export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const convex = getConvexClient();
  if (!convex) return new Response("No Convex client", { status: 503 });

  const now = Date.now();
  const pending = await convex.query(api.scheduledEmails.getPending, { now });

  let sent = 0;
  let skipped = 0;

  for (const scheduled of pending) {
    try {
      const user = await convex.query(api.users.getById, { id: scheduled.userId });
      if (!user?.email || user.emailSuppressed) {
        await convex.mutation(api.scheduledEmails.markSent, { id: scheduled._id });
        skipped++;
        continue;
      }

      const progress = await convex.query(api.progress.getByUser, { userId: scheduled.userId });

      if (scheduled.type === "welcome-day2") {
        const hasTakenMock = progress.length > 0;
        if (hasTakenMock) {
          const avgBloom = Math.round(
            progress.reduce((s: number, r: { bloomLevel: number }) => s + r.bloomLevel, 0) / progress.length
          );
          const scoredItems = progress.filter((r: { lastQuizScore?: number | null }) => r.lastQuizScore != null);
          const avgScore = scoredItems.length > 0
            ? Math.round(scoredItems.reduce((s: number, r: { lastQuizScore?: number | null }) => s + (r.lastQuizScore ?? 0), 0) / scoredItems.length)
            : 50;
          await sendWelcomeDay2MockTaken(user.email, user.name, avgScore, Math.min(avgBloom, 6));
        } else {
          await sendWelcomeDay2NoMock(user.email, user.name);
        }
      }

      if (scheduled.type === "welcome-day7") {
        const mastered = progress.filter((r: { bloomLevel: number }) => r.bloomLevel >= 3).length;
        const improvement = progress.length > 0
          ? Math.max(Math.round((mastered / progress.length) * 100), 5)
          : 5;
        await sendWelcomeDay7(user.email, user.name, improvement);
      }

      await convex.mutation(api.scheduledEmails.markSent, { id: scheduled._id });
      sent++;
    } catch (err) {
      console.error(`Scheduled email ${scheduled._id} failed:`, err);
    }
  }

  return new Response(JSON.stringify({ sent, skipped, total: pending.length }), {
    headers: { "Content-Type": "application/json" },
  });
}
