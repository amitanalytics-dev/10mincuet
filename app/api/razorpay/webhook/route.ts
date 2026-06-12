// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import "server-only";
import crypto from "crypto";
import { getConvexClient } from "../../../lib/convexClient";
import { sendGstInvoice } from "../../../lib/email";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET ?? "";

  // Verify HMAC SHA256 signature
  const expectedSig = crypto.createHmac("sha256", secret).update(body).digest("hex");
  if (expectedSig !== signature) {
    return new Response("Invalid signature", { status: 400 });
  }

  let event: any;
  try { event = JSON.parse(body); } catch { return new Response("Bad JSON", { status: 400 }); }

  if (event.event === "payment.captured") {
    const payment = event.payload?.payment?.entity;
    const userId = payment?.notes?.userId;
    const tier = payment?.notes?.tier;

    if (!userId || !tier) return new Response("OK");

    const convex = getConvexClient();
    if (!convex) return new Response("OK");

    const DAY = 24 * 60 * 60 * 1000;
    const currentPeriodEnd =
      tier === "mock_pack" ? Date.now() + 10 * 365 * DAY   // permanent one-time
      : ["annual", "parent_kid"].includes(tier) ? Date.now() + 365 * DAY
      : Date.now() + 31 * DAY;

    await convex.mutation(api.subscriptions.upgrade, {
      userId: userId as Id<"users">,
      tier,
      razorpayPaymentId: payment.id,
      currentPeriodEnd,
    });

    // Credit referrer if this user was referred and hasn't been credited yet
    const referral = await convex.query(api.referrals.getUnpaidByReferred, {
      referredId: userId as Id<"users">,
    });
    if (referral) {
      await convex.mutation(api.referrals.markPaid, { referralId: referral._id });
      await convex.mutation(api.subscriptions.addFreeMonth, { userId: referral.referrerId });
    }

    // Send GST invoice to student
    try {
      const user = await convex.query(api.users.getById, { id: userId as Id<"users"> });
      if (user?.email && user.name) {
        await sendGstInvoice({
          email: user.email,
          name: user.name,
          tier,
          amountPaise: payment.amount,
          paymentId: payment.id,
        });
      }
    } catch (invoiceErr) {
      // Don't fail the webhook if invoice sending fails
      console.error("GST invoice send failed:", invoiceErr);
    }
  }

  return new Response("OK");
}
