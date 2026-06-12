// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import { getConvexClient } from "../../lib/convexClient";
import { api } from "convex/_generated/api";

export const runtime = "nodejs";

export async function GET() {
  try {
    const convex = getConvexClient();

    let totalStudents = 0;
    let totalSessions = 0;
    let avgBloomImprovement = 0;

    if (convex) {
      totalStudents = await convex.query(api.users.count, {});
      totalSessions = await convex.query(api.progress.count, {});
      const avgLevel = await convex.query(api.progress.avgBloom, {});
      avgBloomImprovement = Math.max(0, Math.round((avgLevel - 1) * 10) / 10);
    }

    return Response.json(
      { totalStudents, totalSessions, avgBloomImprovement },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (err) {
    console.error("Stats error:", err);
    return Response.json(
      { totalStudents: 0, totalSessions: 0, avgBloomImprovement: 0 },
      { headers: { "Cache-Control": "public, s-maxage=60" } }
    );
  }
}
