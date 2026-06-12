// @ts-nocheck
import { v } from "convex/values";
import {
  internalMutation,
  mutation,
  query,
} from "./_generated/server";

// Deterministic 0-99 bucket from a string. FNV-1a 32-bit.
function bucket(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % 100;
}

function pickVariant(test, identityKey: string): string | null {
  const b = bucket(test.testKey + ":" + identityKey);
  let cum = 0;
  for (const v of test.variants) {
    cum += v.allocationPct;
    if (b < cum) return v.key;
  }
  return test.variants[test.variants.length - 1]?.key ?? null;
}

// ── Public assignment + exposure + conversion ───────────────────────────────

export const assign = query({
  args: { testKey: v.string(), identityKey: v.string() },
  handler: async (ctx, { testKey, identityKey }) => {
    const test = await ctx.db
      .query("abTests")
      .withIndex("by_key", (q) => q.eq("testKey", testKey))
      .unique();
    if (!test || test.status !== "running") return null;
    const variantKey = pickVariant(test, identityKey);
    return { testKey, variantKey, test };
  },
});

export const recordExposure = mutation({
  args: {
    testKey: v.string(),
    variantKey: v.string(),
    sessionId: v.string(),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    // De-dup: don't log same (test, identity) more than once per day
    const existing = await ctx.db
      .query("abExposures")
      .withIndex("by_test", (q) => q.eq("testKey", args.testKey))
      .take(500);
    const today = Date.now() - 24 * 60 * 60 * 1000;
    const dup = existing.find(
      (e) =>
        e.sessionId === args.sessionId &&
        e.variantKey === args.variantKey &&
        e.exposedAt > today
    );
    if (dup) return { deduped: true };
    await ctx.db.insert("abExposures", {
      testKey: args.testKey,
      variantKey: args.variantKey,
      sessionId: args.sessionId,
      userId: args.userId,
      exposedAt: Date.now(),
    });
    return { ok: true };
  },
});

export const recordConversion = mutation({
  args: {
    testKey: v.string(),
    variantKey: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // One conversion per (test, user)
    const existing = await ctx.db
      .query("abConversions")
      .withIndex("by_test_user", (q) =>
        q.eq("testKey", args.testKey).eq("userId", args.userId)
      )
      .unique();
    if (existing) return { deduped: true };
    await ctx.db.insert("abConversions", {
      testKey: args.testKey,
      variantKey: args.variantKey,
      userId: args.userId,
      convertedAt: Date.now(),
    });
    return { ok: true };
  },
});

// ── Admin queries / mutations ───────────────────────────────────────────────

export const listTests = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("abTests").order("desc").take(50);
  },
});

export const getByKey = query({
  args: { testKey: v.string() },
  handler: async (ctx, { testKey }) => {
    return await ctx.db
      .query("abTests")
      .withIndex("by_key", (q) => q.eq("testKey", testKey))
      .unique();
  },
});

export const getResults = query({
  args: { testKey: v.string() },
  handler: async (ctx, { testKey }) => {
    const test = await ctx.db
      .query("abTests")
      .withIndex("by_key", (q) => q.eq("testKey", testKey))
      .unique();
    if (!test) return null;

    const perVariant: Record<string, { label: string; exposures: number; conversions: number }> = {};
    for (const v of test.variants) {
      perVariant[v.key] = { label: v.label, exposures: 0, conversions: 0 };
    }

    const exposures = await ctx.db
      .query("abExposures")
      .withIndex("by_test", (q) => q.eq("testKey", testKey))
      .take(5000);
    for (const e of exposures) {
      if (perVariant[e.variantKey]) perVariant[e.variantKey].exposures++;
    }

    const conversions = await ctx.db
      .query("abConversions")
      .withIndex("by_test", (q) => q.eq("testKey", testKey))
      .take(5000);
    for (const c of conversions) {
      if (perVariant[c.variantKey]) perVariant[c.variantKey].conversions++;
    }

    const results = Object.entries(perVariant).map(([key, r]) => ({
      variantKey: key,
      label: r.label,
      exposures: r.exposures,
      conversions: r.conversions,
      rate: r.exposures > 0 ? r.conversions / r.exposures : 0,
    }));

    return { test, results };
  },
});

