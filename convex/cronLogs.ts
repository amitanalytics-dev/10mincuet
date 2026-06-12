// @ts-nocheck
import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

export const record = internalMutation({
  args: {
    cronName: v.string(),
    status: v.union(v.literal("success"), v.literal("failed")),
    startedAt: v.number(),
    durationMs: v.number(),
    recordsAffected: v.optional(v.number()),
    result: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("cronLogs", args);
  },
});

export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    return await ctx.db
      .query("cronLogs")
      .withIndex("by_started")
      .order("desc")
      .take(limit ?? 50);
  },
});
