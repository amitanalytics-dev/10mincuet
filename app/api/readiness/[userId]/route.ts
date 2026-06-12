// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import "server-only";
import { getConvexClient } from "../../../lib/convexClient";
import { api } from "convex/_generated/api";

const EMPTY_READINESS = {
  score: 0,
  topicCoverage: 0,
  mockScoreAvg: 0,
  attendanceRate: 0,
  weakTopics: [],
  recommendations: [],
  calculatedAt: null,
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  if (!userId) {
    return Response.json({ error: "Missing userId" }, { status: 400 });
  }

  const convex = getConvexClient();
  if (!convex) {
    return Response.json(
      { userId, ...EMPTY_READINESS },
      {
        headers: {
          "Cache-Control": "private, s-maxage=3600",
        },
      }
    );
  }

  try {
    const readiness = await convex.query(api.readiness.getByUser, { userId });

    if (!readiness) {
      return Response.json(
        { userId, ...EMPTY_READINESS },
        {
          headers: {
            "Cache-Control": "private, s-maxage=3600",
          },
        }
      );
    }

    return Response.json(
      { userId, ...readiness },
      {
        headers: {
          "Cache-Control": "private, s-maxage=3600",
        },
      }
    );
  } catch (err) {
    console.error("Readiness fetch error:", err);
    return Response.json(
      { error: "Failed to fetch readiness score" },
      { status: 503 }
    );
  }
}