export const create = mutation({
  args: {
    testKey: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    primaryMetric: v.string(),
    variants: v.array(
      v.object({
        key: v.string(),
        label: v.string(),
        allocationPct: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const totalAlloc = args.variants.reduce((a, v) => a + v.allocationPct, 0);
    if (totalAlloc !== 100) throw new Error("Allocations must sum to 100");
    const existing = await ctx.db
      .query("abTests")
      .withIndex("by_key", (q) => q.eq("testKey", args.testKey))
      .unique();
    if (existing) throw new Error(`Test key "${args.testKey}" already exists`);
    return await ctx.db.insert("abTests", {
      ...args,
      status: "draft",
      createdAt: Date.now(),
    });
  },
});

export const setStatus = mutation({
  args: {
    testId: v.id("abTests"),
    status: v.union(
      v.literal("draft"),
      v.literal("running"),
      v.literal("completed"),
      v.literal("paused")
    ),
  },
  handler: async (ctx, { testId, status }) => {
    const updates: Record<string, unknown> = { status };
    if (status === "running") updates.startedAt = Date.now();
    if (status === "completed") updates.completedAt = Date.now();
    await ctx.db.patch(testId, updates);
  },
});

// ── Internal: results cron (Z-test for two-proportion difference) ───────────

// Normal CDF approximation (Abramowitz & Stegun)
function normalCdf(x: number): number {
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

function twoProportionZTest(
  c1: number,
  n1: number,
  c2: number,
  n2: number
): { z: number; p: number } | null {
  if (n1 < 30 || n2 < 30) return null;
  const p1 = c1 / n1;
  const p2 = c2 / n2;
  const pPool = (c1 + c2) / (n1 + n2);
  const denom = Math.sqrt(pPool * (1 - pPool) * (1 / n1 + 1 / n2));
  if (denom === 0) return null;
  const z = (p1 - p2) / denom;
  const p = 2 * (1 - normalCdf(Math.abs(z)));
  return { z, p };
}

export const evaluateRunning = internalMutation({
  args: {},
  handler: async (ctx) => {
    const running = await ctx.db
      .query("abTests")
      .withIndex("by_status", (q) => q.eq("status", "running"))
      .take(50);

    let evaluated = 0;
    let winnersDeclared = 0;
    for (const test of running) {
      const perVariant: Record<string, { exposures: number; conversions: number }> = {};
      for (const v of test.variants) {
        perVariant[v.key] = { exposures: 0, conversions: 0 };
      }
      const exposures = await ctx.db
        .query("abExposures")
        .withIndex("by_test", (q) => q.eq("testKey", test.testKey))
        .take(5000);
      for (const e of exposures) {
        if (perVariant[e.variantKey]) perVariant[e.variantKey].exposures++;
      }
      const conversions = await ctx.db
        .query("abConversions")
        .withIndex("by_test", (q) => q.eq("testKey", test.testKey))
        .take(5000);
      for (const c of conversions) {
        if (perVariant[c.variantKey]) perVariant[c.variantKey].conversions++;
      }

      const variants = Object.entries(perVariant);
      if (variants.length < 2) continue;

      // Compare best variant vs control. Convention: first variant is control.
      const [controlKey, control] = variants[0];
      let bestKey = controlKey;
      let bestRate = control.exposures > 0 ? control.conversions / control.exposures : 0;
      for (let i = 1; i < variants.length; i++) {
        const [k, r] = variants[i];
        const rate = r.exposures > 0 ? r.conversions / r.exposures : 0;
        if (rate > bestRate) {
          bestKey = k;
          bestRate = rate;
        }
      }

      let pValue: number | null = null;
      if (bestKey !== controlKey) {
        const best = perVariant[bestKey];
        const z = twoProportionZTest(
          best.conversions,
          best.exposures,
          control.conversions,
          control.exposures
        );
        pValue = z?.p ?? null;
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
  },
});
