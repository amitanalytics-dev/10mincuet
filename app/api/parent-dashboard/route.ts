// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import "server-only";
import { verifyToken, getAuthHeader } from "../../lib/auth.server";
import { getConvexClient } from "../../lib/convexClient";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export async function GET(req: Request) {
  const payload = await verifyToken(getAuthHeader(req));
  if (!payload) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const convex = getConvexClient();
  if (!convex) return Response.json({ kids: [] });

  try {
    const kids = await convex.query(api.users.getKidsByParent, {
      parentId: payload.sub as Id<"users">,
    });

    const kidsWithProgress = await Promise.all(
      kids.map(async (kid) => {
        const progress = await convex.query(api.progress.getByUser, {
          userId: kid._id,
        });

        const bySubject: Record<string, { bloomLevels: number[]; scores: number[] }> = {};
        for (const row of progress) {
          const subject = topicToSubject(row.topicSlug);
          if (!bySubject[subject]) bySubject[subject] = { bloomLevels: [], scores: [] };
          bySubject[subject].bloomLevels.push(row.bloomLevel);
          if (row.lastQuizScore != null) bySubject[subject].scores.push(row.lastQuizScore);
        }

        const subjectSummary = Object.entries(bySubject).map(([subject, data]) => ({
          subject,
          avgBloom: data.bloomLevels.length
            ? Math.round((data.bloomLevels.reduce((s, l) => s + l, 0) / data.bloomLevels.length) * 10) / 10
            : 1,
          avgScore: data.scores.length
            ? Math.round(data.scores.reduce((s, l) => s + l, 0) / data.scores.length)
            : null,
          topicsStudied: data.bloomLevels.length,
        }));

        return {
          id: kid._id,
          name: kid.name,
          createdAt: kid.createdAt,
          lastLoginAt: kid.lastLoginAt,
          subjectSummary,
          totalTopicsStudied: progress.length,
          avgBloomOverall:
            progress.length
              ? Math.round((progress.reduce((s, r) => s + r.bloomLevel, 0) / progress.length) * 10) / 10
              : 1,
        };
      })
    );

    return Response.json({ kids: kidsWithProgress });
  } catch (err) {
    console.error("Parent dashboard error:", err);
    return Response.json({ kids: [] });
  }
}

function topicToSubject(topicSlug: string): string {
  const physics = ["kinematics", "laws-of-motion", "work-energy", "rotational-motion", "gravitation", "thermodynamics", "waves", "electrostatics", "current-electricity", "magnetic-effects", "electromagnetic-induction", "modern-physics", "optics"];
  const chemistry = ["atomic-structure", "chemical-bonding", "periodic-table", "equilibrium", "thermochemistry", "electrochemistry", "organic-chemistry", "hydrocarbons", "biomolecules", "polymers", "coordination-compounds"];
  const math = ["sets-relations", "complex-numbers", "sequences-series", "quadratic-equations", "permutations-combinations", "binomial-theorem", "matrices-determinants", "limits-derivatives", "integrals", "differential-equations", "coordinate-geometry", "vector-algebra", "3d-geometry", "probability", "statistics"];

  if (physics.some((t) => topicSlug.includes(t))) return "Languages";
  if (chemistry.some((t) => topicSlug.includes(t))) return "Domain";
  if (math.some((t) => topicSlug.includes(t))) return "General Test";
  return "Other";
}
