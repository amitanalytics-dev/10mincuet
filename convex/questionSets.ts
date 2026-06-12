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
      .query("questionSets")
      .withIndex("by_educator", (q) => q.eq("educatorId", educatorId))
      .take(100);
    return all
      .filter((s) => s.status === "published")
      .sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
  },
});

export const getBySlug = query({
  args: { educatorId: v.id("educators"), slug: v.string() },
  handler: async (ctx, { educatorId, slug }) => {
    return await ctx.db
      .query("questionSets")
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
      .query("questionSets")
      .withIndex("by_author", (q) => q.eq("authorUserId", authorUserId))
      .order("desc")
      .take(100);
  },
});

export const listLatestPublished = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const all = await ctx.db.query("questionSets").take(200);
    return all
      .filter((s) => s.status === "published")
      .sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0))
      .slice(0, limit ?? 20);
  },
});

// ── Mutations ───────────────────────────────────────────────────────────────

export const create = mutation({
  args: {
    educatorId: v.id("educators"),
    authorUserId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    subject: v.string(),
    topicSlug: v.optional(v.string()),
    difficulty: v.optional(v.string()),
    questionIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const educator = await ctx.db.get(args.educatorId);
    if (!educator || educator.userId !== args.authorUserId) {
      throw new Error("Not authorized");
    }
    if (args.questionIds.length === 0) {
      throw new Error("A question set needs at least one question");
    }
    const baseSlug = slugify(args.title) || "untitled-set";
    let slug = baseSlug;
    let i = 1;
    while (true) {
      const dup = await ctx.db
        .query("questionSets")
        .withIndex("by_educator_slug", (q) =>
          q.eq("educatorId", args.educatorId).eq("slug", slug)
        )
        .unique();
      if (!dup) break;
      i++;
      slug = `${baseSlug}-${i}`;
    }
    return await ctx.db.insert("questionSets", {
      educatorId: args.educatorId,
      authorUserId: args.authorUserId,
      slug,
      title: args.title,
      description: args.description,
      subject: args.subject,
      topicSlug: args.topicSlug,
      difficulty: args.difficulty,
      questionIds: args.questionIds,
      status: "draft",
      attemptCount: 0,
      createdAt: Date.now(),
    });
  },
});

export const setStatus = mutation({
  args: {
    setId: v.id("questionSets"),
    authorUserId: v.id("users"),
    status: v.union(v.literal("draft"), v.literal("published")),
  },
  handler: async (ctx, { setId, authorUserId, status }) => {
    const set = await ctx.db.get(setId);
    if (!set || set.authorUserId !== authorUserId) {
      throw new Error("Not authorized");
    }
    const patch: Record<string, unknown> = { status };
    if (status === "published" && !set.publishedAt) {
      patch.publishedAt = Date.now();
    }
    await ctx.db.patch(setId, patch);
  },
});

export const recordAttempt = mutation({
  args: {
    setId: v.id("questionSets"),
    userId: v.id("users"),
    userName: v.string(),
    score: v.number(),
  },
  handler: async (ctx, { setId, userId, userName, score }) => {
    const set = await ctx.db.get(setId);
    if (!set) throw new Error("Set not found");
    await ctx.db.insert("questionSetAttempts", {
      setId,
      userId,
      userName,
      score,
      attemptedAt: Date.now(),
    });
    await ctx.db.patch(setId, { attemptCount: (set.attemptCount ?? 0) + 1 });
  },
});
