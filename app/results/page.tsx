"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { subjects } from "../data/topics";
import { slugify } from "../utils/slug";
import {
  loadBloomStore,
  getBloomInfo,
  BLOOM_LEVELS,
  type BloomStore,
  type BloomLevel,
} from "../data/bloom";
import { BloomBadge } from "../components/BloomBadge";
import { AUTH_KEY } from "../utils/auth";
import { AppNav } from "../components/AppNav";

// ─── CUET Advanced predictor helpers ─────────────────────────────────────────

const SCORE_PERCENTILE_TABLE_R: [number, number][] = [
  [360, 100.0], [310, 99.95], [290, 99.9], [270, 99.8],
  [250, 99.6], [235, 99.2], [220, 98.5], [205, 97.5],
  [190, 96.5], [175, 95.0], [160, 93.0], [145, 90.0],
  [130, 86.0], [115, 81.0], [100, 74.0], [85, 65.0],
  [70, 55.0], [55, 43.0], [40, 30.0], [25, 18.0],
  [10, 8.0], [0, 3.5], [-30, 1.0], [-90, 0.1],
];

function scoreToPercentile(score: number): number {
  if (score >= 360) return 100;
  if (score <= -90) return 0.1;
  for (let i = 0; i < SCORE_PERCENTILE_TABLE_R.length - 1; i++) {
    const [s1, p1] = SCORE_PERCENTILE_TABLE_R[i];
    const [s2, p2] = SCORE_PERCENTILE_TABLE_R[i + 1];
    if (score >= s2 && score <= s1) {
      const t = (score - s2) / (s1 - s2);
      return Math.round((p2 + t * (p1 - p2)) * 10) / 10;
    }
  }
  return 0.1;
}

const ADVANCED_CUTOFF = 93.0;

// Bloom level → % of max score the student can attempt
const BLOOM_SCORE_PCT: Record<number, number> = { 1: 0.2, 2: 0.4, 3: 0.6, 4: 0.8, 5: 0.9, 6: 1.0 };

// ─── Types ───────────────────────────────────────────────────────────────────

type QuizScore = {
  score: number;
  total: number;
  pct: number;
  date: string;
};

type TopicResult = {
  topicName: string;
  topicSlug: string;
  subjectName: string;
  subjectSlug: string;
  accent: string;
  quizScore: QuizScore | null;
  avgBloom: BloomLevel | null;
  subConceptCount: number;
  attemptedSubConcepts: number;
  weakSubConcepts: string[];
};

// ─── Bloom summary bar ───────────────────────────────────────────────────────

function BloomSummaryBar({ level }: { level: BloomLevel }) {
  return (
    <div className="flex gap-0.5 items-center">
      {([1, 2, 3, 4, 5, 6] as BloomLevel[]).map((lvl) => {
        const info = getBloomInfo(lvl);
        return (
          <div
            key={lvl}
            className="h-2 rounded-full flex-1 transition-all"
            style={{ backgroundColor: lvl <= level ? info.color : "#E5E7EB" }}
          />
        );
      })}
    </div>
  );
}

// ─── Topic result card ────────────────────────────────────────────────────────

