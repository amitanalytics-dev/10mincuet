"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import type { Question } from "../data/questions";
import { PublicNav } from "../components/PublicNav";
import { ShareCard } from "../components/ShareCard";
import { Analytics } from "../lib/analytics";

// ─── Types ────────────────────────────────────────────────────────────────────
// CUET UG is section-based: Languages (English), Domain Subjects and the
// General Test. Each section runs ~60 minutes; marking is +5 / −1 / 0.

type Section = "languages" | "domain" | "general";
const SECTIONS: Section[] = ["languages", "domain", "general"];

const SECTION_LABEL: Record<Section, string> = {
  languages: "English (Languages)",
  domain: "Domain Subject",
  general: "General Test",
};

const SECTION_COLOR: Record<Section, string> = {
  languages: "text-rose-700",
  domain: "text-blue-700",
  general: "text-amber-700",
};

const SECTION_BADGE: Record<Section, string> = {
  languages: "bg-rose-100 text-rose-800",
  domain: "bg-blue-100 text-blue-800",
  general: "bg-amber-100 text-amber-800",
};

const MARK_CORRECT = 5;
const MARK_WRONG = -1;
const SECTION_MINUTES = 60;

type MockQuestion = Question & { subject: Section };

interface SectionScore {
  score: number;
  correct: number;
  wrong: number;
  unattempted: number;
}

interface MockResult {
  score: number;
  maxScore: number;
  percentile: number;
  timeUsedSeconds: number;
  sectionScores: Record<Section, SectionScore>;
}

// ─── Percentile estimate (percentage-of-max based, CUET-style) ────────────────
function scoreToPercentile(score: number, maxScore: number): number {
  if (maxScore <= 0) return 0;
  const pct = (score / maxScore) * 100; // can be negative due to −1 marking
  const table: [number, number][] = [
    [80, 100],
    [70, 99.5],
    [62, 99],
    [55, 98],
    [48, 96],
    [42, 93],
    [36, 88],
    [30, 80],
    [24, 70],
    [18, 58],
    [12, 44],
    [6, 28],
    [0, 12],
    [-10, 1],
  ];
  for (let i = 0; i < table.length - 1; i++) {
    const [s1, p1] = table[i];
    const [s2, p2] = table[i + 1];
    if (pct >= s2) {
      const t = (pct - s2) / (s1 - s2);
      return Math.round((p2 + t * (p1 - p2)) * 10) / 10;
    }
  }
  return 0;
}

