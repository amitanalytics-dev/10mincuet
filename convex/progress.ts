// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("progress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const upsert = mutation({
  args: {
    userId: v.id("users"),
    topicSlug: v.string(),
    subConcept: v.string(),
    bloomLevel: v.number(),
    lastQuizScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("progress")
      .withIndex("by_user_topic", (q) =>
        q.eq("userId", args.userId).eq("topicSlug", args.topicSlug)
      )
      .collect();
    const existing = rows.find((r) => r.subConcept === args.subConcept);
    if (existing) {
      await ctx.db.patch(existing._id, {
        bloomLevel: args.bloomLevel,
        lastQuizScore: args.lastQuizScore,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("progress", {
        userId: args.userId,
        topicSlug: args.topicSlug,
        subConcept: args.subConcept,
        bloomLevel: args.bloomLevel,
        lastQuizScore: args.lastQuizScore,
        updatedAt: Date.now(),
      });
    }
  },
});

export const count = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("progress").collect();
    return rows.length;
  },
});

export const avgBloom = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("progress").collect();
    if (rows.length === 0) return 1;
    const sum = rows.reduce((s, r) => s + r.bloomLevel, 0);
    return Math.round((sum / rows.length) * 10) / 10;
  },
});