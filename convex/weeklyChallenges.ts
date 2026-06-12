// @ts-nocheck
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// ── Public queries ──────────────────────────────────────────────────────────

export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    // Prefer status-indexed lookup; fall back to "latest by week" for rows that
    // pre-date the status field.
    const active = await ctx.db
      .query("weeklyChallenges")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .first();
    if (active) return active;
    return await ctx.db
      .query("weeklyChallenges")
      .withIndex("by_week")
      .order("desc")
      .first();
  },
});

export const getMyParticipation = query({
  args: { challengeId: v.id("weeklyChallenges"), userId: v.id("users") },
  handler: async (ctx, { challengeId, userId }) => {
    return await ctx.db
      .query("challengeParticipations")
      .withIndex("by_user_challenge", (q) =>
        q.eq("userId", userId).eq("challengeId", challengeId)
      )
      .unique();
  },
});

export const getLeaderboard = query({
  args: { challengeId: v.id("weeklyChallenges"), limit: v.optional(v.number()) },
  handler: async (ctx, { challengeId, limit }) => {
    const rows = await ctx.db
      .query("challengeParticipations")
      .withIndex("by_challenge", (q) => q.eq("challengeId", challengeId))
      .take(500);
    rows.sort((a, b) => {
      // Completed users (sorted by completedAt asc) ahead of in-progress
      const ac = a.completedAt ?? Infinity;
      const bc = b.completedAt ?? Infinity;
      if (ac !== bc) return ac - bc;
      return b.bestScore - a.bestScore;
    });
    return rows.slice(0, limit ?? 20);
  },
});

export const getMyBadges = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const all = await ctx.db
      .query("challengeParticipations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .take(100);
    const completed = all.filter((p) => p.completedAt);
    const badges = [];
    for (const p of completed) {
      const challenge = await ctx.db.get(p.challengeId);
      if (challenge) {
        badges.push({
          challengeId: p.challengeId,
          title: challenge.title ?? `${challenge.subject} · ${challenge.topicSlug}`,
          subject: challenge.subject,
          topicLabel: challenge.topicLabel ?? challenge.topicSlug,
          completedAt: p.completedAt!,
          bestScore: p.bestScore,
          targetScore: challenge.targetScore,
        });
      }
    }
    badges.sort((a, b) => b.completedAt - a.completedAt);
    return badges;
  },
});

// ── Public mutation: join ────────────────────────────────────────────────────

export const join = mutation({
  args: { challengeId: v.id("weeklyChallenges"), userId: v.id("users") },
  handler: async (ctx, { challengeId, userId }) => {
    const existing = await ctx.db
      .query("challengeParticipations")
      .withIndex("by_user_challenge", (q) =>
        q.eq("userId", userId).eq("challengeId", challengeId)
      )
      .unique();
    if (existing) return existing._id;

    const user = await ctx.db.get(userId);
    const challenge = await ctx.db.get(challengeId);
    if (!user || !challenge) throw new Error("User or challenge not found");

    const id = await ctx.db.insert("challengeParticipations", {
      challengeId,
      userId,
      userName: user.name ?? "Anonymous",
      joinedAt: Date.now(),
      bestScore: 0,
      attemptCount: 0,
      updatedAt: Date.now(),
    });

    await ctx.db.patch(challengeId, {
      participants: (challenge.participants ?? 0) + 1,
    });

    return id;
  },
});

// ── Internal helper: update progress when a quiz lands ──────────────────────
// Called from quizActivity.record after the row is inserted.
export async function recordChallengeProgress(
  ctx,
  userId: Id<"users">,
  subject: string,
  topicSlug: string,
  score: number,
  at: number
) {
  // Find the active challenge that matches subject + topicSlug
  const active = await ctx.db
    .query("weeklyChallenges")
    .withIndex("by_status", (q) => q.eq("status", "active"))
    .first();
  if (!active) return;
  if (active.subject !== subject || active.topicSlug !== topicSlug) return;

  const participation = await ctx.db
    .query("challengeParticipations")
    .withIndex("by_user_challenge", (q) =>
      q.eq("userId", userId).eq("challengeId", active._id)
    )
    .unique();

  if (!participation) {
    // Auto-enroll if user is studying the challenge topic without joining
    const user = await ctx.db.get(userId);
    if (!user) return;
    const id = await ctx.db.insert("challengeParticipations", {
      challengeId: active._id,
      userId,
      userName: user.name ?? "Anonymous",
      joinedAt: at,
      bestScore: score,
      attemptCount: 1,
      completedAt: score >= active.targetScore ? at : undefined,
      updatedAt: at,
    });
    await ctx.db.patch(active._id, {
      participants: (active.participants ?? 0) + 1,
      completions:
        (active.completions ?? 0) + (score >= active.targetScore ? 1 : 0),
    });
    return id;
  }

  const newBest = Math.max(participation.bestScore, score);
  const justCompleted =
    !participation.completedAt && newBest >= active.targetScore;
  await ctx.db.patch(participation._id, {
    bestScore: newBest,
    attemptCount: participation.attemptCount + 1,
    completedAt: justCompleted ? at : participation.completedAt,
    updatedAt: at,
  });
  if (justCompleted) {
    await ctx.db.patch(active._id, {
      completions: (active.completions ?? 0) + 1,
    });
  }
}
