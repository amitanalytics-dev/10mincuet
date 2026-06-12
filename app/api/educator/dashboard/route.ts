// @ts-nocheck
import "server-only";
import { verifyToken, getAuthHeader } from "../../../lib/auth.server";
import { getConvexClient } from "../../../lib/convexClient";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const payload = await verifyToken(getAuthHeader(req));
  if (!payload) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const convex = getConvexClient();
  if (!convex) return Response.json({ educator: null });

  const educator = await convex.query(api.educators.getByUser, {
    userId: payload.sub as Id<"users">,
  });
  if (!educator) return Response.json({ educator: null });

  const [notes, sets, followerCount, payouts] = await Promise.all([
    convex.query(api.educatorNotes.listMineByAuthor, { authorUserId: payload.sub as Id<"users"> }),
    convex.query(api.questionSets.listMineByAuthor, { authorUserId: payload.sub as Id<"users"> }),
    convex.query(api.educators.getFollowerCount, { educatorId: educator._id }),
    convex.query(api.educatorPayouts.listByEducator, { educatorId: educator._id }),
  ]);

  return Response.json({ educator, notes, sets, followerCount, payouts });
}
