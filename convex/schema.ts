import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  mockResults: defineTable({
    sessionId: v.string(),
    section: v.union(v.literal('Languages'), v.literal('Domain'), v.literal('GeneralTest')),
    score: v.number(),
    attempted: v.number(),
    totalQuestions: v.number(),
    takenAt: v.number(),
  }).index('by_session', ['sessionId']),

  questionAttempts: defineTable({
    sessionId: v.string(),
    questionId: v.string(),
    subConcept: v.string(),
    selectedOption: v.number(),
    correct: v.boolean(),
    takenAt: v.number(),
  }).index('by_session', ['sessionId']).index('by_concept', ['subConcept']),
});
