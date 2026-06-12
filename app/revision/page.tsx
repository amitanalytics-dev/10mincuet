"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteNav } from "../components/SiteNav";
import {
  getDueItems,
  countQueued,
  nextDueAt,
  recordReview,
  type RevisionItem,
} from "../lib/revisionQueue";

export default function RevisionPage() {
  const [mounted, setMounted] = useState(false);
  const [due, setDue] = useState<RevisionItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [results, setResults] = useState<{ correct: number; wrong: number }>({
    correct: 0,
    wrong: 0,
  });

  useEffect(() => {
    setDue(getDueItems());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteNav />
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // ── Empty / done states ──
  if (due.length === 0 || idx >= due.length) {
    const finished = due.length > 0;
    const queued = countQueued();
    const next = nextDueAt();
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteNav />
        <div className="max-w-xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">{finished ? "🎉" : "📒"}</div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            {finished ? "Revision done for today!" : "Nothing due right now"}
          </h1>
          {finished && (
            <p className="text-gray-500 mb-4">
              {results.correct} correct · {results.wrong} to see again sooner.
              Correct answers move to a longer interval (2 → 7 → 21 days).
            </p>
          )}
          {!finished && queued > 0 && next && (
            <p className="text-gray-500 mb-4">
              {queued} question{queued === 1 ? "" : "s"} scheduled. Next batch due{" "}
              {new Date(next).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
              .
            </p>
          )}
          {!finished && queued === 0 && (
            <p className="text-gray-500 mb-4">
              Questions you get wrong in quizzes and practice land here
              automatically, then resurface on day 2, 7 and 21 — the
              spaced-repetition sweet spots.
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link
              href="/topics"
              className="bg-orange-500 text-white font-bold px-6 py-3 rounded-2xl hover:bg-orange-600 transition-all"
            >
              Practice topics →
            </Link>
            <Link
              href="/diagnostic"
              className="border-2 border-gray-200 text-gray-600 font-semibold px-6 py-3 rounded-2xl hover:border-gray-300 transition-all"
            >
              Take the diagnostic
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Review card ──
  const q = due[idx];
  const answered = picked !== null;

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteNav />
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-4 text-xs font-bold">
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
            📒 Revision · stage {q.stage + 1}/3
          </span>
          <span className="text-gray-400">
            {idx + 1} of {due.length} due
          </span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full mb-6">
          <div
            className="h-1.5 bg-purple-500 rounded-full transition-all"
            style={{ width: `${((idx + (answered ? 1 : 0)) / due.length) * 100}%` }}
          />
        </div>

        <h2 className="text-lg font-bold text-gray-900 mb-5 leading-relaxed">{q.text}</h2>

        <div className="space-y-3">
          {q.options.map((opt, i) => {
            let cls = "bg-white border-gray-200 hover:border-purple-300";
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
                  const correct = i === q.correct;
                  setPicked(i);
                  recordReview(q.id, correct);
                  setResults((r) => ({
                    correct: r.correct + (correct ? 1 : 0),
                    wrong: r.wrong + (correct ? 0 : 1),
                  }));
                }}
                className={`w-full text-left border-2 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 transition-all ${cls}`}
              >
                <span className="font-black text-gray-400 mr-2">
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
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
              <strong>
                {picked === q.correct
                  ? q.stage >= 2
                    ? "Graduated! You won't see this one again. "
                    : "Correct — next review in " + [7, 21, 21][q.stage] + " days. "
                  : "Not yet — this comes back in 2 days. "}
              </strong>
              {q.explanation}
            </div>
            <button
              onClick={() => {
                setIdx(idx + 1);
                setPicked(null);
              }}
              className="w-full bg-purple-600 text-white font-black py-3.5 rounded-2xl hover:bg-purple-700 transition-all active:scale-95"
            >
              {idx + 1 === due.length ? "Finish revision →" : "Next →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
