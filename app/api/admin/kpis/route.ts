// @ts-nocheck
import "server-only";
import { requireFounder } from "../../../lib/admin.server";
import { getConvexClient } from "../../../lib/convexClient";
import { api } from "convex/_generated/api";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const founder = await requireFounder(req);
  if (!founder) return Response.json({ error: "Forbidden" }, { status: 403 });

  const convex = getConvexClient();
  if (!convex) return Response.json({ snapshots: [] });

  const snapshots = await convex.query(api.kpiSnapshots.listRecent, { limit: 30 });
  return Response.json({ snapshots });
}
