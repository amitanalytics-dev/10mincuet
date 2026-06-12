// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import "server-only";
import { verifyToken, getAuthHeader } from "../../lib/auth.server";
import { getConvexClient } from "../../lib/convexClient";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export async function GET(req: Request) {
  const convex = getConvexClient();
  if (!convex) return Response.json({ educators: [] });

  try {
    const educators = await convex.query(api.educators.list, {});
    return Response.json({ educators });
  } catch (err) {
    console.error("Educators list error:", err);
    return Response.json({ educators: [] });
  }
}

export async function POST(req: Request) {
  const payload = await verifyToken(getAuthHeader(req));
  if (!payload) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const convex = getConvexClient();
  if (!convex) return Response.json({ error: "Service unavailable" }, { status: 503 });

  try {
    const body = await req.json();
    const { name, subjects, bio, specialization } = body;

    if (!name?.trim()) return Response.json({ error: "Name is required" }, { status: 400 });
    if (!bio?.trim()) return Response.json({ error: "Bio is required" }, { status: 400 });

    const user = await convex.query(api.users.getById, {
      id: payload.sub as Id<"users">,
    });
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    const educatorId = await convex.mutation(api.educators.create, {
      userId: payload.sub as Id<"users">,
      name: name.trim(),
      subjects: subjects ?? [],
      bio: bio.trim(),
      specialization: specialization?.trim() || undefined,
    });

    return Response.json({ educatorId }, { status: 201 });
  } catch (err) {
    console.error("Create educator error:", err);
    return Response.json({ error: "Failed to create educator profile" }, { status: 500 });
  }
}
