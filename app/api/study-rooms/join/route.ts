// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import "server-only";
import { verifyToken, getAuthHeader } from "../../../lib/auth.server";
import { getConvexClient } from "../../../lib/convexClient";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export async function POST(req: Request) {
  const payload = await verifyToken(getAuthHeader(req));
  if (!payload) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const convex = getConvexClient();
  if (!convex) return Response.json({ error: "Service unavailable" }, { status: 503 });

  try {
    const { roomId, joinCode } = await req.json();

    const user = await convex.query(api.users.getById, {
      id: payload.sub as Id<"users">,
    });
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    let resolvedRoomId: Id<"studyRooms"> | null = null;

    if (joinCode) {
      const room = await convex.query(api.studyRooms.getByJoinCode, {
        joinCode: joinCode.toUpperCase(),
      });
      if (!room) return Response.json({ error: "Room not found" }, { status: 404 });
      resolvedRoomId = room._id;
    } else if (roomId) {
      resolvedRoomId = roomId as Id<"studyRooms">;
    } else {
      return Response.json({ error: "roomId or joinCode required" }, { status: 400 });
    }

    const result = await convex.mutation(api.studyRooms.join, {
      roomId: resolvedRoomId,
      userId: payload.sub as Id<"users">,
      userName: user.name,
    });

    return Response.json({ ok: true, roomId: resolvedRoomId, ...result });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to join room";
    return Response.json({ error: msg }, { status: 400 });
  }
}
