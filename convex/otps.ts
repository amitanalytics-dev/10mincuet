import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Store OTP code for email verification
 */
export const storeOtp = mutation({
  args: {
    email: v.string(),
    code: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("otpCodes", {
      email: args.email,
      code: args.code,
      expiresAt: args.expiresAt,
      used: false,
      createdAt: Date.now(),
    });
  },
});

/**
 * Verify OTP code
 */
export const verifyOtp = query({
  args: {
    email: v.string(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const otpRecord = await ctx.db
      .query("otpCodes")
      .filter((q) =>
        q.and(
          q.eq(q.field("email"), args.email),
          q.eq(q.field("code"), args.code),
          q.not(q.field("used"))
        )
      )
      .first();

    if (!otpRecord) return null;
    if (otpRecord.expiresAt < Date.now()) return null;

    return otpRecord;
  },
});

/**
 * Mark OTP as used
 */
export const markOtpUsed = mutation({
  args: { otpId: v.id("otpCodes") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.otpId, { used: true });
    return { success: true };
  },
});

/**
 * Clean up expired OTP codes (run as scheduled task)
 */
export const cleanupExpiredOtps = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const expiredOtps = await ctx.db
      .query("otpCodes")
      .filter((q) => q.lt(q.field("expiresAt"), now))
      .collect();

    for (const otp of expiredOtps) {
      await ctx.db.delete(otp._id);
    }

    return { deleted: expiredOtps.length };
  },
});