function TopicResultCard({ result }: { result: TopicResult }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
              {result.subjectName}
            </p>
            <p className="font-black text-gray-900 text-sm truncate">{result.topicName}</p>
          </div>
          {result.avgBloom ? (
            <BloomBadge level={result.avgBloom} size="xs" />
          ) : (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 font-medium shrink-0">
              Not started
            </span>
          )}
        </div>

        {/* Stats row */}
        <div className="flex gap-4 mt-3">
          {result.quizScore ? (
            <div className="text-center">
              <div
                className="text-lg font-black"
                style={{ color: result.quizScore.pct >= 60 ? "#10B981" : "#EF4444" }}
              >
                {result.quizScore.score}/{result.quizScore.total}
              </div>
              <div className="text-[10px] text-gray-400">Quiz ({result.quizScore.pct}%)</div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-lg font-black text-gray-300">—</div>
              <div className="text-[10px] text-gray-400">No quiz yet</div>
            </div>
          )}
          <div className="text-center">
            <div className="text-lg font-black text-gray-800">
              {result.attemptedSubConcepts}/{result.subConceptCount}
            </div>
            <div className="text-[10px] text-gray-400">Sub-topics done</div>
          </div>
          {result.avgBloom && (
            <div className="flex-1">
              <div className="text-[10px] text-gray-400 mb-1">Bloom progress</div>
              <BloomSummaryBar level={result.avgBloom} />
            </div>
          )}
        </div>

        {/* Weak sub-concepts */}
        {result.weakSubConcepts.length > 0 && (
          <div className="mt-3">
            <button
              onClick={() => setOpen(!open)}
              className="text-[10px] font-semibold text-red-500 hover:text-red-700"
            >
              ⚠ {result.weakSubConcepts.length} weak sub-concept{result.weakSubConcepts.length > 1 ? "s" : ""} {open ? "▲" : "▼"}
            </button>
            {open && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {result.weakSubConcepts.map((sc, i) => (
                  <span key={i} className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">
                    {sc}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action links */}
        <div className="flex gap-2 mt-3">
          <Link
            href={`/practice/${result.subjectSlug}/${result.topicSlug}`}
            className="flex-1 text-center text-[10px] font-bold py-2 px-2 rounded-xl text-white transition-all hover:opacity-90"
            style={{ backgroundColor: "#8B5CF6" }}
          >
            🧩 Sub-topics
          </Link>
          <Link
            href={`/quiz/${result.subjectSlug}/${result.topicSlug}`}
            className="flex-1 text-center text-[10px] font-bold py-2 px-2 rounded-xl text-white transition-all hover:opacity-90"
            style={{ backgroundColor: result.accent }}
          >
            🎯 Quiz
          </Link>
          <Link
            href={`/bloom/${result.subjectSlug}/${result.topicSlug}`}
            className="flex-1 text-center text-[10px] font-bold py-2 px-2 rounded-xl border-2 transition-all hover:opacity-80"
            style={{ color: result.accent, borderColor: result.accent }}
          >
            📊 Plan
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Attempt Tracker ─────────────────────────────────────────────────────────

type AttemptData = { attemptNumber: number; targetYear: number };

function AttemptTracker() {
  const [attempt, setAttempt] = useState<AttemptData | null>(null);
  const [showAttemptEdit, setShowAttemptEdit] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("jee_attempt_v1");
    if (saved) {
      try { setAttempt(JSON.parse(saved)); } catch {}
    }
  }, []);

  function saveAttempt(n: number, year: number) {
    const data: AttemptData = { attemptNumber: n, targetYear: year };
    localStorage.setItem("jee_attempt_v1", JSON.stringify(data));
    setAttempt(data);
    setShowAttemptEdit(false);
  }

  return (
    <>
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-6 flex items-center justify-between gap-4">
        {attempt ? (
          <>
            <div>
              <p className="text-xs text-orange-600 font-semibold uppercase tracking-wide mb-1">Your CUET Journey</p>
              <p className="font-black text-gray-900">Attempt {attempt.attemptNumber} of 6 · Target: {attempt.targetYear}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {6 - attempt.attemptNumber} attempts remaining ·{" "}
                {attempt.attemptNumber <= 2
                  ? "Early stage — time to build strong foundations"
                  : attempt.attemptNumber <= 4
                  ? "Mid journey — focus on weak spots ruthlessly"
                  : "Final stretch — mock tests daily, no new topics"}
              </p>
            </div>
            <button onClick={() => setShowAttemptEdit(true)} className="text-xs text-orange-500 hover:underline shrink-0">Edit</button>
          </>
        ) : (
          <button onClick={() => setShowAttemptEdit(true)} className="text-sm font-semibold text-orange-500 hover:underline">
            + Set your attempt number →
          </button>
        )}
      </div>

      {showAttemptEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-black text-gray-900 mb-4">Your CUET Attempt</h3>
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Which attempt is this? (max 6, 2 per year)</p>
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <button
                    key={n}
                    onClick={() => saveAttempt(n, attempt?.targetYear ?? 2026)}
                    className={`w-10 h-10 rounded-xl font-black text-sm border-2 transition-all
                      ${attempt?.attemptNumber === n
                        ? "bg-orange-500 text-white border-orange-500"
                        : "border-gray-200 text-gray-600 hover:border-orange-300"}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <p className="text-xs text-gray-500 mb-2">Target year</p>
              <div className="flex gap-2">
                {[2025, 2026, 2027].map((y) => (
                  <button
                    key={y}
                    onClick={() => saveAttempt(attempt?.attemptNumber ?? 1, y)}
                    className={`px-4 py-2 rounded-xl font-bold text-sm border-2 transition-all
                      ${attempt?.targetYear === y
                        ? "bg-orange-500 text-white border-orange-500"
                        : "border-gray-200 text-gray-600 hover:border-orange-300"}`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setShowAttemptEdit(false)} className="text-sm text-gray-400 hover:text-gray-600">Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const [results, setResults] = useState<TopicResult[]>([]);
  const [bloomStore, setBloomStore] = useState<BloomStore>({});
  const [filter, setFilter] = useState<"all" | "attempted" | "weak">("all");
  const [sortBy, setSortBy] = useState<"bloom" | "quiz" | "name">("bloom");

  useEffect(() => {
    const store = loadBloomStore();
    setBloomStore(store);

    // Build results for every topic across all subjects
    const allResults: TopicResult[] = [];

    subjects.forEach((subject) => {
      const subjectSlug = slugify(subject.name);
      subject.topics.forEach((topic) => {
        const topicSlug = slugify(topic.name);

        // Quiz score
        let quizScore: QuizScore | null = null;
        try {
          const raw = localStorage.getItem(`quiz_${topicSlug}`);
          if (raw) quizScore = JSON.parse(raw);
        } catch {}

        // Bloom progress
        const progress = store[topicSlug] ?? {};
        const levels = Object.values(progress).map((p) => p.bloomLevel);
        const avgBloom =
          levels.length > 0
            ? (Math.round(levels.reduce((s, l) => s + l, 0) / levels.length) as BloomLevel)
            : null;

        // Sub-concept stats
        const allSubConcepts = topic.subConcepts.map((sc) => sc.name);
        const attemptedSubConcepts = Object.keys(progress).length;
        const weakSubConcepts = Object.entries(progress)
          .filter(([, p]) => p.bloomLevel <= 2)
          .map(([sc]) => sc);

        allResults.push({
          topicName: topic.name,
          topicSlug,
          subjectName: subject.name,
          subjectSlug,
          accent: subject.accent,
          quizScore,
          avgBloom,
          subConceptCount: allSubConcepts.length,
          attemptedSubConcepts,
          weakSubConcepts,
        });
      });
    });

    setResults(allResults);
  }, []);

  function handleLogout() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = "/";
  }

  // ── Derived stats
  const attempted = results.filter((r) => r.quizScore || r.avgBloom);
  const totalTopics = results.length;
  const avgQuizPct =
    results.filter((r) => r.quizScore).length > 0
      ? Math.round(
          results
            .filter((r) => r.quizScore)
            .reduce((s, r) => s + r.quizScore!.pct, 0) /
            results.filter((r) => r.quizScore).length
        )
      : null;
  const overallBloomLevels = results.filter((r) => r.avgBloom).map((r) => r.avgBloom!);
  const overallBloom =
    overallBloomLevels.length > 0
      ? (Math.round(
          overallBloomLevels.reduce((s, l) => s + l, 0) / overallBloomLevels.length
        ) as BloomLevel)
      : null;
  const totalWeakSpots = results.reduce((s, r) => s + r.weakSubConcepts.length, 0);

  // ── Bloom distribution across all sub-concepts
  const bloomDist: Record<number, number> = {};
  Object.values(bloomStore).forEach((topicProgress) => {
    Object.values(topicProgress).forEach((sc) => {
      bloomDist[sc.bloomLevel] = (bloomDist[sc.bloomLevel] ?? 0) + 1;
    });
  });
  const totalSCs = Object.values(bloomDist).reduce((s, n) => s + n, 0);

  // ── Filter + sort
  const filtered = results
    .filter((r) => {
      if (filter === "attempted") return r.quizScore || r.avgBloom;
      if (filter === "weak") return r.weakSubConcepts.length > 0 || (r.quizScore && r.quizScore.pct < 60);
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "bloom") {
        if (!a.avgBloom && !b.avgBloom) return 0;
        if (!a.avgBloom) return 1;
        if (!b.avgBloom) return -1;
        return a.avgBloom - b.avgBloom; // weakest first
      }
      if (sortBy === "quiz") {
        if (!a.quizScore && !b.quizScore) return 0;
        if (!a.quizScore) return 1;
        if (!b.quizScore) return -1;
        return a.quizScore.pct - b.quizScore.pct; // lowest first
      }
      return a.topicName.localeCompare(b.topicName);
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* ── Overall stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
            <div className="text-3xl font-black text-gray-900">
              {attempted.length}
              <span className="text-gray-300 text-lg">/{totalTopics}</span>
            </div>
            <div className="text-xs text-gray-400 mt-0.5">Topics started</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
            <div
              className="text-3xl font-black"
              style={{
                color:
                  avgQuizPct === null
                    ? "#D1D5DB"
                    : avgQuizPct >= 60
                    ? "#10B981"
                    : "#EF4444",
              }}
            >
              {avgQuizPct !== null ? `${avgQuizPct}%` : "—"}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">Avg quiz score</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
            {overallBloom ? (
              <>
                <div className="flex justify-center mb-1">
                  <BloomBadge level={overallBloom} size="sm" />
                </div>
                <div className="text-xs text-gray-400">Overall Bloom level</div>
              </>
            ) : (
              <>
                <div className="text-3xl font-black text-gray-300">—</div>
                <div className="text-xs text-gray-400">Overall Bloom level</div>
              </>
            )}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
            <div
              className="text-3xl font-black"
              style={{ color: totalWeakSpots > 0 ? "#EF4444" : "#10B981" }}
            >
              {totalWeakSpots}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {totalWeakSpots > 0 ? "Weak sub-concepts" : "No weak spots!"}
            </div>
          </div>
        </div>

        {/* ── Attempt Tracker */}
        <AttemptTracker />

        {/* ── Bloom distribution */}
        {totalSCs > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
            <h2 className="font-black text-gray-900 text-sm mb-3">
              📊 Your Bloom Distribution — All Sub-concepts
            </h2>
            <div className="flex gap-1 h-6 rounded-full overflow-hidden mb-2">
              {BLOOM_LEVELS.map((info) => {
                const count = bloomDist[info.level] ?? 0;
                const pct = totalSCs > 0 ? Math.round((count / totalSCs) * 100) : 0;
                if (pct === 0) return null;
                return (
                  <div
                    key={info.level}
                    className="flex items-center justify-center text-[9px] font-black text-white"
                    style={{ width: `${pct}%`, backgroundColor: info.color }}
                    title={`L${info.level} ${info.name}: ${count} sub-concepts (${pct}%)`}
                  >
                    {pct >= 10 ? `L${info.level}` : ""}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-3 mt-1">
              {BLOOM_LEVELS.map((info) => {
                const count = bloomDist[info.level] ?? 0;
                if (count === 0) return null;
                const pct = Math.round((count / totalSCs) * 100);
                return (
                  <span key={info.level} className="text-[10px] text-gray-500 flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: info.color }} />
                    {info.icon} L{info.level} {info.name}: {count} ({pct}%)
                  </span>
                );
              })}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              CUET requires L3 (Apply) or higher on most questions.
              {(bloomDist[1] ?? 0) + (bloomDist[2] ?? 0) > 0 &&
                ` Focus: push your ${(bloomDist[1] ?? 0) + (bloomDist[2] ?? 0)} L1/L2 sub-concepts to L3+.`}
            </p>
          </div>
        )}

        {/* ── Filters + sort */}
        <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
          <div className="flex gap-2 flex-wrap">
            {(["all", "attempted", "weak"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                  filter === f
                    ? "bg-gray-900 text-white"
                    : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {f === "all" ? `All (${totalTopics})` : f === "attempted" ? `Attempted (${attempted.length})` : `Weak spots (${results.filter((r) => r.weakSubConcepts.length > 0 || (r.quizScore && r.quizScore.pct < 60)).length})`}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Sort:</span>
            {(["bloom", "quiz", "name"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${
                  sortBy === s
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {s === "bloom" ? "Bloom ↑" : s === "quiz" ? "Quiz ↑" : "A–Z"}
              </button>
            ))}
          </div>
        </div>

        {/* ── No data state */}
        {attempted.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm mb-6">
            <div className="text-5xl mb-4">📭</div>
            <h2 className="font-black text-gray-900 text-xl mb-2">No results yet</h2>
            <p className="text-gray-400 text-sm mb-6">
              Complete a quiz or practice session to see your results here.
            </p>
            <Link
              href="/topics"
              className="inline-block bg-gray-900 text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-gray-700 transition-all"
            >
              Start a 10-min session →
            </Link>
          </div>
        )}

        {/* ── Topic grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((result) => (
            <TopicResultCard key={result.topicSlug} result={result} />
          ))}
        </div>

        {/* ── Recommended next action */}
        {attempted.length > 0 && (
          <div className="mt-6 bg-gray-900 text-white rounded-2xl p-5">
            <h3 className="font-black text-sm mb-3">🎯 Recommended next: fix your weakest spots</h3>
            <div className="space-y-2">
              {results
                .filter((r) => r.weakSubConcepts.length > 0)
                .slice(0, 3)
                .map((r) => (
                  <div key={r.topicSlug} className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{r.topicName}</p>
                      <p className="text-xs text-gray-400">
                        {r.weakSubConcepts.slice(0, 2).join(", ")}
                        {r.weakSubConcepts.length > 2 ? ` +${r.weakSubConcepts.length - 2} more` : ""}
                      </p>
                    </div>
                    <Link
                      href={`/practice/${r.subjectSlug}/${r.topicSlug}`}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white text-gray-900 shrink-0 hover:bg-gray-100"
                    >
                      Practice →
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── CUET Advanced Readiness */}
        {(() => {
          // Compute avg Bloom across all attempted sub-concepts
          const allLevels: number[] = [];
          Object.values(bloomStore).forEach((topicProgress) => {
            Object.values(topicProgress).forEach((sc) => {
              allLevels.push(sc.bloomLevel);
            });
          });
          if (allLevels.length === 0) return null;

          const avgBloomNum = allLevels.reduce((s, l) => s + l, 0) / allLevels.length;
          // Map avg bloom to estimated % of max score
          const floorLevel = Math.floor(avgBloomNum) as keyof typeof BLOOM_SCORE_PCT;
          const ceilLevel = Math.min(6, floorLevel + 1) as keyof typeof BLOOM_SCORE_PCT;
          const frac = avgBloomNum - floorLevel;
          const scorePct =
            (BLOOM_SCORE_PCT[floorLevel] ?? 0.2) +
            frac * ((BLOOM_SCORE_PCT[ceilLevel] ?? 0.2) - (BLOOM_SCORE_PCT[floorLevel] ?? 0.2));
          const estimatedScore = Math.round(scorePct * 360);
          const estimatedPercentile = scoreToPercentile(estimatedScore);
          const advancedLikely = estimatedPercentile >= ADVANCED_CUTOFF;
          const gap = Math.max(0, ADVANCED_CUTOFF - estimatedPercentile);

          // Count sub-concepts at L1/L2 (weak)
          const weakCount = allLevels.filter((l) => l <= 2).length;

          return (
            <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                <div>
                  <h3 className="font-black text-gray-900 text-lg">CUET Advanced Readiness</h3>
                  <p className="text-xs text-gray-500">Based on your current Bloom levels across all topics</p>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${
                    advancedLikely
                      ? "bg-green-100 text-green-700"
                      : estimatedPercentile >= 85
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {advancedLikely ? "✓ On track" : estimatedPercentile >= 85 ? "⚠ Close" : "✗ Needs work"}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="bg-white rounded-xl p-3 text-center border border-purple-100">
                  <div className="text-xl font-black text-purple-600">{avgBloomNum.toFixed(1)}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Avg Bloom level</div>
                </div>
                <div className="bg-white rounded-xl p-3 text-center border border-purple-100">
                  <div className="text-xl font-black text-gray-800">{estimatedScore}/360</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Est. mock score</div>
                </div>
                <div className="bg-white rounded-xl p-3 text-center border border-purple-100">
                  <div className="text-xl font-black" style={{ color: "#f97316" }}>
                    {estimatedPercentile.toFixed(1)}%ile
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Est. percentile</div>
                </div>
                <div
                  className={`rounded-xl p-3 text-center border ${
                    advancedLikely ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"
                  }`}
                >
                  <div className={`text-xl font-black ${advancedLikely ? "text-green-600" : "text-red-500"}`}>
                    {advancedLikely ? "✓" : "✗"}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">CUET Advanced</div>
                </div>
              </div>

              <div className="bg-white rounded-xl px-4 py-3 border border-purple-100">
                {advancedLikely ? (
                  <p className="text-sm text-green-700 font-semibold">
                    You&apos;re on track for CUET Advanced. Keep pushing to L4+ on your remaining topics.
                  </p>
                ) : (
                  <p className="text-sm text-gray-700">
                    <span className="font-bold text-red-600">Gap: {gap.toFixed(1)} percentile points</span> to CUET Advanced cutoff.{" "}
                    {weakCount > 0 ? (
                      <>Fix your <span className="font-bold">{weakCount} weak sub-concept{weakCount > 1 ? "s" : ""}</span> (L1/L2) to close this gap.</>
                    ) : (
                      "Keep practicing to push all topics to L3+."
                    )}
                  </p>
                )}
              </div>

              <p className="text-xs text-gray-400 mt-3 text-center">
                Estimate based on Bloom→score mapping. Actual results depend on exam performance.{" "}
                <a href="/predictor" className="text-orange-500 hover:underline font-medium">
                  Use the score predictor →
                </a>
              </p>
            </div>
          );
        })()}

        {/* ── Footer actions */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link
            href="/topics"
            className="text-sm text-gray-400 hover:text-gray-600 font-medium"
          >
            ← All Topics
          </Link>
          <span className="text-gray-200">·</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-400 hover:text-red-600 font-medium"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
