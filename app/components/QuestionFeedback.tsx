"use client";
import { useState } from "react";
import { TOKEN_KEY } from "../utils/auth";

interface Props {
  questionId: string;
  topicSlug: string;
  sessionType: "quiz" | "practice" | "bloom" | "mock";
  onDone?: () => void;
}

export function QuestionFeedback({ questionId, topicSlug, sessionType, onDone }: Props) {
  const [selected, setSelected] = useState<"easy" | "medium" | "hard" | null>(null);
  const [showError, setShowError] = useState(false);
  const [errorNote, setErrorNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submit(difficulty: "easy" | "medium" | "hard", isError = false) {
    setSubmitting(true);
    try {
      const token = localStorage.getItem(TOKEN_KEY) ?? "";
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          questionId,
          topicSlug,
          perceivedDifficulty: difficulty,
          isError,
          errorNote: isError ? errorNote : undefined,
          sessionType,
        }),
      });
    } catch {
      // Silently fail — never block quiz flow
    }
    setSubmitted(true);
    setSubmitting(false);
    onDone?.();
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
        <span>✓</span> <span>Thanks for the feedback</span>
      </div>
    );
  }

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      {!showError ? (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400">This question was:</span>
          {(["easy", "medium", "hard"] as const).map((d) => (
            <button
              key={d}
              disabled={submitting}
              onClick={() => {
                setSelected(d);
                submit(d);
              }}
              className={`text-xs px-3 py-1 rounded-full border transition-all ${
                selected === d
                  ? "bg-orange-500 text-white border-orange-500"
                  : "border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              {d === "easy" ? "😊 Too Easy" : d === "medium" ? "👌 Just Right" : "😤 Too Hard"}
            </button>
          ))}
          <button
            onClick={() => setShowError(true)}
            className="text-xs text-red-400 hover:text-red-600 ml-1"
          >
            🚩 Report Error
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={errorNote}
            onChange={(e) => setErrorNote(e.target.value)}
            placeholder="What's wrong with this question? (optional)"
            className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 resize-none focus:outline-none focus:border-orange-300"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={() => submit("medium", true)}
              disabled={submitting}
              className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-all"
            >
              Submit Report
            </button>
            <button
              onClick={() => setShowError(false)}
              className="text-xs border border-gray-200 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
