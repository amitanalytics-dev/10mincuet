// @ts-nocheck
import { BASE_URL } from "@/app/lib/site";
// Run 'npx convex dev' first to generate convex/_generated/
import "server-only";
import { verifyToken, getAuthHeader } from "../../lib/auth.server";
import { getConvexClient } from "../../lib/convexClient";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export async function GET(req: Request) {
  const payload = await verifyToken(getAuthHeader(req));
  if (!payload) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const convex = getConvexClient();
  if (!convex) return Response.json({ referralCode: null, referralCount: 0, monthsEarned: 0 });

  const user = await convex.query(api.users.getByEmail, { email: payload.email ?? "" });
  if (!user) return Response.json({ referralCode: null, referralCount: 0, monthsEarned: 0 });

  const stats = await convex.query(api.referrals.getStatsByReferrer, {
    referrerId: user._id as Id<"users">,
  });

  const host = process.env.NEXT_PUBLIC_BASE_URL ?? BASE_URL;
  return Response.json({
    referralCode: user.referralCode,
    referralLink: `${host}/register?ref=${user.referralCode}`,
    referralCount: stats.count,
    monthsEarned: stats.monthsEarned,
    maxMonths: 5,
  });
}
