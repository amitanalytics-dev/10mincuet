// @ts-nocheck
import "server-only";
import { getConvexClient } from "../../../lib/convexClient";
import { sendBatchWeeklyDigest, type WeeklyDigestUser } from "../../../lib/email-service";
import { api } from "convex/_generated/api";

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const convex = getConvexClient();
  if (!convex) return new Response("No Convex client", { status: 503 });

  const users = await convex.query(api.users.getAllWithEmail, {});

  const batch: WeeklyDigestUser[] = [];

  for (const user of users) {
    try {
      if (!user.email || user.emailSuppressed) continue;

      const progress = await convex.query(api.progress.getByUser, { userId: user._id });
      if (progress.length === 0) continue;

      const avgBloom = progress.reduce((s, r) => s + r.bloomLevel, 0) / progress.length;
      const quizzesTaken = progress.filter((r) => r.lastQuizScore != null).length;
      const topicsMastered = progress.filter((r) => r.bloomLevel >= 4).length;

      const sortedByBloom = [...progress].sort((a, b) => a.bloomLevel - b.bloomLevel);
      const weakest = sortedByBloom[0];
      const strongest = sortedByBloom[sortedByBloom.length - 1];

      const mastered = progress.filter((r) => r.bloomLevel >= 3).length;
      const improvement = Math.max(Math.round((mastered / progress.length) * 100), 1);

      batch.push({
        email: user.email,
        name: user.name,
        referralCode: user.referralCode,
        stats: {
          quizzesTaken,
          topicsMastered,
          avgBloom: Math.round(avgBloom * 10) / 10,
          weakestArea: weakest ? `${weakest.subConcept} (${weakest.topicSlug})` : "",
          strongestArea: strongest ? `${strongest.subConcept} (${strongest.topicSlug})` : "",
          improvement,
        },
      });
    } catch (err) {
      console.error(`Weekly digest prep failed for ${user.email}:`, err);
    }
  }

  if (batch.length === 0) {
    return new Response("No eligible users");
  }

  await sendBatchWeeklyDigest(batch);

  return new Response(
    JSON.stringify({ sent: batch.length, total: users.length }),
    { headers: { "Content-Type": "application/json" } }
  );
}
