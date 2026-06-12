"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppNav } from "../../../components/AppNav";
import { TOKEN_KEY } from "../../../utils/auth";

interface VariantResult {
  variantKey: string;
  label: string;
  exposures: number;
  conversions: number;
  rate: number;
}

interface ResultsBundle {
  test: {
    testKey: string;
    name: string;
    description?: string;
    status: string;
    primaryMetric: string;
    pValue?: number;
    winnerVariantKey?: string;
  };
  results: VariantResult[];
}

export default function ExperimentDetailPage() {
  const params = useParams<{ key: string }>();
  const [data, setData] = useState<ResultsBundle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    fetch(`/api/admin/experiments/${params.key}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setData(d.results))
      .finally(() => setLoading(false));
  }, [params.key]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppNav />
        <div className="max-w-3xl mx-auto px-4 pt-20 text-center text-gray-400">Loading…</div>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppNav />
        <div className="max-w-3xl mx-auto px-4 pt-20 text-center">
          <h1 className="text-2xl font-black text-gray-900">Experiment not found</h1>
        </div>
      </div>
    );
  }

  const totalExposures = data.results.reduce((a, r) => a + r.exposures, 0);
  const totalConversions = data.results.reduce((a, r) => a + r.conversions, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />

      <section className="max-w-3xl mx-auto px-4 pt-12 pb-20">
        <Link href="/admin/experiments" className="text-xs font-bold text-gray-400 hover:text-gray-600 inline-block mb-2">
          ← Experiments
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">{data.test.name}</h1>
        <p className="text-xs font-mono text-gray-400 mt-1">{data.test.testKey}</p>
        {data.test.description && <p className="text-sm text-gray-600 mt-3">{data.test.description}</p>}

        <div className="mt-6 flex items-center gap-4 text-sm">
          <span className="text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-gray-100 text-gray-700">
            {data.test.status}
          </span>
          <span className="text-gray-500">
            Metric: <span className="font-mono text-gray-700">{data.test.primaryMetric}</span>
          </span>
          {data.test.pValue !== undefined && (
            <span className={`font-mono text-xs px-2 py-1 rounded-full ${data.test.pValue < 0.05 ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-700"}`}>
              p = {data.test.pValue.toFixed(3)}
            </span>
          )}
          {data.test.winnerVariantKey && (
            <span className="text-sm font-bold text-emerald-700">🏆 {data.test.winnerVariantKey}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Total exposures</p>
            <p className="text-3xl font-black text-gray-900 mt-1 tabular-nums">{totalExposures.toLocaleString("en-IN")}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Total conversions</p>
            <p className="text-3xl font-black text-gray-900 mt-1 tabular-nums">{totalConversions.toLocaleString("en-IN")}</p>
          </div>
        </div>

        <h2 className="text-lg font-black text-gray-900 mt-10 mb-3">By variant</h2>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-400">
              <tr>
                <th className="text-left px-4 py-3">Variant</th>
                <th className="text-right px-4 py-3">Exposures</th>
                <th className="text-right px-4 py-3">Conversions</th>
                <th className="text-right px-4 py-3">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.results.map((r) => {
                const isWinner = data.test.winnerVariantKey === r.variantKey;
                return (
                  <tr key={r.variantKey} className={isWinner ? "bg-emerald-50/50" : ""}>
                    <td className="px-4 py-2.5 font-semibold text-gray-900">
                      {r.label}{" "}
                      <span className="text-xs font-mono text-gray-400">({r.variantKey})</span>
                      {isWinner && <span className="ml-2 text-xs text-emerald-700">🏆 winner</span>}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-gray-700">{r.exposures}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-gray-700">{r.conversions}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums font-black text-gray-900">
                      {(r.rate * 100).toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
