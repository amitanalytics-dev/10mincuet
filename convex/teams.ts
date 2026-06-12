// @ts-nocheck
import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";

// ── Constants ───────────────────────────────────────────────────────────────

const TEAM_SEED = [
  { shortName: "MI",   name: "Mumbai Indians",        colorPrimary: "#004BA0", colorSecondary: "#D1AB3E", emoji: "🦁" },
  { shortName: "CSK",  name: "Chennai Super Kings",   colorPrimary: "#FFC400", colorSecondary: "#0080C8", emoji: "🦁" },
  { shortName: "RCB",  name: "Royal Challengers Bengaluru", colorPrimary: "#EC1C24", colorSecondary: "#000000", emoji: "👑" },
  { shortName: "KKR",  name: "Kolkata Knight Riders", colorPrimary: "#3A225D", colorSecondary: "#B3A123", emoji: "⚔️" },
  { shortName: "SRH",  name: "Sunrisers Hyderabad",   colorPrimary: "#F26522", colorSecondary: "#000000", emoji: "🌅" },
  { shortName: "DC",   name: "Delhi Capitals",        colorPrimary: "#17449B", colorSecondary: "#EF1B23", emoji: "🛡️" },
  { shortName: "PBKS", name: "Punjab Kings",          colorPrimary: "#DD1F2D", colorSecondary: "#A77C49", emoji: "🦅" },
  { shortName: "RR",   name: "Rajasthan Royals",      colorPrimary: "#EA1A85", colorSecondary: "#254AA5", emoji: "👑" },
  { shortName: "GT",   name: "Gujarat Titans",        colorPrimary: "#1B2133", colorSecondary: "#B5AF4F", emoji: "💪" },
  { shortName: "LSG",  name: "Lucknow Super Giants",  colorPrimary: "#A72056", colorSecondary: "#FFCC00", emoji: "🐆" },
];

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const MIN_TEAM_BUFFER = 5; // ignore balance cap below this team size

// "YYYY-MM" in IST
function monthLabelForTimestamp(ts: number): string {
  return new Date(ts + IST_OFFSET_MS).toISOString().slice(0, 7);
}

// First-of-month UTC ts whose IST month equals `label`
function monthBoundsForLabel(label: string): { startsAt: number; endsAt: number } {
  const [y, m] = label.split("-").map(Number);
  const startUTC = Date.UTC(y, m - 1, 1, 0, 0, 0) - IST_OFFSET_MS;
  const endUTC = Date.UTC(y, m, 1, 0, 0, 0) - IST_OFFSET_MS;
  return { startsAt: startUTC, endsAt: endUTC };
}

// ── Public queries ──────────────────────────────────────────────────────────

export const listTeams = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("teams").collect();
  },
});

export const getCurrentSeason = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("seasons")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .first();
  },
});

export const getMyTeam = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user?.teamId) return null;
    const team = await ctx.db.get(user.teamId);
    return team
      ? { ...team, joinedAt: user.teamJoinedAt, joinedSeasonId: user.teamJoinedSeasonId }
      : null;
  },
});

export const getStandings = query({
  args: { seasonId: v.optional(v.id("seasons")) },
  handler: async (ctx, { seasonId }) => {
    let resolvedSeasonId = seasonId;
    if (!resolvedSeasonId) {
      const active = await ctx.db
        .query("seasons")
        .withIndex("by_status", (q) => q.eq("status", "active"))
        .first();
      resolvedSeasonId = active?._id;
    }
    if (!resolvedSeasonId) return null;
    return await ctx.db
      .query("teamStandingSnapshots")
      .withIndex("by_season", (q) => q.eq("seasonId", resolvedSeasonId))
      .first();
  },
});

export const getTeamSquad = query({
  args: { teamId: v.id("teams"), seasonId: v.optional(v.id("seasons")) },
  handler: async (ctx, { teamId, seasonId }) => {
    let resolvedSeasonId = seasonId;
    if (!resolvedSeasonId) {
      const active = await ctx.db
        .query("seasons")
        .withIndex("by_status", (q) => q.eq("status", "active"))
        .first();
      resolvedSeasonId = active?._id;
    }
    if (!resolvedSeasonId) return null;
    return await ctx.db
      .query("teamSquadSnapshots")
      .withIndex("by_season_team", (q) =>
        q.eq("seasonId", resolvedSeasonId).eq("teamId", teamId)
      )
      .first();
  },
});

