"use client";
import { useState } from "react";
import { AppNav } from "../components/AppNav";
import { Analytics } from "../lib/analytics";

export default function DoubtSolverPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(3); // free credits

  async function handleSolve(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || credits <= 0) return;
    Analytics.doubtAsked();
    setLoading(true);
    setAnswer("");
    try {
      const res = await fetch("/api/doubt-solver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });
      const data = await res.json();
      if (data.answer) {
        setAnswer(data.answer);
        setCredits((c) => c - 1);
      }
    } catch {
      setAnswer("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            AI Doubt Solver
          </h1>
          <p className="text-gray-500">
            Ask any CUET question. Get a step-by-step NCERT-referenced answer.
          </p>
          <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 text-sm font-semibold px-3 py-1 rounded-full mt-2">
            {credits} free solve{credits !== 1 ? "s" : ""} remaining
          </div>
        </div>

        <form
          onSubmit={handleSolve}
          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-4"
        >
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. A charge of 2μC is placed at origin. Find the electric field at (3,4) m..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none h-24 mb-4"
          />
          <button
            type="submit"
            disabled={loading || credits <= 0 || !question.trim()}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all"
          >
            {loading ? "Solving…" : credits <= 0 ? "Buy more solves" : "Solve this →"}
          </button>
        </form>

        {answer && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3">
              Step-by-step solution:
            </h3>
            <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {answer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
