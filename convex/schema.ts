// Run 'npx convex dev' first to generate convex/_generated/
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.optional(v.string()),
    name: v.string(),
    passwordHash: v.optional(v.string()),
    referralCode: v.string(),
    referredByCode: v.optional(v.string()),
    isKid: v.boolean(),
    parentId: v.optional(v.id("users")),
    createdAt: v.number(),
    lastLoginAt: v.optional(v.number()),
    emailSuppressed: v.optional(v.boolean()),
    emailSuppressedReason: v.optional(v.string()),
    currentClass: v.optional(v.union(v.literal("11"), v.literal("12"), v.literal("dropper"))),
    onboardingCompleted: v.optional(v.boolean()),
    teamId: v.optional(v.id("teams")),
    teamJoinedAt: v.optional(v.number()),
    teamJoinedSeasonId: v.optional(v.id("seasons")),
    streak: v.optional(v.number()),
    longestStreak: v.optional(v.number()),
    lastStreakDay: v.optional(v.string()),
    classUpgradeOptOut: v.optional(v.boolean()),
    // 10minCUET launch promotion: 30-day premium trial set at signup
    trialEndsAt: v.optional(v.number()),
    // CUET-specific: user's chosen subjects (defaults to English + GT + 1 domain)
    cuetSubjects: v.optional(v.array(v.string())),
  })
    .index("by_email", ["email"])
    .index("by_referral_code", ["referralCode"])
    .index("by_parent", ["parentId"])
    .index("by_team", ["teamId"])
    .index("by_isKid", ["isKid"]),

  otpCodes: defineTable({
    email: v.string(),
    code: v.string(),
    expiresAt: v.number(),
    used: v.boolean(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  subscriptions: defineTable({
    userId: v.id("users"),
    tier: v.string(),
    status: v.string(),
    freeMonthsRemaining: v.number(),
    razorpayPaymentId: v.optional(v.string()),
    currentPeriodEnd: v.optional(v.number()),
  }).index("by_user", ["userId"]),

  referrals: defineTable({
    referrerId: v.id("users"),
    referredId: v.id("users"),
    paidAt: v.optional(v.number()),
    monthsCredited: v.number(),
    createdAt: v.number(),
  })
    .index("by_referrer", ["referrerId"])
    .index("by_referred", ["referredId"])
    .index("by_paidAt", ["paidAt"]),

  progress: defineTable({
    userId: v.id("users"),
    topicSlug: v.string(),
    subConcept: v.string(),
    bloomLevel: v.number(),
    lastQuizScore: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_topic", ["userId", "topicSlug"]),

  kidCodes: defineTable({
    code: v.string(),
    userId: v.id("users"),
    createdAt: v.number(),
  }).index("by_code", ["code"]),

  questionFeedback: defineTable({
    userId: v.id("users"),
    questionId: v.string(),
    topicSlug: v.string(),
    perceivedDifficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    isError: v.boolean(),
    errorNote: v.optional(v.string()),
    sessionType: v.string(),
    createdAt: v.number(),
  })
    .index("by_question", ["questionId"])
    .index("by_user", ["userId"])
    .index("by_topic", ["topicSlug"])
    .index("by_isError", ["isError"]),

  questionDifficultyOverride: defineTable({
    questionId: v.string(),
    consensusDifficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    feedbackCount: v.number(),
    lastUpdated: v.number(),
  }).index("by_question", ["questionId"]),

  scheduledEmails: defineTable({
    userId: v.id("users"),
    email: v.string(),
    type: v.union(
      v.literal("welcome-day2"),
      v.literal("welcome-day2-no-mock"),
      v.literal("welcome-day7"),
      v.literal("re-engagement-day7"),
      v.literal("re-engagement-day14"),
      v.literal("re-engagement-day21")
    ),
    scheduledFor: v.number(),
    sent: v.boolean(),
    sentAt: v.optional(v.number()),
    metadata: v.optional(v.string()),
  })
    .index("by_sent_scheduled", ["sent", "scheduledFor"])
    .index("by_user_type", ["userId", "type"]),

  emailEvents: defineTable({
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
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_email_type", ["email", "emailType"]),

  studyRooms: defineTable({
    hostId: v.id("users"),
    hostName: v.string(),
    name: v.string(),
    subject: v.union(
      v.literal("Languages"),
      v.literal("Domain"),
      v.literal("General Test"),
      v.literal("All Subjects")
    ),
    topicSlug: v.optional(v.string()),
    description: v.optional(v.string()),
    maxParticipants: v.number(),
    isActive: v.boolean(),
    scheduledAt: v.optional(v.number()),
    joinCode: v.string(),
    createdAt: v.number(),
  })
    .index("by_active", ["isActive"])
    .index("by_host", ["hostId"])
    .index("by_join_code", ["joinCode"])
    .index("by_subject_active", ["subject", "isActive"]),

  roomParticipants: defineTable({
    roomId: v.id("studyRooms"),
    userId: v.id("users"),
    userName: v.string(),
    joinedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_user", ["userId"])
    .index("by_room_and_user", ["roomId", "userId"]),

  educators: defineTable({
    userId: v.id("users"),
    name: v.string(),
    subjects: v.array(v.string()),
    bio: v.string(),
    specialization: v.optional(v.string()),
    rating: v.number(),
    totalRatings: v.number(),
    totalStudents: v.number(),
    isVerified: v.boolean(),
    bankAccountHolder: v.optional(v.string()),
    bankAccountNumber: v.optional(v.string()),
    bankIfsc: v.optional(v.string()),
    razorpayContactId: v.optional(v.string()),
    razorpayFundAccountId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_rating", ["rating"])
    .index("by_students", ["totalStudents"]),

  educatorFollowers: defineTable({
    educatorId: v.id("educators"),
    userId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_educator", ["educatorId"])
    .index("by_user", ["userId"])
    .index("by_educator_and_user", ["educatorId", "userId"]),

  educatorNotes: defineTable({
    educatorId: v.id("educators"),
    authorUserId: v.id("users"),
    slug: v.string(),
    title: v.string(),
    summary: v.optional(v.string()),
    content: v.string(),
    subject: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),
    publishedAt: v.optional(v.number()),
    viewCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_educator", ["educatorId"])
    .index("by_educator_slug", ["educatorId", "slug"])
    .index("by_author", ["authorUserId"]),

  questionSets: defineTable({
    educatorId: v.id("educators"),
    authorUserId: v.id("users"),
    slug: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    subject: v.string(),
    topicSlug: v.optional(v.string()),
    difficulty: v.optional(v.string()),
    questionIds: v.array(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),
    publishedAt: v.optional(v.number()),
    attemptCount: v.number(),
    createdAt: v.number(),
  })
    .index("by_educator", ["educatorId"])
    .index("by_educator_slug", ["educatorId", "slug"])
    .index("by_author", ["authorUserId"]),

  educatorPayouts: defineTable({
    educatorId: v.id("educators"),
    userId: v.id("users"),
    educatorName: v.string(),
    monthLabel: v.string(),
    followerCountAtPayout: v.number(),
    tier: v.union(v.literal("small"), v.literal("mid"), v.literal("large")),
    amountInr: v.number(),
    status: v.union(v.literal("pending"), v.literal("paid"), v.literal("failed"), v.literal("skipped")),
    razorpayPayoutId: v.optional(v.string()),
    note: v.optional(v.string()),
    createdAt: v.number(),
    paidAt: v.optional(v.number()),
  })
    .index("by_status", ["status"])
    .index("by_educator", ["educatorId"])
    .index("by_month", ["monthLabel"])
    .index("by_educator_month", ["educatorId", "monthLabel"]),

  questionSetAttempts: defineTable({
    setId: v.id("questionSets"),
    userId: v.id("users"),
    userName: v.string(),
    score: v.number(),
    attemptedAt: v.number(),
  })
    .index("by_set", ["setId"])
    .index("by_user", ["userId"]),

  roomMessages: defineTable({
    roomId: v.id("studyRooms"),
    userId: v.id("users"),
    userName: v.string(),
    message: v.string(),
    createdAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_room_time", ["roomId", "createdAt"]),

  roomNotes: defineTable({
    roomId: v.id("studyRooms"),
    userId: v.id("users"),
    userName: v.string(),
    title: v.string(),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_room", ["roomId"]),

  parentInvites: defineTable({
    parentId: v.id("users"),
    inviteCode: v.string(),
    studentId: v.optional(v.id("users")),
    usedAt: v.optional(v.number()),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_parent", ["parentId"])
    .index("by_code", ["inviteCode"]),

  quizActivity: defineTable({
    userId: v.id("users"),
    subject: v.union(v.literal("Languages"), v.literal("Domain"), v.literal("General Test")),
    topicSlug: v.string(),
    score: v.number(),
    completedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_subject", ["userId", "subject"])
    .index("by_subject_completed", ["subject", "completedAt"]),

  mockResults: defineTable({
    userId: v.id("users"),
    languagesScore: v.number(),
    domainScore: v.number(),
    generalTestScore: v.number(),
    totalScore: v.number(),
    maxScore: v.number(),
    takenAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_taken", ["takenAt"]),

  leaderboardSnapshots: defineTable({
    subject: v.union(
      v.literal("Languages"),
      v.literal("Domain"),
      v.literal("General Test"),
      v.literal("Overall")
    ),
    period: v.union(v.literal("weekly"), v.literal("monthly"), v.literal("all-time")),
    entries: v.array(
      v.object({
        userId: v.string(),
        userName: v.string(),
        score: v.number(),
        rank: v.number(),
        mocksCount: v.number(),
        quizzesCount: v.number(),
        accuracy: v.number(),
        topicsMastered: v.number(),
      })
    ),
    updatedAt: v.number(),
  }).index("by_subject_period", ["subject", "period"]),

  readinessScores: defineTable({
    userId: v.id("users"),
    score: v.number(),
    topicCoverage: v.number(),
    mockScoreAvg: v.number(),
    attendanceRate: v.number(),
    weakTopics: v.array(v.string()),
    recommendations: v.array(v.string()),
    calculatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_calculated", ["calculatedAt"]),

  retentionEmailLog: defineTable({
    userId: v.id("users"),
    email: v.string(),
    segment: v.union(
      v.literal("active"),
      v.literal("dormant"),
      v.literal("at-risk")
    ),
    weekStart: v.number(),
    sentAt: v.number(),
    emailType: v.string(),
  })
    .index("by_user_week", ["userId", "weekStart"])
    .index("by_week", ["weekStart"]),

  blogs: defineTable({
    slug: v.string(),
    title: v.string(),
    content: v.string(),
    ncertBook: v.string(),
    ncertChapter: v.string(),
    targetClasses: v.array(v.string()),
    sequenceIn11th: v.optional(v.number()),
    sequenceIn12th: v.optional(v.number()),
    richContent: v.optional(v.string()),
    ncertPdfUrl: v.optional(v.string()),
    estimatedStudyTime: v.optional(v.number()),
    createdAt: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_targetClasses", ["targetClasses"]),

  pendingBatches: defineTable({
    batchId: v.string(),
    status: v.string(),
    submittedAt: v.number(),
    processedAt: v.optional(v.number()),
    topicsJson: v.string(),
    blogsGenerated: v.optional(v.number()),
    errorMessage: v.optional(v.string()),
  }).index("by_status", ["status"]),

  weeklyChallenges: defineTable({
    weekStart: v.number(),
    weekEnd: v.optional(v.number()),
    subject: v.string(),
    topicSlug: v.string(),
    topicLabel: v.optional(v.string()),
    title: v.optional(v.string()),
    targetScore: v.number(),
    participants: v.number(),
    completions: v.optional(v.number()),
    status: v.optional(v.union(v.literal("active"), v.literal("completed"))),
    createdAt: v.number(),
  })
    .index("by_week", ["weekStart"])
    .index("by_status", ["status"]),

  challengeParticipations: defineTable({
    challengeId: v.id("weeklyChallenges"),
    userId: v.id("users"),
    userName: v.string(),
    joinedAt: v.number(),
    bestScore: v.number(),
    attemptCount: v.number(),
    completedAt: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_challenge", ["challengeId"])
    .index("by_user", ["userId"])
    .index("by_user_challenge", ["userId", "challengeId"])
    .index("by_challenge_score", ["challengeId", "bestScore"]),

  tournaments: defineTable({
    name: v.string(),
    subject: v.optional(v.string()),
    topicSlug: v.optional(v.string()),
    topicLabel: v.optional(v.string()),
    size: v.optional(v.number()),
    status: v.string(),
    week: v.optional(v.number()),
    participants: v.optional(v.array(v.string())),
    startsAt: v.optional(v.number()),
    endsAt: v.optional(v.number()),
    registrationClosesAt: v.optional(v.number()),
    round1EndsAt: v.optional(v.number()),
    round2EndsAt: v.optional(v.number()),
    round3EndsAt: v.optional(v.number()),
    currentRound: v.optional(v.number()),
    winnerUserId: v.optional(v.id("users")),
    winnerUserName: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_week", ["week"])
    .index("by_status", ["status"])
    .index("by_starts", ["startsAt"]),

  tournamentEntries: defineTable({
    tournamentId: v.id("tournaments"),
    userId: v.id("users"),
    userName: v.string(),
    seed: v.number(),
    currentRound: v.number(),
    eliminatedInRound: v.optional(v.number()),
    registeredAt: v.number(),
  })
    .index("by_tournament", ["tournamentId"])
    .index("by_tournament_user", ["tournamentId", "userId"])
    .index("by_user", ["userId"]),

  tournamentMatches: defineTable({
    tournamentId: v.id("tournaments"),
    round: v.number(),
    slot: v.number(),
    playerAUserId: v.id("users"),
    playerAUserName: v.string(),
    playerAScore: v.optional(v.number()),
    playerBUserId: v.optional(v.id("users")),
    playerBUserName: v.optional(v.string()),
    playerBScore: v.optional(v.number()),
    winnerUserId: v.optional(v.id("users")),
    winnerUserName: v.optional(v.string()),
    status: v.string(),
    roundStartsAt: v.number(),
    roundEndsAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_tournament", ["tournamentId"])
    .index("by_tournament_round", ["tournamentId", "round"])
    .index("by_player_a", ["playerAUserId"])
    .index("by_player_b", ["playerBUserId"]),

  adminTodos: defineTable({
    title: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical")),
    status: v.union(v.literal("open"), v.literal("done")),
    createdAt: v.number(),
  }).index("by_status", ["status"]),

  teams: defineTable({
    shortName: v.string(),
    name: v.string(),
    colorPrimary: v.string(),
    colorSecondary: v.string(),
    emoji: v.string(),
  }).index("by_short_name", ["shortName"]),

  seasons: defineTable({
    monthLabel: v.string(),
    startsAt: v.number(),
    endsAt: v.number(),
    status: v.union(v.literal("active"), v.literal("completed")),
    winnerTeamId: v.optional(v.id("teams")),
    mvpUserId: v.optional(v.id("users")),
    mvpUserName: v.optional(v.string()),
    mvpScore: v.optional(v.number()),
  })
    .index("by_status", ["status"])
    .index("by_month", ["monthLabel"]),

  teamStandingSnapshots: defineTable({
    seasonId: v.id("seasons"),
    updatedAt: v.number(),
    standings: v.array(
      v.object({
        teamId: v.string(),
        teamShortName: v.string(),
        teamName: v.string(),
        memberCount: v.number(),
        topElevenAverage: v.number(),
        totalScore: v.number(),
        rank: v.number(),
      })
    ),
  }).index("by_season", ["seasonId"]),

  teamSquadSnapshots: defineTable({
    seasonId: v.id("seasons"),
    teamId: v.id("teams"),
    updatedAt: v.number(),
    members: v.array(
      v.object({
        userId: v.string(),
        userName: v.string(),
        score: v.number(),
        quizzesCount: v.number(),
        mocksCount: v.number(),
        accuracy: v.number(),
        isPlayingXI: v.boolean(),
      })
    ),
  }).index("by_season_team", ["seasonId", "teamId"]),

  kpiSnapshots: defineTable({
    dateLabel: v.string(),
    capturedAt: v.number(),
    totalUsers: v.number(),
    newSignups24h: v.number(),
    newSignups7d: v.number(),
    newSignups30d: v.number(),
    dau: v.number(),
    wau: v.number(),
    mau: v.number(),
    dauWauRatio: v.number(),
    paidCount: v.number(),
    freeCount: v.number(),
    mrr: v.number(),
    tierBreakdown: v.string(),
    retention7d: v.number(),
    retention30d: v.number(),
  })
    .index("by_captured", ["capturedAt"])
    .index("by_date", ["dateLabel"]),

  abTests: defineTable({
    testKey: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    variants: v.array(
      v.object({
        key: v.string(),
        label: v.string(),
        allocationPct: v.number(),
      })
    ),
    primaryMetric: v.string(),
    status: v.union(v.literal("draft"), v.literal("running"), v.literal("completed"), v.literal("paused")),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    winnerVariantKey: v.optional(v.string()),
    pValue: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_key", ["testKey"])
    .index("by_status", ["status"]),

  abExposures: defineTable({
    testKey: v.string(),
    variantKey: v.string(),
    userId: v.optional(v.id("users")),
    sessionId: v.string(),
    exposedAt: v.number(),
  })
    .index("by_test", ["testKey"])
    .index("by_test_variant", ["testKey", "variantKey"])
    .index("by_test_user", ["testKey", "userId"]),

  abConversions: defineTable({
    testKey: v.string(),
    variantKey: v.string(),
    userId: v.id("users"),
    convertedAt: v.number(),
  })
    .index("by_test", ["testKey"])
    .index("by_test_variant", ["testKey", "variantKey"])
    .index("by_test_user", ["testKey", "userId"]),

  cronLogs: defineTable({
    cronName: v.string(),
    status: v.union(v.literal("success"), v.literal("failed")),
    startedAt: v.number(),
    durationMs: v.number(),
    recordsAffected: v.optional(v.number()),
    result: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
  })
    .index("by_cron_started", ["cronName", "startedAt"])
    .index("by_started", ["startedAt"]),

  ncertExplanations: defineTable({
    // key = "topicSlug__subconceptSlug", e.g. "electrostatics-capacitors__coulombs-law"
    key: v.string(),
    topicName: v.string(),
    subConceptName: v.string(),
    explanation: v.string(),
    ncertBook: v.optional(v.string()),
    ncertChapter: v.optional(v.number()),
    ncertChapterName: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),
});