export const getTeamByShortName = query({
  args: { shortName: v.string() },
  handler: async (ctx, { shortName }) => {
    return await ctx.db
      .query("teams")
      .withIndex("by_short_name", (q) => q.eq("shortName", shortName.toUpperCase()))
      .unique();
  },
});

export const getTeamMemberCounts = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").take(2000);
    const counts: Record<string, number> = {};
    for (const u of users) {
      if (u.teamId) {
        counts[u.teamId.toString()] = (counts[u.teamId.toString()] ?? 0) + 1;
      }
    }
    return counts;
  },
});

// ── Public mutation: join team (with balance check) ─────────────────────────

export const joinTeam = mutation({
  args: { userId: v.id("users"), teamId: v.id("teams") },
  handler: async (ctx, { userId, teamId }) => {
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");
    if (user.teamId) throw new Error("You are already on a team this season");

    const team = await ctx.db.get(teamId);
    if (!team) throw new Error("Team not found");

    const active = await ctx.db
      .query("seasons")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .first();
    if (!active) throw new Error("No active season");

    // Balance check: max team size = max(MIN_TEAM_BUFFER, ceil(avg * 1.1) + 1)
    const users = await ctx.db.query("users").take(2000);
    const counts: Record<string, number> = {};
    let totalAssigned = 0;
    for (const u of users) {
      if (u.teamId) {
        counts[u.teamId.toString()] = (counts[u.teamId.toString()] ?? 0) + 1;
        totalAssigned++;
      }
    }
    const avg = totalAssigned / TEAM_SEED.length;
    const cap = Math.max(MIN_TEAM_BUFFER, Math.ceil(avg * 1.1) + 1);
    const currentForTarget = counts[teamId.toString()] ?? 0;
    if (currentForTarget >= cap) {
      throw new Error(
        `${team.shortName} is full this season. Pick a team with fewer members to keep things balanced.`
      );
    }

    await ctx.db.patch(userId, {
      teamId,
      teamJoinedAt: Date.now(),
      teamJoinedSeasonId: active._id,
    });

    return { teamId, seasonId: active._id };
  },
});

// ── Internal: seed teams + open current month season ────────────────────────

export const seedTeams = internalMutation({
  args: {},
  handler: async (ctx) => {
    let inserted = 0;
    for (const t of TEAM_SEED) {
      const existing = await ctx.db
        .query("teams")
        .withIndex("by_short_name", (q) => q.eq("shortName", t.shortName))
        .unique();
      if (!existing) {
        await ctx.db.insert("teams", t);
        inserted++;
      }
    }
    return { inserted, total: TEAM_SEED.length };
  },
});

export const ensureCurrentSeason = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const label = monthLabelForTimestamp(now);
    const existing = await ctx.db
      .query("seasons")
      .withIndex("by_month", (q) => q.eq("monthLabel", label))
      .first();
    if (existing) return { seasonId: existing._id, monthLabel: label, created: false };

    // Close any older active seasons before opening a new one
    const oldActives = await ctx.db
      .query("seasons")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .take(10);
    for (const s of oldActives) {
      await ctx.db.patch(s._id, { status: "completed" });
    }

    const { startsAt, endsAt } = monthBoundsForLabel(label);
    const seasonId = await ctx.db.insert("seasons", {
      monthLabel: label,
      startsAt,
      endsAt,
      status: "active",
    });
    return { seasonId, monthLabel: label, created: true };
  },
});

// ── Internal queries used by standings refresh action ───────────────────────

export const getAllUsersWithTeam = internalQuery({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").take(2000);
    return users.filter((u) => u.teamId);
  },
});

export const getQuizActivityInWindow = internalQuery({
  args: { startsAt: v.number(), endsAt: v.number() },
  handler: async (ctx, { startsAt, endsAt }) => {
    // Pull recent activity across all subjects within season window.
    const subjects = ["Languages", "Domain", "General Test"] as const;
    const rows = [];
    for (const subject of subjects) {
      const chunk = await ctx.db
        .query("quizActivity")
        .withIndex("by_subject_completed", (q) =>
          q.eq("subject", subject).gte("completedAt", startsAt)
        )
        .take(2000);
      for (const r of chunk) {
        if (r.completedAt < endsAt) rows.push(r);
      }
    }
    return rows;
  },
});

