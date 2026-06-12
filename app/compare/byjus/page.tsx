import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "10minCUET vs BYJU'S — CUET Prep Comparison 2026",
  description:
    "10minCUET vs BYJU'S for CUET UG 2025. Compare price (₹2,499/yr vs ₹20,000–40,000/yr), format (10 min adaptive quiz vs app-based video lectures), Bloom tracking, and learning outcomes. Honest breakdown.",
  alternates: { canonical: "https://10mincuet.com/compare/byjus" },
  openGraph: {
    type: "website",
    url: "https://10mincuet.com/compare/byjus",
    title: "10minCUET vs BYJU'S — CUET Prep Comparison 2026",
    description:
      "Price, format, Bloom tracking, and learning outcomes compared. 10minCUET vs BYJU'S for CUET UG 2025 — honest breakdown.",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is 10minCUET better than BYJU'S for CUET UG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "They serve different functions. BYJU'S delivers video-based content — animated concept explanations, recorded lectures, and test series. 10minCUET delivers daily Bloom-level mastery tracking through 10-minute adaptive quiz sessions — no video content at all. BYJU'S is the right choice if you learn well from visual instruction and benefit from a structured content library. 10minCUET is the right complement if you need daily objective feedback on whether your understanding has reached the Apply level (L3) that CUET UG primarily tests.",
      },
    },
    {
      "@type": "Question",
      name: "How much does BYJU'S CUET preparation cost compared to 10minCUET?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "BYJU'S CUET preparation subscriptions typically range from ₹20,000 to ₹40,000 per year depending on the plan, course duration, and any bundled test series. 10minCUET's annual plan costs ₹2,499. The two platforms are not direct substitutes — BYJU'S delivers full-syllabus video content, 10minCUET delivers daily sub-concept mastery tracking. Many students use both.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use BYJU'S video lectures with 10minCUET?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — this is a practical and cost-effective combination. Watch BYJU'S animated lecture on a topic (for concept clarity and visual learning), then do a 10-minute 10minCUET session on the same sub-concept to test whether you've reached Bloom Level 3 (Apply). The quiz tells you whether the video actually built working Apply-level understanding, or whether you are still at L2 (Understand) — a common gap with video-based learning.",
      },
    },
  ],
};

const rows = [
  { feature: "Annual cost", a: "₹2,499/year", b: "₹20,000–40,000/year", winner: "a" as const },
  { feature: "Daily time commitment", a: "10 minutes", b: "30–90 min/session (video-based)", winner: "a" as const },
  { feature: "Format", a: "Adaptive Bloom-level quiz per sub-concept", b: "App-based animated video lectures", winner: "tie" as const },
  { feature: "Content type", a: "432 original Bloom-tagged questions", b: "Video lectures + test series", winner: "tie" as const },
  { feature: "Bloom level tracking", a: "Per sub-concept, updated every session", b: "Not available", winner: "a" as const },
  { feature: "Video content", a: "None", b: "Extensive animated library", winner: "b" as const },
  { feature: "Test series", a: "Full mock test (NTA format)", b: "Comprehensive test series", winner: "b" as const },
  { feature: "Location", a: "Anywhere — app or browser", b: "Anywhere — app-based", winner: "tie" as const },
  { feature: "Sub-concept weak spot detection", a: "Automatic, daily, per sub-concept", b: "Manual (interpret test result patterns)", winner: "a" as const },
  { feature: "Parent visibility", a: "Weekly Bloom report + parent account", b: "Available in some plans", winner: "a" as const },
  { feature: "Minimum session length", a: "10 minutes", b: "Typically 20–45 minutes per video", winner: "a" as const },
  { feature: "College predictor + tools", a: "Free, built-in", b: "Available in premium plans", winner: "tie" as const },
];

const body = [
  "BYJU'S became India's most-funded ed-tech company by delivering a fundamentally better video learning experience than textbooks — animated concept explanations, step-by-step problem walkthroughs, and a gamified app interface. For students who learn well from visual instruction and need concept-building support, BYJU'S offers a substantial content library.",
  "The well-documented limitation of video-based learning is the gap between watching and understanding. Educational research is clear on this point: passive watching — even of high-quality content — does not reliably produce Apply-level (L3) mastery. A student who watches BYJU'S entire Electrostatics module can still fail CUET questions on Gauss's Law because the questions require applying the concept to an unfamiliar configuration — not recalling what the video showed.",
  "10minCUET's Bloom-level quiz is designed to close this gap. After watching a BYJU'S lecture (or any content source), a 10-minute 10minCUET session tests whether you can actually apply what you just watched. If the quiz result is L2 (Understand), you know the video did not produce working Apply-level mastery on that sub-concept — and the next session serves L3 questions until it does.",
  "On pricing: BYJU'S CUET subscriptions range from ₹20,000 to ₹40,000 per year depending on plan and content bundle. 10minCUET's annual plan is ₹2,499. These are not comparable on content volume — BYJU'S delivers hundreds of hours of video. 10minCUET delivers 432 original Bloom-tagged questions across 24 high-frequency topics. The relevant comparison is: which platform is more effective at the specific job of daily sub-concept mastery tracking?",
  "For students who are already using BYJU'S: adding 10minCUET's 10-minute daily session after BYJU'S study is a practical, low-cost way to verify that content consumption is translating into Apply-level mastery — the minimum required for CUET UG marks.",
];

