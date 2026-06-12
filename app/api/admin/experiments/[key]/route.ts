// @ts-nocheck
import "server-only";
import { requireFounder } from "../../../../lib/admin.server";
import { getConvexClient } from "../../../../lib/convexClient";
import { api } from "convex/_generated/api";

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const founder = await requireFounder(req);
  if (!founder) return Response.json({ error: "Forbidden" }, { status: 403 });
  const { key } = await params;
  const convex = getConvexClient();
  if (!convex) return Response.json({ results: null });
  const results = await convex.query(api.abTests.getResults, { testKey: key });
  return Response.json({ results });
}
