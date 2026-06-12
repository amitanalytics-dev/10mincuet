// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
        monthsCredited: 0,
        createdAt: Date.now(),
      });
    }
  },
});

export const getUnpaidByReferred = query({
  args: { referredId: v.id("users") },
  handler: async (ctx, { referredId }) => {
    return await ctx.db
      .query("referrals")
      .withIndex("by_referred", (q) => q.eq("referredId", referredId))
      .filter((q) => q.eq(q.field("paidAt"), null))
      .unique();
  },
});

export const markPaid = mutation({
  args: { referralId: v.id("referrals") },
  handler: async (ctx, { referralId }) => {
    await ctx.db.patch(referralId, { paidAt: Date.now(), monthsCredited: 1 });
  },
});

export const getStatsByReferrer = query({
  args: { referrerId: v.id("users") },
  handler: async (ctx, { referrerId }) => {
    const refs = await ctx.db
      .query("referrals")
      .withIndex("by_referrer", (q) => q.eq("referrerId", referrerId))
      .collect();
    const paid = refs.filter((r) => r.paidAt != null);
    const months = Math.min(paid.reduce((s, r) => s + r.monthsCredited, 0), 5);
    return { count: paid.length, monthsEarned: months };
  },
});