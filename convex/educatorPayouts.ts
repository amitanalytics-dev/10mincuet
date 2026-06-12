// @ts-nocheck
import { v } from "convex/values";
import {
  internalMutation,
  mutation,
  query,
} from "./_generated/server";

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

// Sprint 7 decision: flat tier-based monthly retainer for verified educators.
export const TIER_AMOUNTS: Record<string, number> = {
  small: 2000,  // <100 followers
  mid: 5000,    // 100-499 followers
  large: 10000, // 500+ followers
};

function tierForFollowers(n: number): "small" | "mid" | "large" {
  if (n >= 500) return "large";
  if (n >= 100) return "mid";
  return "small";
}

function monthLabelForTimestamp(ts: number): string {
  return new Date(ts + IST_OFFSET_MS).toISOString().slice(0, 7);
}

// Previous month's label — used for the 1st-of-month payout cron, which
// pays for the month that just ended.
function previousMonthLabel(now: number): string {
  const ist = new Date(now + IST_OFFSET_MS);
  const prev = new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth() - 1, 1));
  return prev.toISOString().slice(0, 7);
}

// ── Queries ─────────────────────────────────────────────────────────────────

export const listByEducator = query({
  args: { educatorId: v.id("educators") },
  handler: async (ctx, { educatorId }) => {
    return await ctx.db
      .query("educatorPayouts")
      .withIndex("by_educator", (q) => q.eq("educatorId", educatorId))
      .order("desc")
      .take(24);
  },
});

export const listAll = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    return await ctx.db
      .query("educatorPayouts")
      .order("desc")
      .take(limit ?? 100);
  },
});

export const listPending = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("educatorPayouts")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .order("desc")
      .take(200);
  },
});

// ── Admin mutations ─────────────────────────────────────────────────────────

export const markPaid = mutation({
  args: {
    payoutId: v.id("educatorPayouts"),
    razorpayPayoutId: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, { payoutId, razorpayPayoutId, note }) => {
    await ctx.db.patch(payoutId, {
      status: "paid",
      razorpayPayoutId,
      note,
      paidAt: Date.now(),
    });
  },
});

export const markFailed = mutation({
  args: { payoutId: v.id("educatorPayouts"), note: v.string() },
  handler: async (ctx, { payoutId, note }) => {
    await ctx.db.patch(payoutId, { status: "failed", note });
  },
});

// ── Internal: monthly payout generation ─────────────────────────────────────
// Inserts a "pending" row per verified educator at their tier-appropriate
// amount. Actual Razorpay Payouts API call happens manually from /admin/payouts
// (or via webhook integration in a later sprint).

export const generateMonthly = internalMutation({
  args: { monthLabel: v.optional(v.string()) },
  handler: async (ctx, { monthLabel }) => {
    const now = Date.now();
    const month = monthLabel ?? previousMonthLabel(now);

    const educators = await ctx.db.query("educators").take(500);
    const verified = educators.filter((e) => e.isVerified);

    let created = 0;
    let skipped = 0;

    for (const ed of verified) {
      // Skip if already generated for this month
      const existing = await ctx.db
        .query("educatorPayouts")
        .withIndex("by_educator_month", (q) =>
          q.eq("educatorId", ed._id).eq("monthLabel", month)
        )
        .first();
      if (existing) {
        skipped++;
        continue;
      }

      const followers = await ctx.db
        .query("educatorFollowers")
        .withIndex("by_educator", (q) => q.eq("educatorId", ed._id))
        .take(1000);
      const followerCount = followers.length;
      const tier = tierForFollowers(followerCount);
      const amount = TIER_AMOUNTS[tier];

      const status: "pending" | "skipped" =
        ed.bankAccountNumber && ed.bankIfsc ? "pending" : "skipped";

      await ctx.db.insert("educatorPayouts", {
        educatorId: ed._id,
        userId: ed.userId,
        educatorName: ed.name,
        monthLabel: month,
        followerCountAtPayout: followerCount,
        tier,
        amountInr: amount,
        status,
        note: status === "skipped" ? "Bank details missing" : undefined,
        createdAt: now,
      });
      created++;
    }

    return { month, created, skipped, verified: verified.length };
  },
});
