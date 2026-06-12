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
  physics:    { amount:   9900, label: "Single Subject — ₹99/month" },
  chemistry:  { amount:   9900, label: "Single Subject — ₹99/month" },
  math:       { amount:   9900, label: "Single Subject — ₹99/month" },
  bundle:     { amount:  34900, label: "Full Bundle — ₹349/month" },
  annual:     { amount:  99900, label: "Annual Bundle — ₹999/year" },
  parent_kid: { amount: 149900, label: "Parent + Kid — ₹1,499/year" },
  mock_pack:  { amount:  49900, label: "Mock Test Pack — ₹499 one-time" },
};

export type Tier = keyof typeof PLAN_PRICES;
