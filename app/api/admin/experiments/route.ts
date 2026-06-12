// @ts-nocheck
import "server-only";
import { requireFounder } from "../../../lib/admin.server";
import { getConvexClient } from "../../../lib/convexClient";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const founder = await requireFounder(req);
  if (!founder) return Response.json({ error: "Forbidden" }, { status: 403 });
  const convex = getConvexClient();
  if (!convex) return Response.json({ tests: [] });
  const tests = await convex.query(api.abTests.listTests, {});
  return Response.json({ tests });
}

export async function POST(req: Request) {
  const founder = await requireFounder(req);
  if (!founder) return Response.json({ error: "Forbidden" }, { status: 403 });
  const convex = getConvexClient();
  if (!convex) return Response.json({ error: "Service unavailable" }, { status: 503 });

  const body = await req.json();
  if (body.action === "create") {
    try {
      const id = await convex.mutation(api.abTests.create, {
        testKey: body.testKey,
        name: body.name,
        description: body.description,
        primaryMetric: body.primaryMetric,
        variants: body.variants,
      });
      return Response.json({ ok: true, id });
    } catch (err) {
      return Response.json({ error: err instanceof Error ? err.message : "Create failed" }, { status: 400 });
    }
  }
  if (body.action === "setStatus") {
    await convex.mutation(api.abTests.setStatus, {
      testId: body.testId as Id<"abTests">,
      status: body.status,
    });
    return Response.json({ ok: true });
  }
  return Response.json({ error: "Unknown action" }, { status: 400 });
}
