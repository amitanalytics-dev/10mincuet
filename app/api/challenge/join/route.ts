// @ts-nocheck
import "server-only";
import { verifyToken, getAuthHeader } from "../../../lib/auth.server";
import { getConvexClient } from "../../../lib/convexClient";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const payload = await verifyToken(getAuthHeader(req));
  if (!payload) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const convex = getConvexClient();
  if (!convex) return Response.json({ error: "Service unavailable" }, { status: 503 });

  const { challengeId } = await req.json();
  if (!challengeId) return Response.json({ error: "challengeId required" }, { status: 400 });

  try {
    await convex.mutation(api.weeklyChallenges.join, {
      challengeId: challengeId as Id<"weeklyChallenges">,
      userId: payload.sub as Id<"users">,
    });
    return Response.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Join failed";
    return Response.json({ error: msg }, { status: 400 });
  }
}
