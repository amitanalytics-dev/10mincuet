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

  const { teamId } = await req.json();
  if (!teamId) return Response.json({ error: "teamId required" }, { status: 400 });

  try {
    const result = await convex.mutation(api.teams.joinTeam, {
      userId: payload.sub as Id<"users">,
      teamId: teamId as Id<"teams">,
    });
    return Response.json({ ok: true, ...result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Join failed";
    return Response.json({ error: msg }, { status: 400 });
  }
}
