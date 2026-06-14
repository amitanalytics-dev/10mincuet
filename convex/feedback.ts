import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * 10/10 Feedback Loop - Data Moat System
 * Captures user feedback to continuously improve platform
 */

export const submitQuestionFeedback = mutation({
  args: {
    userId: v.id("users"),
    questionId: v.id("questions"),
    examType: v.union(v.literal("jee"), v.literal("neet"), v.literal("cuet")),
    difficulty: v.union(v.literal(1), v.literal(2), v.literal(3), v.literal(4), v.literal(5)),
    quality: v.union(v.literal(1), v.literal(2), v.literal(3), v.literal(4), v.literal(5)),
    clarity: v.union(v.literal(1), v.literal(2), v.literal(3), v.literal(4), v.literal(5)),
    relevance: v.union(v.literal(1), v.literal(2), v.literal(3), v.literal(4), v.literal(5)),
    notes: v.optional(v.string()),
    timeTaken: v.number(),
    correct: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("questionFeedbackLoop", {
      userId: args.userId,
      questionId: args.questionId,
      examType: args.examType,
      difficultyRating: args.difficulty,
      qualityRating: args.quality,
      clarityRating: args.clarity,
      relevanceRating: args.relevance,
      notes: args.notes,
      timeTaken: args.timeTaken,
      actuallyCorrect: args.correct,
      score: (args.difficulty + args.quality + args.clarity + args.relevance) / 4,
      createdAt: Date.now(),
    });

    return { success: true, message: "Thank you! Your feedback helps us improve." };
  },
});

export const getQuestionCalibrationData = query({
  args: { questionId: v.id("questions") },
  handler: async (ctx, args) => {
    const feedback = await ctx.db
      .query("questionFeedbackLoop")
      .filter((q) => q.eq(q.field("questionId"), args.questionId))
      .collect();

    if (feedback.length === 0) {
      return { feedbackCount: 0, avgScore: 0 };
    }

    const avgScore = feedback.reduce((sum, f) => sum + f.score, 0) / feedback.length;
    const successRate = feedback.filter((f) => f.actuallyCorrect).length / feedback.length;

    return {
      feedbackCount: feedback.length,
      avgScore: Math.round(avgScore * 100) / 100,
      successRate: Math.round(successRate * 100),
      shouldRecalibrate: feedback.length >= 10,
    };
  },
});

export const submitDPPQualityFeedback = mutation({
  args: {
    userId: v.id("users"),
    examType: v.union(v.literal("jee"), v.literal("neet"), v.literal("cuet")),
    dppDate: v.string(),
    relevance: v.union(v.literal(1), v.literal(2), v.literal(3), v.literal(4), v.literal(5)),
    difficulty: v.union(v.literal(1), v.literal(2), v.literal(3), v.literal(4), v.literal(5)),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("dppQualityFeedback", {
      userId: args.userId,
      examType: args.examType,
      dppDate: args.dppDate,
      relevanceRating: args.relevance,
      difficultyRating: args.difficulty,
      completed: args.completed,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});
