// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { bumpStreakOnActivity } from "./streaks";

export const record = mutation({
  args: {
    userId: v.id("users"),
    languagesScore: v.number(),
    domainScore: v.number(),
    generalTestScore: v.number(),
    totalScore: v.number(),
    maxScore: v.number(),
    takenAt: v.number(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("mockResults", {
      userId: args.userId,
      languagesScore: args.languagesScore,
      domainScore: args.domainScore,
      generalTestScore: args.generalTestScore,
      totalScore: args.totalScore,
      maxScore: args.maxScore,
      takenAt: args.takenAt,
    });
    await bumpStreakOnActivity(ctx, args.userId, args.takenAt);
    return id;
  },
});

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("mockResults")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(20);
  },
});
