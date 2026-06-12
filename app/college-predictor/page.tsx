"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicNav } from "../components/PublicNav";

// CUET admissions: central universities allot UG seats on normalized CUET
// score / percentile via portals like DU-CSAS. Cutoffs below are an INDICATIVE
// dataset (normalized-score percentile equivalents) based on 2024 admissions.
interface ProgrammeCutoff {
  institute: string;
  type: "Central" | "State" | "Deemed";
  city: string;
  branch: string; // programme
  stream: ProgrammeStream;
  general: number;
  obc: number;
  sc: number;
  st: number;
  ews: number;
  tier: 1 | 2 | 3;
}

type ProgrammeStream = "commerce" | "economics" | "humanities" | "science" | "english" | "polsci";

const CUTOFFS: ProgrammeCutoff[] = [
  // ── Delhi University (CSAS) — flagship colleges ──
  { institute: "SRCC, Delhi University", type: "Central", city: "Delhi", branch: "B.Com (Hons)", stream: "commerce", general: 99.6, obc: 98.8, sc: 96.5, st: 94.0, ews: 99.2, tier: 1 },
  { institute: "SRCC, Delhi University", type: "Central", city: "Delhi", branch: "B.A. (Hons) Economics", stream: "economics", general: 99.7, obc: 99.0, sc: 96.8, st: 94.5, ews: 99.4, tier: 1 },
  { institute: "Hindu College, Delhi University", type: "Central", city: "Delhi", branch: "B.A. (Hons) Economics", stream: "economics", general: 99.5, obc: 98.6, sc: 96.0, st: 93.5, ews: 99.1, tier: 1 },
  { institute: "Hindu College, Delhi University", type: "Central", city: "Delhi", branch: "B.A. (Hons) Political Science", stream: "polsci", general: 99.2, obc: 98.2, sc: 95.4, st: 92.6, ews: 98.8, tier: 1 },
  { institute: "St. Stephen's College, Delhi University", type: "Central", city: "Delhi", branch: "B.A. (Hons) English", stream: "english", general: 99.4, obc: 98.5, sc: 95.8, st: 93.0, ews: 99.0, tier: 1 },
  { institute: "Hansraj College, Delhi University", type: "Central", city: "Delhi", branch: "B.Com (Hons)", stream: "commerce", general: 99.1, obc: 98.1, sc: 95.0, st: 92.0, ews: 98.7, tier: 1 },
  { institute: "Hansraj College, Delhi University", type: "Central", city: "Delhi", branch: "B.Sc (Hons) Physics", stream: "science", general: 98.6, obc: 97.6, sc: 94.0, st: 90.5, ews: 98.2, tier: 1 },
  { institute: "Miranda House, Delhi University", type: "Central", city: "Delhi", branch: "B.A. (Hons) History", stream: "humanities", general: 99.0, obc: 98.0, sc: 95.2, st: 92.4, ews: 98.6, tier: 1 },
  { institute: "Miranda House, Delhi University", type: "Central", city: "Delhi", branch: "B.Sc (Hons) Chemistry", stream: "science", general: 98.4, obc: 97.4, sc: 93.6, st: 90.0, ews: 98.0, tier: 1 },
  { institute: "Lady Shri Ram College, Delhi University", type: "Central", city: "Delhi", branch: "B.A. (Hons) Economics", stream: "economics", general: 99.3, obc: 98.4, sc: 95.6, st: 92.8, ews: 98.9, tier: 1 },
  { institute: "Lady Shri Ram College, Delhi University", type: "Central", city: "Delhi", branch: "B.A. (Hons) Political Science", stream: "polsci", general: 99.0, obc: 98.0, sc: 95.0, st: 92.0, ews: 98.6, tier: 1 },

  // ── DU — tier 2 colleges ──
  { institute: "Kirori Mal College, Delhi University", type: "Central", city: "Delhi", branch: "B.Com (Hons)", stream: "commerce", general: 98.2, obc: 97.0, sc: 93.0, st: 89.0, ews: 97.8, tier: 2 },
  { institute: "Ramjas College, Delhi University", type: "Central", city: "Delhi", branch: "B.A. (Hons) History", stream: "humanities", general: 97.8, obc: 96.6, sc: 92.4, st: 88.4, ews: 97.4, tier: 2 },
  { institute: "Gargi College, Delhi University", type: "Central", city: "Delhi", branch: "B.A. (Hons) English", stream: "english", general: 97.4, obc: 96.2, sc: 91.8, st: 87.8, ews: 97.0, tier: 2 },
  { institute: "Deshbandhu College, Delhi University", type: "Central", city: "Delhi", branch: "B.Sc (Hons) Mathematics", stream: "science", general: 96.8, obc: 95.6, sc: 90.8, st: 86.8, ews: 96.4, tier: 2 },

  // ── Banaras Hindu University (BHU) ──
  { institute: "Banaras Hindu University", type: "Central", city: "Varanasi", branch: "B.Com (Hons)", stream: "commerce", general: 97.0, obc: 95.8, sc: 91.2, st: 87.0, ews: 96.6, tier: 2 },
  { institute: "Banaras Hindu University", type: "Central", city: "Varanasi", branch: "B.A. (Hons) Economics", stream: "economics", general: 97.2, obc: 96.0, sc: 91.6, st: 87.4, ews: 96.8, tier: 2 },
  { institute: "Banaras Hindu University", type: "Central", city: "Varanasi", branch: "B.Sc (Hons) Biology", stream: "science", general: 96.0, obc: 94.6, sc: 89.6, st: 85.2, ews: 95.6, tier: 2 },
  { institute: "Banaras Hindu University", type: "Central", city: "Varanasi", branch: "B.A. (Hons) Political Science", stream: "polsci", general: 96.4, obc: 95.0, sc: 90.2, st: 86.0, ews: 96.0, tier: 2 },

  // ── Jamia Millia Islamia ──
  { institute: "Jamia Millia Islamia", type: "Central", city: "Delhi", branch: "B.A. (Hons) English", stream: "english", general: 96.5, obc: 95.2, sc: 90.4, st: 86.2, ews: 96.1, tier: 2 },
  { institute: "Jamia Millia Islamia", type: "Central", city: "Delhi", branch: "B.Com (Hons)", stream: "commerce", general: 96.2, obc: 94.8, sc: 90.0, st: 85.8, ews: 95.8, tier: 2 },
  { institute: "Jamia Millia Islamia", type: "Central", city: "Delhi", branch: "B.A. (Hons) History", stream: "humanities", general: 95.6, obc: 94.2, sc: 89.2, st: 84.8, ews: 95.2, tier: 2 },

  // ── Aligarh Muslim University (AMU) ──
  { institute: "Aligarh Muslim University", type: "Central", city: "Aligarh", branch: "B.Com (Hons)", stream: "commerce", general: 95.4, obc: 94.0, sc: 88.8, st: 84.4, ews: 95.0, tier: 2 },
  { institute: "Aligarh Muslim University", type: "Central", city: "Aligarh", branch: "B.Sc (Hons) Physics", stream: "science", general: 94.6, obc: 93.2, sc: 87.8, st: 83.4, ews: 94.2, tier: 3 },
  { institute: "Aligarh Muslim University", type: "Central", city: "Aligarh", branch: "B.A. (Hons) Political Science", stream: "polsci", general: 94.8, obc: 93.4, sc: 88.0, st: 83.6, ews: 94.4, tier: 3 },

  // ── Jawaharlal Nehru University (JNU) — UG ──
  { institute: "Jawaharlal Nehru University", type: "Central", city: "Delhi", branch: "B.A. (Hons) Foreign Languages", stream: "humanities", general: 96.8, obc: 95.4, sc: 90.6, st: 86.4, ews: 96.4, tier: 2 },
  { institute: "Jawaharlal Nehru University", type: "Central", city: "Delhi", branch: "B.A. (Hons) Economics", stream: "economics", general: 96.6, obc: 95.2, sc: 90.4, st: 86.2, ews: 96.2, tier: 2 },

  // ── University of Allahabad ──
  { institute: "University of Allahabad", type: "Central", city: "Prayagraj", branch: "B.Com", stream: "commerce", general: 93.8, obc: 92.2, sc: 86.6, st: 82.0, ews: 93.4, tier: 3 },
  { institute: "University of Allahabad", type: "Central", city: "Prayagraj", branch: "B.A. (Hons) History", stream: "humanities", general: 93.2, obc: 91.6, sc: 86.0, st: 81.4, ews: 92.8, tier: 3 },
  { institute: "University of Allahabad", type: "Central", city: "Prayagraj", branch: "B.Sc Mathematics", stream: "science", general: 92.6, obc: 91.0, sc: 85.2, st: 80.6, ews: 92.2, tier: 3 },

  // ── Other central / state options ──
  { institute: "University of Hyderabad", type: "Central", city: "Hyderabad", branch: "Integrated M.Sc Chemistry", stream: "science", general: 95.0, obc: 93.6, sc: 88.4, st: 84.0, ews: 94.6, tier: 2 },
  { institute: "Jadavpur University", type: "State", city: "Kolkata", branch: "B.A. (Hons) English", stream: "english", general: 96.0, obc: 94.6, sc: 89.6, st: 85.2, ews: 95.6, tier: 2 },
  { institute: "Tezpur University", type: "Central", city: "Tezpur", branch: "B.Sc (Hons) Physics", stream: "science", general: 90.4, obc: 88.8, sc: 82.8, st: 78.0, ews: 90.0, tier: 3 },
  { institute: "Central University of Rajasthan", type: "Central", city: "Ajmer", branch: "B.A. (Hons) Economics", stream: "economics", general: 89.6, obc: 88.0, sc: 81.8, st: 77.0, ews: 89.2, tier: 3 },
];

