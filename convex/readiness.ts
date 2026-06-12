// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import { v } from "convex/values";
import { query, internalMutation, internalQuery, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

// ── Public queries ──────────────────────────────────────────────────────────

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("readinessScores")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .first();
  },
});

// ── Internal queries ────────────────────────────────────────────────────────

export const getAllUsers = internalQuery({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").take(200);
    return users.filter((u) => !u.isKid && u.email && !u.emailSuppressed);
  },
});

// ── Internal mutations ──────────────────────────────────────────────────────

export const calculateForUser = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const now = Date.now();
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now - THIRTY_DAYS;

    // 1. Topic coverage from progress
    const progressEntries = await ctx.db
      .query("progress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .take(200);

    const masteredCount = progressEntries.filter((p) => p.bloomLevel >= 3).length;
    const topicCoverage = Math.min(
      (masteredCount / Math.max(progressEntries.length, 20)) * 100,
      100
    );

    // 2. Mock score average
    const mocks = await ctx.db
      .query("mockResults")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .take(10);

    const mockScoreAvg =
      mocks.length > 0
        ? mocks.reduce((sum, mr) => sum + (mr.totalScore / mr.maxScore) * 100, 0) /
          mocks.length
        : 0;

    // 3. Attendance rate: unique days with quiz activity in last 30 days
    const recentActivity = await ctx.db
      .query("quizActivity")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .take(100);

    const activeDays = new Set(
      recentActivity
        .filter((qa) => qa.completedAt >= thirtyDaysAgo)
        .map((qa) => new Date(qa.completedAt).toISOString().slice(0, 10))
    );
    const attendanceRate = (activeDays.size / 30) * 100;

    // 4. Composite readiness score
    const score =
      topicCoverage * 0.4 + mockScoreAvg * 0.4 + attendanceRate * 0.2;

    // 5. Weak topics: progress entries with bloomLevel <= 2, sorted ascending
    const weakEntries = progressEntries
      .filter((p) => p.bloomLevel <= 2)
      .sort((a, b) => a.bloomLevel - b.bloomLevel)
      .slice(0, 3);
    const weakTopics = weakEntries.map((p) => p.topicSlug);

    // 6. Recommendations
    const recommendations = weakTopics.map(
      (slug) => `Study ${slug} to improve coverage`
    );

    // 7. Upsert readiness score
    const existing = await ctx.db
      .query("readinessScores")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const data = {
      userId,
      score: Math.round(score * 10) / 10,
      topicCoverage: Math.round(topicCoverage * 10) / 10,
      mockScoreAvg: Math.round(mockScoreAvg * 10) / 10,
      attendanceRate: Math.round(attendanceRate * 10) / 10,
      weakTopics,
      recommendations,
      calculatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert("readinessScores", data);
    }
  },
});

// ── Internal action ─────────────────────────────────────────────────────────

export const calculateAll = internalAction({
  args: {},
  handler: async (ctx) => {
    const users: Array<{ _id: string }> = await ctx.runQuery(
      internal.readiness.getAllUsers,
      {}
    );

    for (const user of users) {
      await ctx.runMutation(internal.readiness.calculateForUser, {
        userId: user._id,
      });
    }
  },
});
