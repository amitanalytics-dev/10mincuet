// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const EMAIL_TYPE_VALIDATOR = v.union(
  v.literal("welcome-day2"),
  v.literal("welcome-day2-no-mock"),
  v.literal("welcome-day7"),
  v.literal("re-engagement-day7"),
  v.literal("re-engagement-day14"),
  v.literal("re-engagement-day21")
);

// Schedule a future email. Idempotent — skips if same user+type already scheduled.
export const schedule = mutation({
  args: {
    userId: v.id("users"),
    email: v.string(),
    type: EMAIL_TYPE_VALIDATOR,
    scheduledFor: v.number(),
    metadata: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("scheduledEmails")
      .withIndex("by_user_type", (q) => q.eq("userId", args.userId).eq("type", args.type))
      .first();
    if (existing) return existing._id;

    return await ctx.db.insert("scheduledEmails", {
      userId: args.userId,
      email: args.email,
      type: args.type,
      scheduledFor: args.scheduledFor,
      sent: false,
      metadata: args.metadata,
    });
  },
});

// Track a re-engagement email that has already been sent (prevents duplicate sends).
export const trackSent = mutation({
  args: {
    userId: v.id("users"),
    email: v.string(),
    type: EMAIL_TYPE_VALIDATOR,
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("scheduledEmails")
      .withIndex("by_user_type", (q) => q.eq("userId", args.userId).eq("type", args.type))
      .first();
    if (existing) return existing._id;

    return await ctx.db.insert("scheduledEmails", {
      userId: args.userId,
      email: args.email,
      type: args.type,
      scheduledFor: Date.now(),
      sent: true,
      sentAt: Date.now(),
    });
  },
});

export const getPending = query({
  args: { now: v.number() },
  handler: async (ctx, { now }) => {
    return await ctx.db
      .query("scheduledEmails")
      .withIndex("by_sent_scheduled", (q) => q.eq("sent", false).lte("scheduledFor", now))
      .take(100);
  },
});

export const markSent = mutation({
  args: { id: v.id("scheduledEmails") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { sent: true, sentAt: Date.now() });
  },
});

// Returns true if this email type was already scheduled OR sent for this user.
export const hasTracked = query({
  args: {
    userId: v.id("users"),
    type: EMAIL_TYPE_VALIDATOR,
  },
  handler: async (ctx, { userId, type }) => {
    const doc = await ctx.db
      .query("scheduledEmails")
      .withIndex("by_user_type", (q) => q.eq("userId", userId).eq("type", type))
      .first();
    return doc !== null;
  },
});
