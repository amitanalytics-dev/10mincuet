/**
 * Cron schedule constants for all 18 tier-aligned crons.
 * IST times (Indian Standard Time) as per Amit's build window (6am-10am IST preferred).
 */

export const CRON_SCHEDULES = {
  // TIER 1: VIRAL (4 crons)
  // Run at consistent times to avoid overlap

  /**
   * Tier 1: Streak Reset Check
   * Resets user streaks daily at 3am IST
   * Prevents loss of streaks due to timezone issues
   */
  STREAK_RESET_CHECK: "0 3 * * *", // 3am IST daily

  /**
   * Tier 1: Referral Gifting
   * Awards referral bonuses every Monday 5am IST
   * Motivates viral sharing at week start
   */
  REFERRAL_GIFTING: "0 5 * * 1", // 5am IST, Mondays

  /**
   * Tier 1: Weekly Challenge Reset
   * Creates new weekly challenge every Monday 6am IST
   * Aligns with user engagement peak
   */
  WEEKLY_CHALLENGE_RESET: "0 6 * * 1", // 6am IST, Mondays

  /**
   * Tier 1: Tournament Bracket Generation
   * Generates new brackets bi-weekly (every other Sunday) 4am IST
   * Avoids conflict with weekend gaming
   */
  TOURNAMENT_BRACKET_GEN: "0 4 * * 0", // 4am IST, Sundays (bi-weekly check)

  // TIER 2: DIFFERENTIATION (3 crons)

  /**
   * Tier 2: Educator Weekly Digest
   * Sent every Friday 7am IST
   * Highlights top-performing educators, new certifications
   */
  EDUCATOR_DIGEST: "0 7 * * 5", // 7am IST, Fridays

  /**
   * Tier 2: Parent Dashboard Sync
   * Updates parent dashboards daily at 8am IST
   * Shows child progress, milestones, alerts
   */
  PARENT_DASHBOARD_SYNC: "0 8 * * *", // 8am IST daily

  /**
   * Tier 2: Group Study Analytics
   * Processes group study metrics every Tuesday 9am IST
   * Identifies high-performing study groups
   */
  GROUP_STUDY_ANALYTICS: "0 9 * * 2", // 9am IST, Tuesdays

  // TIER 3: RETENTION (3 crons)

  /**
   * Tier 3: Weekly Retention Email
   * Sent every Thursday 10am IST
   * Win-back emails, re-engagement offers
   */
  WEEKLY_RETENTION_EMAIL: "0 10 * * 4", // 10am IST, Thursdays

  /**
   * Tier 3: Leaderboard Recalculation
   * Recalculates leaderboard every Sunday 11pm IST
   * Aggregates weekly scores, determines winners
   */
  LEADERBOARD_RECALC: "0 23 * * 0", // 11pm IST, Sundays

  /**
   * Tier 3: Weekly Readiness Mail
   * Sent every Wednesday 6am IST
   * Pre-exam prep checklist, resource suggestions
   */
  WEEKLY_READINESS_MAIL: "0 6 * * 3", // 6am IST, Wednesdays

  // ADMIN CRONS (4 crons)

  /**
   * Admin: KPI Calculation
   * Runs first day of month at 1am IST
   * Calculates DAU, MAU, retention, LTV, CAC
   */
  KPI_CALCULATION: "0 1 1 * *", // 1am IST, 1st of month

  /**
   * Admin: A/B Test Results Evaluation
   * Runs every Sunday 12am IST
   * Evaluates test results, determines winners
   */
  AB_TEST_RESULTS: "0 0 * * 0", // 12am IST, Sundays

  /**
   * Admin: Admin Todo Generation
   * Runs daily at 9pm IST
   * Creates actionable todos from KPIs, metrics, alerts
   */
  ADMIN_TODO_GEN: "0 21 * * *", // 9pm IST daily

  /**
   * Admin: Class Upgrade June
   * One-time: June 1st, 2026 at 12am IST
   * (Can be scheduled separately as a one-shot job)
   */
  CLASS_UPGRADE_JUNE: "0 0 1 6 *", // 12am IST, June 1st
};

/**
 * Cron metadata for logging and monitoring
 */
export const CRON_METADATA = {
  STREAK_RESET_CHECK: { tier: "tier1", category: "viral", priority: "high" },
  REFERRAL_GIFTING: { tier: "tier1", category: "viral", priority: "high" },
  WEEKLY_CHALLENGE_RESET: { tier: "tier1", category: "viral", priority: "high" },
  TOURNAMENT_BRACKET_GEN: { tier: "tier1", category: "viral", priority: "medium" },
  EDUCATOR_DIGEST: { tier: "tier2", category: "differentiation", priority: "medium" },
  PARENT_DASHBOARD_SYNC: { tier: "tier2", category: "differentiation", priority: "high" },
  GROUP_STUDY_ANALYTICS: { tier: "tier2", category: "differentiation", priority: "medium" },
  WEEKLY_RETENTION_EMAIL: { tier: "tier3", category: "retention", priority: "high" },
  LEADERBOARD_RECALC: { tier: "tier3", category: "retention", priority: "high" },
  WEEKLY_READINESS_MAIL: { tier: "tier3", category: "retention", priority: "high" },
  KPI_CALCULATION: { tier: "admin", category: "analytics", priority: "critical" },
  AB_TEST_RESULTS: { tier: "admin", category: "analytics", priority: "high" },
  ADMIN_TODO_GEN: { tier: "admin", category: "operations", priority: "medium" },
  CLASS_UPGRADE_JUNE: { tier: "admin", category: "operations", priority: "critical" },
};

/**
 * Batch email thresholds - when to batch send vs individual sends
 */
export const EMAIL_BATCH_THRESHOLD = 100; // batch if > 100 recipients

/**
 * Helper to get next run time (for testing/display)
 */
export const getCronDescription = (cronName: keyof typeof CRON_SCHEDULES): string => {
  const schedules: Record<string, string> = CRON_SCHEDULES;
  const parts = schedules[cronName].split(" ");
  const [minute, hour, day, month, dayOfWeek] = parts;

  const hourNum = parseInt(hour);
  const dayNum = parseInt(day);
  const dayOfWeekNum = parseInt(dayOfWeek);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  if (dayOfWeek !== "*") {
    return `${days[dayOfWeekNum]} at ${hourNum}:${minute.padStart(2, "0")} IST`;
  }
  if (day !== "*") {
    return `${dayNum}th of month at ${hourNum}:${minute.padStart(2, "0")} IST`;
  }
  return `Daily at ${hourNum}:${minute.padStart(2, "0")} IST`;
};
