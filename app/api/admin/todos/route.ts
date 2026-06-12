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
  if (!convex) return Response.json({ todos: [] });

  const todos = await convex.query(api.adminTodos.listOpen, { limit: 50 });
  return Response.json({ todos });
}

export async function POST(req: Request) {
  const founder = await requireFounder(req);
  if (!founder) return Response.json({ error: "Forbidden" }, { status: 403 });

  const convex = getConvexClient();
  if (!convex) return Response.json({ error: "Service unavailable" }, { status: 503 });

  const { todoId } = await req.json();
  if (!todoId) return Response.json({ error: "todoId required" }, { status: 400 });

  await convex.mutation(api.adminTodos.markDone, {
    todoId: todoId as Id<"adminTodos">,
  });
  return Response.json({ ok: true });
}
