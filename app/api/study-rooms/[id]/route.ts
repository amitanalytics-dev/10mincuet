// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import "server-only";
import { getConvexClient } from "../../../lib/convexClient";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const convex = getConvexClient();
  if (!convex) return Response.json({ room: null }, { status: 503 });

  try {
    const room = await convex.query(api.studyRooms.getById, {
      roomId: id as Id<"studyRooms">,
    });
    if (!room) return Response.json({ room: null }, { status: 404 });

    const participantCount = await convex.query(api.studyRooms.getParticipantCount, {
      roomId: id as Id<"studyRooms">,
    });

    return Response.json({ room, participantCount });
  } catch (err) {
    console.error("Get room error:", err);
    return Response.json({ room: null }, { status: 500 });
  }
}
