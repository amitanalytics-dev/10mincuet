// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import "server-only";
import { getConvexClient } from "../../../lib/convexClient";
import { api } from "convex/_generated/api";

const VALID_SUBJECTS = ["Languages", "Domain", "General Test", "Overall"] as const;
const VALID_PERIODS = ["weekly", "monthly", "all-time"] as const;

type Subject = (typeof VALID_SUBJECTS)[number];
type Period = (typeof VALID_PERIODS)[number];

export async function GET(
  req: Request,
  { params }: { params: Promise<{ subject: string }> }
) {
  const { subject } = await params;

  if (!VALID_SUBJECTS.includes(subject as Subject)) {
    return Response.json(
      { error: `Invalid subject. Must be one of: ${VALID_SUBJECTS.join(", ")}` },
      { status: 400 }
    );
  }

  const url = new URL(req.url);
  const periodParam = url.searchParams.get("period") ?? "weekly";

  if (!VALID_PERIODS.includes(periodParam as Period)) {
    return Response.json(
      { error: `Invalid period. Must be one of: ${VALID_PERIODS.join(", ")}` },
      { status: 400 }
    );
  }

  const period = periodParam as Period;

  const convex = getConvexClient();
  if (!convex) {
    return Response.json(
      { subject, period, entries: [], updatedAt: null, userCount: 0 },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600",
        },
      }
    );
  }

  try {
    const snapshot = await convex.query(api.leaderboards.getSnapshot, {
      subject,
      period,
    });

    if (!snapshot) {
      return Response.json(
        { subject, period, entries: [], updatedAt: null, userCount: 0 },
        {
          headers: {
            "Cache-Control": "public, s-maxage=3600",
          },
        }
      );
    }

    return Response.json(
      {
        subject,
        period,
        entries: snapshot.entries ?? [],
        updatedAt: snapshot.updatedAt ?? null,
        userCount: snapshot.userCount ?? 0,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600",
        },
      }
    );
  } catch (err) {
    console.error("Leaderboard fetch error:", err);
    return Response.json(
      { error: "Failed to fetch leaderboard" },
      { status: 503 }
    );
  }
}
