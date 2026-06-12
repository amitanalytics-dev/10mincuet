"use client";

import { use, useState, useEffect, useMemo } from "react";
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
  getTopicProgress,
  type BloomLevel,
  type TopicBloomProgress,
} from "../../../data/bloom";
import { BloomBadge } from "../../../components/BloomBadge";
import { getDeviceId, getDailyQuizSeed, selectDailyQuestions } from "../../../utils/quiz";
import { QuestionFeedback } from "../../../components/QuestionFeedback";
import { enqueueWrongAnswer } from "../../../lib/revisionQueue";

// ─── Types ───────────────────────────────────────────────────────────────────

type SubConceptStat = {
  name: string;
  questions: Question[];
  bloomLevel: BloomLevel | null;
};

// ─── Sub-concept selector ────────────────────────────────────────────────────

function SubConceptCard({
  sc,
  accent,
  onSelect,
  isSelected,
}: {
  sc: SubConceptStat;
  accent: string;
  onSelect: () => void;
  isSelected: boolean;
}) {
  const info = sc.bloomLevel ? getBloomInfo(sc.bloomLevel) : null;
  const qCount = sc.questions.length;

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-2xl border transition-all ${
        isSelected
          ? "border-2 shadow-sm"
          : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
      }`}
      style={
        isSelected
          ? { borderColor: accent, backgroundColor: accent + "08" }
          : {}
      }
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm truncate">{sc.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{qCount} question{qCount !== 1 ? "s" : ""} in pool</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {info ? (
            <BloomBadge level={sc.bloomLevel!} size="xs" />
          ) : (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 font-medium">
              Not attempted
            </span>
          )}
          {isSelected && (
            <span
              className="text-[10px] font-black px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: accent }}
            >
              ← Selected
            </span>
          )}
        </div>
      </div>

      {/* Bloom progress bar for this sub-concept */}
      {sc.bloomLevel && (
        <div className="mt-2 flex gap-0.5">
          {([1, 2, 3, 4, 5, 6] as BloomLevel[]).map((lvl) => {
            const lvlInfo = getBloomInfo(lvl);
            return (
              <div
                key={lvl}
                className="flex-1 h-1.5 rounded-full transition-all"
                style={{
                  backgroundColor:
                    lvl <= sc.bloomLevel! ? lvlInfo.color : "#E5E7EB",
                }}
              />
            );
          })}
        </div>
      )}
    </button>
  );
}

// ─── Single question card ────────────────────────────────────────────────────

function QuestionCard({
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
      <div className="flex items-start gap-3 mb-4">
        <span className="shrink-0 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
          {idx + 1}
        </span>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800 leading-relaxed">{q.text}</p>
          <div className="flex gap-2 mt-1.5 flex-wrap">
            {q.source === "pyq" && q.year && (
              <span className="text-[10px] px-2.5 py-0.5 bg-blue-50 text-blue-500 rounded-full font-semibold">
                CUET UG {q.year}
              </span>
            )}
          </div>
        </div>
      </div>

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
          </div>
          <QuestionFeedback
            questionId={q.id}
            topicSlug={topicSlug}
            sessionType="practice"
          />
        </>
      )}
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function PracticePage({
  params,
}: {
  params: Promise<{ subject: string; topic: string }>;
}) {
  const { subject, topic } = use(params);

  const subjectData = subjects.find((s) => slugify(s.name) === subject);
  const topicData = subjectData?.topics.find((t) => slugify(t.name) === topic);
  const accent = subjectData?.accent ?? "#3B82F6";
  const topicName =
    topicData?.name ??
    topic.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // ── All questions fetched from protected API, grouped by sub-concept
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);

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
        setAllQuestions(data.questions ?? []);
        setQuestionsLoaded(true);
      })
      .catch(() => setQuestionsLoaded(true));
  }, [topic]);

  const subConceptMap = useMemo(() => {
    const map: Record<string, Question[]> = {};
    allQuestions.forEach((q) => {
      if (!map[q.subConcept]) map[q.subConcept] = [];
      map[q.subConcept].push(q);
    });
    return map;
  }, [allQuestions]);

  // ── Load bloom progress for this topic
  const [bloomProgress, setBloomProgress] = useState<TopicBloomProgress>({});

  useEffect(() => {
    setBloomProgress(getTopicProgress(topic));
  }, [topic]);

  // ── Sub-concepts list with stats
  const subConcepts: SubConceptStat[] = useMemo(() => {
    return Object.keys(subConceptMap).map((name) => ({
      name,
      questions: subConceptMap[name],
      bloomLevel: bloomProgress[name]?.bloomLevel ?? null,
    }));
  }, [subConceptMap, bloomProgress]);

  // ── Selected sub-concept & quiz state
  const [selectedSC, setSelectedSC] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [warn, setWarn] = useState(false);
  const [bloomResult, setBloomResult] = useState<BloomLevel | null>(null);

  function startPractice(scName: string) {
    const pool = subConceptMap[scName] ?? [];
    const deviceId = getDeviceId();
    const seed = getDailyQuizSeed(`${topic}__${scName}`, deviceId);
    // Pick up to 5 questions per sub-concept session
    const selected = selectDailyQuestions(pool, 5, seed);
    setSelectedSC(scName);
    setQuestions(selected);
    setAnswers(Array(selected.length).fill(null));
    setSubmitted(false);
    setWarn(false);
    setBloomResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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
    // Spaced repetition: queue wrong answers for revision on day 2/7/21
    questions.forEach((q, i) => {
      if (answers[i] !== q.correct) {
        enqueueWrongAnswer({
          id: q.id, text: q.text, options: q.options, correct: q.correct,
          explanation: q.explanation, topicSlug: topic, subConcept: q.subConcept,
        });
      }
    });
    const correct = answers.filter(
      (a, i) => a !== null && a === questions[i]?.correct
    ).length;
    const pct = Math.round((correct / questions.length) * 100);
    const level = inferBloomLevel(pct);
    setBloomResult(level);
    updateSubConceptLevel(topic, selectedSC!, level, pct);
    // refresh bloom progress
    setBloomProgress(getTopicProgress(topic));

    // Save to localStorage
    const key = `practice_${topic}_${selectedSC}`;
    localStorage.setItem(
      key,
      JSON.stringify({ score: correct, total: questions.length, pct, date: new Date().toISOString() })
    );
  }

  function handleRetry() {
    if (!selectedSC) return;
    startPractice(selectedSC);
  }

  const answered = answers.filter((a) => a !== null).length;
  const score = submitted
    ? answers.filter((a, i) => a !== null && a === questions[i]?.correct).length
    : 0;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  // ── Sort sub-concepts: weakest first (lowest bloom, then unattempted)
  const sortedSubs = [...subConcepts].sort((a, b) => {
    if (a.bloomLevel === null && b.bloomLevel === null) return 0;
    if (a.bloomLevel === null) return -1;
    if (b.bloomLevel === null) return 1;
    return a.bloomLevel - b.bloomLevel;
  });

  // ── Loading state
  if (!questionsLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl mb-3 animate-pulse">🧩</div>
          <p className="text-sm text-gray-500">Loading sub-topics…</p>
        </div>
      </div>
    );
  }

  // ── Empty state
  if (questionsLoaded && allQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🚧</div>
          <h2 className="text-xl font-black text-gray-800">No questions yet</h2>
          <p className="text-gray-400 text-sm mt-2">
            Questions for <strong>{topicName}</strong> are coming soon.
          </p>
          <Link href="/topics" className="mt-5 inline-block text-sm font-semibold text-blue-500 hover:underline">
            ← All Topics
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <Link href="/topics" className="text-xs text-gray-400 hover:text-gray-600">
              ← All Topics
            </Link>
            <h1 className="font-black text-gray-900 text-base mt-0.5 truncate">
              {topicName}
            </h1>
            <p className="text-xs text-gray-400">
              Sub-topic Practice · {subConcepts.length} sub-concepts · {allQuestions.length} questions
            </p>
          </div>
          <div className="flex gap-2 items-center shrink-0">
            <Link
              href={`/quiz/${subject}/${topic}`}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hidden sm:block"
            >
              Full Quiz
            </Link>
            <Link
              href={`/bloom/${subject}/${topic}`}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl text-white hidden sm:block"
              style={{ backgroundColor: accent }}
            >
              Bloom Plan
            </Link>
            <NavActions />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-[280px_1fr] gap-6">
          {/* ── Left: sub-concept selector */}
          <div className="space-y-2">
            <div className="mb-3">
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">
                Sub-concepts
              </p>
              <p className="text-xs text-gray-400">
                Weakest first. Tap to practice.
              </p>
            </div>

            {sortedSubs.map((sc) => (
              <SubConceptCard
                key={sc.name}
                sc={sc}
                accent={accent}
                onSelect={() => startPractice(sc.name)}
                isSelected={selectedSC === sc.name}
              />
            ))}

            {/* Quick links */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <Link
                href={`/daily/${subject}/${topic}`}
                className="flex items-center gap-2 text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
              >
                ⏱ 10-min Study Session
              </Link>
              <Link
                href={`/bloom/${subject}/${topic}`}
                className="flex items-center gap-2 text-xs font-semibold px-3 py-2.5 rounded-xl border-2 transition-all hover:opacity-80"
                style={{ color: accent, borderColor: accent }}
              >
                📊 View Bloom Plan
              </Link>
            </div>
          </div>

          {/* ── Right: quiz panel */}
          <div>
            {!selectedSC ? (
              /* Intro state */
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
                <div className="text-5xl mb-4">🎯</div>
                <h2 className="font-black text-gray-900 text-xl mb-2">
                  Pick a sub-concept
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                  Each sub-concept has 5 targeted questions. Your Bloom level
                  updates after each session. Start with the weakest ones.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xl font-black" style={{ color: accent }}>
                      {allQuestions.length}
                    </div>
                    <div className="text-[10px] text-gray-400">Total Qs</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xl font-black text-gray-800">
                      {subConcepts.length}
                    </div>
                    <div className="text-[10px] text-gray-400">Sub-topics</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xl font-black text-gray-800">5</div>
                    <div className="text-[10px] text-gray-400">Qs/session</div>
                  </div>
                </div>
              </div>
            ) : (
              /* Quiz state */
              <div>
                {/* Sub-concept header */}
                <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
                        Practising
                      </p>
                      <p className="font-black text-gray-900">{selectedSC}</p>
                    </div>
                    {submitted && bloomResult && (
                      <div className="text-right">
                        <p className="text-xs text-gray-400 mb-1">Your level</p>
                        <BloomBadge level={bloomResult} size="sm" />
                      </div>
                    )}
                  </div>

                  {/* Score bar after submit */}
                  {submitted && (
                    <div className="mt-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="text-2xl font-black"
                          style={{ color: pct >= 60 ? "#10B981" : "#EF4444" }}
                        >
                          {score}/{questions.length}
                        </div>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: pct >= 60 ? "#10B981" : "#EF4444",
                            }}
                          />
                        </div>
                        <div className="text-sm font-black text-gray-600">{pct}%</div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {pct >= 80
                          ? "Excellent! You're at Apply level or above on this sub-concept."
                          : pct >= 60
                          ? "Good. A bit more practice and you'll be CUET-ready here."
                          : "Needs work — study this sub-concept in the 10-min session first."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Questions */}
                <div className="space-y-4">
                  {questions.map((q, i) => (
                    <QuestionCard
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

                {/* Submit / Retry */}
                {!submitted ? (
                  <div className="mt-5">
                    {warn && (
                      <div className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-3">
                        ⚠ Answer all {questions.length} questions first.
                        ({questions.length - answered} left)
                      </div>
                    )}
                    <button
                      onClick={handleSubmit}
                      className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all hover:opacity-90 active:scale-95 shadow-lg"
                      style={{ backgroundColor: accent }}
                    >
                      Submit ({answered}/{questions.length} answered)
                    </button>
                  </div>
                ) : (
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={handleRetry}
                      className="px-4 py-2.5 text-sm font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600"
                    >
                      Retry This Sub-topic
                    </button>
                    <button
                      onClick={() => {
                        // Pick next weakest sub-concept
                        const sorted = [...subConcepts].sort((a, b) => {
                          if (a.bloomLevel === null) return -1;
                          if (b.bloomLevel === null) return 1;
                          return a.bloomLevel - b.bloomLevel;
                        });
                        const next = sorted.find((s) => s.name !== selectedSC);
                        if (next) startPractice(next.name);
                      }}
                      className="px-4 py-2.5 text-sm font-semibold rounded-xl text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: accent }}
                    >
                      Next Weakest Sub-topic →
                    </button>
                    <Link
                      href={`/bloom/${subject}/${topic}`}
                      className="px-4 py-2.5 text-sm font-semibold rounded-xl border-2 transition-all hover:opacity-80"
                      style={{ color: accent, borderColor: accent }}
                    >
                      📊 View Full Bloom Plan
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
