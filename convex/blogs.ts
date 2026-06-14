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

// Validate image alt text in HTML content
export const validateImageAltText = internalMutation({
  args: { blogId: v.id("blogs") },
  handler: async (ctx, { blogId }) => {
    const blog = await ctx.db.get(blogId);
    if (!blog) return { valid: false, error: "Blog not found" };

    const content = blog.content ?? "";
    const imgRegex = /<img[^>]+>/g;
    const matches = content.match(imgRegex) ?? [];

    const missingAlt = matches.filter((img) => !img.includes('alt='));
    const withAlt = matches.filter((img) => img.includes('alt='));

    return {
      valid: missingAlt.length === 0,
      totalImages: matches.length,
      withAlt: withAlt.length,
      missingAlt: missingAlt.length,
      details: missingAlt.map((img) => img.substring(0, 100)),
    };
  },
});

// Update Hindi translations for a blog post
export const updateBlogHindiContent = internalMutation({
  args: {
    blogId: v.id("blogs"),
    titleHi: v.optional(v.string()),
    descriptionHi: v.optional(v.string()),
    contentHi: v.optional(v.string()),
  },
  handler: async (ctx, { blogId, titleHi, descriptionHi, contentHi }) => {
    const blog = await ctx.db.get(blogId);
    if (!blog) return { success: false, error: "Blog not found" };

    const updates: any = {};
    if (titleHi !== undefined) updates.titleHi = titleHi;
    if (descriptionHi !== undefined) updates.descriptionHi = descriptionHi;
    if (contentHi !== undefined) updates.contentHi = contentHi;

    await ctx.db.patch(blogId, updates);
    return { success: true, updated: Object.keys(updates), blogSlug: blog.slug };
  },
});

// Batch update Hindi content for multiple blogs
export const batchUpdateHindiContent = internalMutation({
  args: {
    updates: v.array(
      v.object({
        slug: v.string(),
        titleHi: v.optional(v.string()),
        descriptionHi: v.optional(v.string()),
        contentHi: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, { updates }) => {
    const results = [];
    for (const update of updates) {
      const blog = await ctx.db
        .query("blogs")
        .withIndex("by_slug", (q) => q.eq("slug", update.slug))
        .unique();

      if (!blog) {
        results.push({ slug: update.slug, success: false, error: "Not found" });
        continue;
      }

      const patches: any = {};
      if (update.titleHi !== undefined) patches.titleHi = update.titleHi;
      if (update.descriptionHi !== undefined) patches.descriptionHi = update.descriptionHi;
      if (update.contentHi !== undefined) patches.contentHi = update.contentHi;

      await ctx.db.patch(blog._id, patches);
      results.push({ slug: update.slug, success: true, updated: Object.keys(patches) });
    }
    return results;
  },
});
