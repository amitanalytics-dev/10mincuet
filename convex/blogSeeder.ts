// @ts-nocheck
// Internal mutations — bulk-insert AI-generated JEE blogs from seed-daily-blogs batch pipeline.
// Called by scripts/retrieve-daily-blogs.mjs after a Claude batch completes.
// NOTE: No "use node" here — mutations must run in the default Convex (V8) runtime.

import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * bulkInsert — insert up to 50 blogs per call.
 * Skips slugs that already exist (idempotent).
 * Returns { inserted, skipped }.
 */
export const bulkInsert = internalMutation({
  args: {
    blogs: v.array(
      v.object({
        slug: v.string(),
        title: v.string(),
        content: v.string(),
        ncertBook: v.string(),
        ncertChapter: v.string(),
        targetClasses: v.array(v.string()),
        richContent: v.optional(v.string()),
        estimatedStudyTime: v.optional(v.number()),
        createdAt: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, { blogs }) => {
    let inserted = 0;
    let skipped = 0;

    for (const blog of blogs) {
      const existing = await ctx.db
        .query("blogs")
        .withIndex("by_slug", (q) => q.eq("slug", blog.slug))
        .unique();

      if (existing) {
        skipped++;
        continue;
      }

      await ctx.db.insert("blogs", {
        slug: blog.slug,
        title: blog.title,
        content: blog.content,
        ncertBook: blog.ncertBook,
        ncertChapter: blog.ncertChapter,
        targetClasses: blog.targetClasses,
        richContent: blog.richContent ?? blog.content,
        estimatedStudyTime: blog.estimatedStudyTime ?? 30,
        createdAt: blog.createdAt ?? Date.now(),
      });

      inserted++;
    }

    console.log(`blogSeeder.bulkInsert: inserted=${inserted} skipped=${skipped}`);
    return { inserted, skipped };
  },
});

/**
 * triggerDailyBatch — placeholder called by crons.ts at 1:30am UTC (7am IST).
 * Logs intent; actual generation runs via the external seed-daily-blogs.mjs script.
 *
 * To make this self-contained in future, replace with an internalAction that
 * calls the Anthropic batch API directly from Convex.
 */
export const triggerDailyBatch = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = new Date().toISOString();
    console.log(`[${now}] Daily blog batch cron fired. Run 'npm run seed:blogs' to submit batch, then 'npm run retrieve:blogs' after 6-12h.`);
    return { firedAt: now };
  },
});
