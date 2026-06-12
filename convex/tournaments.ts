// @ts-nocheck
import { v } from "convex/values";
import {
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { internal } from "./_generated/api";

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const SIZE = 8; // 8-player single-elim

const TOURNAMENT_TOPIC_POOL = [
  { subject: "General Test", topicSlug: "current-affairs",     topicLabel: "Current Affairs" },
  { subject: "Languages",    topicSlug: "english-reading-comprehension", topicLabel: "English RC" },
  { subject: "Domain",       topicSlug: "mathematics-domain",  topicLabel: "Mathematics" },
  { subject: "General Test", topicSlug: "logical-reasoning",   topicLabel: "Logical Reasoning" },
  { subject: "Languages",    topicSlug: "english-grammar",     topicLabel: "English Grammar" },
  { subject: "Domain",       topicSlug: "economics-domain",    topicLabel: "Economics" },
];

// IST Monday 00:00 for the week containing `now`
function istMondayStart(now: number): number {
  const istNow = new Date(now + IST_OFFSET_MS);
  const day = istNow.getUTCDay();
  const daysSinceMonday = (day + 6) % 7;
  const istMondayMidnight = Date.UTC(
    istNow.getUTCFullYear(),
    istNow.getUTCMonth(),
    istNow.getUTCDate() - daysSinceMonday,
    0, 0, 0
  );
  return istMondayMidnight - IST_OFFSET_MS;
}

// ── Public queries ──────────────────────────────────────────────────────────

export const listLive = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db
      .query("tournaments")
      .withIndex("by_starts")
      .order("desc")
      .take(20);
    return all.filter(
      (t) => t.status === "registration" || t.status === "active" || t.status === "completed"
    );
  },
});

export const getById = query({
  args: { tournamentId: v.id("tournaments") },
  handler: async (ctx, { tournamentId }) => {
    return await ctx.db.get(tournamentId);
  },
});

export const getEntries = query({
  args: { tournamentId: v.id("tournaments") },
  handler: async (ctx, { tournamentId }) => {
    const entries = await ctx.db
      .query("tournamentEntries")
      .withIndex("by_tournament", (q) => q.eq("tournamentId", tournamentId))
      .take(100);
    entries.sort((a, b) => a.seed - b.seed);
    return entries;
  },
});

export const getMatches = query({
  args: { tournamentId: v.id("tournaments") },
  handler: async (ctx, { tournamentId }) => {
    const matches = await ctx.db
      .query("tournamentMatches")
      .withIndex("by_tournament", (q) => q.eq("tournamentId", tournamentId))
      .take(50);
    matches.sort((a, b) => a.round - b.round || a.slot - b.slot);
    return matches;
  },
});

export const isRegistered = query({
  args: { tournamentId: v.id("tournaments"), userId: v.id("users") },
  handler: async (ctx, { tournamentId, userId }) => {
    const entry = await ctx.db
      .query("tournamentEntries")
      .withIndex("by_tournament_user", (q) =>
        q.eq("tournamentId", tournamentId).eq("userId", userId)
      )
      .unique();
    return entry !== null;
  },
});

// ── Public mutation: register ──────────────────────────────────────────────

export const register = mutation({
  args: { tournamentId: v.id("tournaments"), userId: v.id("users") },
  handler: async (ctx, { tournamentId, userId }) => {
    const tournament = await ctx.db.get(tournamentId);
    if (!tournament) throw new Error("Tournament not found");
    if (tournament.status !== "registration") throw new Error("Registration is closed");

    const existing = await ctx.db
      .query("tournamentEntries")
      .withIndex("by_tournament_user", (q) =>
        q.eq("tournamentId", tournamentId).eq("userId", userId)
      )
      .unique();
    if (existing) return { alreadyRegistered: true, entryId: existing._id };

    const allEntries = await ctx.db
      .query("tournamentEntries")
      .withIndex("by_tournament", (q) => q.eq("tournamentId", tournamentId))
      .take(SIZE + 1);
    if (allEntries.length >= (tournament.size ?? SIZE)) {
      throw new Error("Tournament is full");
    }

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const seed = allEntries.length + 1;
    const entryId = await ctx.db.insert("tournamentEntries", {
      tournamentId,
      userId,
      userName: user.name ?? "Anonymous",
      seed,
      currentRound: 1,
      registeredAt: Date.now(),
    });

    return { alreadyRegistered: false, entryId, seed };
  },
});

// ── Internal: bracket generation + round advancement ────────────────────────

