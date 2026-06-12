// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { bumpStreakOnActivity } from "./streaks";
import { recordChallengeProgress } from "./weeklyChallenges";

const SUBJECT_VALIDATOR = v.union(
  v.literal("Languages"),
  v.literal("Domain"),
  v.literal("General Test")
);

export const record = mutation({
  args: {
    userId: v.id("users"),
    subject: SUBJECT_VALIDATOR,
    topicSlug: v.string(),
    score: v.number(),
    completedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("quizActivity", {
      userId: args.userId,
      subject: args.subject,
      topicSlug: args.topicSlug,
      score: args.score,
      completedAt: args.completedAt,
    });
    await bumpStreakOnActivity(ctx, args.userId, args.completedAt);
    await recordChallengeProgress(
      ctx,
      args.userId,
      args.subject,
      args.topicSlug,
      args.score,
      args.completedAt
    );
    return id;
  },
});

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("quizActivity")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .take(100);
  },
});

export const getSubjectActivity = query({
  args: {
    userId: v.id("users"),
    subject: SUBJECT_VALIDATOR,
  },
  handler: async (ctx, { userId, subject }) => {
    return await ctx.db
      .query("quizActivity")
      .withIndex("by_user_subject", (q) =>
        q.eq("userId", userId).eq("subject", subject)
      )
      .take(100);
  },
});
