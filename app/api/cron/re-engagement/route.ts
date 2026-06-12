// @ts-nocheck
import "server-only";
import { getConvexClient } from "../../../lib/convexClient";
import { api } from "convex/_generated/api";
import {
  sendReEngagementDay7,
  sendReEngagementDay14,
  sendReEngagementDay21,
} from "../../../lib/email-service";

// Runs daily via Vercel Cron (4am UTC = 9:30am IST)
// vercel.json: { "path": "/api/cron/re-engagement", "schedule": "0 4 * * *" }
export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const convex = getConvexClient();
  if (!convex) return new Response("No Convex client", { status: 503 });

  const results = { day7: 0, day14: 0, day21: 0, skipped: 0, errors: 0 };

  // Fetch inactive cohorts in parallel
  const [inactive21, inactive14, inactive7] = await Promise.all([
    convex.query(api.users.getInactiveWithEmail, { days: 21 }),
    convex.query(api.users.getInactiveWithEmail, { days: 14 }),
    convex.query(api.users.getInactiveWithEmail, { days: 7 }),
  ]);

  const set21 = new Set(inactive21.map((u: { _id: { toString(): string } }) => u._id.toString()));
  const set14 = new Set(inactive14.map((u: { _id: { toString(): string } }) => u._id.toString()));

  for (const user of inactive7) {
    if (!user.email || user.emailSuppressed) { results.skipped++; continue; }

    try {
      // Day 21 — highest priority, checked first
      if (set21.has(user._id.toString())) {
        const alreadySent = await convex.query(api.scheduledEmails.hasTracked, {
          userId: user._id,
          type: "re-engagement-day21",
        });
        if (!alreadySent) {
          await sendReEngagementDay21(user.email, user.name);
          await convex.mutation(api.scheduledEmails.trackSent, {
            userId: user._id,
            email: user.email,
            type: "re-engagement-day21",
          });
          results.day21++;
        } else {
          results.skipped++;
        }
        continue;
      }

      // Day 14
      if (set14.has(user._id.toString())) {
        const alreadySent = await convex.query(api.scheduledEmails.hasTracked, {
          userId: user._id,
          type: "re-engagement-day14",
        });
        if (!alreadySent) {
          await sendReEngagementDay14(user.email, user.name, []);
          await convex.mutation(api.scheduledEmails.trackSent, {
            userId: user._id,
            email: user.email,
            type: "re-engagement-day14",
          });
          results.day14++;
        } else {
          results.skipped++;
        }
        continue;
      }

      // Day 7
      const alreadySent = await convex.query(api.scheduledEmails.hasTracked, {
        userId: user._id,
        type: "re-engagement-day7",
      });
      if (!alreadySent) {
        const progress = await convex.query(api.progress.getByUser, { userId: user._id });
        const sortedProgress = [...progress].sort(
          (a: { updatedAt: number }, b: { updatedAt: number }) => b.updatedAt - a.updatedAt
        );
        const lastTopic = sortedProgress[0]
          ? sortedProgress[0].topicSlug.replace(/-/g, " ")
          : "Physics";
        const avgBloom = progress.length > 0
          ? Math.round(progress.reduce((s: number, r: { bloomLevel: number }) => s + r.bloomLevel, 0) / progress.length)
          : 1;

        await sendReEngagementDay7(user.email, user.name, lastTopic, Math.min(Math.max(avgBloom, 1), 5));
        await convex.mutation(api.scheduledEmails.trackSent, {
          userId: user._id,
          email: user.email,
          type: "re-engagement-day7",
        });
        results.day7++;
      } else {
        results.skipped++;
      }
    } catch (err) {
      console.error(`Re-engagement failed for ${user.email}:`, err);
      results.errors++;
    }
  }

  return new Response(JSON.stringify(results), {
    headers: { "Content-Type": "application/json" },
  });
}
