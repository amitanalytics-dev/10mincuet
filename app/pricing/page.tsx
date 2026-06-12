"use client";

import Link from "next/link";
import { RazorpayButton } from "../components/RazorpayButton";
import { PublicNav } from "../components/PublicNav";
import { Analytics } from "../lib/analytics";

const PLANS = [
  {
    tier: "Diagnostic",
    price: "₹0",
    period: "forever free",
    description: "Try before you pay. No card. No timer.",
    features: [
      "1 diagnostic quiz per subject (10 questions)",
      "See your Bloom level per subject",
      "Basic topic breakdown",
      "No sub-concept practice",
      "No daily sessions",
    ],
    cta: "Start Free",
    href: "/register",
    highlight: false,
    tag: null,
    paidTier: null,
  },
  {
    tier: "Single Subject",
    price: "₹149",
    period: "per month",
    description: "Go deep on one subject. Best for focused sprints.",
    features: [
      "Full access — one section (English, a Domain subject OR General Test)",
      "All topic quizzes + sub-concept practice",
      "Daily 10-min adaptive sessions",
      "Bloom level tracker",
      "Weekly progress email",
    ],
    cta: "Choose Subject",
    href: "/register",
    highlight: false,
    tag: null,
    paidTier: null,
  },
  {
    tier: "Full Bundle",
    price: "₹349",
    period: "per month",
    description: "All sections + every domain subject. Most popular.",
    features: [
      "Languages + General Test + all Domain subjects — full access",
      "Every CUET topic, all sub-concept practice",
      "Daily 10-min sessions across all subjects",
      "Cross-subject Bloom dashboard",
      "Weekly progress email",
      "Referral credits apply here",
    ],
    cta: "Get Bundle",
    href: "/register",
    highlight: true,
    tag: "Most Popular",
    paidTier: "bundle",
  },
  {
    tier: "Annual Bundle",
    price: "₹2,499",
    period: "per year",
    description: "Best value. Lock in before CUET. Saves ₹1,690.",
    features: [
      "Everything in Full Bundle",
      "12 months full access",
      "Saves ₹1,690 vs monthly billing",
      "Priority support",
      "Early access to new features",
    ],
    cta: "Save ₹1,690",
    href: "/register",
    highlight: false,
    tag: "Best Value",
    paidTier: "annual",
  },
  {
    tier: "Parent + Kid",
    price: "₹2,999",
    period: "per year",
    description: "Parent pays once. Kid gets a login code. No email needed.",
    features: [
      "Everything in Annual Bundle",
      "6-character kid code (any device, no email)",
      "Parent progress dashboard",
      "Weekly email to parent with kid's stats",
      "Kid progress synced across devices",
    ],
    cta: "Get Parent Plan",
    href: "/register",
    highlight: false,
    tag: null,
    paidTier: "parent_kid",
  },
  {
    tier: "Mock Test Pack",
    price: "₹499",
    period: "one-time",
    description: "10 full NTA-pattern mocks. No subscription needed.",
    features: [
      "10 full-length CUET UG mocks (NTA pattern)",
      "Section-based, 60-min sections, +5/−1 scoring",
      "Percentile + rank estimate per attempt",
      "Detailed sub-concept error analysis",
      "Works even on the free plan",
    ],
    cta: "Buy Mock Pack",
    href: "/register",
    highlight: false,
    tag: "New",
    paidTier: "mock_pack",
  },
];

