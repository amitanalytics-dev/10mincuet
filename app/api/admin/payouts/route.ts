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
  if (!convex) return Response.json({ payouts: [] });
  const payouts = await convex.query(api.educatorPayouts.listAll, { limit: 200 });
  return Response.json({ payouts });
}

export async function POST(req: Request) {
  const founder = await requireFounder(req);
  if (!founder) return Response.json({ error: "Forbidden" }, { status: 403 });
  const convex = getConvexClient();
  if (!convex) return Response.json({ error: "Service unavailable" }, { status: 503 });

  const body = await req.json();
  if (body.action === "markPaid") {
    await convex.mutation(api.educatorPayouts.markPaid, {
      payoutId: body.payoutId as Id<"educatorPayouts">,
      razorpayPayoutId: body.razorpayPayoutId,
      note: body.note,
    });
    return Response.json({ ok: true });
  }
  if (body.action === "markFailed") {
    await convex.mutation(api.educatorPayouts.markFailed, {
      payoutId: body.payoutId as Id<"educatorPayouts">,
      note: body.note ?? "Marked failed",
    });
    return Response.json({ ok: true });
  }
  return Response.json({ error: "Unknown action" }, { status: 400 });
}
