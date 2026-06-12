// @ts-nocheck
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

// Closes the current active season (only if it has actually ended) and opens
// the next month's season. Scheduled to fire daily on Jan 28-31 etc. so the
// last-day-of-month covers Feb/Apr/etc. variations.
export const rollover = internalAction({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const active = await ctx.runQuery(internal.teams.getActiveSeasonInternal, {});

    if (!active) {
      // No active season — just ensure one exists for the current month
      await ctx.runMutation(internal.teams.ensureCurrentSeason, {});
      return { opened: "no-prior-active" };
    }

    // Only roll over if the active season has ended (now >= endsAt)
    if (now < active.endsAt) {
      return { skipped: "still-active", endsAt: active.endsAt };
    }

    // Refresh standings one last time before closing
    await ctx.runAction(internal.teamStandings.refresh, {});

    const closed = await ctx.runMutation(internal.teams.completeSeasonAndOpenNext, {
      seasonId: active._id,
    });
    const opened = await ctx.runMutation(internal.teams.ensureCurrentSeason, {});

    return { closed, opened };
  },
});