export const getMockResultsInWindow = internalQuery({
  args: { startsAt: v.number(), endsAt: v.number() },
  handler: async (ctx, { startsAt, endsAt }) => {
    const rows = await ctx.db
      .query("mockResults")
      .withIndex("by_taken", (q) => q.gte("takenAt", startsAt))
      .take(2000);
    return rows.filter((r) => r.takenAt < endsAt);
  },
});

export const getAllTeams = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("teams").collect();
  },
});

export const getActiveSeasonInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("seasons")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .first();
  },
});

// ── Internal: upsert standings snapshot ─────────────────────────────────────

export const upsertStandings = internalMutation({
  args: {
    seasonId: v.id("seasons"),
    standings: v.array(
      v.object({
        teamId: v.string(),
        teamShortName: v.string(),
        teamName: v.string(),
        memberCount: v.number(),
        topElevenAverage: v.number(),
        totalScore: v.number(),
        rank: v.number(),
      })
    ),
  },
  handler: async (ctx, { seasonId, standings }) => {
    const existing = await ctx.db
      .query("teamStandingSnapshots")
      .withIndex("by_season", (q) => q.eq("seasonId", seasonId))
      .first();
    const data = { seasonId, updatedAt: Date.now(), standings };
    if (existing) {
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert("teamStandingSnapshots", data);
    }
  },
});

export const upsertSquadSnapshot = internalMutation({
  args: {
    seasonId: v.id("seasons"),
    teamId: v.id("teams"),
    members: v.array(
      v.object({
        userId: v.string(),
        userName: v.string(),
        score: v.number(),
        quizzesCount: v.number(),
        mocksCount: v.number(),
        accuracy: v.number(),
        isPlayingXI: v.boolean(),
      })
    ),
  },
  handler: async (ctx, { seasonId, teamId, members }) => {
    const existing = await ctx.db
      .query("teamSquadSnapshots")
      .withIndex("by_season_team", (q) =>
        q.eq("seasonId", seasonId).eq("teamId", teamId)
      )
      .first();
    const data = { seasonId, teamId, updatedAt: Date.now(), members };
    if (existing) {
      await ctx.db.patch(existing._id, data);
    } else {
      await ctx.db.insert("teamSquadSnapshots", data);
    }
  },
});

// ── Internal: monthly rollover (close season + open next + crown winner) ────

export const completeSeasonAndOpenNext = internalMutation({
  args: { seasonId: v.id("seasons") },
  handler: async (ctx, { seasonId }) => {
    const season = await ctx.db.get(seasonId);
    if (!season) return { skipped: "season-not-found" };

    // Crown the winner from latest standings snapshot
    const snap = await ctx.db
      .query("teamStandingSnapshots")
      .withIndex("by_season", (q) => q.eq("seasonId", seasonId))
      .first();
    const winner = snap?.standings.find((s) => s.rank === 1);

    // Find MVP across the season — top contributor by score
    let mvpUserId: string | undefined;
    let mvpUserName: string | undefined;
    let mvpScore = 0;
    const allSquads = await ctx.db
      .query("teamSquadSnapshots")
      .withIndex("by_season_team", (q) => q.eq("seasonId", seasonId))
      .take(50);
    for (const squad of allSquads) {
      for (const m of squad.members) {
        if (m.score > mvpScore) {
          mvpScore = m.score;
          mvpUserId = m.userId;
          mvpUserName = m.userName;
        }
      }
    }

    await ctx.db.patch(seasonId, {
      status: "completed",
      winnerTeamId: winner ? (winner.teamId as Id<"teams">) : undefined,
      mvpUserId: mvpUserId as Id<"users"> | undefined,
      mvpUserName,
      mvpScore: mvpScore > 0 ? Math.round(mvpScore) : undefined,
    });

    // Clear team membership so users re-pick next month
    const teamed = await ctx.db.query("users").take(2000);
    for (const u of teamed) {
      if (u.teamId) {
        await ctx.db.patch(u._id, {
          teamId: undefined,
          teamJoinedAt: undefined,
          teamJoinedSeasonId: undefined,
        });
      }
    }

    return { closed: seasonId, winner: winner?.teamShortName, mvp: mvpUserName };
  },
});
