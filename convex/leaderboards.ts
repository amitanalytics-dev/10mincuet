// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import { v } from "convex/values";
import { query, internalMutation, internalQuery, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

const SUBJECT_VALIDATOR = v.union(
  v.literal("Languages"),
  v.literal("Domain"),
  v.literal("General Test"),
  v.literal("Overall")
);

const PERIOD_VALIDATOR = v.union(
  v.literal("weekly"),
  v.literal("monthly"),
  v.literal("all-time")
);

// ── Public queries ──────────────────────────────────────────────────────────

export const getSnapshot = query({
  args: {
    subject: SUBJECT_VALIDATOR,
    period: PERIOD_VALIDATOR,
  },
  handler: async (ctx, { subject, period }) => {
    return await ctx.db
      .query("leaderboardSnapshots")
      .withIndex("by_subject_period", (q) =>
        q.eq("subject", subject).eq("period", period)
      )
      .unique();
  },
});

export const getUserRank = query({
  args: {
    userId: v.id("users"),
    subject: SUBJECT_VALIDATOR,
    period: PERIOD_VALIDATOR,
  },
  handler: async (ctx, { userId, subject, period }) => {
    const snapshot = await ctx.db
      .query("leaderboardSnapshots")
      .withIndex("by_subject_period", (q) =>
        q.eq("subject", subject).eq("period", period)
      )
      .unique();
    if (!snapshot) return null;
    const entry = snapshot.entries.find((e) => e.userId === userId);
    return entry ?? null;
  },
});

// ── Internal data-fetch queries ─────────────────────────────────────────────

export const getAllUsers = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").take(500);
  },
});

export const getAllQuizActivity = internalQuery({
  args: {},
  handler: async (ctx) => {
    const physics = await ctx.db
      .query("quizActivity")
      .withIndex("by_subject_completed", (q) => q.eq("subject", "Languages"))
      .take(2000);
    const chemistry = await ctx.db
      .query("quizActivity")
      .withIndex("by_subject_completed", (q) => q.eq("subject", "Domain"))
      .take(2000);
    const math = await ctx.db
      .query("quizActivity")
      .withIndex("by_subject_completed", (q) => q.eq("subject", "General Test"))
      .take(2000);
    return [...physics, ...chemistry, ...math];
  },
});

export const getAllMockResults = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("mockResults")
      .withIndex("by_taken")
      .take(500);
  },
});

export const getAllProgress = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("progress").take(2000);
  },
});

// ── Internal upsert mutation ────────────────────────────────────────────────

export const storeSnapshot = internalMutation({
  args: {
    subject: SUBJECT_VALIDATOR,
    period: PERIOD_VALIDATOR,
    entries: v.array(
      v.object({
        userId: v.string(),
        userName: v.string(),
        score: v.number(),
        rank: v.number(),
        mocksCount: v.number(),
        quizzesCount: v.number(),
        accuracy: v.number(),
        topicsMastered: v.number(),
      })
    ),
  },
  handler: async (ctx, { subject, period, entries }) => {
    const existing = await ctx.db
      .query("leaderboardSnapshots")
      .withIndex("by_subject_period", (q) =>
        q.eq("subject", subject).eq("period", period)
      )
      .unique();

    const data = { subject, period, entries, updatedAt: Date.now() };
    if (existing) {
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert("leaderboardSnapshots", data);
    }
  },
});

// ── Internal action: compute and store all leaderboard snapshots ────────────

export const refreshAll = internalAction({
  args: {},
  handler: async (ctx) => {
    const [users, quizActivity, mockResults, progress] = await Promise.all([
      ctx.runQuery(internal.leaderboards.getAllUsers, {}),
      ctx.runQuery(internal.leaderboards.getAllQuizActivity, {}),
      ctx.runQuery(internal.leaderboards.getAllMockResults, {}),
      ctx.runQuery(internal.leaderboards.getAllProgress, {}),
    ]);

    const now = Date.now();
    const DAY = 24 * 60 * 60 * 1000;
    const WEEK_MS = 7 * DAY;
    const MONTH_MS = 30 * DAY;

    const subjects = ["Languages", "Domain", "General Test", "Overall"] as const;
    const periods = ["weekly", "monthly", "all-time"] as const;

    // Build user name map
    const userMap = new Map(users.map((u) => [u._id, u.name ?? "Unknown"]));

    // Build progress mastered count per user
    const masteredByUser = new Map();
    for (const p of progress) {
      if (p.bloomLevel >= 3) {
        masteredByUser.set(p.userId, (masteredByUser.get(p.userId) ?? 0) + 1);
      }
    }

    for (const subject of subjects) {
      for (const period of periods) {
        const cutoff =
          period === "weekly"
            ? now - WEEK_MS
            : period === "monthly"
            ? now - MONTH_MS
            : 0;

        // Filter quiz activity by subject and period
        const filteredQuiz = quizActivity.filter((qa) => {
          const subjectMatch =
            subject === "Overall" || qa.subject === subject;
          const timeMatch = cutoff === 0 || qa.completedAt >= cutoff;
          return subjectMatch && timeMatch;
        });

        // Filter mock results by period
        const filteredMocks = mockResults.filter(
          (mr) => cutoff === 0 || mr.takenAt >= cutoff
        );

        // Aggregate per user
        const userStats = new Map();
        for (const qa of filteredQuiz) {
          const uid = qa.userId;
          if (!userStats.has(uid)) {
            userStats.set(uid, { quizzesCount: 0, totalScore: 0, mocksCount: 0 });
          }
          const s = userStats.get(uid);
          s.quizzesCount += 1;
          s.totalScore += qa.score;
        }
        for (const mr of filteredMocks) {
          const uid = mr.userId;
          if (!userStats.has(uid)) {
            userStats.set(uid, { quizzesCount: 0, totalScore: 0, mocksCount: 0 });
          }
          const s = userStats.get(uid);
          s.mocksCount += 1;
        }

        // Compute scores and rank
        const ranked = [];
        for (const [userId, stats] of userStats.entries()) {
          const accuracy =
            stats.quizzesCount > 0
              ? stats.totalScore / stats.quizzesCount
              : 0;
          const score =
            stats.quizzesCount * 10 +
            stats.mocksCount * 30 +
            accuracy * 2;
          ranked.push({
            userId,
            userName: userMap.get(userId) ?? "Unknown",
            score: Math.round(score * 10) / 10,
            mocksCount: stats.mocksCount,
            quizzesCount: stats.quizzesCount,
            accuracy: Math.round(accuracy * 10) / 10,
            topicsMastered: masteredByUser.get(userId) ?? 0,
          });
        }

        ranked.sort((a, b) => b.score - a.score);
        const top10 = ranked.slice(0, 10).map((entry, i) => ({
          ...entry,
          rank: i + 1,
        }));

        await ctx.runMutation(internal.leaderboards.storeSnapshot, {
          subject,
          period,
          entries: top10,
        });
      }
    }
  },
});
