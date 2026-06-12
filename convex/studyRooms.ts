// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

function generateJoinCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export const list = query({
  args: { subject: v.optional(v.string()) },
  handler: async (ctx, { subject }) => {
    const rooms = await ctx.db
      .query("studyRooms")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .order("desc")
      .take(50);

    if (subject && subject !== "All Subjects") {
      return rooms.filter((r) => r.subject === subject || r.subject === "All Subjects");
    }
    return rooms;
  },
});

export const getById = query({
  args: { roomId: v.id("studyRooms") },
  handler: async (ctx, { roomId }) => {
    return await ctx.db.get(roomId);
  },
});

export const getByJoinCode = query({
  args: { joinCode: v.string() },
  handler: async (ctx, { joinCode }) => {
    return await ctx.db
      .query("studyRooms")
      .withIndex("by_join_code", (q) => q.eq("joinCode", joinCode.toUpperCase()))
      .unique();
  },
});

export const getParticipants = query({
  args: { roomId: v.id("studyRooms") },
  handler: async (ctx, { roomId }) => {
    return await ctx.db
      .query("roomParticipants")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .take(100);
  },
});

export const getParticipantCount = query({
  args: { roomId: v.id("studyRooms") },
  handler: async (ctx, { roomId }) => {
    const participants = await ctx.db
      .query("roomParticipants")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .take(100);
    return participants.length;
  },
});

export const create = mutation({
  args: {
    hostId: v.id("users"),
    hostName: v.string(),
    name: v.string(),
    subject: v.union(
      v.literal("Languages"),
      v.literal("Domain"),
      v.literal("General Test"),
      v.literal("All Subjects")
    ),
    topicSlug: v.optional(v.string()),
    description: v.optional(v.string()),
    maxParticipants: v.number(),
    scheduledAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const joinCode = generateJoinCode();
    const roomId = await ctx.db.insert("studyRooms", {
      hostId: args.hostId,
      hostName: args.hostName,
      name: args.name,
      subject: args.subject,
      topicSlug: args.topicSlug,
      description: args.description,
      maxParticipants: args.maxParticipants,
      scheduledAt: args.scheduledAt,
      joinCode,
      isActive: true,
      createdAt: Date.now(),
    });
    // Host auto-joins their room
    await ctx.db.insert("roomParticipants", {
      roomId,
      userId: args.hostId,
      userName: args.hostName,
      joinedAt: Date.now(),
    });
    return { roomId, joinCode };
  },
});

export const join = mutation({
  args: {
    roomId: v.id("studyRooms"),
    userId: v.id("users"),
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room || !room.isActive) throw new Error("Room not found or closed");

    const participants = await ctx.db
      .query("roomParticipants")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .take(100);

    if (participants.length >= room.maxParticipants) throw new Error("Room is full");

    const alreadyIn = participants.find((p) => p.userId === args.userId);
    if (alreadyIn) return { alreadyJoined: true };

    await ctx.db.insert("roomParticipants", {
      roomId: args.roomId,
      userId: args.userId,
      userName: args.userName,
      joinedAt: Date.now(),
    });
    return { alreadyJoined: false };
  },
});

export const leave = mutation({
  args: {
    roomId: v.id("studyRooms"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("roomParticipants")
      .withIndex("by_room_and_user", (q) =>
        q.eq("roomId", args.roomId).eq("userId", args.userId)
      )
      .unique();
    if (existing) await ctx.db.delete(existing._id);
  },
});

export const close = mutation({
  args: {
    roomId: v.id("studyRooms"),
    hostId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room || room.hostId !== args.hostId) throw new Error("Not authorized");
    await ctx.db.patch(args.roomId, { isActive: false });
  },
});
