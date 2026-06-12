// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Called from /api/onboarding after the diagnostic test is submitted.
// Upserts progress rows and marks the user as onboarded.
export const setInitialLevels = internalMutation({
  args: {
    userId: v.id("users"),
    results: v.array(
      v.object({
        topicSlug: v.string(),
        subConcept: v.string(),
        bloomLevel: v.number(),
        score: v.number(),
      })
    ),
  },
  handler: async (ctx, { userId, results }) => {
    for (const r of results) {
      // Look for an existing row for this user + topic + subConcept
      const rows = await ctx.db
        .query("progress")
        .withIndex("by_user_topic", (q) =>
          q.eq("userId", userId).eq("topicSlug", r.topicSlug)
        )
        .collect();

      const existing = rows.find((row) => row.subConcept === r.subConcept);

      if (existing) {
        await ctx.db.patch(existing._id, {
          bloomLevel: r.bloomLevel,
          lastQuizScore: r.score,
          updatedAt: Date.now(),
        });
      } else {
        await ctx.db.insert("progress", {
          userId,
          topicSlug: r.topicSlug,
          subConcept: r.subConcept,
          bloomLevel: r.bloomLevel,
          lastQuizScore: r.score,
          updatedAt: Date.now(),
        });
      }
    }

    // Mark user as onboarded so they skip this test on future logins
    await ctx.db.patch(userId, { onboardingCompleted: true });
  },
});
