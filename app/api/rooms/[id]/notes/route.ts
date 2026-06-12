// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import "server-only";
import { verifyToken, getAuthHeader } from "../../../../lib/auth.server";
import { getConvexClient } from "../../../../lib/convexClient";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const convex = getConvexClient();
  if (!convex) return Response.json({ notes: [] });

  try {
    const notes = await convex.query(api.roomNotes.getNotes, {
      roomId: id as Id<"studyRooms">,
    });
    return Response.json({ notes });
  } catch (err) {
    console.error("Get room notes error:", err);
    return Response.json({ notes: [] });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const payload = await verifyToken(getAuthHeader(req));
  if (!payload) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const convex = getConvexClient();
  if (!convex) return Response.json({ error: "Service unavailable" }, { status: 503 });

  try {
    const body = await req.json();
    const { title, content } = body;

    if (!title?.trim()) return Response.json({ error: "Title is required" }, { status: 400 });
    if (!content?.trim()) return Response.json({ error: "Content is required" }, { status: 400 });

    const user = await convex.query(api.users.getById, {
      id: payload.sub as Id<"users">,
    });
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const noteId = await convex.mutation(api.roomNotes.addNote, {
      roomId: id as Id<"studyRooms">,
      userId: payload.sub as Id<"users">,
      userName: user.name,
      title: title.trim(),
      content: content.trim(),
    });

    return Response.json({ noteId }, { status: 201 });
  } catch (err) {
    console.error("Add room note error:", err);
    return Response.json({ error: "Failed to add note" }, { status: 500 });
  }
}
