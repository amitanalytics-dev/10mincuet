/**
 * Razorpay Configuration
 * Supports both Test (Sandbox) and Live modes
 */

export const RAZORPAY_CONFIG = {
  // Test mode keys (sandbox) — use for development
  TEST: {
    KEY_ID: "rzp_test_1Oy2t0gUEIgYHz", // Test key
    KEY_SECRET: "yrT7MgIuLqfkwn2B9pvJ1C2d", // Test secret
    DESCRIPTION: "10minNEET Premium — Test Mode",
    prefill: {
      name: "Test User",
      email: "test@example.com",
      contact: "9876543210",
    },
  },

  // Live mode keys — use for production
  LIVE: {
    KEY_ID: process.env.RAZORPAY_KEY_ID || "",
    KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "",
    DESCRIPTION: "10minNEET Premium",
    prefill: {
      name: "",
      email: "",
      contact: "",
    },
  },

  // Current mode (determined by environment)
  MODE: process.env.NODE_ENV === "production" && process.env.RAZORPAY_KEY_ID ? "LIVE" : "TEST",

  // Webhook secret for payment verification
  WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || "webhook_test_secret",

  // Currency
  CURRENCY: "INR",

  // Timeout (ms)
  TIMEOUT: 30000,

  // Receipt prefix (for tracking)
  RECEIPT_PREFIX: "NEET_",
};

export type RazorpayMode = "TEST" | "LIVE";

export function getRazorpayKeys() {
  const mode = RAZORPAY_CONFIG.MODE as RazorpayMode;
  return RAZORPAY_CONFIG[mode];
}

export function isTestMode() {
  return RAZORPAY_CONFIG.MODE === "TEST";
}
