import "server-only";
import Razorpay from "razorpay";

export function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

// Amount in paise (₹1 = 100 paise)
export const PLAN_PRICES: Record<string, { amount: number; label: string }> = {
  physics:    { amount:  14900, label: "Physics — ₹149/month" },
  chemistry:  { amount:  14900, label: "Chemistry — ₹149/month" },
  math:       { amount:  14900, label: "Math — ₹149/month" },
  bundle:     { amount:  34900, label: "Full Bundle — ₹349/month" },
  annual:     { amount: 249900, label: "Annual Bundle — ₹2,499/year" },
  parent_kid: { amount: 299900, label: "Parent + Kid — ₹2,999/year" },
  mock_pack:  { amount:  49900, label: "Mock Test Pack — ₹499 one-time" },
};

export type Tier = keyof typeof PLAN_PRICES;
