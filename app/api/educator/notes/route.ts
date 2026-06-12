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

  const body = await req.json();
  if (body.action === "create") {
    try {
      const id = await convex.mutation(api.educatorNotes.create, {
        educatorId: body.educatorId as Id<"educators">,
        authorUserId: payload.sub as Id<"users">,
        title: body.title,
        summary: body.summary,
        content: body.content,
        subject: body.subject,
      });
      return Response.json({ ok: true, id });
    } catch (err) {
      return Response.json({ error: err instanceof Error ? err.message : "Create failed" }, { status: 400 });
    }
  }
  if (body.action === "update") {
    await convex.mutation(api.educatorNotes.update, {
      noteId: body.noteId as Id<"educatorNotes">,
      authorUserId: payload.sub as Id<"users">,
      title: body.title,
      summary: body.summary,
      content: body.content,
      subject: body.subject,
    });
    return Response.json({ ok: true });
  }
  if (body.action === "setStatus") {
    await convex.mutation(api.educatorNotes.setStatus, {
      noteId: body.noteId as Id<"educatorNotes">,
      authorUserId: payload.sub as Id<"users">,
      status: body.status,
    });
    return Response.json({ ok: true });
  }
  return Response.json({ error: "Unknown action" }, { status: 400 });
}
