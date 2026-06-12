// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import "server-only";
import { verifyToken, getAuthHeader } from "../../../lib/auth.server";
import { getConvexClient } from "../../../lib/convexClient";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const convex = getConvexClient();
  if (!convex) return Response.json({ error: "Service unavailable" }, { status: 503 });

  try {
    const educatorId = id as Id<"educators">;

    const educator = await convex.query(api.educators.getById, { educatorId });
    if (!educator) return Response.json({ error: "Educator not found" }, { status: 404 });

    const followerCount = await convex.query(api.educators.getFollowerCount, { educatorId });

    return Response.json({ educator, followerCount });
  } catch (err) {
    console.error("Get educator error:", err);
    return Response.json({ error: "Failed to get educator" }, { status: 500 });
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
    const { action } = body;

    if (action !== "follow" && action !== "unfollow") {
      return Response.json({ error: "Action must be 'follow' or 'unfollow'" }, { status: 400 });
    }

    const educatorId = id as Id<"educators">;
    const userId = payload.sub as Id<"users">;

    if (action === "follow") {
      await convex.mutation(api.educators.follow, { educatorId, userId });
    } else {
      await convex.mutation(api.educators.unfollow, { educatorId, userId });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Follow/unfollow educator error:", err);
    return Response.json({ error: "Failed to update follow status" }, { status: 500 });
  }
}
