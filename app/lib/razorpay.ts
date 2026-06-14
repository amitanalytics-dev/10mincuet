import "server-only";
import Razorpay from "razorpay";

export function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

// Amount in paise (₹1 = 100 paise)
export const PLAN_PRICES: Record<string, { amount: number; label: string; interval?: 'monthly' | 'yearly' }> = {
  // Single subject (monthly)
  physics:    { amount:  14900, label: "Physics — ₹149/month", interval: 'monthly' },
  chemistry:  { amount:  14900, label: "Chemistry — ₹149/month", interval: 'monthly' },
  math:       { amount:  14900, label: "Math — ₹149/month", interval: 'monthly' },
  biology:    { amount:  14900, label: "Biology — ₹149/month", interval: 'monthly' },

  // Bundle plans
  bundle:     { amount:  34900, label: "Full Bundle — ₹349/month", interval: 'monthly' },
  bundle_3mo: { amount:  99900, label: "Bundle 3 Months — ₹999", interval: 'monthly' },
  bundle_6mo: { amount: 199900, label: "Bundle 6 Months — ₹1,999", interval: 'yearly' },

  // Annual plans
  annual:     { amount: 249900, label: "Annual Bundle — ₹2,499/year", interval: 'yearly' },
  parent_kid: { amount: 299900, label: "Parent + Kid — ₹2,999/year", interval: 'yearly' },

  // Add-ons (one-time)
  mock_pack:  { amount:  49900, label: "Mock Test Pack — ₹499 (10 mocks)" },
  mock_20:    { amount:  79900, label: "Mock Pack 20 — ₹799 (20 mocks)" },
};

export type Tier = keyof typeof PLAN_PRICES;

// Feature mapping: which plan gets which features
export const PLAN_FEATURES: Record<string, { subjects: number; mockLimit: string; bloomTracking: boolean; adaptiveSessions: boolean; priority: boolean }> = {
  physics:    { subjects: 1, mockLimit: "1/mo", bloomTracking: false, adaptiveSessions: false, priority: false },
  chemistry:  { subjects: 1, mockLimit: "1/mo", bloomTracking: false, adaptiveSessions: false, priority: false },
  math:       { subjects: 1, mockLimit: "1/mo", bloomTracking: false, adaptiveSessions: false, priority: false },
  biology:    { subjects: 1, mockLimit: "1/mo", bloomTracking: false, adaptiveSessions: false, priority: false },
  bundle:     { subjects: 3, mockLimit: "2/mo", bloomTracking: true, adaptiveSessions: true, priority: false },
  bundle_3mo: { subjects: 3, mockLimit: "2/mo", bloomTracking: true, adaptiveSessions: true, priority: false },
  bundle_6mo: { subjects: 3, mockLimit: "Unlimited", bloomTracking: true, adaptiveSessions: true, priority: false },
  annual:     { subjects: 3, mockLimit: "Unlimited", bloomTracking: true, adaptiveSessions: true, priority: true },
  parent_kid: { subjects: 3, mockLimit: "Unlimited", bloomTracking: true, adaptiveSessions: true, priority: true },
};