// ─── Timer formatter ──────────────────────────────────────────────────────────
function formatTime(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

// ─── Palette status ───────────────────────────────────────────────────────────
type QStatus = "not-visited" | "unanswered" | "answered" | "marked" | "answered-marked";

function getStatus(
  qId: string,
  answers: Record<string, number>,
  marked: Set<string>,
  visited: Set<string>
): QStatus {
  const ans = answers[qId] ?? -1;
  const isAnswered = ans !== -1;
  const isMarked = marked.has(qId);
  const isVisited = visited.has(qId);
  if (isAnswered && isMarked) return "answered-marked";
  if (isMarked) return "marked";
  if (isAnswered) return "answered";
  if (isVisited) return "unanswered";
  return "not-visited";
}

function statusColor(status: QStatus): string {
  switch (status) {
    case "not-visited":
      return "bg-gray-200 text-gray-600";
    case "unanswered":
      return "bg-red-500 text-white";
    case "answered":
      return "bg-green-600 text-white";
    case "marked":
      return "bg-purple-600 text-white";
    case "answered-marked":
      return "bg-purple-600 text-white ring-2 ring-green-400";
  }
}

// Helper: build a per-section question map.
function bySection(questions: MockQuestion[]): Record<Section, MockQuestion[]> {
  const map: Record<Section, MockQuestion[]> = { languages: [], domain: [], general: [] };
  for (const q of questions) map[q.subject].push(q);
  return map;
}

// Global (1-based) index of a question within the whole paper.
function globalIndexOf(
  sectionQs: Record<Section, MockQuestion[]>,
  section: Section,
  idx: number
): number {
  let offset = 0;
  for (const s of SECTIONS) {
    if (s === section) break;
    offset += sectionQs[s].length;
  }
  return offset + idx + 1;
}

// ─── Instructions page ────────────────────────────────────────────────────────
function InstructionsPage({
  onStart,
  sectionCounts,
}: {
  onStart: () => void;
  sectionCounts: Record<Section, number>;
}) {
  const total = SECTIONS.reduce((s, sec) => s + sectionCounts[sec], 0);
  const maxMarks = total * MARK_CORRECT;
  return (
    <div className="min-h-screen bg-gray-100">
      <PublicNav />
      <div className="flex items-center justify-center p-4 py-8">
      <div className="bg-white border border-gray-300 w-full max-w-2xl shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-orange-500 text-white px-6 py-4">
          <h1 className="text-xl font-bold">CUET UG Mock Test</h1>
          <p className="text-orange-200 text-sm mt-0.5">National Testing Agency — Computer Based Test</p>
        </div>

        <div className="p-6 space-y-5">
          {/* Test summary */}
          <div className="border border-blue-200 bg-blue-50 p-4">
            <h2 className="font-bold text-blue-800 text-sm uppercase tracking-wide mb-3">
              Test Details
            </h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Total Questions:</span>{" "}
                <span className="font-bold text-gray-800">{total}</span>
              </div>
              <div>
                <span className="text-gray-500">Sections:</span>{" "}
                <span className="font-bold text-gray-800">3 × {SECTION_MINUTES} min</span>
              </div>
              <div>
                <span className="text-gray-500">Maximum Marks:</span>{" "}
                <span className="font-bold text-gray-800">{maxMarks}</span>
              </div>
              <div>
                <span className="text-gray-500">Marking Scheme:</span>{" "}
                <span className="font-bold text-green-700">+5</span>{" "}
                / <span className="font-bold text-red-600">−1</span>{" "}
                / <span className="font-bold text-gray-500">0</span>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="border border-gray-200 p-4">
            <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-3">
              Sections
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-600">
                  <th className="text-left px-3 py-2 font-semibold">Section</th>
                  <th className="text-center px-3 py-2 font-semibold">Questions</th>
                  <th className="text-center px-3 py-2 font-semibold">Max Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {SECTIONS.map((sec) => (
                  <tr key={sec}>
                    <td className={`px-3 py-2 font-medium ${SECTION_COLOR[sec]}`}>{SECTION_LABEL[sec]}</td>
                    <td className="text-center px-3 py-2">{sectionCounts[sec]}</td>
                    <td className="text-center px-3 py-2">{sectionCounts[sec] * MARK_CORRECT}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Instructions */}
          <div className="border border-gray-200 p-4">
            <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-3">
              General Instructions
            </h2>
            <ol className="list-decimal list-inside space-y-1.5 text-sm text-gray-700">
              <li>This mock follows the CUET UG pattern: Languages, a Domain subject and the General Test.</li>
              <li>You can navigate between sections and questions at any time.</li>
              <li>Use <strong>Mark for Review</strong> to flag questions you want to revisit.</li>
              <li>Each correct answer: <strong className="text-green-700">+5 marks</strong>.</li>
              <li>Each wrong answer: <strong className="text-red-600">−1 mark</strong>.</li>
              <li>Unattempted questions: <strong className="text-gray-500">0 marks</strong>.</li>
              <li>The timer counts down across all sections. Test auto-submits at 0:00:00.</li>
              <li>Once submitted, the test cannot be resumed.</li>
            </ol>
          </div>

          {/* Palette legend */}
          <div className="border border-gray-200 p-4">
            <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-3">
              Question Palette Legend
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">1</span>
                <span>Not visited</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-red-500 flex items-center justify-center text-xs font-bold text-white">2</span>
                <span>Visited, not answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-green-600 flex items-center justify-center text-xs font-bold text-white">3</span>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-purple-600 flex items-center justify-center text-xs font-bold text-white">4</span>
                <span>Marked for review</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-purple-600 ring-2 ring-green-400 flex items-center justify-center text-xs font-bold text-white">5</span>
                <span>Answered + Marked</span>
              </div>
            </div>
          </div>

          <button
            onClick={onStart}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 text-base transition-colors"
          >
            Start Mock Test →
          </button>
          <p className="text-center text-xs text-gray-400">
            The timer starts immediately after clicking &quot;Start Mock Test&quot;
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}

// ─── Result page ──────────────────────────────────────────────────────────────
function ResultPage({
  result,
  questions,
  answers,
  onRetake,
}: {
  result: MockResult;
  questions: MockQuestion[];
  answers: Record<string, number>;
  onRetake: () => void;
}) {
  const [expandReview, setExpandReview] = useState(false);

  const goodScore = result.score >= result.maxScore * 0.5;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Header */}
        <div className="bg-orange-500 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Mock Test Complete</h1>
            <p className="text-orange-200 text-sm">CUET UG Simulation</p>
          </div>
          <div className="text-right">
            <div className="font-mono text-sm text-orange-200">
              Time used: {formatTime(result.timeUsedSeconds)}
            </div>
          </div>
        </div>

        {/* Score summary */}
        <div className="bg-white border border-gray-300 p-6">
          <div className="flex flex-wrap gap-8 items-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900">{result.score}</div>
              <div className="text-sm text-gray-500 mt-1">out of {result.maxScore}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-700">{result.percentile}</div>
              <div className="text-sm text-gray-500 mt-1">Percentile (estimated)</div>
            </div>
            <div className="flex-1 min-w-48">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 border-2 font-bold text-sm ${
                  goodScore
                    ? "border-green-500 text-green-700 bg-green-50"
                    : "border-red-400 text-red-700 bg-red-50"
                }`}
              >
                {goodScore ? "✓" : "✗"}{" "}
                Top university range:{" "}
                {goodScore ? "On track" : "Keep pushing"}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Estimated percentile from your normalized performance.
              </p>
            </div>
          </div>
        </div>

        {/* Share card */}
        <div className="bg-white border border-gray-300 p-6">
          <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide mb-4">
            Share Your Score
          </h2>
          <ShareCard
            type="rank"
            data={{ score: result.score, percentile: result.percentile }}
          />
        </div>

        {/* Section-wise breakdown */}
        <div className="bg-white border border-gray-300">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
            <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide">
              Section-wise Breakdown
            </h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase">
                <th className="text-left px-4 py-2 font-semibold">Section</th>
                <th className="text-center px-4 py-2 font-semibold">Score</th>
                <th className="text-center px-4 py-2 font-semibold">Correct</th>
                <th className="text-center px-4 py-2 font-semibold">Wrong</th>
                <th className="text-center px-4 py-2 font-semibold">Skipped</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {SECTIONS.map((sec) => {
                const ss = result.sectionScores[sec];
                const maxSec = (ss.correct + ss.wrong + ss.unattempted) * MARK_CORRECT;
                return (
                  <tr key={sec}>
                    <td className={`px-4 py-3 font-semibold ${SECTION_COLOR[sec]}`}>
                      {SECTION_LABEL[sec]}
                    </td>
                    <td className="text-center px-4 py-3 font-bold text-gray-800">
                      {ss.score}/{maxSec}
                    </td>
                    <td className="text-center px-4 py-3 text-green-700 font-medium">
                      {ss.correct}
                    </td>
                    <td className="text-center px-4 py-3 text-red-600 font-medium">
                      {ss.wrong}
                    </td>
                    <td className="text-center px-4 py-3 text-gray-400">
                      {ss.unattempted}
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-gray-50 font-bold border-t border-gray-300">
                <td className="px-4 py-3 text-gray-800">Total</td>
                <td className="text-center px-4 py-3 text-gray-900">{result.score}/{result.maxScore}</td>
                <td className="text-center px-4 py-3 text-green-700">
                  {SECTIONS.reduce((s, sec) => s + result.sectionScores[sec].correct, 0)}
                </td>
                <td className="text-center px-4 py-3 text-red-600">
                  {SECTIONS.reduce((s, sec) => s + result.sectionScores[sec].wrong, 0)}
                </td>
                <td className="text-center px-4 py-3 text-gray-400">
                  {SECTIONS.reduce((s, sec) => s + result.sectionScores[sec].unattempted, 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Review all questions */}
        <div className="bg-white border border-gray-300">
          <button
            onClick={() => setExpandReview((p) => !p)}
            className="w-full flex items-center justify-between px-4 py-3 font-bold text-gray-700 hover:bg-gray-50 transition-colors text-sm"
          >
            <span>Review All Questions ({questions.length})</span>
            <span className="text-gray-400">{expandReview ? "▲ Collapse" : "▼ Expand"}</span>
          </button>

          {expandReview && (
            <div className="border-t border-gray-200 divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {questions.map((q, idx) => {
                const userAns = answers[q.id] ?? -1;
                const isCorrect = userAns === q.correct;
                const isSkipped = userAns === -1;
                const letters = ["A", "B", "C", "D"];

                return (
                  <div key={q.id} className="px-4 py-4">
                    <div className="flex items-start gap-3">
                      <span
                        className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          isSkipped
                            ? "bg-gray-400"
                            : isCorrect
                            ? "bg-green-600"
                            : "bg-red-500"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 font-semibold ${SECTION_BADGE[q.subject]}`}>
                            {SECTION_LABEL[q.subject]}
                          </span>
                          <span
                            className={`text-xs font-semibold ${
                              isSkipped
                                ? "text-gray-400"
                                : isCorrect
                                ? "text-green-700"
                                : "text-red-600"
                            }`}
                          >
                            {isSkipped ? "Skipped (0)" : isCorrect ? "Correct (+5)" : "Wrong (−1)"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800 mb-2">{q.text}</p>
                        <div className="grid grid-cols-1 gap-1">
                          {q.options.map((opt, oi) => (
                            <div
                              key={oi}
                              className={`text-xs px-3 py-1.5 rounded ${
                                oi === q.correct
                                  ? "bg-green-100 text-green-800 font-semibold"
                                  : oi === userAns && !isCorrect
                                  ? "bg-red-100 text-red-700"
                                  : "text-gray-500"
                              }`}
                            >
                              <span className="font-bold">{letters[oi]}.</span> {opt}
                              {oi === q.correct && " ✓"}
                              {oi === userAns && !isCorrect && " (your answer)"}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2 italic">{q.explanation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pb-8">
          <button
            onClick={onRetake}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 text-sm transition-colors"
          >
            Retake Mock →
          </button>
          <Link
            href="/topics"
            className="flex-1 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-bold py-3 text-sm text-center transition-colors"
          >
            Practice Weak Topics →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Submit dialog ────────────────────────────────────────────────────────────
function SubmitDialog({
  questions,
  answers,
  marked,
  onCancel,
  onConfirm,
}: {
  questions: MockQuestion[];
  answers: Record<string, number>;
  marked: Set<string>;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const answered = questions.filter((q) => (answers[q.id] ?? -1) !== -1).length;
  const notAnswered = questions.length - answered;
  const markedCount = marked.size;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-gray-300 w-full max-w-sm shadow-xl">
        <div className="bg-orange-500 text-white px-5 py-3">
          <h2 className="font-bold">Submit Test?</h2>
        </div>
        <div className="p-5 space-y-3">
          <div className="border border-gray-200 divide-y divide-gray-100 text-sm">
            <div className="flex justify-between px-4 py-2">
              <span className="text-gray-600">Answered</span>
              <span className="font-bold text-green-700">{answered}</span>
            </div>
            <div className="flex justify-between px-4 py-2">
              <span className="text-gray-600">Not answered</span>
              <span className="font-bold text-red-600">{notAnswered}</span>
            </div>
            <div className="flex justify-between px-4 py-2">
              <span className="text-gray-600">Marked for review</span>
              <span className="font-bold text-purple-700">{markedCount}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Once submitted, you cannot change your answers. Are you sure?
          </p>
          <div className="flex gap-3 pt-1">
            <button
              onClick={onCancel}
              className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 text-sm transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main test UI ─────────────────────────────────────────────────────────────
function MockTestUI({
  questions,
  onSubmit,
}: {
  questions: MockQuestion[];
  onSubmit: (answers: Record<string, number>, timeUsed: number) => void;
}) {
  const startTimeRef = useRef(Date.now());
  const sectionQs = bySection(questions);
  const totalQuestions = questions.length;
  const totalSeconds = SECTIONS.length * SECTION_MINUTES * 60;

  const firstSection = SECTIONS.find((s) => sectionQs[s].length > 0) ?? "languages";

  const [currentSection, setCurrentSection] = useState<Section>(firstSection);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const answersRef = useRef<Record<string, number>>({});
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showPalette, setShowPalette] = useState(false);

  const currentQ = sectionQs[currentSection][currentIdx];

  useEffect(() => {
    if (currentQ) {
      setVisited((prev) => new Set([...prev, currentQ.id]));
    }
  }, [currentQ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          const used = Math.round((Date.now() - startTimeRef.current) / 1000);
          onSubmit(answersRef.current, used);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = useCallback(
    (optIdx: number) => {
      if (!currentQ) return;
      setAnswers((prev) => {
        const next = { ...prev, [currentQ.id]: optIdx };
        answersRef.current = next;
        return next;
      });
    },
    [currentQ]
  );

  const handleClear = useCallback(() => {
    if (!currentQ) return;
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[currentQ.id];
      answersRef.current = next;
      return next;
    });
  }, [currentQ]);

  function goNext() {
    const sQs = sectionQs[currentSection];
    if (currentIdx < sQs.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      const sIdx = SECTIONS.indexOf(currentSection);
      for (let i = sIdx + 1; i < SECTIONS.length; i++) {
        if (sectionQs[SECTIONS[i]].length > 0) {
          setCurrentSection(SECTIONS[i]);
          setCurrentIdx(0);
          return;
        }
      }
    }
  }

  const handleMarkAndNext = useCallback(() => {
    if (!currentQ) return;
    setMarked((prev) => new Set([...prev, currentQ.id]));
    goNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQ, currentSection, currentIdx]);

  function goPrev() {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    } else {
      const sIdx = SECTIONS.indexOf(currentSection);
      for (let i = sIdx - 1; i >= 0; i--) {
        if (sectionQs[SECTIONS[i]].length > 0) {
          setCurrentSection(SECTIONS[i]);
          setCurrentIdx(sectionQs[SECTIONS[i]].length - 1);
          return;
        }
      }
    }
  }

  function handleSaveAndNext() {
    goNext();
  }

  function jumpTo(section: Section, idx: number) {
    setCurrentSection(section);
    setCurrentIdx(idx);
  }

  function handleConfirmSubmit() {
    const used = Math.round((Date.now() - startTimeRef.current) / 1000);
    onSubmit(answers, used);
  }

  const timerColor =
    timeLeft < 300 ? "text-red-600" : timeLeft < 600 ? "text-orange-600" : "text-gray-800";

  const letters = ["A", "B", "C", "D"];
  const selectedAns = currentQ ? (answers[currentQ.id] ?? -1) : -1;
  const globalIdx = currentQ ? globalIndexOf(sectionQs, currentSection, currentIdx) : 0;
  const isLast = globalIdx === totalQuestions;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top bar with timer */}
      <div className="bg-blue-700 text-white px-4 py-2 flex items-center justify-between sticky top-0 z-20">
        <div className="font-bold text-sm">CUET UG Mock Test</div>
        <div className={`font-mono text-lg font-bold bg-white px-3 py-1 rounded ${timerColor}`}>
          {formatTime(timeLeft)}
        </div>
        <button
          onClick={() => setShowSubmitDialog(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-1.5 text-sm transition-colors"
        >
          Submit
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 48px)" }}>
        {/* Left panel — palette */}
        <div className="hidden md:flex md:w-64 md:shrink-0 bg-white border-r border-gray-300 flex-col overflow-hidden">
          <div className="border-b border-gray-300">
            {SECTIONS.filter((s) => sectionQs[s].length > 0).map((sec) => {
              const sQs = sectionQs[sec];
              const answeredInSection = sQs.filter((q) => (answers[q.id] ?? -1) !== -1).length;
              return (
                <button
                  key={sec}
                  onClick={() => { setCurrentSection(sec); setCurrentIdx(0); }}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold border-b border-gray-200 last:border-b-0 transition-colors ${
                    currentSection === sec ? "bg-blue-700 text-white" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div>{SECTION_LABEL[sec]}</div>
                  <div className={`text-[10px] mt-0.5 ${currentSection === sec ? "text-blue-200" : "text-gray-400"}`}>
                    {answeredInSection}/{sQs.length} answered
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-5 gap-1.5">
              {sectionQs[currentSection].map((q, idx) => {
                const status = getStatus(q.id, answers, marked, visited);
                const isCurrent = idx === currentIdx;
                return (
                  <button
                    key={q.id}
                    onClick={() => jumpTo(currentSection, idx)}
                    className={`w-full aspect-square text-xs font-bold rounded transition-all ${statusColor(status)} ${
                      isCurrent ? "ring-2 ring-offset-1 ring-blue-500 scale-110" : ""
                    }`}
                  >
                    {globalIndexOf(sectionQs, currentSection, idx)}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 space-y-1">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">Legend</div>
              {(
                [
                  ["not-visited", "Not visited"],
                  ["unanswered", "Not answered"],
                  ["answered", "Answered"],
                  ["marked", "Marked"],
                  ["answered-marked", "Answered + Marked"],
                ] as [QStatus, string][]
              ).map(([status, label]) => (
                <div key={status} className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded text-[9px] flex items-center justify-center font-bold ${statusColor(status)}`}>
                    &nbsp;
                  </span>
                  <span className="text-[10px] text-gray-600">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel — question */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5">
            {currentQ ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm text-gray-500 font-semibold">
                    Question {globalIdx} of {totalQuestions}
                  </span>
                  <span className={`text-xs px-2 py-0.5 font-semibold rounded ${SECTION_BADGE[currentSection]}`}>
                    {SECTION_LABEL[currentSection]}
                  </span>
                  {marked.has(currentQ.id) && (
                    <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 font-semibold rounded">
                      Marked
                    </span>
                  )}
                  <span className="ml-auto text-xs text-gray-400">+5 / −1 / 0</span>
                </div>

                <div className="bg-white border border-gray-200 p-5 mb-5">
                  <p className="text-sm text-gray-900 leading-relaxed font-medium">{currentQ.text}</p>
                </div>

                <div className="space-y-2 mb-6">
                  {currentQ.options.map((opt, oi) => {
                    const isSelected = selectedAns === oi;
                    return (
                      <button
                        key={oi}
                        onClick={() => handleSelect(oi)}
                        className={`w-full text-left text-sm px-4 py-3 border transition-colors ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 text-blue-900"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className="font-bold mr-2">{letters[oi]}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-gray-400 text-sm">No question available.</div>
            )}
          </div>

          <div className="border-t border-gray-300 bg-gray-50 px-5 py-3 flex items-center gap-2 flex-wrap">
            <button
              onClick={goPrev}
              className="px-4 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={handleMarkAndNext}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold transition-colors"
            >
              Mark for Review &amp; Next
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => setShowPalette(true)}
              className="px-4 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-colors md:hidden"
            >
              📋 Palette
            </button>
            <div className="flex-1" />
            <button
              onClick={isLast ? () => setShowSubmitDialog(true) : handleSaveAndNext}
              className={`px-5 py-2 text-white text-sm font-bold transition-colors ${
                isLast ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-700 hover:bg-blue-800"
              }`}
            >
              {isLast ? "Submit Test →" : "Save & Next →"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile palette bottom sheet */}
      {showPalette && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowPalette(false)} />
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[70vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <span className="font-bold text-sm text-gray-800">Question Palette</span>
              <button onClick={() => setShowPalette(false)} className="text-gray-400 text-xl leading-none">✕</button>
            </div>
            <div className="border-b border-gray-200">
              {SECTIONS.filter((s) => sectionQs[s].length > 0).map((sec) => {
                const sQs = sectionQs[sec];
                const answeredInSection = sQs.filter((q) => (answers[q.id] ?? -1) !== -1).length;
                return (
                  <button
                    key={sec}
                    onClick={() => { setCurrentSection(sec); setCurrentIdx(0); setShowPalette(false); }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold border-b border-gray-200 last:border-b-0 transition-colors ${
                      currentSection === sec ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{SECTION_LABEL[sec]}</span>
                    <span className={`ml-2 text-[10px] ${currentSection === sec ? "text-orange-100" : "text-gray-400"}`}>
                      {answeredInSection}/{sQs.length}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <div className="grid grid-cols-6 gap-2">
                {sectionQs[currentSection].map((q, idx) => {
                  const status = getStatus(q.id, answers, marked, visited);
                  const isCurrent = idx === currentIdx;
                  return (
                    <button
                      key={q.id}
                      onClick={() => { jumpTo(currentSection, idx); setShowPalette(false); }}
                      className={`aspect-square text-xs font-bold rounded transition-all ${statusColor(status)} ${
                        isCurrent ? "ring-2 ring-offset-1 ring-orange-500 scale-110" : ""
                      }`}
                    >
                      {globalIndexOf(sectionQs, currentSection, idx)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {showSubmitDialog && (
        <SubmitDialog
          questions={questions}
          answers={answers}
          marked={marked}
          onCancel={() => setShowSubmitDialog(false)}
          onConfirm={handleConfirmSubmit}
        />
      )}
    </div>
  );
}

// ─── Main page component ──────────────────────────────────────────────────────
function getUserClass(): "11" | "12" | "dropper" | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("jee_class_v1") as "11" | "12" | "dropper" | null;
}

export default function MockPage() {
  const [phase, setPhase] = useState<"instructions" | "test" | "result">("instructions");
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [userClass, setUserClass] = useState<"11" | "12" | "dropper" | null>(null);

  useEffect(() => {
    setUserClass(getUserClass());
  }, []);
  const [finalAnswers, setFinalAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<MockResult | null>(null);

  const sectionCounts: Record<Section, number> = {
    languages: questions.filter((q) => q.subject === "languages").length,
    domain: questions.filter((q) => q.subject === "domain").length,
    general: questions.filter((q) => q.subject === "general").length,
  };

  function computeResult(
    qs: MockQuestion[],
    ans: Record<string, number>,
    timeUsed: number
  ): MockResult {
    const sectionScores: Record<Section, SectionScore> = {
      languages: { score: 0, correct: 0, wrong: 0, unattempted: 0 },
      domain: { score: 0, correct: 0, wrong: 0, unattempted: 0 },
      general: { score: 0, correct: 0, wrong: 0, unattempted: 0 },
    };

    let totalScore = 0;
    for (const q of qs) {
      const subj = q.subject;
      const userAns = ans[q.id] ?? -1;
      if (userAns === -1) {
        sectionScores[subj].unattempted++;
      } else if (userAns === q.correct) {
        sectionScores[subj].correct++;
        sectionScores[subj].score += MARK_CORRECT;
        totalScore += MARK_CORRECT;
      } else {
        sectionScores[subj].wrong++;
        sectionScores[subj].score += MARK_WRONG;
        totalScore += MARK_WRONG;
      }
    }

    const maxScore = qs.length * MARK_CORRECT;
    const percentile = scoreToPercentile(totalScore, maxScore);

    const mockResult = {
      date: new Date().toISOString(),
      score: totalScore,
      maxScore,
      percentile,
      timeUsedSeconds: timeUsed,
      sectionScores,
    };
    try {
      const history = JSON.parse(localStorage.getItem("jee_mock_history") || "[]");
      history.unshift(mockResult);
      localStorage.setItem("jee_mock_history", JSON.stringify(history.slice(0, 10)));
    } catch {
      // localStorage may not be available
    }

    return { score: totalScore, maxScore, percentile, timeUsedSeconds: timeUsed, sectionScores };
  }

  async function loadQuestions(): Promise<boolean> {
    setLoading(true);
    setLoadError("");
    try {
      const res = await fetch("/api/questions?topic=_mock");
      if (!res.ok) {
        setLoadError("Failed to load questions. Please try again.");
        setLoading(false);
        return false;
      }
      const data: MockQuestion[] = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        setLoadError("No questions available. Please try again later.");
        setLoading(false);
        return false;
      }
      setQuestions(data);
      setLoading(false);
      return true;
    } catch {
      setLoadError("Network error. Please check your connection.");
      setLoading(false);
      return false;
    }
  }

  async function handleStart() {
    const ok = await loadQuestions();
    if (ok) setPhase("test");
  }

  function handleSubmit(ans: Record<string, number>, timeUsed: number) {
    setFinalAnswers(ans);
    const res = computeResult(questions, ans, timeUsed);
    setResult(res);
    Analytics.mockCompleted(res.score, res.percentile);
    setPhase("result");
  }

  function handleRetake() {
    setResult(null);
    setFinalAnswers({});
    setQuestions([]);
    setPhase("instructions");
  }

  if (phase === "instructions") {
    return (
      <>
        {loading && (
          <div className="fixed inset-0 bg-white/90 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="text-4xl mb-3 animate-pulse">📋</div>
              <p className="text-gray-600 font-semibold">Loading your CUET mock…</p>
            </div>
          </div>
        )}
        {loadError && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-5 py-3 shadow-lg text-sm font-semibold">
            {loadError}
          </div>
        )}
        {userClass === "11" && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 bg-blue-600 text-white px-5 py-2.5 shadow-lg text-sm font-semibold rounded-full">
            Showing Class 11 syllabus only
          </div>
        )}
        <InstructionsPage onStart={handleStart} sectionCounts={sectionCounts} />
      </>
    );
  }

  if (phase === "test") {
    if (loading || questions.length === 0) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-3 animate-pulse">📋</div>
            <p className="text-gray-600 font-semibold">Preparing your mock test…</p>
          </div>
        </div>
      );
    }
    return <MockTestUI questions={questions} onSubmit={handleSubmit} />;
  }

  if (phase === "result" && result) {
    return (
      <ResultPage
        result={result}
        questions={questions}
        answers={finalAnswers}
        onRetake={handleRetake}
      />
    );
  }

  return null;
}
