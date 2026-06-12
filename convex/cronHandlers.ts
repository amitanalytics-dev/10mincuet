// @ts-nocheck
import { internalMutation } from "./_generated/server";

// Wraps an internalMutation handler with cronLogs tracking. Use this for
// every scheduled cron so /admin shows a complete run history.
async function withLogging(ctx, cronName, fn) {
  const startedAt = Date.now();
  try {
    const result = await fn();
    await ctx.db.insert("cronLogs", {
      cronName,
      status: "success",
      startedAt,
      durationMs: Date.now() - startedAt,
      recordsAffected: typeof result === "object" && result !== null
        ? Object.values(result).find((v) => typeof v === "number")
        : undefined,
      result: JSON.stringify(result),
    });
    return result;
  } catch (err) {
    await ctx.db.insert("cronLogs", {
      cronName,
      status: "failed",
      startedAt,
      durationMs: Date.now() - startedAt,
      errorMessage: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
}

// ─── TIER 1: VIRAL ───────────────────────────────────────────────────────────

export const streakResetCheck = internalMutation({
  args: {},
  handler: async (ctx) => {
    return await withLogging(ctx, "streakResetCheck", async () => {
      // Reset streak for any user whose lastStreakDay is older than yesterday IST.
      const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
      const now = Date.now();
      const todayIST = new Date(now + IST_OFFSET_MS).toISOString().slice(0, 10);
      const yesterdayIST = new Date(now + IST_OFFSET_MS - 86400000).toISOString().slice(0, 10);

      const users = await ctx.db.query("users").take(2000);
      let reset = 0;
      for (const user of users) {
        if (!user.streak) continue;
        // If lastStreakDay is today or yesterday IST, the streak is alive.
        // Anything older -> reset.
        if (user.lastStreakDay === todayIST || user.lastStreakDay === yesterdayIST) continue;
        await ctx.db.patch(user._id, { streak: 0 });
        reset++;
      }
      return { reset };
    });
  },
});

export const referralGifting = internalMutation({
  args: {},
  handler: async (ctx) => {
    const unpaid = await ctx.db
      .query("referrals")
      .filter((q) => q.eq(q.field("paidAt"), undefined))
      .take(200);
    let gifted = 0;
    for (const ref of unpaid) {
      const sub = await ctx.db
        .query("subscriptions")
        .withIndex("by_user", (q) => q.eq("userId", ref.referrerId))
        .first();
      if (sub) {
        await ctx.db.patch(sub._id, {
          freeMonthsRemaining: (sub.freeMonthsRemaining ?? 0) + 1,
        });
        await ctx.db.patch(ref._id, { paidAt: Date.now(), monthsCredited: 1 });
        gifted++;
      }
    }
    return { gifted };
  },
});

// CUET rotation pool: 24 weeks across Languages / Domain / General Test.
// Targets sub-topics within each CUET section based on NTA 2022-2025 patterns.
const CHALLENGE_ROTATION = [
  { subject: "General Test", topicSlug: "current-affairs",             topicLabel: "Current Affairs",            targetScore: 75 },
  { subject: "Languages",    topicSlug: "english-reading-comprehension", topicLabel: "English Reading Comprehension", targetScore: 75 },
  { subject: "Domain",       topicSlug: "mathematics-domain",          topicLabel: "Mathematics",                targetScore: 75 },
  { subject: "General Test", topicSlug: "logical-reasoning",           topicLabel: "Logical Reasoning",          targetScore: 75 },
  { subject: "Languages",    topicSlug: "english-vocabulary",          topicLabel: "English Vocabulary",         targetScore: 75 },
  { subject: "Domain",       topicSlug: "economics-domain",            topicLabel: "Economics",                  targetScore: 75 },
  { subject: "General Test", topicSlug: "quantitative-aptitude",       topicLabel: "Quantitative Aptitude",      targetScore: 75 },
  { subject: "Languages",    topicSlug: "english-grammar",             topicLabel: "English Grammar",            targetScore: 80 },
  { subject: "Domain",       topicSlug: "business-studies-domain",     topicLabel: "Business Studies",           targetScore: 75 },
  { subject: "General Test", topicSlug: "general-knowledge",           topicLabel: "General Knowledge",          targetScore: 75 },
  { subject: "Languages",    topicSlug: "hindi-comprehension",         topicLabel: "Hindi Comprehension",        targetScore: 75 },
  { subject: "Domain",       topicSlug: "accountancy-domain",          topicLabel: "Accountancy",                targetScore: 75 },
  { subject: "General Test", topicSlug: "general-science",             topicLabel: "General Science",            targetScore: 75 },
  { subject: "Languages",    topicSlug: "english-cloze-test",          topicLabel: "English Cloze Test",         targetScore: 75 },
  { subject: "Domain",       topicSlug: "political-science-domain",    topicLabel: "Political Science",          targetScore: 75 },
  { subject: "General Test", topicSlug: "history-gk",                  topicLabel: "History (GK)",               targetScore: 75 },
  { subject: "Languages",    topicSlug: "english-sentence-correction", topicLabel: "Sentence Correction",        targetScore: 80 },
  { subject: "Domain",       topicSlug: "sociology-domain",            topicLabel: "Sociology",                  targetScore: 75 },
  { subject: "General Test", topicSlug: "geography-gk",                topicLabel: "Geography (GK)",             targetScore: 75 },
  { subject: "Languages",    topicSlug: "english-para-jumbles",        topicLabel: "Para Jumbles",               targetScore: 80 },
  { subject: "Domain",       topicSlug: "psychology-domain",           topicLabel: "Psychology",                 targetScore: 75 },
  { subject: "General Test", topicSlug: "indian-polity",               topicLabel: "Indian Polity",              targetScore: 75 },
  { subject: "Languages",    topicSlug: "english-error-spotting",      topicLabel: "Error Spotting",             targetScore: 80 },
  { subject: "Domain",       topicSlug: "geography-domain",            topicLabel: "Geography",                  targetScore: 75 },
];

// IST Monday 00:00 for the week that contains `now`
function istMondayStart(now: number): number {
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now + IST_OFFSET_MS);
  const day = istNow.getUTCDay(); // 0 Sun .. 6 Sat
  const daysSinceMonday = (day + 6) % 7;
  const istMondayMidnight = Date.UTC(
    istNow.getUTCFullYear(),
    istNow.getUTCMonth(),
    istNow.getUTCDate() - daysSinceMonday,
    0,
    0,
    0
  );
  return istMondayMidnight - IST_OFFSET_MS;
}

export const weeklyChallengeReset = internalMutation({
  args: {},
  handler: async (ctx) => {
    return await withLogging(ctx, "weeklyChallengeReset", async () => {
      const now = Date.now();
      const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
      const weekStart = istMondayStart(now);
      const weekEnd = weekStart + ONE_WEEK_MS;

      // Mark any older active challenge as completed
      const stale = await ctx.db
        .query("weeklyChallenges")
        .withIndex("by_status", (q) => q.eq("status", "active"))
        .take(5);
      for (const s of stale) {
        if (s.weekStart !== weekStart) {
          await ctx.db.patch(s._id, { status: "completed" });
        }
      }

      // Idempotency: only create if no challenge exists for this week
      const existing = await ctx.db
        .query("weeklyChallenges")
        .withIndex("by_week", (q) => q.eq("weekStart", weekStart))
        .first();
      if (existing) {
        if (!existing.status) {
          await ctx.db.patch(existing._id, { status: "active" });
        }
        return { weekStart, existingId: existing._id };
      }

      // Pick from rotation deterministically per week so reruns produce the
      // same challenge.
      const weekIndex = Math.floor(weekStart / ONE_WEEK_MS);
      const pick = CHALLENGE_ROTATION[weekIndex % CHALLENGE_ROTATION.length];

      const id = await ctx.db.insert("weeklyChallenges", {
        weekStart,
        weekEnd,
        subject: pick.subject,
        topicSlug: pick.topicSlug,
        topicLabel: pick.topicLabel,
        title: `${pick.subject} sprint: ${pick.topicLabel}`,
        targetScore: pick.targetScore,
        participants: 0,
        completions: 0,
        status: "active",
        createdAt: now,
      });

      return {
        weekStart,
        challengeId: id,
        subject: pick.subject,
        topicSlug: pick.topicSlug,
        targetScore: pick.targetScore,
      };
    });
  },
});

// Replaced by internal.tournaments.tick action — see convex/crons.ts.
// Kept here only so existing references in api/cron/tier1/route.ts don't
// 404; deletes when route is removed.
export const tournamentBracketGen = internalMutation({
  args: {},
  handler: async (_ctx) => {
    return { deprecated: "use internal.tournaments.tick instead" };
  },
});

// ─── TIER 2: DIFFERENTIATION ─────────────────────────────────────────────────

export const educatorDigest = internalMutation({
  args: {},
  handler: async (ctx) => {
    const educators = await ctx.db.query("educators").take(100);
    let queued = 0;
    for (const ed of educators) {
      const user = await ctx.db.get(ed.userId);
      if (!user?.email || user.emailSuppressed) continue;
      await ctx.db.insert("scheduledEmails", {
        userId: ed.userId,
        email: user.email,
        type: "welcome-day7",
        scheduledFor: Date.now(),
        sent: false,
        metadata: JSON.stringify({ digestType: "educator-weekly" }),
      });
      queued++;
    }
    return { queued };
  },
});

export const parentDashboardSync = internalMutation({
  args: {},
  handler: async (ctx) => {
    const parents = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("isKid"), false))
      .take(200);
    const withKids = parents.filter((p) => p._id);
    return { synced: withKids.length };
  },
});

