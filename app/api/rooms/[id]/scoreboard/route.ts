// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import "server-only";
import { getConvexClient } from "../../../../lib/convexClient";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const convex = getConvexClient();
  if (!convex) return Response.json({ scoreboard: [] });

  try {
    const scoreboard = await convex.query(api.roomChat.getScoreboard, {
      roomId: id as Id<"studyRooms">,
    });
    return Response.json({ scoreboard });
  } catch (err) {
    console.error("Get room scoreboard error:", err);
    return Response.json({ scoreboard: [] });
  }
}
