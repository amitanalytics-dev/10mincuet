"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PublicNav } from "../components/PublicNav";
import { enqueueWrongAnswer } from "../lib/revisionQueue";

export type DiagQuestion = {
  id: string;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
  area: string;
  topic: string;
};

type Stream = "science" | "commerce" | "humanities";

const STREAMS: { key: Stream; label: string; emoji: string; subjects: string }[] = [
  { key: "science", label: "Science", emoji: "🔬", subjects: "Physics · Chemistry · Biology · Maths" },
  { key: "commerce", label: "Commerce", emoji: "📊", subjects: "Accountancy · Business Studies · Economics" },
  { key: "humanities", label: "Humanities", emoji: "🏛️", subjects: "History · Geography · Political Science" },
];

export function DiagnosticClient({
  data,
}: {
  data: {
    english: DiagQuestion[];
    general: DiagQuestion[];
    science: DiagQuestion[];
    commerce: DiagQuestion[];
    humanities: DiagQuestion[];
  };
}) {
  const [stream, setStream] = useState<Stream | null>(null);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ q: DiagQuestion; correct: boolean }[]>([]);

  const questions = useMemo<DiagQuestion[]>(() => {
    if (!stream) return [];
    return [...data.english, ...data.general, ...data[stream]];
  }, [stream, data]);

  // ── Step 1: stream picker ──
  if (!stream) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicNav />
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <div className="inline-block bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            Free · No signup · 2 minutes
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
            Where do you stand for CUET?
          </h1>
          <p className="text-gray-500 mb-8">
            6 quick questions — 2 English, 2 General Test, 2 from your stream.
            Instant feedback after every answer.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {STREAMS.map((s) => (
              <button
                key={s.key}
                onClick={() => setStream(s.key)}
                className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-orange-400 hover:shadow-lg transition-all text-center active:scale-95"
              >
                <div className="text-4xl mb-2">{s.emoji}</div>
                <div className="font-black text-gray-900 mb-1">{s.label}</div>
                <div className="text-xs text-gray-400 leading-relaxed">{s.subjects}</div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-6">
            Not sure? Pick the stream you&apos;re studying in Class 11/12 — you can retake any time.
          </p>
        </div>
      </div>
    );
  }

  // ── Step 3: result screen ──
  if (idx >= questions.length) {
    const score = answers.filter((a) => a.correct).length;
    const byArea = new Map<string, { total: number; wrong: number }>();
    for (const a of answers) {
      const cur = byArea.get(a.q.area) ?? { total: 0, wrong: 0 };
      cur.total += 1;
      if (!a.correct) cur.wrong += 1;
      byArea.set(a.q.area, cur);
    }
    let weakest: string | null = null;
    let weakestRate = 0;
    for (const [area, v] of byArea) {
      const rate = v.wrong / v.total;
      if (rate > weakestRate) {
        weakestRate = rate;
        weakest = area;
      }
    }
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicNav />
        <div className="max-w-xl mx-auto px-4 py-12 text-center">
          <div className="text-6xl mb-4">{score >= 5 ? "🏆" : score >= 3 ? "💪" : "🌱"}</div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            You scored {score}/6
          </h1>
          <p className="text-gray-500 mb-6">
            {score >= 5
              ? "Strong base. Now it's about consistency until exam day."
              : score >= 3
              ? "Decent start — a few weak spots are costing you marks."
              : "Lots of headroom. The good news: CUET rewards daily practice fast."}
          </p>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 text-left mb-4">
            <div className="text-xs font-black uppercase tracking-widest text-orange-500 mb-3">
              Your breakdown
            </div>
            {[...byArea.entries()].map(([area, v]) => (
              <div key={area} className="flex items-center justify-between py-1.5 text-sm">
                <span className="text-gray-700">{area}</span>
                <span className={`font-bold ${v.wrong === 0 ? "text-green-600" : v.wrong === v.total ? "text-red-500" : "text-amber-500"}`}>
                  {v.total - v.wrong}/{v.total}
                </span>
              </div>
            ))}
          </div>

          {weakest && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-6 text-left">
              <div className="text-xs font-black uppercase tracking-widest text-red-500 mb-1">
                Weakest area
              </div>
              <p className="text-sm text-gray-700">
                <strong>{weakest}</strong> needs the most work. 10 minutes a day on
                targeted sub-concepts fixes this faster than marathon sessions.
              </p>
            </div>
          )}

          <Link
            href="/register"
            className="block w-full bg-orange-500 text-white font-black text-lg py-4 rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 active:scale-95 mb-3"
          >
            Save your result — start free →
          </Link>
          <button
            onClick={() => {
              setStream(null);
              setIdx(0);
              setPicked(null);
              setAnswers([]);
            }}
            className="text-sm text-gray-400 underline hover:text-gray-600"
          >
            Retake with a different stream
          </button>
        </div>
      </div>
    );
  }

  // ── Step 2: questions with instant feedback ──
  const q = questions[idx];
  const answered = picked !== null;

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-4 text-xs font-bold">
          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full">{q.area}</span>
          <span className="text-gray-400">
            Question {idx + 1} of {questions.length}
          </span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full mb-6">
          <div
            className="h-1.5 bg-orange-500 rounded-full transition-all"
            style={{ width: `${((idx + (answered ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>

        <h2 className="text-lg font-bold text-gray-900 mb-5 leading-relaxed">{q.text}</h2>

        <div className="space-y-3">
          {q.options.map((opt, i) => {
            let cls = "bg-white border-gray-200 hover:border-orange-300";
            if (answered) {
              if (i === q.correct) cls = "bg-green-50 border-green-400";
              else if (i === picked) cls = "bg-red-50 border-red-400";
              else cls = "bg-white border-gray-100 opacity-60";
            }
            return (
              <button
                key={i}
                disabled={answered}
                onClick={() => {
                  setPicked(i);
                  setAnswers((prev) => [...prev, { q, correct: i === q.correct }]);
                  if (i !== q.correct) {
                    enqueueWrongAnswer({
                      id: q.id, text: q.text, options: q.options, correct: q.correct,
                      explanation: q.explanation, topicSlug: q.topic, area: q.area,
                    });
                  }
                }}
                className={`w-full text-left border-2 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 transition-all ${cls}`}
              >
                <span className="font-black text-gray-400 mr-2">
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
                {answered && i === q.correct && <span className="float-right">✅</span>}
                {answered && i === picked && i !== q.correct && (
                  <span className="float-right">❌</span>
                )}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-5">
            <div
              className={`rounded-xl p-4 text-sm leading-relaxed mb-4 ${
                picked === q.correct
                  ? "bg-green-50 border border-green-100 text-green-800"
                  : "bg-amber-50 border border-amber-100 text-amber-800"
              }`}
            >
              <strong>{picked === q.correct ? "Correct! " : "Not quite. "}</strong>
              {q.explanation}
            </div>
            <button
              onClick={() => {
                setIdx(idx + 1);
                setPicked(null);
              }}
              className="w-full bg-orange-500 text-white font-black py-3.5 rounded-2xl hover:bg-orange-600 transition-all active:scale-95"
            >
              {idx + 1 === questions.length ? "See my result →" : "Next question →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
