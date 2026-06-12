// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
  },
});

export const getByReferralCode = query({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_referral_code", (q) => q.eq("referralCode", code))
      .unique();
  },
});

export const create = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    passwordHash: v.string(),
    referralCode: v.string(),
    referredByCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const doc: Record<string, unknown> = {
      email: args.email,
      name: args.name,
      passwordHash: args.passwordHash,
      referralCode: args.referralCode,
      isKid: false,
      createdAt: now,
      // 30-day launch promotion: every new signup gets premium access
      trialEndsAt: now + 30 * 24 * 60 * 60 * 1000,
    };
    if (args.referredByCode) doc.referredByCode = args.referredByCode;
    const userId = await ctx.db.insert("users", doc);
    return userId;
  },
});

export const createKidAccount = mutation({
  args: {
    name: v.string(),
    parentId: v.id("users"),
    kidCode: v.string(),
    referralCode: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      name: args.name,
      isKid: true,
      parentId: args.parentId,
      referralCode: args.referralCode,
      createdAt: Date.now(),
    });
    await ctx.db.insert("kidCodes", {
      code: args.kidCode,
      userId,
      createdAt: Date.now(),
    });
    return userId;
  },
});

export const getAllWithEmail = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.filter((u) => u.email && !u.isKid);
  },
});

export const getById = query({
  args: { id: v.id("users") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const count = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users.filter((u) => !u.isKid).length;
  },
});

export const updateLastLogin = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { lastLoginAt: Date.now() });
  },
});

export const setSuppressed = mutation({
  args: {
    email: v.string(),
    reason: v.string(),
  },
  handler: async (ctx, { email, reason }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    if (user) {
      await ctx.db.patch(user._id, {
        emailSuppressed: true,
        emailSuppressedReason: reason,
      });
    }
  },
});

// Returns non-kid users with email who haven't logged in for `days` days.
// Falls back to createdAt when lastLoginAt is absent (users who never re-logged in after signup).
export const getKidsByParent = query({
  args: { parentId: v.id("users") },
  handler: async (ctx, { parentId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_parent", (q) => q.eq("parentId", parentId))
      .take(20);
  },
});

export const setClass = mutation({
  args: { userId: v.id("users"), currentClass: v.union(v.literal("11"), v.literal("12"), v.literal("dropper")) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { currentClass: args.currentClass });
  },
});

export const getInactiveWithEmail = query({
  args: { days: v.number() },
  handler: async (ctx, { days }) => {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const users = await ctx.db.query("users").collect();
    return users.filter((u) => {
      if (u.isKid || !u.email || u.emailSuppressed) return false;
      const lastActive = u.lastLoginAt ?? u.createdAt;
      return lastActive < cutoff;
    });
  },
});