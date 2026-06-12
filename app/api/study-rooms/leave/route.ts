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
    const { roomId } = await req.json();
    if (!roomId) return Response.json({ error: "roomId required" }, { status: 400 });

    await convex.mutation(api.studyRooms.leave, {
      roomId: roomId as Id<"studyRooms">,
      userId: payload.sub as Id<"users">,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Leave room error:", err);
    return Response.json({ error: "Failed to leave room" }, { status: 500 });
  }
}
