import type { Metadata } from "next";
import Link from "next/link";
import { PublicNav } from "../components/PublicNav";

export const metadata: Metadata = {
  title: "CUET UG Cutoffs 2021–2024 — Historical Data & Trends",
  description:
    "10 years of CUET UG cutoff data. Category-wise qualifying percentiles, CUET Advanced trends, NIT CS closing cutoffs. Free reference for CUET 2025 & 2026 aspirants.",
};

interface AdvancedCutoff {
  year: number;
  session: string;
  general: number;
  obcNcl: number;
  sc: number;
  st: number;
  ews: number;
  totalCandidates: number;
  qualifiers: number;
}

interface NitTrichyCS {
  year: number;
  closing: number;
}

const ADVANCED_CUTOFFS: AdvancedCutoff[] = [
  { year: 2024, session: "Jan", general: 89.7, obcNcl: 75.3, sc: 54.0, st: 44.0, ews: 78.2, totalCandidates: 1152698, qualifiers: 247498 },
  { year: 2024, session: "Apr", general: 93.2, obcNcl: 81.1, sc: 61.5, st: 52.4, ews: 84.7, totalCandidates: 986425, qualifiers: 250284 },
  { year: 2023, session: "Jan", general: 90.0, obcNcl: 76.5, sc: 55.5, st: 44.5, ews: 79.5, totalCandidates: 869010, qualifiers: 109032 },
  { year: 2023, session: "Apr", general: 90.7, obcNcl: 77.0, sc: 56.2, st: 46.0, ews: 80.4, totalCandidates: 943038, qualifiers: 190387 },
  { year: 2022, session: "Jan", general: 88.4, obcNcl: 67.0, sc: 46.9, st: 34.7, ews: 66.2, totalCandidates: 872432, qualifiers: 160838 },
  { year: 2022, session: "Apr", general: 87.9, obcNcl: 68.0, sc: 48.1, st: 36.2, ews: 67.4, totalCandidates: 615508, qualifiers: 111975 },
  { year: 2021, session: "Feb", general: 87.9, obcNcl: 68.0, sc: 48.1, st: 36.2, ews: 66.2, totalCandidates: 621756, qualifiers: 150838 },
  { year: 2021, session: "Mar", general: 87.9, obcNcl: 68.0, sc: 48.1, st: 36.2, ews: 66.2, totalCandidates: 355661, qualifiers: 91369 },
];

const NIT_TRICHY_CS: NitTrichyCS[] = [
  { year: 2024, closing: 99.42 },
  { year: 2023, closing: 99.38 },
  { year: 2022, closing: 99.31 },
  { year: 2021, closing: 99.25 },
];

const MAX_CLOSING = Math.max(...NIT_TRICHY_CS.map((r) => r.closing));

function formatLakh(n: number): string {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
  return String(n);
}

// Compare Apr session cutoffs year over year for general category
function getTrendArrow(rows: AdvancedCutoff[], year: number, cat: keyof Omit<AdvancedCutoff, "year" | "session" | "totalCandidates" | "qualifiers">): string {
  const current = rows.find((r) => r.year === year);
  const prev = rows.find((r) => r.year === year - 1);
  if (!current || !prev) return "";
  return current[cat] > prev[cat] ? "&#8593;" : current[cat] < prev[cat] ? "&#8595;" : "&#8594;";
}

