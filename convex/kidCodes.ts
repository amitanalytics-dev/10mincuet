// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import { v } from "convex/values";
import { query } from "./_generated/server";

export const getByCode = query({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    const row = await ctx.db
      .query("kidCodes")
      .withIndex("by_code", (q) => q.eq("code", code))
      .unique();
    if (!row) return null;
    const user = await ctx.db.get(row.userId);
    return user ? { userId: row.userId.toString(), name: user.name } : null;
  },
});