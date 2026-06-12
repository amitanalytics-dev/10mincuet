// @ts-nocheck
import "server-only";
import { verifyToken, getAuthHeader } from "../../../lib/auth.server";
import { getConvexClient } from "../../../lib/convexClient";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const convex = getConvexClient();
  if (!convex) return Response.json({ challenge: null });

  const challenge = await convex.query(api.weeklyChallenges.getCurrent, {});
  if (!challenge) return Response.json({ challenge: null });

  const leaderboard = await convex.query(api.weeklyChallenges.getLeaderboard, {
    challengeId: challenge._id,
    limit: 20,
  });

  let myParticipation = null;
  let myBadges = null;
  const payload = await verifyToken(getAuthHeader(req));
  if (payload) {
    myParticipation = await convex.query(api.weeklyChallenges.getMyParticipation, {
      challengeId: challenge._id,
      userId: payload.sub as Id<"users">,
    });
    myBadges = await convex.query(api.weeklyChallenges.getMyBadges, {
      userId: payload.sub as Id<"users">,
    });
  }

  return Response.json({ challenge, leaderboard, myParticipation, myBadges });
}
