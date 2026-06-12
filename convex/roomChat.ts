// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addMessage = mutation({
  args: {
    roomId: v.id("studyRooms"),
    userId: v.id("users"),
    userName: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.message || args.message.trim().length === 0) {
      throw new Error("Message cannot be empty");
    }
    if (args.message.length > 500) {
      throw new Error("Message cannot exceed 500 characters");
    }
    const id = await ctx.db.insert("roomMessages", {
      roomId: args.roomId,
      userId: args.userId,
      userName: args.userName,
      message: args.message,
      createdAt: Date.now(),
    });
    return id;
  },
});

export const getMessages = query({
  args: {
    roomId: v.id("studyRooms"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("roomMessages")
      .withIndex("by_room_time", (q) => q.eq("roomId", args.roomId))
      .take(args.limit ?? 50);
  },
});

export const getScoreboard = query({
  args: { roomId: v.id("studyRooms") },
  handler: async (ctx, { roomId }) => {
    const messages = await ctx.db
      .query("roomMessages")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .take(500);

    const counts: Record<string, { userId: string; userName: string; messageCount: number }> = {};
    for (const msg of messages) {
      const key = msg.userId;
      if (!counts[key]) {
        counts[key] = { userId: msg.userId, userName: msg.userName, messageCount: 0 };
      }
      counts[key].messageCount += 1;
    }

    return Object.values(counts).sort((a, b) => b.messageCount - a.messageCount);
  },
});
