import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Upsert a single NCERT explanation by key
export const upsertExplanation = mutation({
  args: {
    key: v.string(),
    topicName: v.string(),
    subConceptName: v.string(),
    explanation: v.string(),
    ncertBook: v.optional(v.string()),
    ncertChapter: v.optional(v.number()),
    ncertChapterName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("ncertExplanations")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        explanation: args.explanation,
        topicName: args.topicName,
        subConceptName: args.subConceptName,
        ncertBook: args.ncertBook,
        ncertChapter: args.ncertChapter,
        ncertChapterName: args.ncertChapterName,
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      return await ctx.db.insert("ncertExplanations", {
        ...args,
        updatedAt: Date.now(),
      });
    }
  },
});

// Batch upsert — accepts an array of explanation objects
export const batchUpsertExplanations = mutation({
  args: {
    explanations: v.array(
      v.object({
        key: v.string(),
        topicName: v.string(),
        subConceptName: v.string(),
        explanation: v.string(),
        ncertBook: v.optional(v.string()),
        ncertChapter: v.optional(v.number()),
        ncertChapterName: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const results: string[] = [];
    for (const item of args.explanations) {
      const existing = await ctx.db
        .query("ncertExplanations")
        .withIndex("by_key", (q) => q.eq("key", item.key))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          explanation: item.explanation,
          topicName: item.topicName,
          subConceptName: item.subConceptName,
          ncertBook: item.ncertBook,
          ncertChapter: item.ncertChapter,
          ncertChapterName: item.ncertChapterName,
          updatedAt: Date.now(),
        });
        results.push(existing._id);
      } else {
        const id = await ctx.db.insert("ncertExplanations", {
          ...item,
          updatedAt: Date.now(),
        });
        results.push(id);
      }
    }
    return results;
  },
});

// Query all explanations as a map
export const getAllExplanations = query({
  handler: async (ctx) => {
    const rows = await ctx.db.query("ncertExplanations").collect();
    const map: Record<string, string> = {};
    for (const row of rows) {
      map[row.key] = row.explanation;
    }
    return map;
  },
});
