// @ts-nocheck
import "server-only";
import { verifyToken, getAuthHeader } from "../../../lib/auth.server";
import { getConvexClient } from "../../../lib/convexClient";
import { computeAccess } from "../../../lib/access";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const payload = await verifyToken(getAuthHeader(req));
  if (!payload) return Response.json({ access: { hasPremium: false, reason: "free" } });

  const convex = getConvexClient();
  if (!convex) return Response.json({ access: { hasPremium: false, reason: "free" } });

  const userId = payload.sub as Id<"users">;
  const [user, subscription] = await Promise.all([
    convex.query(api.users.getById, { id: userId }),
    convex.query(api.subscriptions.getByUser, { userId }).catch(() => null),
  ]);

  const access = computeAccess(user, subscription);
  return Response.json({ access });
}
