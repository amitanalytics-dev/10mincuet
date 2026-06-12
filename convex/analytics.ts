// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import { query } from "./_generated/server";

const DAY_MS = 24 * 60 * 60 * 1000;

export const dailyStats = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const yesterday = now - DAY_MS;
    const sevenDaysAgo = now - 7 * DAY_MS;

    const users = await ctx.db.query("users").collect();
    const subs = await ctx.db.query("subscriptions").collect();
    const progressRows = await ctx.db.query("progress").collect();

    // --- ACQUISITION ---
    const totalStudents = users.filter((u) => !u.isKid).length;
    const newToday = users.filter((u) => !u.isKid && u.createdAt > yesterday).length;
    const newLast7 = users.filter((u) => !u.isKid && u.createdAt > sevenDaysAgo).length;

    // --- MONETIZATION ---
    const paidPlans = ["physics", "chemistry", "math", "bundle", "annual", "parent_kid"];
    const paidSubs = subs.filter((s) => paidPlans.includes(s.tier) && s.status === "active");
    const tierBreakdown: Record<string, number> = {};
    for (const s of paidSubs) {
      tierBreakdown[s.tier] = (tierBreakdown[s.tier] ?? 0) + 1;
    }
    const mrr = paidSubs.reduce((sum, s) => {
      const prices: Record<string, number> = {
        physics: 149, chemistry: 149, math: 149,
        bundle: 349, annual: Math.round(2499 / 12), parent_kid: Math.round(2999 / 12),
      };
      return sum + (prices[s.tier] ?? 0);
    }, 0);
    const freeSubs = subs.filter((s) => s.tier === "free").length;

    // --- ENGAGEMENT ---
    const activeToday = new Set(
      progressRows.filter((p) => p.updatedAt > yesterday).map((p) => p.userId)
    ).size;
    const activeLast7 = new Set(
      progressRows.filter((p) => p.updatedAt > sevenDaysAgo).map((p) => p.userId)
    ).size;
    const totalProgressEntries = progressRows.length;
    const avgBloom =
      progressRows.length > 0
        ? (progressRows.reduce((s, r) => s + r.bloomLevel, 0) / progressRows.length).toFixed(1)
        : "0";

    // Bloom level distribution
    const bloomDist: Record<number, number> = {};
    for (const r of progressRows) {
      bloomDist[r.bloomLevel] = (bloomDist[r.bloomLevel] ?? 0) + 1;
    }

    // --- RETENTION ---
    const dau = activeToday;
    const mau = activeLast7; // proxy: 7-day active
    const dauMauRatio =
      mau > 0 ? ((dau / mau) * 100).toFixed(0) : "0";

    return {
      timestamp: now,
      acquisition: { totalStudents, newToday, newLast7 },
      monetization: { mrr, paidCount: paidSubs.length, freeSubs, tierBreakdown },
      engagement: { activeToday, activeLast7, totalProgressEntries, avgBloom, bloomDist },
      retention: { dau, mau, dauMauRatio },
    };
  },
});