export const groupStudyAnalytics = internalMutation({
  args: {},
  handler: async (ctx) => {
    const activeRooms = await ctx.db
      .query("studyRooms")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .take(100);
    return { activeRooms: activeRooms.length };
  },
});

// ─── TIER 3: RETENTION ───────────────────────────────────────────────────────

export const weeklyRetentionEmail = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const users = await ctx.db.query("users").take(200);
    let queued = 0;
    for (const user of users) {
      if (!user.email || user.emailSuppressed || user.isKid) continue;
      if (user.lastLoginAt && user.lastLoginAt < sevenDaysAgo) {
        await ctx.db.insert("scheduledEmails", {
          userId: user._id,
          email: user.email,
          type: "re-engagement-day7",
          scheduledFor: now,
          sent: false,
        });
        queued++;
      }
    }
    return { queued };
  },
});

export const leaderboardRecalc = internalMutation({
  args: {},
  handler: async (ctx) => {
    const snapshots = await ctx.db.query("leaderboardSnapshots").take(10);
    return { snapshots: snapshots.length };
  },
});

export const weeklyReadinessMail = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const users = await ctx.db.query("users").take(200);
    let queued = 0;
    for (const user of users) {
      if (!user.email || user.emailSuppressed || user.isKid) continue;
      await ctx.db.insert("scheduledEmails", {
        userId: user._id,
        email: user.email,
        type: "welcome-day2",
        scheduledFor: now,
        sent: false,
        metadata: JSON.stringify({ emailType: "readiness-weekly" }),
      });
      queued++;
    }
    return { queued };
  },
});

