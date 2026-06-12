"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { NavActions } from "../../../components/NavActions";
import { subjects } from "../../../data/topics";
import { slugify } from "../../../utils/slug";
import {
  getBloomInfo,
  getTopicProgress,
  markGatePassed,
  gateBank,
  BLOOM_LEVELS,
  type BloomLevel,
  type SubConceptProgress,
  type GateQuestion,
} from "../../../data/bloom";
import { BloomBadge, BloomBar } from "../../../components/BloomBadge";
import { getTopicBloomDistribution, getTopicJEEBloomLevel } from "../../../data/questions";

// ─── Activity map: Bloom level → what to do in a study session ───────────────
const LEVEL_ACTIVITY: Record<
  BloomLevel,
  { action: string; target: string; mins: number }
> = {
  1: { action: "Read formulas aloud, then copy 3 key ones by hand", target: "formulas", mins: 5 },
  2: { action: "Study worked examples and explain each step out loud", target: "examples", mins: 8 },
  3: { action: "Solve 2 quick-fire problems without looking at notes", target: "quickfire", mins: 6 },
  4: { action: "Before each problem: write which concept applies, then solve", target: "quickfire", mins: 8 },
  5: { action: "Find the flaw in these gate questions, then explain why", target: "gate", mins: 8 },
  6: { action: "Derive the main formula from first principles — no peeking", target: "gate", mins: 10 },
};

// ─── Gate quiz for one sub-concept ───────────────────────────────────────────