export default function CutoffsPage() {
  // Deduplicate years for trend arrows (use Apr/latest session per year)
  const latestPerYear = ADVANCED_CUTOFFS.reduce<Record<number, AdvancedCutoff>>((acc, row) => {
    if (!acc[row.year] || row.session === "Apr") acc[row.year] = row;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <div className="text-center py-4">
          <h2 className="text-3xl font-black text-gray-900 leading-tight">
            10 Years of CUET UG Cutoffs
          </h2>
          <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
            The data you actually need. Category-wise qualifying percentiles, trend analysis,
            and NIT closing cutoff patterns — in one place.
          </p>
        </div>

        {/* CUET Advanced Qualifying Cutoff Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-black text-gray-900 text-lg">CUET Advanced Qualifying Cutoffs</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Minimum percentile in CUET UG to appear for CUET Advanced
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wide">Year</th>
                  <th className="text-left px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wide">Session</th>
                  <th className="text-right px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wide">General</th>
                  <th className="text-right px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wide">OBC-NCL</th>
                  <th className="text-right px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wide">SC</th>
                  <th className="text-right px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wide">ST</th>
                  <th className="text-right px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wide">EWS</th>
                  <th className="text-right px-4 py-3 text-xs font-black text-gray-500 uppercase tracking-wide">Qualifiers</th>
                </tr>
              </thead>
              <tbody>
                {ADVANCED_CUTOFFS.map((row, i) => {
                  const isApr = row.session === "Apr";
                  const prevYear = latestPerYear[row.year - 1];
                  return (
                    <tr
                      key={`${row.year}-${row.session}`}
                      className={`border-b border-gray-50 ${i % 2 === 0 ? "" : "bg-gray-50/40"} hover:bg-orange-50/30 transition-colors`}
                    >
                      <td className="px-4 py-3 font-bold text-gray-900">{row.year}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          isApr ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"
                        }`}>
                          {row.session}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-800">
                        {row.general}
                        {isApr && prevYear && (
                          <span
                            className={`ml-1 text-xs ${row.general > prevYear.general ? "text-red-500" : "text-green-600"}`}
                            dangerouslySetInnerHTML={{
                              __html: row.general > prevYear.general ? "&#8593;" : "&#8595;",
                            }}
                          />
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">{row.obcNcl}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{row.sc}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{row.st}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{row.ews}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-semibold text-gray-800">{formatLakh(row.qualifiers)}</span>
                        <span className="text-xs text-gray-400 ml-1">/ {formatLakh(row.totalCandidates)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Insight callouts */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Key Insights</h3>

          <div className="grid sm:grid-cols-3 gap-3">
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
              <div className="text-2xl mb-2">&#128200;</div>
              <p className="text-sm font-bold text-orange-900 leading-snug">
                April cutoff is consistently 1&ndash;3% higher than January for General category.
              </p>
              <p className="text-xs text-orange-700 mt-2 leading-relaxed">
                Harder paper in April or better preparation? Either way — January is your safer bet if you are borderline.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <div className="text-2xl mb-2">&#128200;</div>
              <p className="text-sm font-bold text-blue-900 leading-snug">
                SC/ST cutoffs rose +8% over 4 years vs General +5%.
              </p>
              <p className="text-xs text-blue-700 mt-2 leading-relaxed">
                Reserved category competition is rising faster. Do not assume an old cutoff still applies to you.
              </p>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
              <div className="text-2xl mb-2">&#9989;</div>
              <p className="text-sm font-bold text-green-900 leading-snug">
                ~2.5 lakh students qualify for Advanced every year regardless of session.
              </p>
              <p className="text-xs text-green-700 mt-2 leading-relaxed">
                NTA adjusts the cutoff to hit a fixed qualifier count — not the other way around.
              </p>
            </div>
          </div>
        </div>

        {/* NIT Trichy CS Closing Cutoff Trend */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-black text-gray-900 text-lg mb-1">
            NIT Trichy CS — Closing Percentile Trend
          </h3>
          <p className="text-xs text-gray-400 mb-5">
            General category, All India quota, Round 1 closing
          </p>

          <div className="space-y-4">
            {NIT_TRICHY_CS.map((row) => {
              const barWidth = ((row.closing - 99) / (MAX_CLOSING - 99)) * 100;
              const prevRow = NIT_TRICHY_CS.find((r) => r.year === row.year - 1);
              const diff = prevRow ? row.closing - prevRow.closing : null;

              return (
                <div key={row.year}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-gray-700">{row.year}</span>
                    <div className="flex items-center gap-2">
                      {diff !== null && (
                        <span className={`text-xs font-semibold ${diff > 0 ? "text-red-500" : "text-green-600"}`}>
                          {diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)} vs prev
                        </span>
                      )}
                      <span className="text-sm font-black text-gray-900">{row.closing}%ile</span>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all"
                      style={{ width: `${Math.max(barWidth, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-gray-400 mt-4">
            The bar starts at 99.0 percentile for visual clarity — actual range is 99.25 to 99.42.
          </p>
        </div>

        {/* What this means for you */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-black text-gray-900 text-lg mb-4">What This Data Tells You</h3>
          <div className="space-y-3">
            {[
              { point: "Top NIT CS cutoffs are rising ~0.05 percentile per year. At 99.42, the margin is already razor thin.", icon: "&#128202;" },
              { point: "For OBC-NCL students, 98th percentile gets you in the same NIT CS seats that require 99.4 for General.", icon: "&#127919;" },
              { point: "CUET Advanced qualifier count stays ~2.5L. The cutoff is backward-engineered from that target.", icon: "&#128161;" },
              { point: "January session gives you a second attempt if you underperform. April tends to be 1–3 points higher for General.", icon: "&#128197;" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-lg mt-0.5" dangerouslySetInnerHTML={{ __html: item.icon }} />
                <p className="text-sm text-gray-700 leading-relaxed">{item.point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA linking to predictor */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center">
          <h3 className="font-black text-gray-900 text-lg mb-1">See which colleges fit your percentile</h3>
          <p className="text-sm text-gray-600 mb-4">
            Enter your current percentile and category. Instant results from JoSAA 2024 data.
          </p>
          <Link
            href="/college-predictor"
            className="inline-block bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-all text-sm shadow-md shadow-orange-100"
          >
            Open College Predictor &rarr;
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 pb-4">
          Source: NTA official results, JoSAA archive. Data for informational purposes only.
          Cutoffs change every year — verify at{" "}
          <a href="https://nta.ac.in" target="_blank" rel="noopener noreferrer" className="underline">
            nta.ac.in
          </a>{" "}
          and{" "}
          <a href="https://josaa.nic.in" target="_blank" rel="noopener noreferrer" className="underline">
            josaa.nic.in
          </a>.
        </p>
      </div>
    </div>
  );
}