// ─── ADMIN ────────────────────────────────────────────────────────────────────

// Plan -> monthly INR price. Single source of truth for MRR calc.
// Annual = treat as ARR / 12 to keep MRR comparable.
const PLAN_MONTHLY_INR: Record<string, number> = {
  languages: 99,
  domain: 99,
  general_test: 99,
  bundle: 349,
  annual: 999 / 12,
};

export const kpiCalculation = internalMutation({
  args: {},
  handler: async (ctx) => {
    return await withLogging(ctx, "kpiCalculation", async () => {
      const now = Date.now();
      const DAY = 24 * 60 * 60 * 1000;
      const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
      const dateLabel = new Date(now + IST_OFFSET_MS).toISOString().slice(0, 10);

      const users = await ctx.db.query("users").take(2000);
      const subs = await ctx.db.query("subscriptions").take(2000);

      // Acquisition
      const nonKid = users.filter((u) => !u.isKid);
      const totalUsers = nonKid.length;
      const newSignups24h = nonKid.filter((u) => u.createdAt > now - DAY).length;
      const newSignups7d = nonKid.filter((u) => u.createdAt > now - 7 * DAY).length;
      const newSignups30d = nonKid.filter((u) => u.createdAt > now - 30 * DAY).length;

      // Activity (DAU/WAU/MAU based on lastLoginAt — a proxy. Streak system
      // will give a stricter "studied today" metric in Sprint 3+.)
      const dau = nonKid.filter((u) => u.lastLoginAt && u.lastLoginAt > now - DAY).length;
      const wau = nonKid.filter((u) => u.lastLoginAt && u.lastLoginAt > now - 7 * DAY).length;
      const mau = nonKid.filter((u) => u.lastLoginAt && u.lastLoginAt > now - 30 * DAY).length;
      const dauWauRatio = wau > 0 ? Math.round((dau / wau) * 1000) / 10 : 0;

      // Retention: of users who signed up 7 days ago, how many were active in last 7 days
      const cohort7 = nonKid.filter(
        (u) => u.createdAt > now - 14 * DAY && u.createdAt <= now - 7 * DAY
      );
      const retained7 = cohort7.filter(
        (u) => u.lastLoginAt && u.lastLoginAt > now - 7 * DAY
      ).length;
      const retention7d = cohort7.length > 0
        ? Math.round((retained7 / cohort7.length) * 1000) / 10
        : 0;

      const cohort30 = nonKid.filter(
        (u) => u.createdAt > now - 60 * DAY && u.createdAt <= now - 30 * DAY
      );
      const retained30 = cohort30.filter(
        (u) => u.lastLoginAt && u.lastLoginAt > now - 30 * DAY
      ).length;
      const retention30d = cohort30.length > 0
        ? Math.round((retained30 / cohort30.length) * 1000) / 10
        : 0;

      // Monetization
      const activeSubs = subs.filter((s) => s.status === "active");
      const paidCount = activeSubs.length;
      const freeCount = totalUsers - paidCount;
      const tierBreakdown: Record<string, number> = {};
      let mrr = 0;
      for (const sub of activeSubs) {
        tierBreakdown[sub.tier] = (tierBreakdown[sub.tier] ?? 0) + 1;
        mrr += PLAN_MONTHLY_INR[sub.tier] ?? 0;
      }
      mrr = Math.round(mrr);

      // Upsert today's snapshot (one per IST day)
      const existing = await ctx.db
        .query("kpiSnapshots")
        .withIndex("by_date", (q) => q.eq("dateLabel", dateLabel))
        .first();
      const data = {
        dateLabel,
        capturedAt: now,
        totalUsers,
        newSignups24h,
        newSignups7d,
        newSignups30d,
        dau,
        wau,
        mau,
        dauWauRatio,
        paidCount,
        freeCount,
        mrr,
        tierBreakdown: JSON.stringify(tierBreakdown),
        retention7d,
        retention30d,
      };
      if (existing) {
        await ctx.db.patch(existing._id, data);
      } else {
        await ctx.db.insert("kpiSnapshots", data);
      }

      return { dau, wau, mau, paidCount, mrr, totalUsers };
    });
  },
});

