// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: { email: v.string(), code: v.string(), expiresAt: v.number() },
  handler: async (ctx, args) => {
    // Delete any existing unused codes for this email
    const existing = await ctx.db
      .query("otpCodes")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .collect();
    for (const e of existing) {
      if (!e.used) await ctx.db.delete(e._id);
    }
    return await ctx.db.insert("otpCodes", {
      email: args.email,
      code: args.code,
      expiresAt: args.expiresAt,
      used: false,
      createdAt: Date.now(),
    });
  },
});

export const verify = mutation({
  args: { email: v.string(), code: v.string() },
  handler: async (ctx, args) => {
    const now = Date.now();
    const otps = await ctx.db
      .query("otpCodes")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .collect();
    const valid = otps.find((o) => o.code === args.code && !o.used && o.expiresAt > now);
    if (!valid) return false;
    await ctx.db.patch(valid._id, { used: true });
    return true;
  },
});