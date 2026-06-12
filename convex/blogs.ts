import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listAllBlogs = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("blogs").order("desc").collect();
  },
});

export const getBlogBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("blogs")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
  },
});

// Deletes all blog posts whose title or slug contains "neet" (case-insensitive)
export const deleteNonJeeBlogs = internalMutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("blogs").collect();
    const toDelete = all.filter((b) => {
      const titleLower = (b.title ?? "").toLowerCase();
      const slugLower = (b.slug ?? "").toLowerCase();
      return titleLower.includes("neet") || slugLower.includes("neet");
    });
    for (const b of toDelete) {
      await ctx.db.delete(b._id);
    }
    return { deleted: toDelete.length, titles: toDelete.map((b) => b.title) };
  },
});
