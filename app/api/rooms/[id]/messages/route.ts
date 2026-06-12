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
  if (!convex) return Response.json({ messages: [] });

  try {
    const messages = await convex.query(api.roomChat.getMessages, {
      roomId: id as Id<"studyRooms">,
      limit: 100,
    });
    return Response.json({ messages });
  } catch (err) {
    console.error("Get room messages error:", err);
    return Response.json({ messages: [] });
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
    const { message } = body;

    if (!message?.trim()) return Response.json({ error: "Message is required" }, { status: 400 });
    if (message.trim().length > 500) {
      return Response.json({ error: "Message must be 500 characters or fewer" }, { status: 400 });
    }

    const user = await convex.query(api.users.getById, {
      id: payload.sub as Id<"users">,
    });
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const messageId = await convex.mutation(api.roomChat.addMessage, {
      roomId: id as Id<"studyRooms">,
      userId: payload.sub as Id<"users">,
      userName: user.name,
      message: message.trim(),
    });

    return Response.json({ messageId }, { status: 201 });
  } catch (err) {
    console.error("Send room message error:", err);
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}
