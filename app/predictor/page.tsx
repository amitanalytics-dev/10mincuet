"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicNav } from "../components/PublicNav";

// ─── Data & logic ─────────────────────────────────────────────────────────────

const SCORE_PERCENTILE_TABLE: [number, number][] = [
  [360, 100.0], [310, 99.95], [290, 99.9], [270, 99.8],
  [250, 99.6], [235, 99.2], [220, 98.5], [205, 97.5],
  [190, 96.5], [175, 95.0], [160, 93.0], [145, 90.0],
  [130, 86.0], [115, 81.0], [100, 74.0], [85, 65.0],
  [70, 55.0], [55, 43.0], [40, 30.0], [25, 18.0],
  [10, 8.0], [0, 3.5], [-30, 1.0], [-90, 0.1],
];

export function scoreToPercentile(score: number): number {
  if (score >= 360) return 100;
  if (score <= -90) return 0.1;
  for (let i = 0; i < SCORE_PERCENTILE_TABLE.length - 1; i++) {
    const [s1, p1] = SCORE_PERCENTILE_TABLE[i];
    const [s2, p2] = SCORE_PERCENTILE_TABLE[i + 1];
    if (score >= s2 && score <= s1) {
      const t = (score - s2) / (s1 - s2);
      return Math.round((p2 + t * (p1 - p2)) * 10) / 10;
    }
  }
  return 0.1;
}

function percentileToRank(percentile: number): number {
  return Math.round(((100 - percentile) / 100) * 1100000);
}

const ADVANCED_CUTOFF = 93.0;

function getCollegeBand(percentile: number): { label: string; examples: string; color: string } {
  if (percentile >= 99.5) return { label: "Top DU Colleges — Flagship Programmes", examples: "SRCC Economics/B.Com, St. Stephen's, LSR", color: "text-purple-700 bg-purple-50" };
  if (percentile >= 99.0) return { label: "Top DU & Central University Honours", examples: "Hindu, Hansraj, Miranda House Honours", color: "text-blue-700 bg-blue-50" };
  if (percentile >= 98.0) return { label: "Strong DU Colleges", examples: "Kirori Mal, Ramjas, Gargi Honours", color: "text-green-700 bg-green-50" };
  if (percentile >= 96.0) return { label: "Central Universities — Popular Courses", examples: "BHU, Jamia, JNU UG Honours", color: "text-green-600 bg-green-50" };
  if (percentile >= 93.0) return { label: "Central Universities — Most Programmes", examples: "AMU, BHU, Allahabad Honours", color: "text-yellow-700 bg-yellow-50" };
  if (percentile >= 85.0) return { label: "State & Newer Central Universities", examples: "State universities, Tezpur, CU Rajasthan", color: "text-orange-600 bg-orange-50" };
  if (percentile >= 70.0) return { label: "State Universities — General Courses", examples: "State government degree colleges", color: "text-red-600 bg-red-50" };
  return { label: "Below most central-university cutoffs", examples: "Private universities, retake recommended", color: "text-red-700 bg-red-100" };
}

function getSessionStrategy(percentile: number, targetPercentile: number, weeksRemaining: number): string {
  const gap = targetPercentile - percentile;
  if (gap <= 0) return "You're already at or above your target. Attempt January to lock in your score.";
  if (gap <= 3 && weeksRemaining >= 16) return "Small gap. Attempt January for experience, target April for the actual score.";
  if (gap <= 5 && weeksRemaining >= 8) return "Achievable gap. Focus on weak topics for 6-8 weeks, then attempt.";
  if (gap > 10 && weeksRemaining < 12) return "Large gap with limited time. Use the upcoming session for practice, invest in the next cycle.";
  return "Keep grinding. 2-3 weak topics fixed = +3-5 percentile improvement.";
}

