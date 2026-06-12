// @ts-nocheck
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listOpen = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    return await ctx.db
      .query("adminTodos")
      .withIndex("by_status", (q) => q.eq("status", "open"))
      .order("desc")
      .take(limit ?? 50);
  },
});

export const markDone = mutation({
  args: { todoId: v.id("adminTodos") },
  handler: async (ctx, { todoId }) => {
    await ctx.db.patch(todoId, { status: "done" });
  },
});
