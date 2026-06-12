// @ts-nocheck
import "server-only";
import { verifyToken, getAuthHeader } from "../../lib/auth.server";
import { getConvexClient } from "../../lib/convexClient";
import { internal } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export async function POST(req: Request) {
  const payload = await verifyToken(getAuthHeader(req));
  if (!payload) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const convex = getConvexClient();
  if (!convex) return Response.json({ error: "Service unavailable" }, { status: 503 });

  const body = await req.json();
  const { results } = body as {
    results: {
      topicSlug: string;
      subConcept: string;
      bloomLevel: number;
      score: number;
    }[];
  };

  if (!Array.isArray(results) || results.length === 0) {
    return Response.json({ error: "Missing results" }, { status: 400 });
  }

  try {
    await convex.mutation(internal.onboarding.setInitialLevels, {
      userId: payload.sub as Id<"users">,
      results,
    });
    return Response.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Onboarding mutation error:", msg);
    return Response.json({ error: "Failed to save results" }, { status: 500 });
  }
}
