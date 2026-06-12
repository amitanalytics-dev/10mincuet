// @ts-nocheck
import { v } from "convex/values";
import { query } from "./_generated/server";

export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    return await ctx.db
      .query("kpiSnapshots")
      .withIndex("by_captured")
      .order("desc")
      .take(limit ?? 30);
  },
});

export const getLatest = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("kpiSnapshots")
      .withIndex("by_captured")
      .order("desc")
      .first();
  },
});