export default function ByjusComparePage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-black text-gray-900 text-lg">
            10min<span className="text-orange-500">CUET</span>
          </Link>
          <Link
            href="/register"
            className="bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-orange-600 transition-all"
          >
            Start Free →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-16 pb-10 text-center">
        <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-4">
          Comparison
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-6">
          10minCUET vs BYJU&apos;S — CUET UG Prep Compared
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          BYJU&apos;S is India&apos;s largest ed-tech platform, built on animated video lectures.
          10minCUET is a 10-minute daily Bloom-level mastery tracker — no video, only adaptive
          quizzes. Here&apos;s an honest comparison for CUET UG 2025 students.
        </p>
      </section>

      {/* Comparison table */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_1fr] bg-gray-50 border-b border-gray-100">
            <div className="p-4 text-sm font-black text-gray-500">Feature</div>
            <div className="p-4 text-sm font-black text-orange-600 border-l border-gray-100">
              10minCUET
            </div>
            <div className="p-4 text-sm font-black text-gray-700 border-l border-gray-100">
              BYJU&apos;S
            </div>
          </div>
          {rows.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-[1fr_1fr_1fr] border-b border-gray-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
            >
              <div className="p-4 text-sm text-gray-600 font-medium">{row.feature}</div>
              <div
                className={`p-4 text-sm border-l border-gray-100 ${row.winner === "a" ? "text-orange-600 font-bold" : "text-gray-600"}`}
              >
                {row.a}
                {row.winner === "a" && (
                  <span className="ml-1 text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-semibold">
                    ✓
                  </span>
                )}
              </div>
              <div
                className={`p-4 text-sm border-l border-gray-100 ${row.winner === "b" ? "text-gray-900 font-bold" : "text-gray-500"}`}
              >
                {row.b}
                {row.winner === "b" && (
                  <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full font-semibold">
                    ✓
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Body */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-black text-gray-900 mb-6">The full picture</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            {body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-black text-gray-900 mb-8">Frequently asked questions</h2>
        <div className="space-y-6">
          {faqJsonLd.mainEntity.map((faq) => (
            <div key={faq.name} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-black text-gray-900 mb-3">{faq.name}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{faq.acceptedAnswer.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Internal links */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <h2 className="text-lg font-black text-gray-900 mb-4">Related comparisons</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/compare/10mincuet-vs-unacademy" className="text-sm text-orange-500 border border-orange-200 px-4 py-2 rounded-full hover:bg-orange-50 transition-all">
            10minCUET vs Unacademy
          </Link>
          <Link href="/compare/10mincuet-vs-physics-wallah" className="text-sm text-orange-500 border border-orange-200 px-4 py-2 rounded-full hover:bg-orange-50 transition-all">
            10minCUET vs Physics Wallah
          </Link>
          <Link href="/compare/allen" className="text-sm text-orange-500 border border-orange-200 px-4 py-2 rounded-full hover:bg-orange-50 transition-all">
            10minCUET vs Allen Kota
          </Link>
          <Link href="/compare/10mincuet-vs-coaching" className="text-sm text-orange-500 border border-orange-200 px-4 py-2 rounded-full hover:bg-orange-50 transition-all">
            10minCUET vs Coaching Institutes
          </Link>
          <Link href="/methodology" className="text-sm text-orange-500 border border-orange-200 px-4 py-2 rounded-full hover:bg-orange-50 transition-all">
            Our Methodology
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange-500 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-black mb-4">
            Test if Your BYJU&apos;S Study Is Actually Working — Start Free
          </h2>
          <p className="text-orange-100 text-lg mb-8">
            One free diagnostic. No card needed. See your Bloom level in 10 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-block bg-white text-orange-500 font-black text-lg px-8 py-4 rounded-2xl hover:bg-orange-50 transition-all shadow-xl"
            >
              Start Free →
            </Link>
            <Link
              href="/pricing"
              className="inline-block border-2 border-white/50 text-white font-semibold text-lg px-8 py-4 rounded-2xl hover:border-white transition-all"
            >
              See Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center">
        <div className="max-w-5xl mx-auto px-4">
          <p className="font-black text-gray-900 text-lg mb-1">
            10min<span className="text-orange-500">CUET</span>
          </p>
          <div className="flex justify-center gap-4 mt-4 text-xs text-gray-400 flex-wrap">
            <Link href="/topics" className="hover:text-gray-600">Topics</Link>
            <span>·</span>
            <Link href="/pricing" className="hover:text-gray-600">Pricing</Link>
            <span>·</span>
            <Link href="/about" className="hover:text-gray-600">About</Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-gray-600">Contact</Link>
            <span>·</span>
            <Link href="/privacy-policy" className="hover:text-gray-600">Privacy</Link>
          </div>
          <p className="text-xs text-gray-300 mt-4">
            © 2025 EAZEALLIANCE SERVICES PRIVATE LIMITED. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
