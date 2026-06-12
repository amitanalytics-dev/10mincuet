"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { NavActions } from "../../../components/NavActions";
import type { Question } from "../../../data/questions";
import { TOKEN_KEY } from "../../../utils/auth";
import { subjects } from "../../../data/topics";
import { slugify } from "../../../utils/slug";
import {
  inferBloomLevel,
  updateSubConceptLevel,
  getBloomInfo,
  type BloomLevel,
} from "../../../data/bloom";
import { BloomBadge } from "../../../components/BloomBadge";
import {
  getDeviceId,
  getDailyQuizSeed,
  selectDailyQuestions,
} from "../../../utils/quiz";
import { QuestionFeedback } from "../../../components/QuestionFeedback";

// ─── Sub-components ──────────────────────────────────────────────────────────

function QuizQuestion({
  q,
  idx,
  selected,
  onSelect,
  submitted,
  topicSlug,
}: {
  q: Question;
  idx: number;
  selected: number | null;
  onSelect: (n: number) => void;
  submitted: boolean;
  topicSlug: string;
}) {
  const letters = ["A", "B", "C", "D"];

  return (
    <div
      className={`bg-white rounded-2xl border p-5 transition-all ${
        submitted
          ? selected === q.correct
            ? "border-emerald-300 shadow-sm"
            : "border-red-300 shadow-sm"
          : "border-gray-100 hover:border-gray-200"
      }`}
    >
      {/* Question header */}
      <div className="flex items-start gap-3 mb-4">
        <span className="shrink-0 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
          {idx + 1}
        </span>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800 leading-relaxed">{q.text}</p>
          {q.source === "pyq" && q.year && (
            <span className="inline-block mt-1.5 text-[10px] px-2.5 py-0.5 bg-blue-50 text-blue-500 rounded-full font-semibold">
              CUET UG {q.year}
            </span>
          )}
          {q.source === "new" && (
            <span className="inline-block mt-1.5 text-[10px] px-2.5 py-0.5 bg-violet-50 text-violet-500 rounded-full font-semibold">
              Practice Q
            </span>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {q.options.map((opt, oi) => {
          let cls =
            "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 cursor-pointer";
          if (submitted) {
            if (oi === q.correct)
              cls = "bg-emerald-50 border-emerald-300 text-emerald-800";
            else if (oi === selected)
              cls = "bg-red-50 border-red-300 text-red-800";
            else cls = "bg-gray-50 border-gray-100 text-gray-400";
          } else if (selected === oi) {
            cls = "bg-blue-50 border-blue-300 text-blue-800";
          }

          return (
            <button
              key={oi}
              disabled={submitted}
              onClick={() => !submitted && onSelect(oi)}
              className={`w-full text-left text-sm px-4 py-3 rounded-xl border transition-all ${cls}`}
            >
              <span className="font-bold mr-2">{letters[oi]}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explanation after submit */}
      {submitted && (
        <>
          <div
            className={`mt-3 text-xs rounded-xl px-4 py-3 leading-relaxed ${
              selected === q.correct
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-red-50 text-red-700 border border-red-100"
            }`}
          >
            <span className="font-bold">
              {selected === q.correct ? "✓ Correct. " : "✗ Incorrect. "}
            </span>
            {q.explanation}
            <div className="mt-1 text-[10px] opacity-70">
              Sub-concept: {q.subConcept}
            </div>
          </div>
          <QuestionFeedback
            questionId={q.id}
            topicSlug={topicSlug}
            sessionType="quiz"
          />
        </>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function QuizPage({
  params,
}: {
  params: Promise<{ subject: string; topic: string }>;
}) {
  const { subject, topic } = use(params);

  const subjectData = subjects.find((s) => slugify(s.name) === subject);
  const topicData = subjectData?.topics.find((t) => slugify(t.name) === topic);

  // ── Seeded daily question selection ─────────────────────────────────────────
  // deviceId + topic + today → same student sees same 8 Qs all day on retry
  // different students → different 8 from the same pool
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizReady, setQuizReady] = useState(false);

  useEffect(() => {
    const deviceId = getDeviceId();
    const token = localStorage.getItem(TOKEN_KEY) ?? "";
    fetch(`/api/questions?topic=${encodeURIComponent(topic)}&did=${encodeURIComponent(deviceId)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401) { window.location.href = "/topics"; return null; }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        const pool: Question[] = data.questions ?? [];
        if (pool.length === 0) { setQuizReady(true); return; }
        const seed = getDailyQuizSeed(topic, deviceId);
        const selected = selectDailyQuestions(pool, 8, seed);
        setQuestions(selected);
        setAnswers(Array(selected.length).fill(null));
        setQuizReady(true);
      })
      .catch(() => setQuizReady(true));
  }, [topic]);

  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [warn, setWarn] = useState(false);
  // bloomResults: subConcept → inferred BloomLevel
  const [bloomResults, setBloomResults] = useState<Record<string, BloomLevel>>({});

  const accent = subjectData?.accent ?? "#3B82F6";
  const topicName =
    topicData?.name ?? topic.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const answered = answers.filter((a) => a !== null).length;
  const score = submitted
    ? answers.filter((a, i) => a !== null && a === questions[i]?.correct).length
    : 0;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  // Weak spots: subConcepts where answers were wrong
  const weakSpots = submitted
    ? [
        ...new Set(
          questions
            .filter((q, i) => answers[i] !== q.correct)
            .map((q) => q.subConcept)
        ),
      ]
    : [];

  function handleSelect(idx: number, opt: number) {
    if (submitted) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = opt;
      return next;
    });
    setWarn(false);
  }

  function handleSubmit() {
    if (answers.some((a) => a === null)) {
      setWarn(true);
      return;
    }
    setSubmitted(true);
    const finalScore = answers.filter(
      (a, i) => a !== null && a === questions[i]?.correct
    ).length;

    // Save quiz score to localStorage
    localStorage.setItem(
      `quiz_${topic}`,
      JSON.stringify({
        score: finalScore,
        total: questions.length,
        pct: Math.round((finalScore / questions.length) * 100),
        date: new Date().toISOString(),
      })
    );

    // ── Compute Bloom level per sub-concept
    const scMap: Record<string, { correct: number; total: number }> = {};
    questions.forEach((q, i) => {
      if (!scMap[q.subConcept]) scMap[q.subConcept] = { correct: 0, total: 0 };
      scMap[q.subConcept].total++;
      if (answers[i] === q.correct) scMap[q.subConcept].correct++;
    });

    const bloomMap: Record<string, BloomLevel> = {};
    Object.entries(scMap).forEach(([sc, res]) => {
      const scorePct = Math.round((res.correct / res.total) * 100);
      const level = inferBloomLevel(scorePct);
      bloomMap[sc] = level;
      updateSubConceptLevel(topic, sc, level, scorePct);

      // Sync to server
      const token = localStorage.getItem(TOKEN_KEY) ?? "";
      fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topicSlug: topic,
          subConcept: sc,
          bloomLevel: level,
          lastQuizScore: scorePct,
        }),
      }).catch(() => {}); // silently fail if offline
    });
    setBloomResults(bloomMap);
  }

  function handleRetry() {
    setSubmitted(false);
    setWarn(false);
    setBloomResults({});
    setQuizReady(false);
    // Re-fetch from API (picks up new day's seed automatically)
    const deviceId = getDeviceId();
    const token = localStorage.getItem(TOKEN_KEY) ?? "";
    fetch(`/api/questions?topic=${encodeURIComponent(topic)}&did=${encodeURIComponent(deviceId)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const pool: Question[] = data.questions ?? [];
        const seed = getDailyQuizSeed(topic, deviceId);
        const selected = selectDailyQuestions(pool, 8, seed);
        setQuestions(selected);
        setAnswers(Array(selected.length).fill(null));
        setQuizReady(true);
      })
      .catch(() => setQuizReady(true));
    window.scrollTo(0, 0);
  }

  // ── Loading state (seeded selection runs in useEffect)
  if (!quizReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl mb-3 animate-pulse">🎯</div>
          <p className="text-sm text-gray-500">Selecting today&apos;s questions…</p>
        </div>
      </div>
    );
  }

  // ── Empty state (no questions for topic yet)
  if (quizReady && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🚧</div>
          <h2 className="text-xl font-black text-gray-800">Questions coming soon</h2>
          <p className="text-gray-400 text-sm mt-2">
            We&apos;re preparing questions for <strong>{topicName}</strong>.
          </p>
          <Link
            href="/topics"
            className="mt-5 inline-block text-sm font-semibold text-blue-500 hover:underline"
          >
            ← Back to topics
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Sticky header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <Link href="/topics" className="text-xs text-gray-400 hover:text-gray-600">
              ← All Topics
            </Link>
            <h1 className="font-black text-gray-900 text-base mt-0.5 truncate">
              {topicName}
            </h1>
            <p className="text-xs text-gray-400">Practice Quiz · {questions.length} questions</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {submitted && (
              <div className="text-center">
                <div
                  className="text-2xl font-black"
                  style={{ color: pct >= 60 ? "#10B981" : "#EF4444" }}
                >
                  {score}/{questions.length}
                </div>
                <div className="text-[10px] text-gray-400">{pct}%</div>
              </div>
            )}
            <NavActions />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* ── Results summary (after submit) */}
        {submitted && (
          <div className="mb-6 space-y-4">
            {/* Score card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex flex-wrap gap-6 items-center mb-5">
                <div className="text-center">
                  <div className="text-4xl font-black" style={{ color: accent }}>
                    {score}/{questions.length}
                  </div>
                  <div className="text-xs text-gray-400">correct</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-black text-gray-800">{pct}%</div>
                  <div className="text-xs text-gray-400">score</div>
                </div>
                <div className="flex-1 min-w-32">
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: pct >= 60 ? "#10B981" : "#EF4444",
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {pct >= 80
                      ? "Excellent! Ready for CUET UG."
                      : pct >= 60
                      ? "Good. Revise weak spots below."
                      : "Needs work. Study the topic first."}
                  </p>
                </div>
              </div>

              {/* Weak spots */}
              {weakSpots.length > 0 ? (
                <div className="rounded-xl bg-red-50 border border-red-100 p-4">
                  <p className="text-xs font-bold text-red-600 uppercase tracking-wide mb-2">
                    ⚠ Weak Spots Identified
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {weakSpots.map((ws, i) => (
                      <span
                        key={i}
                        className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium"
                      >
                        {ws}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-red-500 mt-2">
                    Focus on these sub-concepts in your next study session.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                  <p className="text-sm font-semibold text-emerald-700">
                    🎉 Perfect score! You&apos;ve mastered all sub-concepts in this topic.
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={handleRetry}
                  className="px-4 py-2.5 text-sm font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all"
                >
                  Retry Quiz
                </button>
                <Link
                  href={`/practice/${subject}/${topic}`}
                  className="px-4 py-2.5 text-sm font-semibold rounded-xl text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: "#8B5CF6" }}
                >
                  🧩 Practice by Sub-topic →
                </Link>
                <Link
                  href={`/daily/${subject}/${topic}`}
                  className="px-4 py-2.5 text-sm font-semibold rounded-xl text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: accent }}
                >
                  ⏱ 10-min Study →
                </Link>
                <Link
                  href={`/bloom/${subject}/${topic}`}
                  className="px-4 py-2.5 text-sm font-semibold rounded-xl border-2 transition-all hover:opacity-80"
                  style={{ color: accent, borderColor: accent }}
                >
                  📊 Bloom Plan →
                </Link>
              </div>
            </div>

            {/* ── Bloom Assessment */}
            {Object.keys(bloomResults).length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-black text-gray-900 text-sm">
                      📊 Bloom&apos;s Assessment
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Cognitive level per sub-concept based on your quiz performance
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {Object.entries(bloomResults).map(([sc, level]) => {
                    const info = getBloomInfo(level);
                    return (
                      <div
                        key={sc}
                        className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-xl"
                        style={{ backgroundColor: info.bgColor }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{sc}</p>
                          <p className="text-xs mt-0.5" style={{ color: info.textColor }}>
                            {info.description}
                          </p>
                        </div>
                        <BloomBadge level={level} size="xs" />
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <span className="font-semibold">What this means:</span> Each level shows
                    where you are on Bloom&apos;s Taxonomy — from Remembering (L1) to Creating
                    (L6). Use the Bloom Plan to advance each sub-concept to the next level.
                  </p>
                </div>

                <Link
                  href={`/bloom/${subject}/${topic}`}
                  className="flex items-center justify-center gap-2 mt-4 w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: accent }}
                >
                  Open Adaptive Bloom Plan →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ── Question list */}
        <div className="space-y-4">
          {questions.map((q, i) => (
            <QuizQuestion
              key={q.id}
              q={q}
              idx={i}
              selected={answers[i]}
              onSelect={(opt) => handleSelect(i, opt)}
              submitted={submitted}
              topicSlug={topic}
            />
          ))}
        </div>

        {/* ── Submit section */}
        {!submitted && (
          <div className="mt-6">
            {warn && (
              <div className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-3">
                ⚠ Please answer all {questions.length} questions before submitting. (
                {questions.length - answered} remaining)
              </div>
            )}
            <button
              onClick={handleSubmit}
              className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all hover:opacity-90 active:scale-95 shadow-lg"
              style={{ backgroundColor: accent }}
            >
              Submit Quiz ({answered}/{questions.length} answered)
            </button>
          </div>
        )}

        {/* ── Back link */}
        <div className="mt-8 text-center">
          <Link href="/topics" className="text-sm text-gray-400 hover:text-gray-600">
            ← Back to all topics
          </Link>
        </div>
      </div>
    </div>
  );
}

