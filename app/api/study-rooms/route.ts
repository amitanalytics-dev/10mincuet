// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import "server-only";
import { verifyToken, getAuthHeader } from "../../lib/auth.server";
import { getConvexClient } from "../../lib/convexClient";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export async function GET(req: Request) {
  const convex = getConvexClient();
  if (!convex) return Response.json({ rooms: [] });

  try {
    const url = new URL(req.url);
    const subject = url.searchParams.get("subject") ?? undefined;
    const rooms = await convex.query(api.studyRooms.list, { subject: subject ?? undefined });

    const roomsWithCount = await Promise.all(
      rooms.map(async (room) => {
        const count = await convex.query(api.studyRooms.getParticipantCount, {
          roomId: room._id,
        });
        return { ...room, participantCount: count };
      })
    );

    return Response.json({ rooms: roomsWithCount });
  } catch (err) {
    console.error("Study rooms list error:", err);
    return Response.json({ rooms: [] });
  }
}

export async function POST(req: Request) {
  const payload = await verifyToken(getAuthHeader(req));
  if (!payload) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const convex = getConvexClient();
  if (!convex) return Response.json({ error: "Service unavailable" }, { status: 503 });

  try {
    const body = await req.json();
    const { name, subject, description, maxParticipants, topicSlug, scheduledAt } = body;

    if (!name?.trim()) return Response.json({ error: "Room name required" }, { status: 400 });
    if (!["Languages", "Domain", "General Test", "All Subjects"].includes(subject)) {
      return Response.json({ error: "Invalid subject" }, { status: 400 });
    }

    const user = await convex.query(api.users.getById, {
      id: payload.sub as Id<"users">,
    });
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const result = await convex.mutation(api.studyRooms.create, {
      hostId: payload.sub as Id<"users">,
      hostName: user.name,
      name: name.trim(),
      subject,
      description: description?.trim() || undefined,
      maxParticipants: Math.min(Math.max(parseInt(maxParticipants) || 5, 2), 20),
      topicSlug: topicSlug?.trim() || undefined,
      scheduledAt: scheduledAt ? parseInt(scheduledAt) : undefined,
    });

    return Response.json(result);
  } catch (err) {
    console.error("Create room error:", err);
    return Response.json({ error: "Failed to create room" }, { status: 500 });
  }
}
