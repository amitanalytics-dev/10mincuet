import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all topics for an exam (used for DPP, question bank filtering)
 */
export const getTopicsByExam = query({
  args: { examType: v.union(v.literal("jee"), v.literal("neet"), v.literal("cuet")) },
  handler: async (ctx, args) => {
    const topics = await ctx.db
      .query("topics")
      .filter((q) => q.eq(q.field("examType"), args.examType))
      .collect();

    return topics.map((t) => ({
      id: t._id,
      subject: t.subject,
      topic: t.name,
      subtopic: t.subtopic,
      frequency: t.frequency,
      importance: t.importance,
      bloomLevel: t.bloomLevel,
      questionCount: t.questionCount,
    }));
  },
});

/**
 * Get DPP for today (Daily Practice Problems)
 * Curated based on: frequency + importance + student's progress
 */
export const getTodayDPP = query({
  args: {
    userId: v.id("users"),
    examType: v.union(v.literal("jee"), v.literal("neet"), v.literal("cuet")),
  },
  handler: async (ctx, args) => {
    // Get student's last practice date
    const lastDPP = await ctx.db
      .query("dppProgress")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("examType"), args.examType)
        )
      )
      .order("desc")
      .first();

    // Get high-frequency, high-importance topics
    const topics = await ctx.db
      .query("topics")
      .filter((q) =>
        q.and(
          q.eq(q.field("examType"), args.examType),
          q.gte(q.field("frequency"), 3), // Appeared 3+ times
          q.gte(q.field("importance"), 7) // Importance 7+/10
        )
      )
      .take(5)
      .collect();

    // Get 5-10 questions from selected topics
    const dppQuestions = await ctx.db
      .query("questions")
      .filter((q) =>
        q.and(
          q.eq(q.field("examType"), args.examType),
          q.eq(q.field("status"), "published")
        )
      )
      .order("desc")
      .take(10)
      .collect();

    return {
      date: new Date().toISOString().split("T")[0],
      topicsFocused: topics.map((t) => ({ subject: t.subject, topic: t.name })),
      questions: dppQuestions.map((q) => ({
        id: q._id,
        question: q.questionText,
        difficulty: q.difficulty,
        estimatedTime: q.estimatedTimeSeconds,
        subject: q.subject,
        topic: q.topic,
        bloomLevel: q.bloomLevel,
      })),
      completedCount: 0,
      targetTime: 45 * 60, // 45 minutes
    };
  },
});

/**
 * Get questions by topic with filters
 */