export const abTestResults = internalMutation({
  args: {},
  handler: async (ctx) => {
    return await withLogging(ctx, "abTestResults", async () => {
      // Inline call rather than runMutation so we share the same ctx.
      // (See convex/abTests.ts for the canonical evaluation logic.)
      const running = await ctx.db
        .query("abTests")
        .withIndex("by_status", (q) => q.eq("status", "running"))
        .take(50);

      function normalCdf(x) {
        const t = 1 / (1 + 0.2316419 * Math.abs(x));
        const d = 0.3989423 * Math.exp((-x * x) / 2);
        const p =
          d *
          t *
          (0.3193815 +
            t *
              (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        return x > 0 ? 1 - p : p;
      }

      let evaluated = 0;
      let winnersDeclared = 0;
      for (const test of running) {
        const perVariant: Record<string, { exposures: number; conversions: number }> = {};
        for (const v of test.variants) perVariant[v.key] = { exposures: 0, conversions: 0 };

        const exposures = await ctx.db
          .query("abExposures")
          .withIndex("by_test", (q) => q.eq("testKey", test.testKey))
          .take(5000);
        for (const e of exposures) if (perVariant[e.variantKey]) perVariant[e.variantKey].exposures++;

        const conversions = await ctx.db
          .query("abConversions")
          .withIndex("by_test", (q) => q.eq("testKey", test.testKey))
          .take(5000);
        for (const c of conversions) if (perVariant[c.variantKey]) perVariant[c.variantKey].conversions++;

        const variants = Object.entries(perVariant);
        if (variants.length < 2) continue;
        const [controlKey, control] = variants[0];
        let bestKey = controlKey;
        let bestRate = control.exposures > 0 ? control.conversions / control.exposures : 0;
        for (let i = 1; i < variants.length; i++) {
          const [k, r] = variants[i];
          const rate = r.exposures > 0 ? r.conversions / r.exposures : 0;
          if (rate > bestRate) { bestKey = k; bestRate = rate; }
        }

        let pValue: number | null = null;
        if (bestKey !== controlKey) {
          const best = perVariant[bestKey];
          if (best.exposures >= 30 && control.exposures >= 30) {
            const p1 = best.conversions / best.exposures;
            const p2 = control.conversions / control.exposures;
            const pPool = (best.conversions + control.conversions) / (best.exposures + control.exposures);
            const denom = Math.sqrt(pPool * (1 - pPool) * (1 / best.exposures + 1 / control.exposures));
            if (denom > 0) {
              const z = (p1 - p2) / denom;
              pValue = 2 * (1 - normalCdf(Math.abs(z)));
            }
          }
        }
        evaluated++;
        const patch: Record<string, unknown> = { pValue: pValue ?? undefined };
        if (pValue !== null && pValue < 0.05) {
          patch.status = "completed";
          patch.completedAt = Date.now();
          patch.winnerVariantKey = bestKey;
          winnersDeclared++;
        }
        await ctx.db.patch(test._id, patch);
      }
      return { evaluated, winnersDeclared };
    });
  },
});

export const adminTodoGen = internalMutation({
  args: {},
  handler: async (ctx) => {
    return await withLogging(ctx, "adminTodoGen", async () => {
      const now = Date.now();
      const users = await ctx.db.query("users").take(200);
      const subs = await ctx.db.query("subscriptions").take(200);
      const active = subs.filter((s) => s.status === "active").length;
      await ctx.db.insert("adminTodos", {
        title: `Daily check: ${users.length} users, ${active} paid`,
        priority: "medium",
        status: "open",
        createdAt: now,
      });
      return { todos: 1 };
    });
  },
});

// Sprint 7 — pays verified educators a flat tier-based monthly retainer.
// Runs on the 1st of every month at 12:30am IST. Inserts pending rows;
// founders mark them paid manually from /admin/payouts after the Razorpay
// Payouts API call lands.
export const educatorPayoutMonthly = internalMutation({
  args: {},
  handler: async (ctx) => {
    return await withLogging(ctx, "educatorPayoutMonthly", async () => {
      const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
      const now = Date.now();
      const ist = new Date(now + IST_OFFSET_MS);
      const prev = new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth() - 1, 1));
      const monthLabel = prev.toISOString().slice(0, 7);

      const TIER_AMOUNTS: Record<string, number> = { small: 2000, mid: 5000, large: 10000 };
      function tierForFollowers(n: number) {
        if (n >= 500) return "large" as const;
        if (n >= 100) return "mid" as const;
        return "small" as const;
      }

      const educators = await ctx.db.query("educators").take(500);
      const verified = educators.filter((e) => e.isVerified);
      let created = 0;
      let skipped = 0;
      for (const ed of verified) {
        const existing = await ctx.db
          .query("educatorPayouts")
          .withIndex("by_educator_month", (q) =>
            q.eq("educatorId", ed._id).eq("monthLabel", monthLabel)
          )
          .first();
        if (existing) {
          skipped++;
          continue;
        }
        const followers = await ctx.db
          .query("educatorFollowers")
          .withIndex("by_educator", (q) => q.eq("educatorId", ed._id))
          .take(1000);
        const followerCount = followers.length;
        const tier = tierForFollowers(followerCount);
        const status: "pending" | "skipped" =
          ed.bankAccountNumber && ed.bankIfsc ? "pending" : "skipped";
        await ctx.db.insert("educatorPayouts", {
          educatorId: ed._id,
          userId: ed.userId,
          educatorName: ed.name,
          monthLabel,
          followerCountAtPayout: followerCount,
          tier,
          amountInr: TIER_AMOUNTS[tier],
          status,
          note: status === "skipped" ? "Bank details missing" : undefined,
          createdAt: now,
        });
        created++;
      }
      return { monthLabel, created, skipped, verified: verified.length };
    });
  },
});

export const classUpgradeJune = internalMutation({
  args: {},
  handler: async (ctx) => {
    return await withLogging(ctx, "classUpgradeJune", async () => {
      const now = Date.now();
      const users = await ctx.db.query("users").take(2000);
      const candidates = users.filter(
        (u) => u.currentClass === "11" && !u.classUpgradeOptOut
      );
      let upgraded = 0;
      for (const u of candidates) {
        await ctx.db.patch(u._id, { currentClass: "12" });
        upgraded++;
      }
      const optedOut = users.filter(
        (u) => u.currentClass === "11" && u.classUpgradeOptOut
      ).length;
      await ctx.db.insert("adminTodos", {
        title: `Class upgrade complete: ${upgraded} users moved from 11 → 12 (${optedOut} opted out)`,
        priority: "high",
        status: "open",
        createdAt: now,
      });
      return { upgraded, optedOut };
    });
  },
});
