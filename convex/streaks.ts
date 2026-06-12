// @ts-nocheck
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

// "YYYY-MM-DD" in IST
export function dayLabelIST(ts: number): string {
  return new Date(ts + IST_OFFSET_MS).toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00Z").getTime();
  const db = new Date(b + "T00:00:00Z").getTime();
  return Math.round((db - da) / 86400000);
}

// Called from quiz / mock submission handlers. Idempotent per-day:
// repeated calls within the same IST day are a no-op.
export async function bumpStreakOnActivity(ctx, userId: Id<"users">, now: number) {
  const user = await ctx.db.get(userId);
  if (!user) return;
  const today = dayLabelIST(now);
  if (user.lastStreakDay === today) return; // already counted today

  let newStreak = 1;
  if (user.lastStreakDay) {
    const gap = daysBetween(user.lastStreakDay, today);
    if (gap === 1) newStreak = (user.streak ?? 0) + 1;
    // gap === 0 already handled above; gap > 1 => break, reset to 1
  }
  const longest = Math.max(user.longestStreak ?? 0, newStreak);

  await ctx.db.patch(userId, {
    streak: newStreak,
    longestStreak: longest,
    lastStreakDay: today,
  });
}

export const getMyStreak = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) return null;
    const today = dayLabelIST(Date.now());
    // If the user hasn't logged activity today and last day was >1d ago,
    // the persisted streak is stale — show it but the next activity will
    // reset it.
    return {
      streak: user.streak ?? 0,
      longestStreak: user.longestStreak ?? 0,
      lastStreakDay: user.lastStreakDay ?? null,
      activeToday: user.lastStreakDay === today,
    };
  },
});

// Manual nudge if a client opens the app — kept opt-in, not auto-called.
// Useful for parents who use the parent dashboard without studying.
export const markActiveToday = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    await bumpStreakOnActivity(ctx, userId, Date.now());
    return null;
  },
});
