// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const logEmailEvent = mutation({
  args: {
    email: v.string(),
    emailType: v.string(),
    eventType: v.union(
      v.literal("sent"),
      v.literal("delivered"),
      v.literal("opened"),
      v.literal("clicked"),
      v.literal("bounced"),
      v.literal("complained")
    ),
    link: v.optional(v.string()),
    resendId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("emailEvents", {
      email: args.email,
      emailType: args.emailType,
      eventType: args.eventType,
      link: args.link,
      resendId: args.resendId,
      createdAt: Date.now(),
    });
  },
});
