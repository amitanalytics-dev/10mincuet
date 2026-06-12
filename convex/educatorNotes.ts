// @ts-nocheck
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

// ── Public reads ────────────────────────────────────────────────────────────

export const listPublishedByEducator = query({
  args: { educatorId: v.id("educators") },
  handler: async (ctx, { educatorId }) => {
    const all = await ctx.db
      .query("educatorNotes")
      .withIndex("by_educator", (q) => q.eq("educatorId", educatorId))
      .take(100);
    return all
      .filter((n) => n.status === "published")
      .sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
  },
});

export const getBySlug = query({
  args: { educatorId: v.id("educators"), slug: v.string() },
  handler: async (ctx, { educatorId, slug }) => {
    return await ctx.db
      .query("educatorNotes")
      .withIndex("by_educator_slug", (q) =>
        q.eq("educatorId", educatorId).eq("slug", slug)
      )
      .unique();
  },
});

export const listMineByAuthor = query({
  args: { authorUserId: v.id("users") },
  handler: async (ctx, { authorUserId }) => {
    return await ctx.db
      .query("educatorNotes")
      .withIndex("by_author", (q) => q.eq("authorUserId", authorUserId))
      .order("desc")
      .take(100);
  },
});

// ── Mutations ───────────────────────────────────────────────────────────────

export const create = mutation({
  args: {
    educatorId: v.id("educators"),
    authorUserId: v.id("users"),
    title: v.string(),
    summary: v.optional(v.string()),
    content: v.string(),
    subject: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const educator = await ctx.db.get(args.educatorId);
    if (!educator || educator.userId !== args.authorUserId) {
      throw new Error("Not authorized");
    }
    const baseSlug = slugify(args.title) || "untitled";
    let slug = baseSlug;
    let i = 1;
    while (true) {
      const dup = await ctx.db
        .query("educatorNotes")
        .withIndex("by_educator_slug", (q) =>
          q.eq("educatorId", args.educatorId).eq("slug", slug)
        )
        .unique();
      if (!dup) break;
      i++;
      slug = `${baseSlug}-${i}`;
    }
    const now = Date.now();
    return await ctx.db.insert("educatorNotes", {
      educatorId: args.educatorId,
      authorUserId: args.authorUserId,
      slug,
      title: args.title,
      summary: args.summary,
      content: args.content,
      subject: args.subject,
      status: "draft",
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    noteId: v.id("educatorNotes"),
    authorUserId: v.id("users"),
    title: v.optional(v.string()),
    summary: v.optional(v.string()),
    content: v.optional(v.string()),
    subject: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const note = await ctx.db.get(args.noteId);
    if (!note || note.authorUserId !== args.authorUserId) {
      throw new Error("Not authorized");
    }
    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.title !== undefined) patch.title = args.title;
    if (args.summary !== undefined) patch.summary = args.summary;
    if (args.content !== undefined) patch.content = args.content;
    if (args.subject !== undefined) patch.subject = args.subject;
    await ctx.db.patch(args.noteId, patch);
  },
});

export const setStatus = mutation({
  args: {
    noteId: v.id("educatorNotes"),
    authorUserId: v.id("users"),
    status: v.union(v.literal("draft"), v.literal("published")),
  },
  handler: async (ctx, { noteId, authorUserId, status }) => {
    const note = await ctx.db.get(noteId);
    if (!note || note.authorUserId !== authorUserId) {
      throw new Error("Not authorized");
    }
    const patch: Record<string, unknown> = { status, updatedAt: Date.now() };
    if (status === "published" && !note.publishedAt) {
      patch.publishedAt = Date.now();
    }
    await ctx.db.patch(noteId, patch);
  },
});

export const incrementView = mutation({
  args: { noteId: v.id("educatorNotes") },
  handler: async (ctx, { noteId }) => {
    const note = await ctx.db.get(noteId);
    if (!note) return;
    await ctx.db.patch(noteId, { viewCount: (note.viewCount ?? 0) + 1 });
  },
});