type Category = "general" | "obc" | "sc" | "st" | "ews";
type StreamFilter = "any" | ProgrammeStream;

const CATEGORY_LABELS: Record<Category, string> = {
  general: "General",
  obc: "OBC-NCL",
  sc: "SC",
  st: "ST",
  ews: "EWS",
};

const STREAM_LABELS: Record<StreamFilter, string> = {
  any: "Any",
  commerce: "Commerce",
  economics: "Economics",
  english: "English",
  humanities: "Humanities",
  polsci: "Pol. Science",
  science: "Science",
};

const TIER_LABELS: Record<1 | 2 | 3, string> = {
  1: "Tier 1",
  2: "Tier 2",
  3: "Tier 3",
};

const TYPE_COLORS: Record<string, string> = {
  Central: "bg-blue-50 text-blue-700",
  State: "bg-purple-50 text-purple-700",
  Deemed: "bg-amber-50 text-amber-700",
};

function getCutoffForCategory(row: ProgrammeCutoff, cat: Category): number {
  return row[cat];
}

function getStatus(userPct: number, closing: number): "qualify" | "borderline" | "below" {
  const diff = userPct - closing;
  if (diff >= 0) return "qualify";
  if (diff >= -1) return "borderline";
  return "below";
}

function sortScore(userPct: number, closing: number): number {
  const diff = userPct - closing;
  if (diff >= 0) return 1000 + diff;
  if (diff >= -1) return 500 + diff;
  return diff;
}

