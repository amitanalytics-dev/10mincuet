"use client";

import { PLAN_PRICES, PLAN_FEATURES } from "@/app/lib/razorpay";

interface PricingTier {
  id: string;
  name: string;
  monthlyPrice?: number;
  yearlyPrice?: number;
  description: string;
  features: string[];
  cta: string;
  highlight?: boolean;
  tag?: string;
  interval: "monthly" | "yearly" | "one-time";
}

const TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    description: "Perfect for trying out. One diagnostic quiz per subject.",
    features: [
      "Diagnostic quiz (Physics, Chemistry, Biology)",
      "View your Bloom level",
      "1 mock test per subject per month",
      "Mobile app access",
      "No credit card needed",
    ],
    cta: "Start Free",
    highlight: false,
    interval: "monthly",
  },
  {
    id: "single_subject",
    name: "Single Subject",
    monthlyPrice: 149,
    description: "Master one subject deeply at your own pace.",
    features: [
      "Physics OR Chemistry OR Biology",
      "All topics in your subject",
      "Daily 10-minute adaptive sessions",
      "Bloom-level tracking per sub-concept",
      "Unlimited practice questions",
      "2 mock tests per month",
    ],
    cta: "Choose Subject",
    interval: "monthly",
  },
  {
    id: "bundle",
    name: "Full Bundle",
    monthlyPrice: 349,
    description: "All 3 subjects. Flexible month-to-month.",
    features: [
      "Physics + Chemistry + Biology",
      "All 24+ topics",
      "Daily adaptive 10-minute sessions",
      "Cross-subject Bloom dashboard",
      "Unlimited practice",
      "2 mock tests per month",
      "Weekly progress email",
      "Cancel anytime",
    ],
    cta: "Get Bundle",
    interval: "monthly",
  },
  {
    id: "bundle_3mo",
    name: "3-Month Bundle",
    monthlyPrice: 333,
    yearlyPrice: 999,
    description: "Lock in for 3 months. 6% savings vs monthly.",
    features: [
      "Everything in Full Bundle",
      "3 months full access",
      "Saves ₹48 vs paying monthly",
      "Flexible: start/pause anytime after 3 months",
    ],
    cta: "Save ₹48",
    interval: "yearly",
  },
  {
    id: "bundle_6mo",
    name: "6-Month Bundle",
    monthlyPrice: 333,
    yearlyPrice: 1999,
    description: "Half-year commitment. 20% savings.",
    features: [
      "Everything in Full Bundle",
      "6 months full access",
      "Saves ₹499 vs paying monthly",
      "Unlimited mock tests",
      "Priority support",
    ],
    cta: "Save ₹499",
    interval: "yearly",
  },
  {
    id: "annual",
    name: "Annual Bundle",
    yearlyPrice: 2499,
    description: "Full year. Lock in before NEET. Best value.",
    features: [
      "Everything in Full Bundle",
      "12 months full access",
      "Saves ₹1,689 vs monthly",
      "Unlimited mock tests",
      "Priority email support",
      "Early access to new features",
      "Performance analytics",
    ],
    cta: "Save ₹1,689",
    highlight: true,
    tag: "Best Value",
    interval: "yearly",
  },
  {
    id: "parent_kid",
    name: "Parent + Kid",
    yearlyPrice: 2999,
    description: "Dual account. Parent tracks kid's progress.",
    features: [
      "Everything in Annual Bundle",
      "2 accounts (parent + child)",
      "6-character kid code (no email needed)",
      "Parent progress dashboard",
      "Weekly email to parent with stats",
      "No phone fights about logins",
      "Unlimited mock tests",
      "Priority support",
    ],
    cta: "Get Parent Plan",
    interval: "yearly",
  },
];

const ADD_ONS = [
  {
    id: "mock_10",
    name: "Mock Test Pack (10)",
    price: 499,
    description: "10 full NTA-pattern mocks. One-time purchase.",
    features: [
      "10 full mock tests",
      "NTA exam pattern",
      "Percentile estimates",
      "Works even on free plan",
    ],
  },
  {
    id: "mock_20",
    name: "Mock Test Pack (20)",
    price: 799,
    description: "20 full tests. Best for serious prep.",
    features: [
      "20 full mock tests",
      "NTA exam pattern",
      "Detailed analytics per test",
      "Works even on free plan",
      "Save ₹199 vs 2x the 10-pack",
    ],
  },
];

