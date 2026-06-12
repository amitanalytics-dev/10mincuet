import posthog from "posthog-js";

export const track = (event: string, props?: Record<string, unknown>) => {
  if (typeof window !== "undefined") {
    posthog.capture(event, props);
  }
};

// All tracked events
export const Analytics = {
  signupStarted: () => track("signup_started"),
  signupCompleted: (cls: string) => track("signup_completed", { class: cls }),
  classSelected: (cls: string) => track("class_selected", { class: cls }),
  quizStarted: (topic: string, subject: string) => track("quiz_started", { topic, subject }),
  quizCompleted: (topic: string, score: number, bloomLevel: number) => track("quiz_completed", { topic, score, bloomLevel }),
  bloomImproved: (topic: string, from: number, to: number) => track("bloom_improved", { topic, from, to }),
  topicOpened: (topic: string, subject: string) => track("topic_opened", { topic, subject }),
  mockStarted: () => track("mock_started"),
  mockCompleted: (score: number, percentile: number) => track("mock_completed", { score, percentile }),
  pricingViewed: () => track("pricing_viewed"),
  paymentInitiated: (plan: string) => track("payment_initiated", { plan }),
  referralShared: () => track("referral_shared"),
  blogRead: (slug: string, subject: string) => track("blog_read", { slug, subject }),
  ncertRefClicked: (topic: string, book: string, chapter: number) => track("ncert_ref_clicked", { topic, book, chapter }),
  streakUpdated: (days: number) => track("streak_updated", { days }),
  shareCardOpened: (type: string) => track("share_card_opened", { type }),
  paywallShown: (trigger: string) => track("paywall_shown", { trigger }),
  upgradeClicked: (from: string) => track("upgrade_clicked", { from }),
  streakMilestone: (days: number) => track("streak_milestone", { days }),
  shareClicked: (type: string, topic: string) => track("share_clicked", { type, topic }),
  doubtAsked: () => track("doubt_asked"),
  onboardingCompleted: (classLevel: string, avgScore: number) => track("onboarding_completed", { class: classLevel, avg_score: avgScore }),
};
