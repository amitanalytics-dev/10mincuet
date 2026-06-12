// @ts-nocheck
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Submit feedback for a question
export const submitFeedback = mutation({
  args: {
    userId: v.id("users"),
    questionId: v.string(),
    topicSlug: v.string(),
    perceivedDifficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    isError: v.boolean(),
    errorNote: v.optional(v.string()),
    sessionType: v.string(),
  },
  handler: async (ctx, args) => {
    // Don't allow duplicate feedback from same user on same question
    const existing = await ctx.db
      .query("questionFeedback")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("questionId"), args.questionId))
      .first();

    if (existing) {
      // Update existing feedback instead
      await ctx.db.patch(existing._id, {
        perceivedDifficulty: args.perceivedDifficulty,
        isError: args.isError,
        errorNote: args.errorNote,
        createdAt: Date.now(),
      });
      return { updated: true };
    }

    await ctx.db.insert("questionFeedback", {
      ...args,
      createdAt: Date.now(),
    });

    // After insert, check if we should update consensus difficulty
    await updateConsensus(ctx, args.questionId, args.topicSlug);

    return { created: true };
  },
});

// Internal helper — recalculate consensus difficulty
async function updateConsensus(ctx: any, questionId: string, topicSlug: string) {
  const allFeedback = await ctx.db
    .query("questionFeedback")
    .withIndex("by_question", (q: any) => q.eq("questionId", questionId))
    .collect();

  if (allFeedback.length < 5) return; // Need at least 5 responses

  const counts = { easy: 0, medium: 0, hard: 0 };
  for (const fb of allFeedback) {
    counts[fb.perceivedDifficulty as keyof typeof counts]++;
  }

  // Majority vote
  const consensus = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as
    | "easy"
    | "medium"
    | "hard";

  const existing = await ctx.db
    .query("questionDifficultyOverride")
    .withIndex("by_question", (q: any) => q.eq("questionId", questionId))
    .first();

  if (existing) {
    await ctx.db.patch(existing._id, {
      consensusDifficulty: consensus,
      feedbackCount: allFeedback.length,
      lastUpdated: Date.now(),
    });
  } else {
    await ctx.db.insert("questionDifficultyOverride", {
      questionId,
      consensusDifficulty: consensus,
      feedbackCount: allFeedback.length,
      lastUpdated: Date.now(),
    });
  }
}

// Get aggregate difficulty stats for a topic
export const getTopicFeedbackStats = query({
  args: { topicSlug: v.string() },
  handler: async (ctx, { topicSlug }) => {
    const feedback = await ctx.db
      .query("questionFeedback")
      .withIndex("by_topic", (q) => q.eq("topicSlug", topicSlug))
      .collect();

    const errorFlags = feedback.filter((f) => f.isError);
    const hardCount = feedback.filter((f) => f.perceivedDifficulty === "hard").length;
    const easyCount = feedback.filter((f) => f.perceivedDifficulty === "easy").length;

    return {
      total: feedback.length,
      hardPercent: feedback.length ? Math.round((hardCount / feedback.length) * 100) : 0,
      easyPercent: feedback.length ? Math.round((easyCount / feedback.length) * 100) : 0,
      errorFlagCount: errorFlags.length,
      flaggedQuestions: errorFlags.map((f) => f.questionId),
    };
  },
});

// Get all flagged (error) questions — for admin review
export const getFlaggedQuestions = query({
  args: {},
  handler: async (ctx) => {
    const flagged = await ctx.db
      .query("questionFeedback")
      .filter((q) => q.eq(q.field("isError"), true))
      .collect();
    return flagged;
  },
});