function formatRank(rank: number): string {
  if (rank >= 100000) return `~${(rank / 100000).toFixed(1)}L`;
  if (rank >= 1000) return `~${(rank / 1000).toFixed(1)}K`;
  return `~${rank}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PredictorPage() {
  const [score, setScore] = useState(175);
  const [scoreInput, setScoreInput] = useState("175");
  const [targetPercentile, setTargetPercentile] = useState(95);
  const [weeksRemaining, setWeeksRemaining] = useState(20);

  // Second calculator state
  const [percentileInput, setPercentileInput] = useState("95");

  const percentile = scoreToPercentile(score);
  const rank = percentileToRank(percentile);
  const band = getCollegeBand(percentile);
  const strategy = getSessionStrategy(percentile, targetPercentile, weeksRemaining);
  const advancedQualified = percentile >= ADVANCED_CUTOFF;

  const pctileRank = percentileToRank(Math.min(100, Math.max(0, parseFloat(percentileInput) || 0)));

  function handleScoreInput(val: string) {
    setScoreInput(val);
    const n = parseInt(val, 10);
    if (!isNaN(n) && n >= -90 && n <= 360) setScore(n);
  }

  function handleSlider(val: number) {
    setScore(val);
    setScoreInput(String(val));
  }

  return (
    <>
      {/* JSON-LD FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What percentile gets you into top central universities via CUET UG 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "A normalized CUET score around the 93rd percentile or higher opens up most central-university honours programmes; flagship DU colleges typically need 99+ percentile. Exact cutoffs vary each year by university, category and programme.",
                },
              },
              {
                "@type": "Question",
                name: "What score gives 99 percentile in CUET UG?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Approximately 230-250 out of 360 marks gives a 99 percentile in CUET UG, depending on the session difficulty and candidate pool.",
                },
              },
              {
                "@type": "Question",
                name: "How is CUET UG percentile calculated?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "NTA uses normalization across sessions: Percentile = (Number of candidates who scored equal to or less than you / Total candidates) × 100.",
                },
              },
            ],
          }),
        }}
      />

      <div className="min-h-screen bg-gray-50">
        <PublicNav />

        <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

          {/* ── Calculator 1: Score → Percentile */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-black text-gray-900 text-base mb-4">
              📊 CUET UG Score → Percentile
            </h2>

            <p className="text-xs text-gray-500 mb-2 font-medium">Enter your mock score</p>

            {/* Slider */}
            <input
              type="range"
              min={-90}
              max={360}
              step={1}
              value={score}
              onChange={(e) => handleSlider(parseInt(e.target.value))}
              className="w-full accent-orange-500 mb-3"
            />

            <div className="flex items-center gap-2 mb-5">
              <input
                type="number"
                value={scoreInput}
                min={-90}
                max={360}
                onChange={(e) => handleScoreInput(e.target.value)}
                className="w-28 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all text-center"
              />
              <span className="text-sm text-gray-400 font-medium">/ 360</span>
              <span className="text-xs text-gray-400 ml-auto">(range: −90 to 360)</span>
            </div>

            {/* Results row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {/* Percentile */}
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-center">
                <div className="text-3xl font-black text-orange-500 leading-none">
                  {percentile.toFixed(1)}
                </div>
                <div className="text-[10px] font-semibold text-orange-400 mt-1 uppercase tracking-wide">
                  Percentile
                </div>
              </div>

              {/* Rank */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
                <div className="text-3xl font-black text-gray-700 leading-none">
                  {formatRank(rank)}
                </div>
                <div className="text-[10px] font-semibold text-gray-400 mt-1 uppercase tracking-wide">
                  Est. Rank
                </div>
              </div>

              {/* Advanced */}
              <div
                className={`border rounded-2xl p-4 text-center ${
                  advancedQualified
                    ? "bg-green-50 border-green-100"
                    : "bg-red-50 border-red-100"
                }`}
              >
                <div className={`text-2xl font-black leading-none ${advancedQualified ? "text-green-600" : "text-red-500"}`}>
                  {advancedQualified ? "✓ Yes" : "✗ No"}
                </div>
                <div className={`text-[10px] font-semibold mt-1 uppercase tracking-wide ${advancedQualified ? "text-green-500" : "text-red-400"}`}>
                  Top University Range
                </div>
              </div>
            </div>

            {/* College band */}
            <div className={`rounded-xl px-4 py-3 ${band.color} mb-1`}>
              <p className="text-sm font-black">🎓 {band.label}</p>
              <p className="text-xs mt-0.5 opacity-80">{band.examples}</p>
            </div>

            {!advancedQualified && (
              <p className="text-xs text-gray-400 mt-2">
                Need {ADVANCED_CUTOFF}%ile for the top central-university range. Gap:{" "}
                <span className="font-bold text-red-500">
                  {(ADVANCED_CUTOFF - percentile).toFixed(1)} percentile points
                </span>
              </p>
            )}
          </div>

          {/* ── Session Strategy */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-black text-gray-900 text-base mb-4">
              📅 Session Strategy
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Target percentile
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={50}
                    max={100}
                    step={0.5}
                    value={targetPercentile}
                    onChange={(e) => setTargetPercentile(parseFloat(e.target.value))}
                    className="flex-1 accent-orange-500"
                  />
                  <span className="text-sm font-bold text-gray-800 w-14 text-right">
                    {targetPercentile.toFixed(1)}%ile
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Weeks to prepare
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={4}
                    max={40}
                    step={1}
                    value={weeksRemaining}
                    onChange={(e) => setWeeksRemaining(parseInt(e.target.value))}
                    className="flex-1 accent-orange-500"
                  />
                  <span className="text-sm font-bold text-gray-800 w-16 text-right">
                    {weeksRemaining} wks
                  </span>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
                <p className="text-sm font-semibold text-orange-800">→ {strategy}</p>
              </div>
            </div>
          </div>

          {/* ── Calculator 2: Percentile → Rank */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-black text-gray-900 text-base mb-1">
              🔢 Percentile → Rank
            </h2>
            <p className="text-xs text-gray-400 mb-4">Based on ~11 lakh total candidates</p>

            <div className="flex items-center gap-3 mb-4">
              <input
                type="number"
                value={percentileInput}
                min={0}
                max={100}
                step={0.1}
                onChange={(e) => setPercentileInput(e.target.value)}
                className="w-28 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all text-center"
              />
              <span className="text-sm text-gray-400 font-medium">percentile</span>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-gray-500">Approx. rank</span>
              <span className="text-2xl font-black text-gray-800">
                {formatRank(pctileRank)}
              </span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <p className="text-xs text-amber-700">
              <span className="font-bold">Disclaimer:</span> Percentile estimates based on CUET UG
              2023–2024 historical data. Actual percentiles vary by session, shift, and candidate
              pool. Use this as a reference, not a guarantee.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap gap-3 justify-center pb-4">
            <Link
              href="/score-normalisation"
              className="text-sm font-semibold text-orange-500 hover:text-orange-600"
            >
              How does NTA normalisation work? →
            </Link>
            <span className="text-gray-200">·</span>
            <Link href="/topics" className="text-sm text-gray-400 hover:text-gray-600">
              Back to topics
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
