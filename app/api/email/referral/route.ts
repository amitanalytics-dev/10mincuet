// @ts-nocheck
import "server-only";
import { getConvexClient } from "../../../lib/convexClient";
import { sendReferralFriendJoined, sendReferralBothReward } from "../../../lib/email-service";
import { api } from "convex/_generated/api";

// POST /api/email/referral
// Body: { event: "friend_joined" | "both_reward", newUserEmail, originalUserEmail, newUserName, originalUserName }
// Called from /api/register when a new user signs up with a referral code.
// Called again when that user completes their first mock.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event, newUserEmail, originalUserEmail, newUserName, originalUserName } = body;

    if (!event || !newUserEmail || !originalUserEmail || !newUserName || !originalUserName) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (event === "friend_joined") {
      await sendReferralFriendJoined(originalUserEmail, originalUserName, newUserName);
      return Response.json({ ok: true });
    }

    if (event === "both_reward") {
      await sendReferralBothReward(originalUserEmail, originalUserName, newUserEmail, newUserName);
      return Response.json({ ok: true });
    }

    return Response.json({ error: "Unknown event type" }, { status: 400 });
  } catch (err) {
    console.error("referral email error:", err);
    return Response.json({ error: "Failed to send referral email" }, { status: 500 });
  }
}
