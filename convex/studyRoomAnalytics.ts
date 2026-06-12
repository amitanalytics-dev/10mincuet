// @ts-nocheck
import { v } from "convex/values";
import { query } from "./_generated/server";

// Per-host stats across all rooms they've ever hosted
export const getHostStats = query({
  args: { hostId: v.id("users") },
  handler: async (ctx, { hostId }) => {
    const rooms = await ctx.db
      .query("studyRooms")
      .withIndex("by_host", (q) => q.eq("hostId", hostId))
      .take(200);

    if (rooms.length === 0) {
      return {
        totalRooms: 0,
        activeRooms: 0,
        totalParticipants: 0,
        uniqueParticipants: 0,
        totalMessages: 0,
        totalNotes: 0,
        avgParticipantsPerRoom: 0,
        topSubject: null,
        rooms: [],
      };
    }

    const activeRooms = rooms.filter((r) => r.isActive).length;
    const subjectCounts: Record<string, number> = {};
    let totalMessages = 0;
    let totalNotes = 0;
    let totalParticipants = 0;
    const uniqueUserIds = new Set<string>();

    const perRoom = [];

    for (const room of rooms) {
      subjectCounts[room.subject] = (subjectCounts[room.subject] ?? 0) + 1;

      const participants = await ctx.db
        .query("roomParticipants")
        .withIndex("by_room", (q) => q.eq("roomId", room._id))
        .take(200);
      for (const p of participants) uniqueUserIds.add(p.userId.toString());
      totalParticipants += participants.length;

      const messages = await ctx.db
        .query("roomMessages")
        .withIndex("by_room", (q) => q.eq("roomId", room._id))
        .take(500);
      totalMessages += messages.length;

      const notes = await ctx.db
        .query("roomNotes")
        .withIndex("by_room", (q) => q.eq("roomId", room._id))
        .take(50);
      totalNotes += notes.length;

      perRoom.push({
        roomId: room._id,
        name: room.name,
        subject: room.subject,
        isActive: room.isActive,
        createdAt: room.createdAt,
        participantCount: participants.length,
        messageCount: messages.length,
        noteCount: notes.length,
        joinCode: room.joinCode,
      });
    }

    perRoom.sort((a, b) => b.createdAt - a.createdAt);

    const topSubject = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    return {
      totalRooms: rooms.length,
      activeRooms,
      totalParticipants,
      uniqueParticipants: uniqueUserIds.size,
      totalMessages,
      totalNotes,
      avgParticipantsPerRoom: Math.round((totalParticipants / rooms.length) * 10) / 10,
      topSubject,
      rooms: perRoom,
    };
  },
});
