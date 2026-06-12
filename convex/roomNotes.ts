// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addNote = mutation({
  args: {
    roomId: v.id("studyRooms"),
    userId: v.id("users"),
    userName: v.string(),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("roomNotes", {
      roomId: args.roomId,
      userId: args.userId,
      userName: args.userName,
      title: args.title,
      content: args.content,
      createdAt: Date.now(),
    });
    return id;
  },
});

export const getNotes = query({
  args: { roomId: v.id("studyRooms") },
  handler: async (ctx, { roomId }) => {
    return await ctx.db
      .query("roomNotes")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .take(100);
  },
});

export const deleteNote = mutation({
  args: {
    noteId: v.id("roomNotes"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.noteId);
    if (!note) throw new Error("Note not found");
    if (note.userId !== args.userId) throw new Error("Not authorized to delete this note");
    await ctx.db.delete(args.noteId);
    return null;
  },
});