export const getQuestionsByTopic = query({
  args: {
    examType: v.union(v.literal("jee"), v.literal("neet"), v.literal("cuet")),
    subject: v.string(),
    topic: v.string(),
    difficulty: v.optional(v.union(v.literal("easy"), v.literal("medium"), v.literal("hard"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query_builder = ctx.db
      .query("questions")
      .filter((q) =>
        q.and(
          q.eq(q.field("examType"), args.examType),
          q.eq(q.field("subject"), args.subject),
          q.eq(q.field("topic"), args.topic),
          q.eq(q.field("status"), "published")
        )
      );

    if (args.difficulty) {
      query_builder = query_builder.filter(
        (q) => q.eq(q.field("difficulty"), args.difficulty)
      );
    }

    const questions = await query_builder.take(args.limit || 20).collect();

    return {
      total: questions.length,
      questions: questions.map((q) => ({
        id: q._id,
        question: q.questionText,
        options: q.options,
        difficulty: q.difficulty,
        bloomLevel: q.bloomLevel,
        estimatedTime: q.estimatedTimeSeconds,
        subject: q.subject,
        topic: q.topic,
        isPYQ: q.isPYQ,
        pyqYear: q.pyqYear,
      })),
    };
  },
});

/**
 * Get question with solution (only for paid users)
 */
export const getQuestionWithSolution = query({
  args: {
    questionId: v.id("questions"),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const question = await ctx.db.get(args.questionId);
    if (!question) return null;

    // Check if user has paid access
    const hasAccess = args.userId
      ? await ctx.db
          .query("subscriptions")
          .filter((q) => q.eq(q.field("userId"), args.userId!))
          .first()
      : false;

    if (!hasAccess) {
      // Return question without solution for free users
      return {
        ...question,
        solution: null,
        conceptMap: null,
        relatedTopics: null,
      };
    }

    // Full details for paid users
    return {
      id: question._id,
      question: question.questionText,
      options: question.options,
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty,
      bloomLevel: question.bloomLevel,
      estimatedTime: question.estimatedTimeSeconds,
      subject: question.subject,
      topic: question.topic,
      solution: question.solution,
      conceptMap: question.conceptMap,
      conceptMapUrl: question.conceptMapUrl,
      relatedTopics: question.relatedTopics,
      mindMapUrl: question.mindMapUrl,
      commonMistakes: question.commonMistakes,
      estimatedTimeMin: Math.floor(question.estimatedTimeSeconds / 60),
      estimatedTimeSec: question.estimatedTimeSeconds % 60,
    };
  },
});

/**
 * Get Revision Blueprint (important topics curated by frequency + importance)
 */
export const getRevisionBlueprint = query({
  args: {
    examType: v.union(v.literal("jee"), v.literal("neet"), v.literal("cuet")),
    subject: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query_builder = ctx.db
      .query("revisionBlueprint")
      .filter((q) => q.eq(q.field("examType"), args.examType));

    if (args.subject) {
      query_builder = query_builder.filter((q) =>
        q.eq(q.field("subject"), args.subject)
      );
    }

    const blueprint = await query_builder.collect();

    return {
      examType: args.examType,
      subject: args.subject || "All",
      topics: blueprint
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .map((t) => ({
          rank: t.rank,
          topic: t.topicName,
          subject: t.subject,
          frequency: t.frequency,
          importance: t.importance,
          expectedMarks: t.expectedMarks,
          score: t.score,
          recommendedDaysToStudy: t.recommendedDaysToStudy,
          keyPoints: t.keyPoints,
        })),
    };
  },
});

/**
 * Submit DPP response and track progress
 */
export const submitDPPResponse = mutation({
  args: {
    userId: v.id("users"),
    examType: v.union(v.literal("jee"), v.literal("neet"), v.literal("cuet")),
    questionId: v.id("questions"),
    selectedAnswer: v.string(),
    timeTaken: v.number(), // seconds
  },
  handler: async (ctx, args) => {
    const question = await ctx.db.get(args.questionId);
    if (!question) return null;

    const isCorrect = args.selectedAnswer === question.correctAnswer;

    // Record response
    const response = await ctx.db.insert("questionResponses", {
      userId: args.userId,
      questionId: args.questionId,
      examType: args.examType,
      selectedAnswer: args.selectedAnswer,
      isCorrect,
      timeTaken: args.timeTaken,
      createdAt: Date.now(),
    });

    // Update DPP progress
    await ctx.db.insert("dppProgress", {
      userId: args.userId,
      examType: args.examType,
      questionsAttempted: 1,
      correctCount: isCorrect ? 1 : 0,
      accuracy: isCorrect ? 100 : 0,
      totalTimeSpent: args.timeTaken,
      completedAt: Date.now(),
    });

    return {
      correct: isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.solution,
      timeSpent: args.timeTaken,
      averageTime: question.estimatedTimeSeconds,
    };
  },
});

/**
 * Get student's question bank progress
 */
export const getStudentProgress = query({
  args: {
    userId: v.id("users"),
    examType: v.union(v.literal("jee"), v.literal("neet"), v.literal("cuet")),
  },
  handler: async (ctx, args) => {
    const responses = await ctx.db
      .query("questionResponses")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.eq(q.field("examType"), args.examType)
        )
      )
      .collect();

    const correct = responses.filter((r) => r.isCorrect).length;
    const total = responses.length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    // Group by topic
    const byTopic: Record<string, { correct: number; total: number }> = {};
    responses.forEach((r) => {
      if (!byTopic[r.questionId]) {
        byTopic[r.questionId] = { correct: 0, total: 0 };
      }
      byTopic[r.questionId].total++;
      if (r.isCorrect) byTopic[r.questionId].correct++;
    });

    return {
      examType: args.examType,
      totalQuestionsAttempted: total,
      correctAnswers: correct,
      accuracy,
      dppStreak: responses.length > 0 ? Math.min(responses.length, 30) : 0,
      lastPracticedAt: responses.length > 0 ? responses[responses.length - 1].createdAt : null,
      topicBreakdown: Object.entries(byTopic).map(([topic, stats]) => ({
        topic,
        accuracy: Math.round((stats.correct / stats.total) * 100),
      })),
    };
  },
});
