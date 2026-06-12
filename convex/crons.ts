// @ts-nocheck
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// ─── EXISTING (4) ─────────────────────────────────────────────────────────────

crons.interval("refresh leaderboards", { hours: 1 }, internal.leaderboards.refreshAll, {});
crons.interval("refresh team standings", { hours: 1 }, internal.teamStandings.refresh, {});
crons.cron("calculate readiness weekly", "0 0 * * 1", internal.readiness.calculateAll, {});
// Monthly season rollover: 1st of month at 12:30am IST (19:00 UTC on last day prev month)
crons.cron("monthly season rollover", "0 19 28-31 * *", internal.seasonRollover.rollover, {});

// ─── TIER 1: VIRAL ────────────────────────────────────────────────────────────

crons.cron("streak reset check",       "30 21 * * *", internal.cronHandlers.streakResetCheck,    {});
crons.cron("referral gifting",         "30 23 * * 0", internal.cronHandlers.referralGifting,     {});
crons.cron("weekly challenge reset",   "30  0 * * 1", internal.cronHandlers.weeklyChallengeReset,{});
// Daily orchestrator: opens registration, closes & seeds brackets, advances rounds.
crons.cron("tournament tick",          "0  19 * * *", internal.tournaments.tick,                {});

// ─── TIER 2: DIFFERENTIATION ──────────────────────────────────────────────────

crons.cron("educator digest",          "30  1 * * 5", internal.cronHandlers.educatorDigest,      {});
crons.cron("parent dashboard sync",    "30  2 * * *", internal.cronHandlers.parentDashboardSync, {});
crons.cron("group study analytics",    "30  3 * * 2", internal.cronHandlers.groupStudyAnalytics, {});

// ─── TIER 3: RETENTION ───────────────────────────────────────────────────────

crons.cron("weekly retention email",   "30  4 * * 4", internal.cronHandlers.weeklyRetentionEmail,{});
crons.cron("leaderboard recalc",       "0  17 * * 0", internal.cronHandlers.leaderboardRecalc,  {});
crons.cron("weekly readiness mail",    "30  0 * * 3", internal.cronHandlers.weeklyReadinessMail, {});

// ─── BLOG SEEDING ─────────────────────────────────────────────────────────────

// 7am IST = 1:30am UTC daily. Logs intent; actual generation via external script.
crons.cron("daily blog seed", "30 1 * * *", internal.blogSeeder.triggerDailyBatch, {});

// ─── ADMIN ────────────────────────────────────────────────────────────────────

// Daily snapshot — trend data needs a row per day. 30min past midnight IST.
crons.cron("kpi calculation",          "30 18 * * *", internal.cronHandlers.kpiCalculation,     {});
// Monthly educator payouts. 1st of month, 30min past midnight IST.
crons.cron("educator payout monthly",  "30 18 1 * *", internal.cronHandlers.educatorPayoutMonthly, {});
crons.cron("ab test results",          "0  18 * * 0", internal.cronHandlers.abTestResults,      {});
crons.cron("admin todo gen",           "30 15 * * *", internal.cronHandlers.adminTodoGen,       {});
crons.cron("class upgrade june",       "0   0 1 6 *", internal.cronHandlers.classUpgradeJune,   {});

export default crons;
