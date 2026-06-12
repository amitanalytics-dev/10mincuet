"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppNav } from "../components/AppNav";
import { TOKEN_KEY } from "../utils/auth";

interface ReadinessScore {
  score: number;
  topicCoverage: number;
  mockScoreAvg: number;
  attendanceRate: number;
  weakTopics: string[];
  recommendations: string[];
  calculatedAt: number;
}

function scoreBand(score: number): { label: string; color: string; bg: string } {
  if (score >= 75) return { label: "Exam ready", color: "text-emerald-700", bg: "bg-emerald-50" };
  if (score >= 50) return { label: "On track", color: "text-blue-700", bg: "bg-blue-50" };
  if (score >= 25) return { label: "Building", color: "text-amber-700", bg: "bg-amber-50" };
  return { label: "Just starting", color: "text-gray-700", bg: "bg-gray-100" };
}

function StatCard({ label, value, max = 100 }: { label: string; value: number; max?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
      <p className="text-3xl font-black text-gray-900 mt-1">{value.toFixed(0)}%</p>
      <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function ReadinessPage() {
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState<ReadinessScore | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setError("Sign in to see your readiness score.");
      setLoading(false);
      return;
    }
    fetch("/api/readiness", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setScore(data.score);
        }
      })
      .catch(() => setError("Failed to load readiness score."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />

      <section className="max-w-3xl mx-auto px-4 pt-12 pb-20">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
          Your CUET Readiness
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          A composite of topic mastery, mock performance, and consistency — recalculated weekly.
        </p>

        {loading ? (
          <div className="mt-12 text-center text-gray-400">Loading…</div>
        ) : error ? (
          <div className="mt-12 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
            <p className="text-sm font-semibold text-amber-800">{error}</p>
            {error.includes("Sign in") && (
              <Link
                href="/login"
                className="mt-4 inline-block bg-orange-500 text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-orange-600 transition-all"
              >
                Sign in
              </Link>
            )}
          </div>
        ) : !score ? (
          <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 text-center">
            <div className="text-5xl mb-3">📊</div>
            <p className="font-black text-gray-900 text-lg">No readiness score yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Complete a few topic quizzes and a mock test — your first score lands on Monday.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <Link
                href="/topics"
                className="bg-orange-500 text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-orange-600 transition-all"
              >
                Start a topic
              </Link>
              <Link
                href="/mock"
                className="bg-white border border-gray-200 text-gray-900 font-bold text-sm px-5 py-2.5 rounded-full hover:border-gray-400 transition-all"
              >
                Take a mock
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-10">
            {/* Composite score */}
            {(() => {
              const band = scoreBand(score.score);
              return (
                <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center shadow-sm">
                  <p className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${band.bg} ${band.color}`}>
                    {band.label}
                  </p>
                  <p className="text-7xl font-black text-gray-900 mt-4 tabular-nums">
                    {score.score.toFixed(0)}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">out of 100</p>
                </div>
              );
            })()}

            {/* Sub-scores */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <StatCard label="Topic coverage" value={score.topicCoverage} />
              <StatCard label="Mock score avg" value={score.mockScoreAvg} />
              <StatCard label="Attendance (30d)" value={score.attendanceRate} />
            </div>

            {/* Weak topics */}
            {score.weakTopics.length > 0 && (
              <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Weakest topics
                </p>
                <ul className="space-y-2">
                  {score.weakTopics.map((slug) => (
                    <li key={slug} className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                      <Link
                        href={`/topics/${slug}`}
                        className="text-sm font-semibold text-gray-900 hover:text-orange-500 transition-colors"
                      >
                        {slug.replace(/-/g, " ")}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {score.recommendations.length > 0 && (
              <div className="mt-6 bg-orange-50 rounded-2xl border border-orange-100 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-orange-700 mb-3">
                  Next steps
                </p>
                <ul className="space-y-2">
                  {score.recommendations.map((rec, i) => (
                    <li key={i} className="text-sm text-gray-800 leading-relaxed">
                      • {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-xs text-gray-400 mt-6 text-center">
              Calculated {new Date(score.calculatedAt).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "short",
              })} · refreshes every Monday
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
