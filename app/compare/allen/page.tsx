import { BASE_URL } from "@/app/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "10minCUET vs Allen Kota — CUET Prep Comparison 2026",
  description:
    "10minCUET vs Allen Kota for CUET UG 2025. Compare price (₹999/yr vs ₹80,000–1.2L/yr), format (10 min/day vs 8hr classroom), Bloom tracking, and parent visibility. Honest breakdown.",
  alternates: { canonical: `${BASE_URL}/compare/allen` },
  openGraph: {
    type: "website",
    url: `${BASE_URL}/compare/allen`,
    title: "10minCUET vs Allen Kota — CUET Prep Comparison 2026",
    description:
      "Price, format, Bloom tracking, and parent visibility compared. Honest breakdown for CUET UG 2025 students.",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is 10minCUET better than Allen Kota for CUET UG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "They are fundamentally different products. Allen Kota delivers teacher-led instruction, live doubt-clearing, structured daily schedules, and an intense peer competition environment. 10minCUET delivers daily Bloom-level mastery tracking per sub-concept in 10 minutes a day — no teachers, no live classes. Allen is the right choice if you need structure, live faculty, and peer benchmarking. 10minCUET is the right complement if you need daily calibration on which specific sub-concepts are below the Apply level that CUET UG requires.",
      },
    },
    {
      "@type": "Question",
      name: "How much does Allen Kota cost compared to 10minCUET?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Allen Kota's classroom courses for two-year CUET preparation range from ₹80,000 to ₹1.2 lakh per year in tuition fees alone, not including hostel (₹8,000–15,000/month) and living expenses. Total two-year cost for a residential Kota student often exceeds ₹4–5 lakh. 10minCUET's annual plan costs ₹999 — approximately 1–2% of the equivalent Allen cost. These are not direct substitutes — Allen delivers full-syllabus instruction, 10minCUET delivers daily sub-concept mastery tracking.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use both Allen Kota and 10minCUET together?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — and this is one of the most effective combinations for Kota students. Use Allen for structured daily instruction and peer competition. After each Allen class, do a 10-minute 10minCUET session on the same sub-concept to verify whether today's lecture actually built Apply-level (L3) understanding. The Bloom-level update gives you real-time calibration that weekly Allen batch tests cannot provide at sub-concept granularity.",
      },
    },
  ],
};

const rows = [
  { feature: "Annual tuition cost", a: "₹999/year", b: "₹80,000–1.2L/year", winner: "a" as const },
  { feature: "Daily time commitment", a: "10 minutes", b: "8 hours (classroom)", winner: "a" as const },
  { feature: "Location required", a: "Anywhere — fully online", b: "Kota only (residential)", winner: "a" as const },
  { feature: "Format", a: "Adaptive Bloom-level quiz per sub-concept", b: "Classroom lectures + batch tests", winner: "tie" as const },
  { feature: "Bloom level tracking", a: "Per sub-concept, updated every session", b: "Not available", winner: "a" as const },
  { feature: "Live teacher interaction", a: "Not available", b: "Daily — experienced faculty", winner: "b" as const },
  { feature: "Doubt solving", a: "Not available", b: "Available — structured doubt sessions", winner: "b" as const },
  { feature: "Peer competition", a: "Not available", b: "Strong — daily batch ranking", winner: "b" as const },
  { feature: "Parent visibility", a: "Weekly Bloom report + parent account", b: "Periodic PTMs, batch rankings", winner: "a" as const },
  { feature: "Sub-concept weak spot detection", a: "Automatic, daily, per sub-concept", b: "Weekly batch test, batch-level only", winner: "a" as const },
  { feature: "College predictor + tools", a: "Free, built-in", b: "Available via Resonance/Allen portal", winner: "tie" as const },
  { feature: "Content coverage", a: "24 high-frequency topics", b: "Full CUET + Board syllabus", winner: "b" as const },
];

const body = [
  "Allen Career Institute is India's largest CUET coaching network, headquartered in Kota. It has produced an outsized share of top-100 AIR students over the past three decades. For students who thrive in structured, high-intensity peer environments — and whose families can manage the financial and logistical demands of Kota — Allen is a legitimate and proven pathway.",
  "The structural limitations of the Allen model are well-documented. First, cost: two years in Kota including hostel and living expenses typically exceeds ₹4–5 lakh. Second, attrition: a significant proportion of Kota students underperform relative to expectations, partly due to the emotional difficulty of relocating at 16, and partly because the batch model cannot personalise instruction to individual sub-concept gaps. Third, feedback lag: Allen's weekly batch tests give you a rank in the batch — not a sub-concept-level diagnosis of why you lost marks.",
  "10minCUET addresses the third limitation directly. The Bloom-level tracker runs after every 10-minute session — not once a week. It identifies, at the sub-concept level, whether today's study brought you from L2 (Understand) to L3 (Apply). An Allen student who does a 10-minute 10minCUET session after each day's class gets daily precision feedback that the batch system cannot provide.",
  "On parent visibility: Allen communicates through periodic Parent-Teacher Meetings and batch rankings. 10minCUET's parent dashboard shows a weekly Bloom level map per sub-concept — which specific topics are below L3, and how much progress has been made in the last 7 days. For parents who want granular visibility without waiting for the next PTM, this is a meaningful difference.",
  "The two platforms are not competitors in the conventional sense. Many of the most successful recent CUET candidates used both: Allen for structured instruction, intensive peer competition, and experienced faculty; 10minCUET for daily sub-concept mastery calibration. The 10 minutes after Allen class homework is not competing with Allen — it is making Allen more effective.",
];

export default function AllenComparePage() {
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
          10minCUET vs Allen Kota — CUET UG Prep Compared
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Allen Kota is India&apos;s largest CUET coaching institution. 10minCUET is a 10-minute
          daily Bloom-level mastery tracker. Here&apos;s an honest breakdown of what each does —
          and what it costs.
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
              Allen Kota
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
          <Link href="/compare/byjus" className="text-sm text-orange-500 border border-orange-200 px-4 py-2 rounded-full hover:bg-orange-50 transition-all">
            10minCUET vs BYJU&apos;S
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
            Add Daily Precision to Your CUET Prep — Start Free
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
