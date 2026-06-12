// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

function generateInviteCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export const createInvite = mutation({
  args: { parentId: v.id("users") },
  handler: async (ctx, { parentId }) => {
    const inviteCode = generateInviteCode();
    const now = Date.now();
    const expiresAt = now + 7 * 24 * 60 * 60 * 1000; // 7 days

    await ctx.db.insert("parentInvites", {
      parentId,
      inviteCode,
      expiresAt,
      createdAt: now,
    });

    return { inviteCode, expiresAt };
  },
});

export const getByCode = query({
  args: { inviteCode: v.string() },
  handler: async (ctx, { inviteCode }) => {
    return await ctx.db
      .query("parentInvites")
      .withIndex("by_code", (q) => q.eq("inviteCode", inviteCode))
      .unique();
  },
});

export const useInvite = mutation({
  args: {
    inviteCode: v.string(),
    studentId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const invite = await ctx.db
      .query("parentInvites")
      .withIndex("by_code", (q) => q.eq("inviteCode", args.inviteCode))
      .unique();

    if (!invite) throw new Error("Invite not found");
    if (invite.studentId !== undefined) throw new Error("Invite has already been used");
    if (invite.expiresAt < Date.now()) throw new Error("Invite has expired");

    await ctx.db.patch(invite._id, {
      studentId: args.studentId,
      usedAt: Date.now(),
    });

    await ctx.db.patch(args.studentId, {
      parentId: invite.parentId,
    });

    return { parentId: invite.parentId };
  },
});

export const getByParent = query({
  args: { parentId: v.id("users") },
  handler: async (ctx, { parentId }) => {
    return await ctx.db
      .query("parentInvites")
      .withIndex("by_parent", (q) => q.eq("parentId", parentId))
      .order("desc")
      .take(10);
  },
});
