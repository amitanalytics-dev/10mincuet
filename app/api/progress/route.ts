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

  const convex = getConvexClient();
  if (!convex) return Response.json({});

  const rows = await convex.query(api.progress.getByUser, {
    userId: payload.sub as Id<"users">,
  });

  const store: Record<string, Record<string, { bloomLevel: number; lastQuizScore: number | null }>> = {};
  for (const r of rows) {
    if (!store[r.topicSlug]) store[r.topicSlug] = {};
    store[r.topicSlug][r.subConcept] = { bloomLevel: r.bloomLevel, lastQuizScore: r.lastQuizScore ?? null };
  }
  return Response.json(store);
}

export async function POST(req: Request) {
  const payload = await verifyToken(getAuthHeader(req));
  if (!payload) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const convex = getConvexClient();
  if (!convex) return Response.json({ ok: true });

  const { topicSlug, subConcept, bloomLevel, lastQuizScore } = await req.json();
  if (!topicSlug || !subConcept || bloomLevel == null)
    return Response.json({ error: "Missing fields" }, { status: 400 });

  await convex.mutation(api.progress.upsert, {
    userId: payload.sub as Id<"users">,
    topicSlug,
    subConcept,
    bloomLevel,
    lastQuizScore: lastQuizScore ?? undefined,
  });
  return Response.json({ ok: true });
}
