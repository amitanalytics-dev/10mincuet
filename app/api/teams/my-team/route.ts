// @ts-nocheck
import "server-only";
import { verifyToken, getAuthHeader } from "../../../lib/auth.server";
import { getConvexClient } from "../../../lib/convexClient";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const payload = await verifyToken(getAuthHeader(req));
  if (!payload) return Response.json({ team: null });

  const convex = getConvexClient();
  if (!convex) return Response.json({ team: null });

  const team = await convex.query(api.teams.getMyTeam, {
    userId: payload.sub as Id<"users">,
  });
  return Response.json({ team });
}