const FAQS = [
  {
    q: "What does 'free' actually include?",
    a: "One diagnostic quiz per section — 10 questions each across English, the General Test and your Domain subjects. You see your Bloom level for that section. No credit card needed, no expiry.",
  },
  {
    q: "How does the referral work?",
    a: "Every registered user gets a unique referral code. When a friend signs up and pays for any plan, you earn 1 free month on your current plan. Maximum 5 months free total. Only for the first 5,000 students on the platform.",
  },
  {
    q: "What is a Kid Code?",
    a: "In the Parent+Kid plan, after payment you get a 6-character code (like ARJ492). Your child enters this on any phone or laptop — no email, no password required from them.",
  },
  {
    q: "What's the difference between Mock Pack and a subscription?",
    a: "The ₹499 Mock Pack is one-time — 10 full NTA-pattern mocks with percentile estimates. It works even on the free plan. Subscriptions give daily adaptive study sessions and Bloom tracking on top of mocks.",
  },
  {
    q: "Can I switch plans?",
    a: "Yes. Upgrade any time. Downgrade at end of billing period. No lock-in on monthly plans.",
  },
  {
    q: "Do you have discounts for coaching institutes?",
    a: "We don't partner with coaching institutes. This is a direct-to-student product. For bulk access for a school or institute, email us.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />

      {/* Hero */}
      <div className="text-center py-12 px-4">
        <h2 className="text-4xl font-black text-gray-900 mb-3">
          Start free. Pay when you&apos;re ready.
        </h2>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          No dark patterns. No free trial that auto-charges. Diagnostic is yours forever.
          First 5,000 students can earn up to 5 free months via referral.
        </p>
      </div>

      {/* Plans */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.tier}
              className={`rounded-2xl border flex flex-col relative ${
                plan.highlight
                  ? "bg-orange-500 border-orange-500 text-white shadow-2xl shadow-orange-200 ring-4 ring-orange-300 ring-offset-2 p-7 lg:-my-3 z-10"
                  : "bg-white border-gray-200 p-6"
              }`}
            >
              {plan.tag && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-black px-3 py-1 rounded-full whitespace-nowrap ${
                  plan.highlight ? "bg-white text-orange-500" : "bg-orange-500 text-white"
                }`}>
                  {plan.tag}
                </div>
              )}
              <div className={`text-xs font-black uppercase tracking-widest mb-2 ${plan.highlight ? "text-orange-100" : "text-orange-500"}`}>
                {plan.tier}
              </div>
              <div className={`text-4xl font-black mb-0.5 ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                {plan.price}
              </div>
              <div className={`text-xs mb-3 ${plan.highlight ? "text-orange-100" : "text-gray-400"}`}>
                {plan.period}
              </div>
              {plan.tier === "Annual Bundle" && (
                <div className="mb-3">
                  <span className="inline-block bg-green-100 text-green-700 text-xs font-black px-3 py-1.5 rounded-full">
                    Save ₹1,689/yr
                  </span>
                  <p className="text-xs text-gray-400 mt-1">vs ₹4,188 if paid monthly</p>
                </div>
              )}
              <p className={`text-sm mb-4 leading-relaxed ${plan.highlight ? "text-orange-100" : "text-gray-500"}`}>
                {plan.description}
              </p>
              <ul className="flex-1 space-y-2 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className={`flex items-start gap-2 text-sm ${plan.highlight ? "text-white" : "text-gray-700"}`}>
                    <span className={`shrink-0 mt-0.5 ${plan.highlight ? "text-orange-200" : "text-orange-400"}`}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              {plan.paidTier ? (
                <RazorpayButton
                  tier={plan.paidTier}
                  label={plan.tier}
                  className={`block w-full text-center font-bold py-3 rounded-xl transition-all text-sm ${
                    plan.highlight
                      ? "bg-white text-orange-500 hover:bg-orange-50"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                >
                  {plan.cta} →
                </RazorpayButton>
              ) : (
                <Link
                  href={plan.href}
                  className={`block text-center font-bold py-3 rounded-xl transition-all text-sm ${
                    plan.highlight
                      ? "bg-white text-orange-500 hover:bg-orange-50"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                  onClick={() => Analytics.upgradeClicked("pricing_page")}
                >
                  {plan.cta} →
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Referral callout */}
        <div className="mt-8 bg-white border border-orange-100 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🔗</div>
            <div>
              <h3 className="font-black text-gray-900 mb-1">Earn up to 5 free months via referral</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Every registered user gets a referral code. When a friend pays for any plan,
                you earn 1 free month on your current plan. Cap: 5 months. Only for the first
                5,000 students — after that, referral program closes.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-12">
          <h3 className="text-2xl font-black text-gray-900 mb-6 text-center">Common Questions</h3>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5">
                <h4 className="font-bold text-gray-900 mb-2 text-sm">{faq.q}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center text-xs text-gray-400 space-y-1">
          <p>Payments processed securely via Razorpay · GST invoice auto-emailed on payment</p>
          <p>
            <Link href="/refund-policy" className="underline hover:text-gray-600">Refund Policy</Link>
            {" · "}
            <Link href="/terms" className="underline hover:text-gray-600">Terms of Use</Link>
            {" · "}
            <Link href="/contact" className="underline hover:text-gray-600">Contact</Link>
          </p>
        </div>
      </div>

      {/* FAQ structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How much does 10minCUET cost?",
                "acceptedAnswer": { "@type": "Answer", "text": "10minCUET has a free tier with no credit card required. The Bundle plan is ₹349/month. The Annual plan is ₹2,499/year — saving ₹1,689 compared to monthly billing." }
              },
              {
                "@type": "Question",
                "name": "Can I get 10minCUET for free?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes. Refer a paying friend and get 1 free month. You can earn up to 5 free months through referrals." }
              },
              {
                "@type": "Question",
                "name": "Is there a refund policy?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes. 10minCUET offers a refund within 7 days of purchase if you are not satisfied." }
              }
            ]
          })
        }}
      />
    </div>
  );
}
