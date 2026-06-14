import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all available paper years for an exam
 */
export const getAvailableYears = query({
  args: { examType: v.union(v.literal("jee"), v.literal("neet"), v.literal("cuet")) },
  handler: async (ctx, args) => {
    const papers = await ctx.db
      .query("paperAnalysis")
      .filter((q) => q.eq(q.field("examType"), args.examType))
      .collect();

    const years = [...new Set(papers.map((p) => p.year))].sort((a, b) => b - a);
    return years;
  },
});

/**
 * Get paper analysis for a specific year
 */
export const getPaperAnalysis = query({
  args: {
    examType: v.union(v.literal("jee"), v.literal("neet"), v.literal("cuet")),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    const paper = await ctx.db
      .query("paperAnalysis")
      .filter(
        (q) =>
          q.and(
            q.eq(q.field("examType"), args.examType),
            q.eq(q.field("year"), args.year)
          )
      )
      .first();

    return paper;
  },
});

/**
 * Get pattern analysis across multiple years
 */
export const getPatternAnalysis = query({
  args: {
    examType: v.union(v.literal("jee"), v.literal("neet"), v.literal("cuet")),
    years: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    const papers = await ctx.db
      .query("paperAnalysis")
      .filter((q) => q.eq(q.field("examType"), args.examType))
      .collect();

    const filteredPapers = papers.filter((p) => args.years.includes(p.year));

    if (!filteredPapers.length) return null;

    // Aggregate pattern data
    const topicFrequency: Record<string, number> = {};
    const bloomDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    let totalMarks = 0;
    let totalQuestions = 0;

    filteredPapers.forEach((paper) => {
      paper.subjects.forEach((subject) => {
        subject.subtopics.forEach((topic) => {
          topicFrequency[topic.name] = (topicFrequency[topic.name] || 0) + 1;
          bloomDistribution[topic.bloomLevel]++;
          totalMarks += topic.marks;
          totalQuestions += topic.questionCount;
        });
      });
    });

    return {
      yearsAnalyzed: filteredPapers.length,
      topicFrequency: Object.entries(topicFrequency)
        .map(([topic, freq]) => ({ topic, frequency: freq }))
        .sort((a, b) => b.frequency - a.frequency),
      bloomDistribution,
      averageMarksPerQuestion: totalQuestions > 0 ? totalMarks / totalQuestions : 0,
    };
  },
});

/**
 * Grant paper access to user after OTP verification
 */
export const grantPaperAccess = mutation({
  args: {
    userId: v.id("users"),
    examType: v.union(v.literal("jee"), v.literal("neet"), v.literal("cuet")),
    year: v.number(),
    tier: v.string(),
  },
  handler: async (ctx, args) => {
    let access = await ctx.db
      .query("userPaperAccess")
      .filter(
        (q) =>
          q.and(
            q.eq(q.field("userId"), args.userId),
            q.eq(q.field("examType"), args.examType)
          )
      )
      .first();

    if (access) {
      // Update existing access
      const newYears = Array.from(new Set([...access.yearsAccessible, args.year]));
      await ctx.db.patch(access._id, {
        yearsAccessible: newYears,
        tier: args.tier,
      });
    } else {
      // Create new access record
      await ctx.db.insert("userPaperAccess", {
        userId: args.userId,
        examType: args.examType,
        yearsAccessible: [args.year],
        tier: args.tier,
        verifiedPhone: true,
        verifiedEmail: true,
        createdAt: Date.now(),
      });
    }

    return { success: true, grantedYear: args.year };
  },
});

/**
 * Check if user can access a paper year
 */
export const canAccessPaper = query({
  args: {
    userId: v.id("users"),
    examType: v.union(v.literal("jee"), v.literal("neet"), v.literal("cuet")),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    const access = await ctx.db
      .query("userPaperAccess")
      .filter(
        (q) =>
          q.and(
            q.eq(q.field("userId"), args.userId),
            q.eq(q.field("examType"), args.examType)
          )
      )
      .first();

    if (!access) return false;
    return access.yearsAccessible.includes(args.year);
  },
});

/**
 * Get user's accessible years
 */
export const getUserAccessibleYears = query({
  args: {
    userId: v.id("users"),
    examType: v.union(v.literal("jee"), v.literal("neet"), v.literal("cuet")),
  },
  handler: async (ctx, args) => {
    const access = await ctx.db
      .query("userPaperAccess")
      .filter(
        (q) =>
          q.and(
            q.eq(q.field("userId"), args.userId),
            q.eq(q.field("examType"), args.examType)
          )
      )
      .first();

    return access?.yearsAccessible || [];
  },
});