export function PricingComparison() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-black text-gray-900 mb-4">
          Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          No hidden fees. No dark patterns. Cancel anytime.
        </p>
        <p className="text-lg text-orange-600 font-semibold">
          Earn up to 5 free months via referral (time-based reward only).
        </p>
      </div>

      {/* Main Pricing Grid */}
      <div className="max-w-6xl mx-auto mb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-2xl border-2 flex flex-col relative transition-transform hover:scale-105 ${
                tier.highlight
                  ? "border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50 shadow-2xl shadow-orange-200 ring-4 ring-orange-300 ring-offset-2 p-8 lg:-my-6 z-10"
                  : "border-gray-200 bg-white p-6 shadow-sm hover:shadow-md"
              }`}
            >
              {/* Tag */}
              {tier.tag && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-black px-4 py-1.5 rounded-full">
                  ⭐ {tier.tag}
                </div>
              )}

              {/* Name & Price */}
              <h3 className={`text-2xl font-black mb-1 ${tier.highlight ? "text-orange-900" : "text-gray-900"}`}>
                {tier.name}
              </h3>
              <p className={`text-sm mb-4 ${tier.highlight ? "text-orange-700" : "text-gray-600"}`}>
                {tier.description}
              </p>

              <div className="mb-6">
                {tier.monthlyPrice !== undefined && (
                  <div>
                    <span className="text-4xl font-black text-orange-600">
                      ₹{tier.monthlyPrice}
                    </span>
                    {tier.interval === "monthly" && (
                      <span className={`text-sm ${tier.highlight ? "text-orange-700" : "text-gray-600"}`}>
                        /month
                      </span>
                    )}
                  </div>
                )}
                {tier.yearlyPrice !== undefined && tier.interval !== "monthly" && (
                  <div>
                    <span className="text-4xl font-black text-orange-600">
                      ₹{tier.yearlyPrice}
                    </span>
                    <span className={`text-sm ${tier.highlight ? "text-orange-700" : "text-gray-600"}`}>
                      /year
                    </span>
                    {tier.monthlyPrice && (
                      <p className={`text-xs mt-1 ${tier.highlight ? "text-orange-700" : "text-gray-500"}`}>
                        {tier.monthlyPrice > 0 ? `₹${tier.monthlyPrice.toFixed(0)}/mo avg` : ""}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* CTA */}
              <button
                className={`w-full py-3 rounded-lg font-black mb-6 transition-all ${
                  tier.highlight
                    ? "bg-orange-600 text-white hover:bg-orange-700 shadow-lg"
                    : "border-2 border-orange-500 text-orange-600 hover:bg-orange-50"
                }`}
              >
                {tier.cta}
              </button>

              {/* Features */}
              <ul className="space-y-2">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className={`text-sm flex items-start gap-2 ${tier.highlight ? "text-orange-900" : "text-gray-700"}`}>
                    <span className="text-orange-500 font-black flex-shrink-0">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Add-ons Section */}
      <div className="max-w-4xl mx-auto mb-20">
        <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">
          Add-ons (Work with any plan)
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {ADD_ONS.map((addon) => (
            <div key={addon.id} className="border-2 border-gray-200 rounded-2xl p-6 bg-white hover:shadow-md transition-all">
              <h3 className="text-xl font-black text-gray-900 mb-2">
                {addon.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{addon.description}</p>
              <div className="mb-4">
                <span className="text-3xl font-black text-orange-600">
                  ₹{addon.price}
                </span>
              </div>
              <ul className="space-y-1 mb-4">
                {addon.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-orange-500 flex-shrink-0">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-2 rounded-lg border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-bold text-sm transition-all">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Referral Info */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 mb-20">
        <h2 className="text-2xl font-black text-green-900 mb-4">
          🎁 Referral Rewards (Time-Based Only)
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-black text-green-900 mb-3">How it works:</h3>
            <ul className="space-y-2 text-green-800">
              <li className="flex items-start gap-2">
                <span className="font-black">1.</span>
                <span>Get your unique referral code</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-black">2.</span>
                <span>Share with friends</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-black">3.</span>
                <span>Friend purchases ANY plan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-black">4.</span>
                <span>You earn 1 free month (max 5 months)</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-black text-green-900 mb-3">What you get:</h3>
            <div className="bg-white rounded-lg p-4 border-2 border-green-200">
              <p className="text-sm text-green-900 mb-2">
                <span className="font-black">Free Premium Access</span> (time-based only)
              </p>
              <ul className="space-y-1 text-sm text-green-800">
                <li>✓ 1 month free per successful referral</li>
                <li>✓ Maximum 5 months total</li>
                <li>✓ No monetary payouts</li>
                <li>✓ Applied to your active subscription</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {[
            {
              q: "Can I switch plans?",
              a: "Yes! Upgrade anytime. Downgrade at end of billing period. No lock-in on monthly plans.",
            },
            {
              q: "What payment methods do you accept?",
              a: "Credit/debit cards, UPI, net banking, and wallet via Razorpay. Full encryption, no data stored.",
            },
            {
              q: "Is there a refund policy?",
              a: "Yes. Full refund within 7 days of first payment if you're not satisfied. No questions asked.",
            },
            {
              q: "What's the difference between bundles?",
              a: "All bundles have the same features. Monthly is flexible; longer terms save more money. Pick based on your prep timeline.",
            },
            {
              q: "Do referral rewards expire?",
              a: "Free months are applied immediately to your subscription and extend your access by that duration.",
            },
          ].map((faq, idx) => (
            <div key={idx} className="border-2 border-gray-200 rounded-lg p-6 bg-white">
              <h3 className="font-black text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="max-w-4xl mx-auto text-center mt-16">
        <p className="text-gray-600 mb-6">
          Ready to start? No credit card required to try free.
        </p>
        <button className="px-8 py-4 bg-orange-600 text-white font-black text-lg rounded-xl hover:bg-orange-700 transition-all shadow-lg">
          Get Started Free
        </button>
      </div>
    </div>
  );
}
