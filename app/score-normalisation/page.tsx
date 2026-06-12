import type { Metadata } from "next";
import Link from "next/link";
import NormalisationCalculator from "./NormalisationCalculator";
import { PublicNav } from "../components/PublicNav";

export const metadata: Metadata = {
  title: "NTA Normalisation Explained — CUET UG Percentile Calculation",
  description:
    "Understand how NTA normalises CUET UG scores across sessions and shifts. Learn why your 180 and your friend's 180 can give different percentiles. Historical cutoffs 2021–2024.",
  openGraph: {
    title: "NTA Normalisation Explained",
    description:
      "Plain-language breakdown of how NTA calculates your CUET UG percentile. Includes interactive calculator and historical cutoff data.",
    url: "/score-normalisation",
  },
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const HISTORICAL_CUTOFFS = [
  { year: "2024", session: "Jan", advancedCutoff: 89.7, rank1: 310 },
  { year: "2024", session: "April", advancedCutoff: 93.2, rank1: 318 },
  { year: "2023", session: "Jan", advancedCutoff: 90.0, rank1: 360 },
  { year: "2023", session: "April", advancedCutoff: 90.7, rank1: 350 },
  { year: "2022", session: "Jan", advancedCutoff: 88.4, rank1: 343 },
  { year: "2022", session: "April", advancedCutoff: 87.9, rank1: 296 },
  { year: "2021", session: "Feb", advancedCutoff: 87.9, rank1: 300 },
  { year: "2021", session: "March", advancedCutoff: 87.9, rank1: 300 },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ScoreNormalisationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Section 1 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-black text-gray-900 text-base mb-3">
            What is NTA normalisation?
          </h2>
          <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
            <p>
              CUET UG is held in multiple sessions (January and April) and multiple shifts
              per session. Each shift has a different question paper. Some shifts are harder
              than others.
            </p>
            <p>
              <strong className="text-gray-900">NTA normalisation</strong> is the process
              of adjusting raw scores to account for this difficulty difference. The goal is
              to make sure a student in a hard shift is not penalised compared to a student
              in an easier shift.
            </p>
            <p>
              The result is a <strong className="text-gray-900">percentile score</strong>,
              not a raw mark. Your percentile tells NTA where you rank among all candidates
              who appeared in your session.
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-black text-gray-900 text-base mb-3">
            Why your friend&apos;s 180 and your 180 can give different percentiles
          </h2>
          <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
            <p>
              Suppose you both scored 180. If your shift was harder (tougher questions,
              lower average marks), your raw 180 places you higher relative to others in
              your shift. NTA rewards this.
            </p>
            <p>
              If your friend&apos;s shift was easier and the average score was higher, their
              180 places them lower within their shift. Their percentile comes out lower
              even though the raw number is the same.
            </p>
            <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 mt-2">
              <p className="text-sm font-semibold text-orange-800">
                Key takeaway: compare percentiles, not raw scores.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive calculator (client component) */}
        <NormalisationCalculator />

        {/* Section 3: Historical cutoffs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-black text-gray-900 text-base mb-4">
            Historical CUET Advanced cutoffs (General category)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 pr-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Year</th>
                  <th className="text-left py-2 pr-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Session</th>
                  <th className="text-right py-2 pr-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Advanced cutoff %ile</th>
                  <th className="text-right py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">AIR 1 score</th>
                </tr>
              </thead>
              <tbody>
                {HISTORICAL_CUTOFFS.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-gray-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    <td className="py-2.5 pr-4 font-bold text-gray-900">{row.year}</td>
                    <td className="py-2.5 pr-4 text-gray-600">{row.session}</td>
                    <td className="py-2.5 pr-4 text-right font-bold text-orange-600">{row.advancedCutoff}</td>
                    <td className="py-2.5 text-right text-gray-600">{row.rank1}/360</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Source: NTA official result data. Cutoffs vary by category; table shows General (UR) only.
          </p>
        </div>

        {/* Section 4: Key insight */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-2xl p-6">
          <h2 className="font-black text-gray-900 text-base mb-3">
            Key insight: April is typically harder to crack
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              More students appear in the April session because it&apos;s the last chance
              before counselling. Higher participation + more preparation time = higher
              competition.
            </p>
            <p>
              This means the same raw score often yields a <strong className="text-gray-900">lower percentile in April</strong> compared to January — even after normalisation, because the raw score distribution is compressed at the top.
            </p>
            <p>
              <strong className="text-gray-900">Strategy:</strong> Use January as a baseline
              attempt. Analyse gaps. Grind hard for 3–4 months. Attack April for your best
              percentile.
            </p>
          </div>
        </div>

        {/* CTA links */}
        <div className="flex flex-wrap gap-3 justify-center pb-4">
          <Link
            href="/predictor"
            className="text-sm font-semibold text-orange-500 hover:text-orange-600"
          >
            ← Estimate your percentile
          </Link>
          <span className="text-gray-200">·</span>
          <Link href="/topics" className="text-sm text-gray-400 hover:text-gray-600">
            Back to topics
          </Link>
        </div>
      </div>
    </div>
  );
}