function GateQuizPanel({
  questions,
  subConcept,
  level,
  topicSlug,
  accent,
  onPassed,
  onClose,
}: {
  questions: GateQuestion[];
  subConcept: string;
  level: BloomLevel;
  topicSlug: string;
  accent: string;
  onPassed: () => void;
  onClose: () => void;
}) {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const letters = ["A", "B", "C", "D"];

  const score = submitted
    ? answers.filter((a, i) => a !== null && a === questions[i]?.correct).length
    : 0;
  const passed = submitted && score >= 2;

  function handleSubmit() {
    if (answers.some((a) => a === null)) return;
    setSubmitted(true);
    if (answers.filter((a, i) => a === questions[i]?.correct).length >= 2) {
      markGatePassed(topicSlug, subConcept, level);
    }
  }

  if (passed) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="font-black text-emerald-700 text-lg mb-1">Gate cleared!</h3>
        <p className="text-sm text-emerald-600 mb-2">
          You scored {score}/{questions.length} — level advanced to{" "}
          <strong>L{(level + 1) as BloomLevel}</strong>.
        </p>
        <BloomBadge level={(level + 1) as BloomLevel} size="md" />
        <button
          onClick={onPassed}
          className="mt-4 w-full py-3 rounded-xl font-bold text-white text-sm"
          style={{ backgroundColor: accent }}
        >
          Continue →
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-black text-gray-900 text-sm">
          🔑 Gate Quiz — {subConcept}
        </h3>
        <button onClick={onClose} className="text-gray-400 text-xs hover:text-gray-600">
          ✕ Close
        </button>
      </div>
      <p className="text-xs text-gray-400 mb-5">
        Score ≥ 2/3 to advance from L{level} → L{level + 1}. Answer all questions first.
      </p>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((q, qi) => (
          <div key={q.id} className="border border-gray-100 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-800 mb-3 leading-relaxed">{q.text}</p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                let cls = "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 cursor-pointer";
                if (submitted) {
                  if (oi === q.correct) cls = "bg-emerald-50 border-emerald-300 text-emerald-800";
                  else if (oi === answers[qi]) cls = "bg-red-50 border-red-300 text-red-800";
                  else cls = "bg-gray-50 border-gray-100 text-gray-400";
                } else if (answers[qi] === oi) {
                  cls = "bg-blue-50 border-blue-300 text-blue-800";
                }
                return (
                  <button
                    key={oi}
                    disabled={submitted}
                    onClick={() => {
                      if (submitted) return;
                      setAnswers((prev) => {
                        const next = [...prev];
                        next[qi] = oi;
                        return next;
                      });
                    }}
                    className={`w-full text-left text-xs px-3 py-2.5 rounded-lg border transition-all ${cls}`}
                  >
                    <span className="font-bold mr-1.5">{letters[oi]}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {submitted && (
              <div className={`mt-2 text-xs rounded-lg px-3 py-2 leading-relaxed ${answers[qi] === q.correct ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                <strong>{answers[qi] === q.correct ? "✓ " : "✗ "}</strong>
                {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Result / submit */}
      {submitted && !passed && (
        <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
          <p className="text-sm font-semibold text-amber-700">
            Score: {score}/3 — need 2+ to advance. Review the explanations above and try again.
          </p>
          <button
            onClick={() => {
              setAnswers(Array(questions.length).fill(null));
              setSubmitted(false);
            }}
            className="mt-2 text-xs font-semibold text-amber-700 underline"
          >
            Retry gate quiz
          </button>
        </div>
      )}

      {!submitted && (
        <button
          disabled={answers.some((a) => a === null)}
          onClick={handleSubmit}
          className="w-full mt-5 py-3 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-40"
          style={{ backgroundColor: accent }}
        >
          Submit ({answers.filter((a) => a !== null).length}/{questions.length} answered)
        </button>
      )}
    </div>
  );
}

// ─── Sub-concept progress card ────────────────────────────────────────────────

function SubConceptCard({
  name,
  progress,
  accent,
  onStartGate,
}: {
  name: string;
  progress: SubConceptProgress | null;
  accent: string;
  onStartGate: () => void;
}) {
  const level = progress?.bloomLevel ?? 1;
  const info = getBloomInfo(level);
  const nextLevel = level < 6 ? level + 1 : null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{name}</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-snug">{info.description}</p>
        </div>
        <BloomBadge level={level} size="xs" />
      </div>

      <BloomBar level={level} />

      {progress && (
        <p className="text-[10px] text-gray-400 mt-2">
          Last quiz: {progress.lastQuizScore}% · Gates passed: {progress.gatesPassed.length}
        </p>
      )}

      {nextLevel && (
        <button
          onClick={onStartGate}
          className="mt-3 w-full py-2 rounded-lg text-xs font-semibold border-2 transition-all hover:opacity-80"
          style={{ color: accent, borderColor: accent }}
        >
          Take gate test → advance to L{nextLevel}
        </button>
      )}

      {level === 6 && (
        <div className="mt-3 text-center text-xs font-semibold text-purple-600 bg-purple-50 rounded-lg py-2">
          ✨ Maximum level reached — Master
        </div>
      )}
    </div>
  );
}

// ─── Adaptive 15-min plan ─────────────────────────────────────────────────────

function AdaptivePlan({
  progress,
  subject,
  topic,
  accent,
}: {
  progress: Record<string, SubConceptProgress>;
  subject: string;
  topic: string;
  accent: string;
}) {
  const items = Object.entries(progress)
    .map(([sc, prog]) => ({ sc, level: prog.bloomLevel }))
    .sort((a, b) => a.level - b.level); // weakest first

  const totalMins = items.reduce((s, it) => s + LEVEL_ACTIVITY[it.level].mins, 0);
  const capped = totalMins > 15; // if too long, trim to 15 min

  // Take items until we hit 15 min
  let runningMins = 0;
  const planItems: typeof items = [];
  for (const item of items) {
    const act = LEVEL_ACTIVITY[item.level];
    if (capped && runningMins + act.mins > 15) break;
    planItems.push(item);
    runningMins += act.mins;
  }

  if (planItems.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl p-4 text-center text-sm text-gray-400">
        No sub-concept data yet. Take a quiz first.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">⏱</span>
        <div>
          <p className="text-sm font-bold text-gray-800">Today&apos;s Adaptive Plan</p>
          <p className="text-xs text-gray-400">~{runningMins} min · prioritised by your weakest levels</p>
        </div>
      </div>

      {planItems.map(({ sc, level }, i) => {
        const act = LEVEL_ACTIVITY[level];
        const info = getBloomInfo(level);
        const target =
          act.target === "gate"
            ? `/bloom/${subject}/${topic}`
            : `/daily/${subject}/${topic}`;

        return (
          <Link
            key={sc}
            href={target}
            className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:shadow-sm transition-all"
          >
            <span
              className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white"
              style={{ backgroundColor: info.color }}
            >
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800 truncate">{sc}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-snug">{act.action}</p>
            </div>
            <div className="shrink-0 text-right">
              <BloomBadge level={level} size="xs" />
              <p className="text-[10px] text-gray-400 mt-1">{act.mins} min</p>
            </div>
          </Link>
        );
      })}

      <Link
        href={`/daily/${subject}/${topic}`}
        className="flex items-center justify-center gap-2 mt-2 w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
        style={{ backgroundColor: accent }}
      >
        Start Study Session →
      </Link>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type Tab = "progress" | "plan" | "gate";

export default function BloomPage({
  params,
}: {
  params: Promise<{ subject: string; topic: string }>;
}) {
  const { subject, topic } = use(params);

  const subjectData = subjects.find((s) => slugify(s.name) === subject);
  const topicData = subjectData?.topics.find((t) => slugify(t.name) === topic);

  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<Record<string, SubConceptProgress>>({});
  const [tab, setTab] = useState<Tab>("progress");
  // Gate quiz state
  const [gateSubConcept, setGateSubConcept] = useState<string | null>(null);
  const [gateLevel, setGateLevel] = useState<BloomLevel | null>(null);

  const accent = subjectData?.accent ?? "#3B82F6";
  const topicName =
    topicData?.name ??
    topic.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // All sub-concepts from topic definition
  const topicSubConcepts = topicData?.subConcepts?.map((sc) => sc.name) ?? [];

  useEffect(() => {
    setMounted(true);
    setProgress(getTopicProgress(topic));
  }, [topic]);

  // Refresh progress after gate is passed
  function handleGatePassed() {
    setProgress(getTopicProgress(topic));
    setGateSubConcept(null);
    setGateLevel(null);
    setTab("progress");
  }

  function startGate(sc: string, level: BloomLevel) {
    setGateSubConcept(sc);
    setGateLevel(level);
    setTab("gate");
  }

  // Compute overall level as average across all sub-concepts
  const progressValues = Object.values(progress);
  const avgLevel =
    progressValues.length > 0
      ? (Math.round(
          progressValues.reduce((s, p) => s + p.bloomLevel, 0) / progressValues.length
        ) as BloomLevel)
      : null;

  const hasProgress = Object.keys(progress).length > 0;

  // Gate questions for current sub-concept
  const gateKey =
    gateSubConcept && gateLevel ? `${topic}__L${gateLevel}` : null;
  const gateQuestions: GateQuestion[] =
    gateKey && gateBank[gateKey] ? gateBank[gateKey] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Sticky header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link href="/topics" className="text-xs text-gray-400 hover:text-gray-600">
            ← All Topics
          </Link>
          <div className="flex items-center justify-between mt-0.5">
            <div>
              <h1 className="font-black text-gray-900 text-base">{topicName}</h1>
              <p className="text-xs text-gray-400">Bloom&apos;s Taxonomy Progress</p>
            </div>
            <div className="flex items-center gap-2">
              {mounted && avgLevel && (
                <BloomBadge level={avgLevel} size="sm" />
              )}
              <NavActions />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* ── CUET vs You gap card */}
        {(() => {
          const jeeLevel = getTopicJEEBloomLevel(topic);
          const jeeDist = getTopicBloomDistribution(topic);
          const totalQ = Object.values(jeeDist).reduce((s, n) => s + (n ?? 0), 0);
          const jeeInfo = getBloomInfo(jeeLevel);
          if (totalQ === 0) return null;
          return (
            <div className="mb-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                What CUET UG tests on this topic
              </p>
              {/* Distribution bar */}
              <div className="flex gap-1 h-5 rounded-lg overflow-hidden mb-2">
                {([2, 3, 4] as BloomLevel[]).map((lvl) => {
                  const count = jeeDist[lvl] ?? 0;
                  const pct = totalQ > 0 ? Math.round((count / totalQ) * 100) : 0;
                  if (pct === 0) return null;
                  const info = getBloomInfo(lvl);
                  return (
                    <div
                      key={lvl}
                      className="flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ width: `${pct}%`, backgroundColor: info.color }}
                    >
                      {pct >= 18 ? `L${lvl} ${pct}%` : pct >= 10 ? `${pct}%` : ""}
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-3 mb-3">
                {([2, 3, 4] as BloomLevel[]).map((lvl) => {
                  const count = jeeDist[lvl] ?? 0;
                  if (count === 0) return null;
                  const pct = Math.round((count / totalQ) * 100);
                  const info = getBloomInfo(lvl);
                  return (
                    <span key={lvl} className="text-[10px] text-gray-500 flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: info.color }} />
                      L{lvl} {info.name} · {pct}%
                    </span>
                  );
                })}
              </div>

              {/* Gap indicator */}
              {mounted && avgLevel !== null && (
                <div
                  className={`rounded-xl px-4 py-3 flex items-center gap-3 ${
                    avgLevel >= jeeLevel
                      ? "bg-emerald-50 border border-emerald-100"
                      : "bg-amber-50 border border-amber-100"
                  }`}
                >
                  <div className="text-lg">{avgLevel >= jeeLevel ? "✅" : "⚠️"}</div>
                  <div>
                    {avgLevel >= jeeLevel ? (
                      <p className="text-sm font-semibold text-emerald-700">
                        You&apos;re at L{avgLevel} — at or above CUET&apos;s dominant L{jeeLevel}. You&apos;re ready.
                      </p>
                    ) : (
                      <p className="text-sm font-semibold text-amber-700">
                        You&apos;re at L{avgLevel} · CUET tests at L{jeeLevel}{" "}
                        <span className="font-normal text-amber-600">({jeeInfo.name})</span>.{" "}
                        Close {jeeLevel - avgLevel} level{jeeLevel - avgLevel > 1 ? "s" : ""} to be exam-ready.
                      </p>
                    )}
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Based on analysis of CUET UG 2015–2025 papers
                    </p>
                  </div>
                </div>
              )}

              {!mounted || avgLevel === null ? (
                <div className="rounded-xl px-4 py-3 bg-gray-50 border border-gray-100">
                  <p className="text-xs text-gray-500">
                    Take the quiz to see your gap vs CUET&apos;s level.
                  </p>
                </div>
              ) : null}
            </div>
          );
        })()}

        {/* ── No data state */}
        {mounted && !hasProgress && (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center mb-6">
            <div className="text-4xl mb-3">📊</div>
            <h2 className="font-black text-gray-800 text-lg mb-2">
              No quiz data yet
            </h2>
            <p className="text-sm text-gray-500 mb-5 max-w-xs mx-auto">
              Take the practice quiz first. Your Bloom level per sub-concept gets
              computed automatically from your score.
            </p>
            <Link
              href={`/quiz/${subject}/${topic}`}
              className="inline-block px-5 py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
              style={{ backgroundColor: accent }}
            >
              Take Practice Quiz →
            </Link>
          </div>
        )}

        {/* ── Tabs (only when there's data) */}
        {mounted && hasProgress && (
          <>
            <div className="flex gap-2 mb-6">
              {(
                [
                  { id: "progress" as Tab, label: "📊 My Levels" },
                  { id: "plan" as Tab, label: "⏱ 15-min Plan" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all border ${
                    tab === t.id
                      ? "text-white shadow-md border-transparent"
                      : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                  style={tab === t.id ? { backgroundColor: accent } : {}}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* ── Gate quiz panel */}
            {tab === "gate" && gateSubConcept && gateLevel !== null && (
              <div className="mb-4">
                {gateQuestions.length > 0 ? (
                  <GateQuizPanel
                    questions={gateQuestions}
                    subConcept={gateSubConcept}
                    level={gateLevel}
                    topicSlug={topic}
                    accent={accent}
                    onPassed={handleGatePassed}
                    onClose={() => setTab("progress")}
                  />
                ) : (
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                    <p className="text-sm font-semibold text-amber-700 mb-1">
                      Gate questions for L{gateLevel} coming soon
                    </p>
                    <p className="text-xs text-amber-600 mb-3">
                      We&apos;re adding gate questions for this topic. For now, retake the
                      quiz and aim for a higher score to advance your level.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTab("progress")}
                        className="text-xs font-semibold text-amber-700 underline"
                      >
                        Back to progress
                      </button>
                      <span className="text-amber-300">·</span>
                      <Link
                        href={`/quiz/${subject}/${topic}`}
                        className="text-xs font-semibold text-amber-700 underline"
                      >
                        Retake quiz →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Progress tab */}
            {tab === "progress" && (
              <div className="space-y-3">
                {/* Overall bloom overview */}
                <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Overall Bloom Progress
                  </p>
                  <div className="flex gap-1 mb-2">
                    {BLOOM_LEVELS.map((bl) => {
                      const count = progressValues.filter(
                        (p) => p.bloomLevel === bl.level
                      ).length;
                      return (
                        <div key={bl.level} className="flex-1 text-center">
                          <div
                            className="rounded-md py-1.5 text-xs font-bold mb-1 transition-all"
                            style={{
                              backgroundColor: count > 0 ? bl.bgColor : "#F9FAFB",
                              color: count > 0 ? bl.textColor : "#9CA3AF",
                              border: `1px solid ${count > 0 ? bl.color + "40" : "#F3F4F6"}`,
                            }}
                          >
                            {bl.icon}
                          </div>
                          <p className="text-[9px] text-gray-400">{count}</p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[9px] text-gray-300 px-1">
                    {BLOOM_LEVELS.map((bl) => (
                      <span key={bl.level} className="flex-1 text-center">
                        L{bl.level}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sub-concept cards */}
                {topicSubConcepts.length > 0
                  ? topicSubConcepts.map((sc) => (
                      <SubConceptCard
                        key={sc}
                        name={sc}
                        progress={progress[sc] ?? null}
                        accent={accent}
                        onStartGate={() => {
                          const level = progress[sc]?.bloomLevel ?? 1;
                          if (level < 6) startGate(sc, level);
                        }}
                      />
                    ))
                  : Object.entries(progress).map(([sc, prog]) => (
                      <SubConceptCard
                        key={sc}
                        name={sc}
                        progress={prog}
                        accent={accent}
                        onStartGate={() => {
                          if (prog.bloomLevel < 6) startGate(sc, prog.bloomLevel);
                        }}
                      />
                    ))}

                {/* Quiz again */}
                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/quiz/${subject}/${topic}`}
                    className="flex-1 py-3 text-center text-sm font-bold rounded-xl border-2 transition-all hover:opacity-80"
                    style={{ color: accent, borderColor: accent }}
                  >
                    Retake Quiz
                  </Link>
                  <Link
                    href={`/daily/${subject}/${topic}`}
                    className="flex-1 py-3 text-center text-sm font-bold rounded-xl text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: accent }}
                  >
                    Study 10 min →
                  </Link>
                </div>
              </div>
            )}

            {/* ── Adaptive plan tab */}
            {tab === "plan" && (
              <AdaptivePlan
                progress={progress}
                subject={subject}
                topic={topic}
                accent={accent}
              />
            )}
          </>
        )}

        <div className="mt-8 text-center">
          <Link href="/topics" className="text-sm text-gray-400 hover:text-gray-600">
            ← Back to all topics
          </Link>
        </div>
      </div>
    </div>
  );
}
