// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
  },
});

export const createFree = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.insert("subscriptions", {
      userId,
      tier: "free",
      status: "active",
      freeMonthsRemaining: 0,
    });
  },
});

export const upgrade = mutation({
  args: {
    userId: v.id("users"),
    tier: v.string(),
    razorpayPaymentId: v.string(),
    currentPeriodEnd: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, {
        tier: args.tier,
        status: "active",
        razorpayPaymentId: args.razorpayPaymentId,
        currentPeriodEnd: args.currentPeriodEnd,
      });
    } else {
      await ctx.db.insert("subscriptions", {
        userId: args.userId,
        tier: args.tier,
        status: "active",
        freeMonthsRemaining: 0,
        razorpayPaymentId: args.razorpayPaymentId,
        currentPeriodEnd: args.currentPeriodEnd,
      });
    }
  },
});

export const addFreeMonth = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const sub = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    if (sub) {
      const newMonths = Math.min((sub.freeMonthsRemaining ?? 0) + 1, 5);
      await ctx.db.patch(sub._id, { freeMonthsRemaining: newMonths });
    }
  },
});