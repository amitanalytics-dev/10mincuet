"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { PublicNav } from "../../../../components/PublicNav";
import {
  getFoundationClass,
  getFoundationSubject,
} from "../../../../data/foundation-topics";
import {
  getFoundationQuestions,
  type FoundationQuestion,
} from "../../../../data/foundation-questions";
import { slugify } from "../../../../utils/slug";

// Single question card (mirrors the practice/quiz page pattern).
function QuestionCard({
  q,
  idx,
  selected,
  onSelect,
  submitted,
}: {
  q: FoundationQuestion;
  idx: number;
  selected: number | null;
  onSelect: (n: number) => void;
  submitted: boolean;
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
        <p className="text-sm font-medium text-gray-800 leading-relaxed flex-1">{q.text}</p>
      </div>

      <div className="space-y-2">
        {q.options.map((opt, oi) => {
          let cls = "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 cursor-pointer";
          if (submitted) {
            if (oi === q.correct) cls = "bg-emerald-50 border-emerald-300 text-emerald-800";
            else if (oi === selected) cls = "bg-red-50 border-red-300 text-red-800";
            else cls = "bg-gray-50 border-gray-100 text-gray-400";
          } else if (selected === oi) {
            cls = "bg-emerald-50 border-emerald-300 text-emerald-800";
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
        <div className="mt-3 text-xs rounded-xl px-4 py-3 leading-relaxed bg-gray-50 text-gray-600">
          <span className="font-bold text-gray-800">Explanation: </span>
          {q.explanation}
        </div>
      )}
    </div>
  );
}

export default function FoundationQuizPage({
  params,
}: {
  params: Promise<{ classLevel: string; subject: string; topic: string }>;
}) {
  const { classLevel, subject, topic } = use(params);

  const cls = getFoundationClass(classLevel);
  const subjectBlock = getFoundationSubject(classLevel, subject);
  const topicMeta = subjectBlock?.topics.find((t) => slugify(t.name) === topic);

  const questions = useMemo(
    () => getFoundationQuestions(classLevel, subject, topic),
    [classLevel, subject, topic]
  );

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(
    () => questions.reduce((s, q) => s + (answers[q.id] === q.correct ? 1 : 0), 0),
    [answers, questions]
  );

  if (!cls || !subjectBlock || !topicMeta) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicNav />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-500 mb-4">This foundation chapter could not be found.</p>
          <Link href="/foundation" className="text-emerald-600 font-bold">
            ← Back to Foundation
          </Link>
        </div>
      </div>
    );
  }

  const accent = subjectBlock.accent;

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Link href="/foundation" className="hover:text-emerald-600">Foundation</Link>
          <span>›</span>
          <span>{cls.label}</span>
          <span>›</span>
          <span>{subjectBlock.subject}</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold px-3 py-1 rounded-full mb-2"
            style={{ backgroundColor: accent + "15", color: accent }}>
            🌱 Free Foundation
          </div>
          <h1 className="text-xl font-black text-gray-900 mb-1">{topicMeta.name}</h1>
          <p className="text-sm text-gray-500">{topicMeta.summary}</p>
          {topicMeta.feedsInto.length > 0 && (
            <p className="text-[11px] text-emerald-600 font-semibold mt-2">
              Feeds into CUET: {topicMeta.feedsInto.map((f) => f.replace(/-/g, " ")).join(", ")}
            </p>
          )}
        </div>

        {questions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
            Practice questions for this chapter are coming soon.
          </div>
        ) : (
          <>
            {/* Score banner */}
            {submitted && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
                <p className="text-sm text-emerald-700 font-semibold">You scored</p>
                <p className="text-3xl font-black text-emerald-700">
                  {score}/{questions.length}
                </p>
              </div>
            )}

            <div className="space-y-4">
              {questions.map((q, idx) => (
                <QuestionCard
                  key={q.id}
                  q={q}
                  idx={idx}
                  selected={answers[q.id] ?? null}
                  onSelect={(n) => setAnswers((prev) => ({ ...prev, [q.id]: n }))}
                  submitted={submitted}
                />
              ))}
            </div>

            <div className="flex gap-3">
              {!submitted ? (
                <button
                  onClick={() => setSubmitted(true)}
                  className="flex-1 text-white font-bold py-3 rounded-xl transition-all hover:opacity-90"
                  style={{ backgroundColor: accent }}
                >
                  Submit Answers →
                </button>
              ) : (
                <button
                  onClick={() => { setSubmitted(false); setAnswers({}); }}
                  className="flex-1 text-white font-bold py-3 rounded-xl transition-all hover:opacity-90"
                  style={{ backgroundColor: accent }}
                >
                  Try Again
                </button>
              )}
              <Link
                href="/foundation"
                className="flex-1 text-center border-2 font-bold py-3 rounded-xl transition-all hover:opacity-80"
                style={{ color: accent, borderColor: accent }}
              >
                More Chapters
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