export default function CollegePredictorPage() {
  const [percentile, setPercentile] = useState<number>(95);
  const [percentileInput, setPercentileInput] = useState<string>("95");
  const [category, setCategory] = useState<Category>("general");
  const [stream, setStream] = useState<StreamFilter>("any");

  function handlePercentileInput(val: string) {
    setPercentileInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setPercentile(num);
    }
  }

  function handleSlider(val: number) {
    setPercentile(val);
    setPercentileInput(String(val));
  }

  const filtered = CUTOFFS.filter((row) => {
    if (stream === "any") return true;
    return row.stream === stream;
  });

  const withStatus = filtered.map((row) => {
    const closing = getCutoffForCategory(row, category);
    const status = getStatus(percentile, closing);
    const score = sortScore(percentile, closing);
    const diff = percentile - closing;
    return { ...row, closing, status, score, diff };
  });

  withStatus.sort((a, b) => b.score - a.score);

  const results = withStatus.slice(0, 20);

  const qualifyCount = withStatus.filter((r) => r.status === "qualify").length;
  const borderlineCount = withStatus.filter((r) => r.status === "borderline").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Input card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">&#127891;</span>
            <div>
              <h2 className="text-lg font-black text-gray-900">CUET UG College Predictor</h2>
              <p className="text-xs text-gray-400">
                Indicative central-university cutoffs, based on 2024 admissions
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-5">
            {/* Percentile */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Your CUET Normalized Score (percentile)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={0.01}
                  value={percentile}
                  onChange={(e) => handleSlider(parseFloat(e.target.value))}
                  className="flex-1 accent-orange-500 h-2"
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  value={percentileInput}
                  onChange={(e) => handlePercentileInput(e.target.value)}
                  className="w-24 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-900 text-center focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0</span>
                <span className="font-bold text-orange-500">{percentile.toFixed(2)} percentile</span>
                <span>100</span>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      category === cat
                        ? "bg-orange-500 text-white shadow-md shadow-orange-100"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
            </div>

            {/* Programme stream */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Programme Preference
              </label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(STREAM_LABELS) as StreamFilter[]).map((b) => (
                  <button
                    key={b}
                    onClick={() => setStream(b)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      stream === b
                        ? "bg-orange-500 text-white shadow-md shadow-orange-100"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {STREAM_LABELS[b]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary bar */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-green-700">{qualifyCount}</div>
            <div className="text-xs text-green-600 font-semibold mt-0.5">You Qualify</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-yellow-700">{borderlineCount}</div>
            <div className="text-xs text-yellow-600 font-semibold mt-0.5">Borderline</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-gray-700">{withStatus.length - qualifyCount - borderlineCount}</div>
            <div className="text-xs text-gray-500 font-semibold mt-0.5">Below Cutoff</div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-3">
          <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest">
            Top 20 Results — sorted by chance
          </h3>

          {results.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-400">
              No programmes match your filter. Try &quot;Any&quot; to see all options.
            </div>
          ) : (
            results.map((row, i) => {
              const statusColors = {
                qualify: "border-green-200 bg-green-50",
                borderline: "border-yellow-200 bg-yellow-50",
                below: "border-gray-200 bg-white",
              };
              const badgeColors = {
                qualify: "bg-green-100 text-green-700",
                borderline: "bg-yellow-100 text-yellow-700",
                below: "bg-gray-100 text-gray-500",
              };
              const badgeText = {
                qualify: "You qualify",
                borderline: "Borderline",
                below: "Below cutoff",
              };
              const diffText =
                row.diff >= 0
                  ? `+${row.diff.toFixed(2)}`
                  : `${row.diff.toFixed(2)}`;

              return (
                <div
                  key={`${row.institute}-${row.branch}-${i}`}
                  className={`rounded-2xl border p-5 transition-all ${statusColors[row.status]}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-base font-black text-gray-900">
                          {row.institute}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[row.type]}`}>
                          {row.type}
                        </span>
                        <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {TIER_LABELS[row.tier]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 font-medium">{row.branch}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{row.city}</p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 shrink-0">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${badgeColors[row.status]}`}>
                        {row.status === "qualify" ? "✓ " : row.status === "borderline" ? "~ " : "✗ "}
                        {badgeText[row.status]}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-600">
                    <span>
                      Closing cutoff:{" "}
                      <span className="font-bold text-gray-800">{row.closing.toFixed(2)}%</span>
                    </span>
                    <span>
                      Your percentile:{" "}
                      <span className="font-bold text-gray-800">{percentile.toFixed(2)}%</span>
                    </span>
                    <span>
                      Gap:{" "}
                      <span
                        className={`font-bold ${
                          row.diff >= 0 ? "text-green-700" : row.diff >= -1 ? "text-yellow-700" : "text-red-600"
                        }`}
                      >
                        {diffText}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Disclaimer */}
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 text-xs text-orange-800 leading-relaxed">
          <span className="font-bold">Disclaimer:</span> This is an indicative dataset of CUET-based
          central and state university programmes with approximate normalized-score cutoffs, based on
          2024 admissions. Actual admission cutoffs are decided each year by each university&rsquo;s
          counselling process (e.g. DU-CSAS) and vary by category, college and programme. Always check
          the official admission portal of the university you are applying to.
        </div>

        {/* CTA */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
          <h3 className="font-black text-gray-900 text-lg mb-1">
            Want to hit that target percentile?
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            10minCUET tracks your Bloom level per sub-concept. Know exactly what to fix.
          </p>
          <Link
            href="/register"
            className="inline-block bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-all text-sm shadow-md shadow-orange-100"
          >
            Start Free &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
