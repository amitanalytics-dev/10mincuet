/**
 * Referral Integration Helper
 * Handles referral tracking and reward processing
 */

import { mutation } from "convex/_generated/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "convex/_generated/api";

/**
 * Get referral code for current user
 * (Usually the user's ID or a custom code)
 */
export function getUserReferralCode(userId: string): string {
  return `REF_${userId.substring(0, 8).toUpperCase()}`;
}

/**
 * Parse referral code from URL or query params
 * Example: ?ref=REF_abc123
 */
export function getReferralCodeFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("ref");
}

/**
 * Store referral code in localStorage for later processing
 */
export function storeReferralCode(code: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("referral_code", code);
    // Also store timestamp
    localStorage.setItem("referral_code_timestamp", Date.now().toString());
  }
}

/**
 * Get stored referral code
 */
export function getStoredReferralCode(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("referral_code");
}

/**
 * Clear referral code after use
 */
export function clearReferralCode(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("referral_code");
    localStorage.removeItem("referral_code_timestamp");
  }
}

/**
 * Process referral when referred user completes payment
 * Call this in your payment success handler
 */
export async function processReferral(
  convex: ConvexHttpClient,
  referredUserId: string,
  referralCode: string
) {
  try {
    // 1. Extract referrer ID from code
    const referrerId = `${referralCode.substring(4).toLowerCase()}`;

    // 2. Create referral record if not exists
    await (convex.mutation as any)(api.referrals.create, {
      referrerId,
      referredId: referredUserId,
    });

    // 3. Mark as paid and award referrer
    const referral = await (convex.query as any)(api.referrals.getUnpaidReferrals, {
      referredId: referredUserId,
    });

    if (referral) {
      const result = await (convex.mutation as any)(
        api.referrals.markPaidAndAwardReferrer,
        { referralId: referral._id }
      );
      return result;
    }
  } catch (error) {
    console.error("Error processing referral:", error);
    // Non-blocking — don't fail payment if referral processing fails
    return null;
  }
}

/**
 * Get referrer stats for UI display
 */
export async function getReferrerStats(convex: ConvexHttpClient, userId: string) {
  try {
    const stats = await (convex.query as any)(api.referrals.getStatsByReferrer, {
      referrerId: userId,
    });
    return stats;
  } catch (error) {
    console.error("Error fetching referrer stats:", error);
    return null;
  }
}

/**
 * Share referral link helper
 */
export function generateShareLinks(referralCode: string) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const referralUrl = `${baseUrl}?ref=${referralCode}`;

  return {
    url: referralUrl,
    twitter: `https://twitter.com/intent/tweet?text=Check%20out%20${baseUrl}%20-%20get%20${referralCode}&url=${referralUrl}`,
    whatsapp: `https://wa.me/?text=Join%20me:%20${referralUrl}`,
    email: `mailto:?subject=Join%2010minNEET&body=Use%20my%20referral%20code:%20${referralCode}%0A${referralUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${referralUrl}`,
  };
}

/**
 * Referral notification for UI
 */
export interface ReferralNotification {
  type: "success" | "info" | "warning";
  message: string;
  freeMonthsEarned?: number;
  referralCode?: string;
}

export function getReferralNotification(
  referrer: string | null,
  referralCode: string | null
): ReferralNotification | null {
  if (!referrer && !referralCode) return null;

  if (referralCode) {
    return {
      type: "info",
      message: `You've joined with referral code ${referralCode}. If you upgrade, the referrer gets 1 free month!`,
      referralCode,
    };
  }

  return null;
}