export const ensureRegistrationOpen = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    // Skip if a non-completed tournament already exists
    const existing = await ctx.db
      .query("tournaments")
      .withIndex("by_status", (q) => q.eq("status", "registration"))
      .first();
    if (existing) return { skipped: "already-open", id: existing._id };
    const active = await ctx.db
      .query("tournaments")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .first();
    if (active) return { skipped: "active-exists", id: active._id };

    // Pick topic deterministically by week index
    const weekIndex = Math.floor(now / (7 * DAY_MS));
    const pick = TOURNAMENT_TOPIC_POOL[weekIndex % TOURNAMENT_TOPIC_POOL.length];

    const monday = istMondayStart(now);
    // If now is already past this Monday, target next Monday so users have
    // the week to register before round 1 starts.
    const nextMonday = now >= monday ? monday + 7 * DAY_MS : monday;

    const startsAt = nextMonday + 6 * 3600000; // Mon 6am IST
    const registrationClosesAt = startsAt; // close at Mon 6am IST
    const round1EndsAt = nextMonday + 2 * DAY_MS + 18 * 3600000 + 30 * 60000; // Wed midnight IST
    const round2EndsAt = nextMonday + 4 * DAY_MS + 18 * 3600000 + 30 * 60000; // Fri midnight IST
    const round3EndsAt = nextMonday + 6 * DAY_MS + 18 * 3600000 + 30 * 60000; // Sun midnight IST
    const endsAt = round3EndsAt;

    const id = await ctx.db.insert("tournaments", {
      name: `${pick.subject} Cup · ${pick.topicLabel}`,
      subject: pick.subject,
      topicSlug: pick.topicSlug,
      topicLabel: pick.topicLabel,
      size: SIZE,
      status: "registration",
      startsAt,
      endsAt,
      registrationClosesAt,
      round1EndsAt,
      round2EndsAt,
      round3EndsAt,
      currentRound: 0,
      createdAt: now,
    });
    return { created: id, topic: pick.topicLabel };
  },
});

export const closeRegistrationAndSeedBracket = internalMutation({
  args: { tournamentId: v.id("tournaments") },
  handler: async (ctx, { tournamentId }) => {
    const t = await ctx.db.get(tournamentId);
    if (!t || t.status !== "registration") return { skipped: "not-in-registration" };

    const entries = await ctx.db
      .query("tournamentEntries")
      .withIndex("by_tournament", (q) => q.eq("tournamentId", tournamentId))
      .take(SIZE + 1);

    if (entries.length < SIZE) {
      // Not enough players → cancel
      await ctx.db.patch(tournamentId, { status: "cancelled" });
      return { cancelled: true, registered: entries.length };
    }

    entries.sort((a, b) => a.seed - b.seed);
    const top = entries.slice(0, SIZE);

    // Classic single-elim seeding: 1v8, 4v5, 2v7, 3v6
    const pairs: [number, number][] = [
      [0, 7],
      [3, 4],
      [1, 6],
      [2, 5],
    ];

    for (let i = 0; i < pairs.length; i++) {
      const [a, b] = pairs[i];
      await ctx.db.insert("tournamentMatches", {
        tournamentId,
        round: 1,
        slot: i,
        playerAUserId: top[a].userId,
        playerAUserName: top[a].userName,
        playerBUserId: top[b].userId,
        playerBUserName: top[b].userName,
        status: "pending",
        roundStartsAt: t.startsAt ?? Date.now(),
        roundEndsAt: t.round1EndsAt ?? Date.now() + 2 * DAY_MS,
      });
    }

    await ctx.db.patch(tournamentId, { status: "active", currentRound: 1 });
    return { seeded: true, matches: pairs.length };
  },
});

// Internal helper called during round resolution.
// Resolves a single match using each player's best quiz score within
// [roundStartsAt, roundEndsAt] on the tournament's topic.
async function resolveMatchInternal(ctx, match, tournament) {
  const window = { from: match.roundStartsAt, to: match.roundEndsAt };

  async function bestScoreForUser(userId: Id<"users">) {
    const acts = await ctx.db
      .query("quizActivity")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .take(200);
    const onTopic = acts.filter(
      (a) =>
        a.topicSlug === tournament.topicSlug &&
        a.completedAt >= window.from &&
        a.completedAt <= window.to
    );
    if (onTopic.length === 0) return null;
    return Math.max(...onTopic.map((a) => a.score));
  }

  const scoreA = await bestScoreForUser(match.playerAUserId);
  const scoreB = match.playerBUserId ? await bestScoreForUser(match.playerBUserId) : null;

  let winnerId = null;
  let winnerName = null;
  if (scoreA !== null && (scoreB === null || scoreA > scoreB)) {
    winnerId = match.playerAUserId;
    winnerName = match.playerAUserName;
  } else if (scoreB !== null) {
    winnerId = match.playerBUserId;
    winnerName = match.playerBUserName;
  } else {
    // Neither played — coin flip by seed (lower seed wins)
    winnerId = match.playerAUserId;
    winnerName = match.playerAUserName;
  }

  await ctx.db.patch(match._id, {
    playerAScore: scoreA ?? 0,
    playerBScore: scoreB ?? 0,
    winnerUserId: winnerId,
    winnerUserName: winnerName,
    status: "completed",
    completedAt: Date.now(),
  });

  // Mark loser as eliminated
  const losers = [match.playerAUserId, match.playerBUserId].filter(
    (id) => id && id !== winnerId
  );
  for (const loserId of losers) {
    const entry = await ctx.db
      .query("tournamentEntries")
      .withIndex("by_tournament_user", (q) =>
        q.eq("tournamentId", tournament._id).eq("userId", loserId)
      )
      .unique();
    if (entry) {
      await ctx.db.patch(entry._id, {
        eliminatedInRound: match.round,
        currentRound: match.round,
      });
    }
  }

  return { winnerId, winnerName };
}

