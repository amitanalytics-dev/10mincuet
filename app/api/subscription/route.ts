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

  // Legacy env-var user → full access
  if (payload.sub === "legacy") {
    return Response.json({ tier: "bundle", status: "active", freeMonthsRemaining: 0 });
  }

  const convex = getConvexClient();
  if (!convex) return Response.json({ tier: "free", status: "active", freeMonthsRemaining: 0 });

  try {
    const sub = await convex.query(api.subscriptions.getByUser, {
      userId: payload.sub as Id<"users">,
    });
    if (!sub) return Response.json({ tier: "free", status: "active", freeMonthsRemaining: 0 });
    return Response.json({
      tier: sub.tier,
      status: sub.status,
      freeMonthsRemaining: sub.freeMonthsRemaining,
      currentPeriodEnd: sub.currentPeriodEnd,
    });
  } catch {
    return Response.json({ tier: "free", status: "active", freeMonthsRemaining: 0 });
  }
}
