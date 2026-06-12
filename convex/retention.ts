// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import { v } from "convex/values";
import { query, mutation, internalQuery } from "./_generated/server";

const SEGMENT_VALIDATOR = v.union(
  v.literal("active"),
  v.literal("dormant"),
  v.literal("at-risk")
);

// ── Internal helper ─────────────────────────────────────────────────────────

/**
 * Returns users segmented by engagement level, filtered to those who haven't
 * already received a retention email this week.
 */
export const getUsersForWeek = internalQuery({
  args: { weekStart: v.number() },
  handler: async (ctx, { weekStart }) => {
    const now = Date.now();
    const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

    // Get non-suppressed users with email (bounded)
    const users = await ctx.db.query("users").take(200);
    const eligible = users.filter(
      (u) => !u.isKid && u.email && !u.emailSuppressed
    );

    // Build set of userIds already emailed this week
    const logs = await ctx.db
      .query("retentionEmailLog")
      .withIndex("by_week", (q) => q.eq("weekStart", weekStart))
      .take(200);
    const alreadyEmailed = new Set(logs.map((l) => l.userId));

    const result = [];
    for (const user of eligible) {
      if (alreadyEmailed.has(user._id)) continue;

      const lastActive = user.lastLoginAt ?? user.createdAt;
      const inactiveDuration = now - lastActive;

      let segment;
      if (inactiveDuration <= THREE_DAYS) {
        segment = "active";
      } else if (inactiveDuration <= SEVEN_DAYS) {
        segment = "dormant";
      } else {
        segment = "at-risk";
      }

      // Optionally fetch their latest readiness score
      const readiness = await ctx.db
        .query("readinessScores")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .order("desc")
        .first();

      result.push({
        userId: user._id,
        email: user.email,
        name: user.name,
        segment,
        lastReadinessScore: readiness?.score ?? null,
      });
    }

    return result;
  },
});

// ── Public queries ──────────────────────────────────────────────────────────

/**
 * Returns users who haven't received a retention email this week.
 * weekStart should be the Monday midnight timestamp (ms) for the current week.
 */
export const getWeeklyQueue = query({
  args: { weekStart: v.number() },
  handler: async (ctx, { weekStart }) => {
    const now = Date.now();
    const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

    // Get non-suppressed users with email (bounded)
    const users = await ctx.db.query("users").take(200);
    const eligible = users.filter(
      (u) => !u.isKid && u.email && !u.emailSuppressed
    );

    // Build set of userIds already emailed this week
    const logs = await ctx.db
      .query("retentionEmailLog")
      .withIndex("by_week", (q) => q.eq("weekStart", weekStart))
      .take(200);
    const alreadyEmailed = new Set(logs.map((l) => l.userId));

    const result = [];
    for (const user of eligible) {
      if (alreadyEmailed.has(user._id)) continue;

      const lastActive = user.lastLoginAt ?? user.createdAt;
      const inactiveDuration = now - lastActive;

      let segment;
      if (inactiveDuration <= THREE_DAYS) {
        segment = "active";
      } else if (inactiveDuration <= SEVEN_DAYS) {
        segment = "dormant";
      } else {
        segment = "at-risk";
      }

      result.push({
        userId: user._id,
        email: user.email,
        name: user.name,
        segment,
      });
    }

    return result;
  },
});

// ── Public mutations ────────────────────────────────────────────────────────

/**
 * Records that a retention email was sent to a user for the given week.
 */
export const logEmailSent = mutation({
  args: {
    userId: v.id("users"),
    email: v.string(),
    segment: SEGMENT_VALIDATOR,
    weekStart: v.number(),
    emailType: v.string(),
  },
  handler: async (ctx, { userId, email, segment, weekStart, emailType }) => {
    return await ctx.db.insert("retentionEmailLog", {
      userId,
      email,
      segment,
      weekStart,
      sentAt: Date.now(),
      emailType,
    });
  },
});
