// @ts-nocheck
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

const PLAYING_XI = 11;

// Per-user score within season window: identical formula to individual leaderboard
// score = quizzes * 10 + mocks * 30 + accuracy * 2
function userScore(quizCount: number, mockCount: number, accuracy: number): number {
  return quizCount * 10 + mockCount * 30 + accuracy * 2;
}

// Top-11 average (playing XI). If team has < 11 members, average over actual size
// to avoid punishing small teams with implicit zeros.
function topElevenAverage(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sorted = [...scores].sort((a, b) => b - a);
  const take = Math.min(PLAYING_XI, sorted.length);
  const sum = sorted.slice(0, take).reduce((a, b) => a + b, 0);
  return sum / take;
}

export const refresh = internalAction({
  args: {},
  handler: async (ctx) => {
    const [season, teams, users, quizActivity, mockResults] = await Promise.all([
      ctx.runQuery(internal.teams.getActiveSeasonInternal, {}),
      ctx.runQuery(internal.teams.getAllTeams, {}),
      ctx.runQuery(internal.teams.getAllUsersWithTeam, {}),
      Promise.resolve(null),
      Promise.resolve(null),
    ]);

    if (!season) return { skipped: "no-active-season" };

    const [quiz, mocks] = await Promise.all([
      ctx.runQuery(internal.teams.getQuizActivityInWindow, {
        startsAt: season.startsAt,
        endsAt: season.endsAt,
      }),
      ctx.runQuery(internal.teams.getMockResultsInWindow, {
        startsAt: season.startsAt,
        endsAt: season.endsAt,
      }),
    ]);

    // Aggregate per user
    const userStats = new Map<
      string,
      {
        userName: string;
        teamId: string;
        quizCount: number;
        mockCount: number;
        scoreSum: number;
      }
    >();
    for (const u of users) {
      userStats.set(u._id.toString(), {
        userName: u.name ?? "Anonymous",
        teamId: u.teamId.toString(),
        quizCount: 0,
        mockCount: 0,
        scoreSum: 0,
      });
    }

    for (const qa of quiz) {
      const s = userStats.get(qa.userId.toString());
      if (!s) continue;
      s.quizCount += 1;
      s.scoreSum += qa.score;
    }
    for (const mr of mocks) {
      const s = userStats.get(mr.userId.toString());
      if (!s) continue;
      s.mockCount += 1;
    }

    // Build per-team contributor lists
    const teamContributors = new Map<
      string,
      Array<{
        userId: string;
        userName: string;
        score: number;
        quizCount: number;
        mockCount: number;
        accuracy: number;
      }>
    >();
    for (const [userId, s] of userStats.entries()) {
      const accuracy = s.quizCount > 0 ? s.scoreSum / s.quizCount : 0;
      const score = userScore(s.quizCount, s.mockCount, accuracy);
      const arr = teamContributors.get(s.teamId) ?? [];
      arr.push({
        userId,
        userName: s.userName,
        score,
        quizCount: s.quizCount,
        mockCount: s.mockCount,
        accuracy,
      });
      teamContributors.set(s.teamId, arr);
    }

    // Standings per team
    const rawStandings = teams.map((t) => {
      const contributors = teamContributors.get(t._id.toString()) ?? [];
      const scores = contributors.map((c) => c.score);
      const topAvg = topElevenAverage(scores);
      const total = scores.reduce((a, b) => a + b, 0);
      return {
        teamId: t._id.toString(),
        teamShortName: t.shortName,
        teamName: t.name,
        memberCount: contributors.length,
        topElevenAverage: Math.round(topAvg * 10) / 10,
        totalScore: Math.round(total * 10) / 10,
      };
    });

    rawStandings.sort((a, b) => {
      if (b.topElevenAverage !== a.topElevenAverage) {
        return b.topElevenAverage - a.topElevenAverage;
      }
      return b.totalScore - a.totalScore;
    });
    const standings = rawStandings.map((s, i) => ({ ...s, rank: i + 1 }));

    await ctx.runMutation(internal.teams.upsertStandings, {
      seasonId: season._id,
      standings,
    });

    // Upsert squad snapshots per team (top 50 contributors, mark first 11 as playing XI)
    for (const t of teams) {
      const contributors = teamContributors.get(t._id.toString()) ?? [];
      contributors.sort((a, b) => b.score - a.score);
      const members = contributors.slice(0, 50).map((c, i) => ({
        userId: c.userId,
        userName: c.userName,
        score: Math.round(c.score * 10) / 10,
        quizzesCount: c.quizCount,
        mocksCount: c.mockCount,
        accuracy: Math.round(c.accuracy * 10) / 10,
        isPlayingXI: i < PLAYING_XI,
      }));
      await ctx.runMutation(internal.teams.upsertSquadSnapshot, {
        seasonId: season._id,
        teamId: t._id,
        members,
      });
    }

    return {
      seasonLabel: season.monthLabel,
      teamsRanked: standings.length,
      contributors: userStats.size,
    };
  },
});
