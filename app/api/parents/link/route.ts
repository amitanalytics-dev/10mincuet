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
    const body = await req.json();
    const { inviteCode } = body;

    if (!inviteCode?.trim()) return Response.json({ error: "Invite code is required" }, { status: 400 });

    const student = await convex.query(api.users.getById, {
      id: payload.sub as Id<"users">,
    });
    if (!student) return Response.json({ error: "User not found" }, { status: 404 });

    const result = await convex.mutation(api.parentInvites.useInvite, {
      inviteCode: inviteCode.trim().toUpperCase(),
      studentId: payload.sub as Id<"users">,
    });

    return Response.json({ success: true, parentId: result.parentId });
  } catch (err) {
    console.error("Link student to parent error:", err);
    return Response.json({ error: "Failed to link student to parent" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const payload = await verifyToken(getAuthHeader(req));
  if (!payload) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const convex = getConvexClient();
  if (!convex) return Response.json({ error: "Service unavailable" }, { status: 503 });

  try {
    const result = await convex.mutation(api.parentInvites.createInvite, {
      parentId: payload.sub as Id<"users">,
    });

    return Response.json({ inviteCode: result.inviteCode, expiresAt: result.expiresAt });
  } catch (err) {
    console.error("Create parent invite error:", err);
    return Response.json({ error: "Failed to generate invite code" }, { status: 500 });
  }
}