export const advanceTournamentRound = internalMutation({
  args: { tournamentId: v.id("tournaments"), round: v.number() },
  handler: async (ctx, { tournamentId, round }) => {
    const t = await ctx.db.get(tournamentId);
    if (!t || t.status !== "active") return { skipped: "not-active" };
    if (t.currentRound !== round) return { skipped: "wrong-round", currentRound: t.currentRound };

    const matches = await ctx.db
      .query("tournamentMatches")
      .withIndex("by_tournament_round", (q) =>
        q.eq("tournamentId", tournamentId).eq("round", round)
      )
      .take(20);

    const winners: Array<{ userId: Id<"users">; userName: string }> = [];
    for (const m of matches) {
      if (m.status === "completed" && m.winnerUserId) {
        winners.push({ userId: m.winnerUserId, userName: m.winnerUserName });
        continue;
      }
      const r = await resolveMatchInternal(ctx, m, t);
      if (r.winnerId) winners.push({ userId: r.winnerId, userName: r.winnerName });
    }

    if (round === 3) {
      // Final: declare tournament winner
      const champion = winners[0];
      await ctx.db.patch(tournamentId, {
        status: "completed",
        currentRound: 3,
        winnerUserId: champion?.userId,
        winnerUserName: champion?.userName,
      });
      return { completed: true, champion: champion?.userName };
    }

    // Generate next round matches by pairing adjacent winners
    const nextRound = round + 1;
    const nextRoundStartsAt = round === 1 ? t.round1EndsAt : t.round2EndsAt;
    const nextRoundEndsAt = round === 1 ? t.round2EndsAt : t.round3EndsAt;

    for (let i = 0; i < winners.length; i += 2) {
      const a = winners[i];
      const b = winners[i + 1];
      if (!a) continue;
      await ctx.db.insert("tournamentMatches", {
        tournamentId,
        round: nextRound,
        slot: i / 2,
        playerAUserId: a.userId,
        playerAUserName: a.userName,
        playerBUserId: b?.userId,
        playerBUserName: b?.userName,
        status: "pending",
        roundStartsAt: nextRoundStartsAt ?? Date.now(),
        roundEndsAt: nextRoundEndsAt ?? Date.now() + 2 * DAY_MS,
      });
    }

    await ctx.db.patch(tournamentId, { currentRound: nextRound });
    return { advanced: nextRound, matchesGenerated: Math.ceil(winners.length / 2) };
  },
});

export const getActiveAndRegistration = internalQuery({
  args: {},
  handler: async (ctx) => {
    const reg = await ctx.db
      .query("tournaments")
      .withIndex("by_status", (q) => q.eq("status", "registration"))
      .first();
    const active = await ctx.db
      .query("tournaments")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .first();
    return { reg, active };
  },
});

// Daily cron orchestrator (replaces the old tournamentBracketGen stub).
// Decides what to do based on the current state of tournaments.
export const tick = internalAction({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const state = await ctx.runQuery(internal.tournaments.getActiveAndRegistration, {});

    // 1. Ensure a registration tournament always exists once the active one is done
    if (!state.reg && !state.active) {
      const r = await ctx.runMutation(internal.tournaments.ensureRegistrationOpen, {});
      return { opened: r };
    }

    // 2. Close registration + seed bracket when registration window has ended
    if (state.reg && state.reg.registrationClosesAt && now >= state.reg.registrationClosesAt) {
      const r = await ctx.runMutation(internal.tournaments.closeRegistrationAndSeedBracket, {
        tournamentId: state.reg._id,
      });
      return { seeded: r };
    }

    // 3. Advance rounds when their deadline has passed
    if (state.active) {
      const t = state.active;
      const round = t.currentRound ?? 1;
      const deadline =
        round === 1 ? t.round1EndsAt : round === 2 ? t.round2EndsAt : t.round3EndsAt;
      if (deadline && now >= deadline) {
        const r = await ctx.runMutation(internal.tournaments.advanceTournamentRound, {
          tournamentId: t._id,
          round,
        });
        return { advanced: r };
      }
    }

    return { idle: true };
  },
});
