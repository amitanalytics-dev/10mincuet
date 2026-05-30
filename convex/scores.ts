import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const saveSectionResult = mutation({
  args: {
    sessionId: v.string(),
    section: v.union(v.literal('Languages'), v.literal('Domain'), v.literal('GeneralTest')),
    score: v.number(),
    attempted: v.number(),
    totalQuestions: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('mockResults', { ...args, takenAt: Date.now() });
  },
});

export const saveAttempts = mutation({
  args: {
    sessionId: v.string(),
    attempts: v.array(
      v.object({
        questionId: v.string(),
        subConcept: v.string(),
        selectedOption: v.number(),
        correct: v.boolean(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    for (const a of args.attempts) {
      await ctx.db.insert('questionAttempts', { ...a, sessionId: args.sessionId, takenAt: now });
    }
  },
});

export const getSessionResults = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query('mockResults')
      .withIndex('by_session', (q) => q.eq('sessionId', args.sessionId))
      .collect();
  },
});

export const getWeakConcepts = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const attempts = await ctx.db
      .query('questionAttempts')
      .withIndex('by_session', (q) => q.eq('sessionId', args.sessionId))
      .collect();

    const conceptMap: Record<string, { correct: number; total: number }> = {};
    for (const a of attempts) {
      if (!conceptMap[a.subConcept]) conceptMap[a.subConcept] = { correct: 0, total: 0 };
      conceptMap[a.subConcept].total++;
      if (a.correct) conceptMap[a.subConcept].correct++;
    }

    return Object.entries(conceptMap)
      .map(([concept, stats]) => ({ concept, accuracy: stats.correct / stats.total, total: stats.total }))
      .sort((a, b) => a.accuracy - b.accuracy);
  },
});
