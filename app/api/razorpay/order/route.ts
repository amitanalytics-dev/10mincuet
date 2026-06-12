import "server-only";
import { verifyToken, getAuthHeader } from "../../../lib/auth.server";
import { getRazorpay, PLAN_PRICES, type Tier } from "../../../lib/razorpay";

export async function POST(req: Request) {
  const payload = await verifyToken(getAuthHeader(req));
  if (!payload) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { tier } = await req.json() as { tier: Tier };
  const plan = PLAN_PRICES[tier];
  if (!plan) return Response.json({ error: "Invalid plan" }, { status: 400 });

  const razorpay = getRazorpay();
  if (!razorpay) return Response.json({ error: "Payments not configured" }, { status: 503 });

  try {
    const order = await razorpay.orders.create({
      amount: plan.amount,
      currency: "INR",
      receipt: `order_${Date.now()}_${payload.sub?.slice(0, 8) ?? "anon"}`,
      notes: {
        userId: payload.sub ?? "",
        tier,
        userEmail: payload.email ?? "",
        userName: payload.name ?? "",
      },
    });

    return Response.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      userName: payload.name ?? "",
      userEmail: payload.email ?? "",
      planLabel: plan.label,
    });
  } catch (err) {
    console.error("Razorpay order error:", err);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}
