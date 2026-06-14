// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * REFERRAL SYSTEM
 * ═════════════════
 * RULE: Referrers earn FREE PREMIUM TIME ONLY (no cash/monetary awards)
 *
 * When a referred user PAYS for ANY plan:
 * - Referrer gets 1 free month of premium (₹349 value)
 * - Capped at 5 months maximum per referrer
 * - Tracked in subscription.freeMonthsRemaining
 *
 * This is NOT a monetary payout system. No cash transfers.
 */

export const create = mutation({
  args: { referrerId: v.id("users"), referredId: v.id("users") },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("referrals")
      .withIndex("by_referred", (q) => q.eq("referredId", args.referredId))
      .unique();
    if (!existing) {
      await ctx.db.insert("referrals", {
        referrerId: args.referrerId,
        referredId: args.referredId,
        paidAt: null, // Set when referred user makes a payment
        monthsCredited: 0, // How many free months earned from this referral
        createdAt: Date.now(),
      });
    }
  },
});

/**
 * Called when a referred user completes their FIRST payment.
 * Referrer earns 1 free month (time-based award only).
 */
export const markPaidAndAwardReferrer = mutation({
  args: { referralId: v.id("referrals") },
  handler: async (ctx, { referralId }) => {
    const referral = await ctx.db.get(referralId);
    if (!referral || referral.paidAt) return { success: false, reason: "Already processed or invalid" };

    // Mark referral as paid
    await ctx.db.patch(referralId, {
      paidAt: Date.now(),
      monthsCredited: 1, // Award: 1 free month
    });

    // Award 1 free month to the referrer (stored in their subscription)
    const referrerSub = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", referral.referrerId))
      .unique();

    if (referrerSub) {
      const currentMonths = referrerSub.freeMonthsRemaining ?? 0;
      const newMonths = Math.min(currentMonths + 1, 5); // Cap at 5 months
      await ctx.db.patch(referrerSub._id, { freeMonthsRemaining: newMonths });

      return {
        success: true,
        referrerAward: `1 free month added (total: ${newMonths}/5 months available)`,
        awardType: "TIME_BASED_PREMIUM_ACCESS",
        noMonetaryPayout: true,
      };
    }

    return { success: false, reason: "Referrer subscription not found" };
  },
});

/**
 * Get unpaid referrals (referred users who haven't paid yet)
 */
export const getUnpaidReferrals = query({
  args: { referredId: v.id("users") },
  handler: async (ctx, { referredId }) => {
    return await ctx.db
      .query("referrals")
      .withIndex("by_referred", (q) => q.eq("referredId", referredId))
      .filter((q) => q.eq(q.field("paidAt"), null))
      .unique();
  },
});

/**
 * Get referrer stats (how many free months earned)
 * IMPORTANT: This tracks TIME-BASED rewards only, NOT monetary value
 */
export const getStatsByReferrer = query({
  args: { referrerId: v.id("users") },
  handler: async (ctx, { referrerId }) => {
    const refs = await ctx.db
      .query("referrals")
      .withIndex("by_referrer", (q) => q.eq("referrerId", referrerId))
      .collect();
    const paid = refs.filter((r) => r.paidAt != null);
    const monthsEarned = Math.min(
      paid.reduce((s, r) => s + (r.monthsCredited ?? 0), 0),
      5 // Hard cap at 5 months
    );

    return {
      totalReferrals: refs.length,
      paidReferrals: paid.length,
      freeMonthsEarned: monthsEarned,
      monthsRemaining: 5 - monthsEarned,
      monetaryAward: null, // EXPLICITLY NULL: No cash payouts
      awardType: "Premium access time only",
      note: "Referrers earn free premium months, not money",
    };
  },
});

/**
 * Get all referral stats (global)
 */
export const getGlobalReferralStats = query({
  args: {},
  handler: async (ctx) => {
    const allReferrals = await ctx.db.query("referrals").collect();
    const paidReferrals = allReferrals.filter((r) => r.paidAt != null);
    const totalFreeMonthsEarned = paidReferrals.reduce((sum, r) => sum + (r.monthsCredited ?? 0), 0);

    return {
      totalReferralPairs: allReferrals.length,
      successfulReferrals: paidReferrals.length,
      conversionRate: ((paidReferrals.length / Math.max(allReferrals.length, 1)) * 100).toFixed(1) + "%",
      totalFreeMonthsGiven: totalFreeMonthsEarned,
      averageMonthsPerReferrer: (totalFreeMonthsEarned / Math.max(paidReferrals.length, 1)).toFixed(1),
      monetaryPayouts: 0, // ALWAYS ZERO: No cash rewards
      rewardModel: "Time-based premium access only",
      cap: "5 months per referrer",
    };
  },
});