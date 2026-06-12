// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    subjects: v.array(v.string()),
    bio: v.string(),
    specialization: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const educatorId = await ctx.db.insert("educators", {
      userId: args.userId,
      name: args.name,
      subjects: args.subjects,
      bio: args.bio,
      specialization: args.specialization,
      rating: 0,
      totalRatings: 0,
      totalStudents: 0,
      isVerified: false,
      createdAt: Date.now(),
    });
    return educatorId;
  },
});

export const getByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("educators")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("educators")
      .withIndex("by_students")
      .order("desc")
      .take(50);
  },
});

export const getById = query({
  args: { educatorId: v.id("educators") },
  handler: async (ctx, { educatorId }) => {
    return await ctx.db.get(educatorId);
  },
});

export const follow = mutation({
  args: {
    educatorId: v.id("educators"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("educatorFollowers")
      .withIndex("by_educator_and_user", (q) =>
        q.eq("educatorId", args.educatorId).eq("userId", args.userId)
      )
      .unique();
    if (existing) return null;

    await ctx.db.insert("educatorFollowers", {
      educatorId: args.educatorId,
      userId: args.userId,
      createdAt: Date.now(),
    });

    const educator = await ctx.db.get(args.educatorId);
    if (educator) {
      await ctx.db.patch(args.educatorId, {
        totalStudents: educator.totalStudents + 1,
      });
    }
    return null;
  },
});

export const unfollow = mutation({
  args: {
    educatorId: v.id("educators"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("educatorFollowers")
      .withIndex("by_educator_and_user", (q) =>
        q.eq("educatorId", args.educatorId).eq("userId", args.userId)
      )
      .unique();
    if (existing) {
      await ctx.db.delete(existing._id);
      const educator = await ctx.db.get(args.educatorId);
      if (educator) {
        await ctx.db.patch(args.educatorId, {
          totalStudents: Math.max(0, educator.totalStudents - 1),
        });
      }
    }
    return null;
  },
});

export const isFollowing = query({
  args: {
    educatorId: v.id("educators"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("educatorFollowers")
      .withIndex("by_educator_and_user", (q) =>
        q.eq("educatorId", args.educatorId).eq("userId", args.userId)
      )
      .unique();
    return existing !== null;
  },
});

export const getFollowerCount = query({
  args: { educatorId: v.id("educators") },
  handler: async (ctx, { educatorId }) => {
    const followers = await ctx.db
      .query("educatorFollowers")
      .withIndex("by_educator", (q) => q.eq("educatorId", educatorId))
      .take(1000);
    return followers.length;
  },
});

export const leaderboard = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("educators")
      .withIndex("by_students")
      .order("desc")
      .take(20);
  },
});
