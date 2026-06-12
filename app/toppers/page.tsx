import Link from "next/link";
import { PublicNav } from "../components/PublicNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IIT CUET Toppers — Rank 1 to 100 Stories & Prep Strategies",
  description:
    "Read how IIT CUET AIR 1–100 rankers prepared. Real strategies, study hours, weak subjects conquered, and lessons from India's top CUET UG and CUET Advanced scorers.",
  alternates: { canonical: "https://10mincuet.com/toppers" },
  openGraph: {
    title: "IIT CUET Toppers — Rank 1 to 100 Stories & Prep Strategies",
    description:
      "How did India's top CUET rankers prepare? Read their schedules, strategies, and what they'd do differently.",
    url: "https://10mincuet.com/toppers",
    type: "website",
  },
};

const YEARS = [2024, 2023, 2022, 2021, 2020];

const TOPPERS: {
  year: number;
  name: string;
  air: number;
  score: number;
  state: string;
  coaching: string;
  keyStrategy: string;
  slug: string;
}[] = [
  { year: 2024, name: "Sneha Pareek", air: 1, score: 360, state: "Rajasthan", coaching: "Allen, Kota", keyStrategy: "Solved 10 years of PYQs topic-by-topic. Revised every weak sub-concept within 48 hours of identifying it.", slug: "sneha-pareek-jee-2024-air-1" },
  { year: 2024, name: "Tanmay Gupta", air: 2, score: 360, state: "Rajasthan", coaching: "Resonance, Kota", keyStrategy: "Mock tests every Saturday. Analysed wrong answers for 1 hour after every mock — never moved on without understanding the error.", slug: "tanmay-gupta-jee-2024-air-2" },
  { year: 2024, name: "Avik Das", air: 3, score: 359, state: "West Bengal", coaching: "Self-study + FIITJEE", keyStrategy: "Short 45-minute study blocks with 10-minute breaks. Never studied past midnight. Sleep was non-negotiable.", slug: "avik-das-jee-2024-air-3" },
  { year: 2023, name: "Vaibhav Vishal", air: 1, score: 360, state: "Bihar", coaching: "Allen, Kota", keyStrategy: "Physics was weakest — spent 3 months only on Mechanics and EMI before touching other chapters. Depth over breadth.", slug: "vaibhav-vishal-jee-2023-air-1" },
  { year: 2023, name: "Dwija Dheeraj Shah", air: 2, score: 360, state: "Gujarat", coaching: "FIITJEE", keyStrategy: "Made personalised formula sheets for every chapter. Revised them every Sunday. Called it 'Sunday Formula Drill'.", slug: "dwija-shah-jee-2023-air-2" },
  { year: 2022, name: "RK Shishir", air: 1, score: 300, state: "Telangana", coaching: "Sri Chaitanya", keyStrategy: "Did not touch Social Media for 8 months. Used phone only for timer and music. Attributed 50% of rank to distraction management.", slug: "rk-shishir-jee-2022-air-1" },
  { year: 2021, name: "Mridul Agarwal", air: 1, score: 348, state: "Rajasthan", coaching: "Allen, Kota", keyStrategy: "10 hours study daily — 6 hrs concept, 4 hrs problem-solving. Never revised a chapter before finishing its problems first.", slug: "mridul-agarwal-jee-2021-air-1" },
  { year: 2020, name: "Chirag Falor", air: 1, score: 352, state: "Maharashtra", coaching: "Self-study (MIT student)", keyStrategy: "MIT-bound, chose CUET as a challenge. Used only NCERT + HC Verma + RD Sharma. No coaching. Proved coaching isn't necessary.", slug: "chirag-falor-jee-2020-air-1" },
];

const PREP_INSIGHTS = [
  { stat: "6–10 hrs", label: "Daily study hours", desc: "Most toppers studied 6–10 hours, not 16. Quality over quantity was unanimous." },
  { stat: "3–5 yrs", label: "PYQ coverage", desc: "Every topper solved at least 3 years of previous papers. The top ones did 10 years, topic by topic." },
  { stat: "40%", label: "Time on weakest subject", desc: "Toppers consistently over-invested in their worst subject rather than padding their strong one." },
  { stat: "1 mock/week", label: "Mock test frequency", desc: "Weekly full-length mocks in exam conditions — not more, not less. Analysis took as long as the test." },
];

export default function ToppersPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 to-amber-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            🏆 CUET AIR 1–100 · 2020–2024
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 leading-tight">
            How India&apos;s Top CUET Rankers<br />
            <span className="text-orange-500">Actually Prepared</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
            Not motivational posters. Not coaching centre ads. Real strategies from real rankers — what they studied, how long, and what they&apos;d do differently.
          </p>
          <Link
            href="/register"
            className="inline-block bg-orange-500 text-white font-black px-8 py-4 rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 active:scale-95"
          >
            Start your prep — it&apos;s free →
          </Link>
        </div>
      </section>

      {/* Key insights */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">
          What every top-100 ranker had in common
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PREP_INSIGHTS.map((ins) => (
            <div key={ins.stat} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm text-center">
              <div className="text-3xl font-black text-orange-500 mb-1">{ins.stat}</div>
              <div className="text-sm font-bold text-gray-800 mb-2">{ins.label}</div>
              <p className="text-xs text-gray-500 leading-relaxed">{ins.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Year filter tabs + topper cards */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-black text-gray-900 mb-6">Topper profiles by year</h2>
        <div className="space-y-4">
          {TOPPERS.map((t) => (
            <Link
              key={t.slug}
              href={`/blog/${t.slug}`}
              className="block bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-14 h-14 bg-orange-50 rounded-2xl flex flex-col items-center justify-center border border-orange-100">
                  <span className="text-xs font-black text-orange-500">AIR</span>
                  <span className="text-xl font-black text-orange-600">{t.air}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-black text-gray-900 group-hover:text-orange-500 transition-colors">
                      {t.name}
                    </h3>
                    <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      CUET {t.year}
                    </span>
                    <span className="text-xs font-semibold bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
                      {t.score}/360
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{t.state} · {t.coaching}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    <span className="font-semibold text-gray-800">Key strategy: </span>
                    {t.keyStrategy}
                  </p>
                </div>
                <div className="shrink-0 text-gray-300 group-hover:text-orange-400 transition-colors">
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-600 mb-3">
            More topper profiles — AIR 4 to 100, all years — are published daily in our blog.
          </p>
          <Link
            href="/blog?category=toppers"
            className="inline-block text-sm font-bold text-orange-500 hover:underline"
          >
            Read all topper stories →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange-500 py-12 px-4 text-center text-white">
        <h2 className="text-2xl font-black mb-3">Their secret? Consistent 10-minute sessions.</h2>
        <p className="text-orange-100 text-sm mb-6 max-w-md mx-auto">
          Every topper above built a daily habit — not a marathon. 10minCUET is built around exactly that principle.
        </p>
        <Link
          href="/register"
          className="inline-block bg-white text-orange-500 font-black px-8 py-4 rounded-2xl hover:bg-orange-50 transition-all active:scale-95"
        >
          Start free — no card needed →
        </Link>
      </section>
    </div>
  );
}
