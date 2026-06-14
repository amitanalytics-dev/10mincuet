"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useState } from "react";

export function QuestionBankViewer({
  examType,
  subject,
  topic,
}: {
  examType: "jee" | "neet" | "cuet";
  subject: string;
  topic: string;
}) {
  const { user } = useUser();
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | undefined>();
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const questions = useQuery(api.questions.getQuestionsByTopic, {
    examType,
    subject,
    topic,
    difficulty,
  });

  const selectedQuestionData = selectedQuestion
    ? useQuery(api.questions.getQuestionWithSolution, {
        questionId: selectedQuestion as any,
        userId: user ? (user.sub as any) : undefined,
      })
    : null;

  const submitResponse = useMutation(api.questions.submitDPPResponse);

  if (!questions) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900">
            {subject} → {topic}
          </h1>
          <p className="text-gray-600 mt-2">
            {questions.total} questions available
          </p>
        </div>

        {/* Difficulty Filter */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 mb-8">
          <h3 className="font-bold text-gray-900 mb-4">Filter by Difficulty</h3>
          <div className="flex gap-4 flex-wrap">
            {(["easy", "medium", "hard"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(difficulty === d ? undefined : d)}
                className={`px-6 py-2 rounded-lg font-bold capitalize transition-all ${
                  difficulty === d
                    ? d === "easy"
                      ? "bg-green-500 text-white"
                      : d === "medium"
                      ? "bg-yellow-500 text-white"
                      : "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {d === "easy"
                  ? "🟢 Easy"
                  : d === "medium"
                  ? "🟡 Medium"
                  : "🔴 Hard"}
              </button>
            ))}
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Question List */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
            <div className="p-6 border-b-2 border-gray-200">
              <h2 className="font-black text-gray-900">📋 Questions</h2>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {questions.questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setSelectedQuestion(q.id);
                    setShowSolution(false);
                  }}
                  className={`w-full text-left p-4 border-b border-gray-100 hover:bg-orange-50 transition-all ${
                    selectedQuestion === q.id ? "bg-orange-100" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-sm font-bold text-gray-600">Q{idx + 1}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 line-clamp-2">
                        {q.question}
                      </p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span
                          className={`text-xs px-2 py-1 rounded font-bold ${
                            q.difficulty === "easy"
                              ? "bg-green-100 text-green-900"
                              : q.difficulty === "medium"
                              ? "bg-yellow-100 text-yellow-900"
                              : "bg-red-100 text-red-900"
                          }`}
                        >
                          {q.difficulty === "easy"
                            ? "Easy"
                            : q.difficulty === "medium"
                            ? "Medium"
                            : "Hard"}
                        </span>
                        <span className="text-xs px-2 py-1 rounded font-bold bg-blue-100 text-blue-900">
                          L{q.bloomLevel}
                        </span>
                        {q.isPYQ && (
                          <span className="text-xs px-2 py-1 rounded font-bold bg-purple-100 text-purple-900">
                            PYQ {q.pyqYear}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Question Viewer */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
            {selectedQuestionData ? (
              <div className="space-y-6">
                {/* Question */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Question</h3>
                  <p className="text-gray-800 leading-relaxed mb-6">
                    {selectedQuestionData.question}
                  </p>

                  {/* Options (if MCQ) */}
                  {selectedQuestionData.options && (
                    <div className="space-y-2">
                      {selectedQuestionData.options.map((opt: string, idx: number) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedQuestionData.correctAnswer === opt
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 hover:border-orange-500"
                          }`}
                        >
                          <span className="font-bold">
                            {String.fromCharCode(65 + idx)})
                          </span>{" "}
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Time:</span>
                    <span className="font-bold">
                      {selectedQuestionData.estimatedTimeMin}m{" "}
                      {selectedQuestionData.estimatedTimeSec}s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bloom Level:</span>
                    <span className="font-bold bg-blue-100 text-blue-900 px-2 py-1 rounded">
                      L{selectedQuestionData.bloomLevel}
                    </span>
                  </div>
                </div>

                {/* Solution */}
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="w-full py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-all"
                >
                  {showSolution ? "Hide Solution" : "Show Solution"}
                </button>

                {showSolution && selectedQuestionData.solution && (
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <h4 className="font-bold text-blue-900 mb-2">✓ Solution</h4>
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {selectedQuestionData.solution}
                    </p>

                    {selectedQuestionData.commonMistakes && (
                      <div className="mt-4 pt-4 border-t-2 border-blue-200">
                        <h5 className="font-bold text-red-900 mb-2">⚠️ Common Mistakes</h5>
                        <ul className="space-y-1 text-sm text-gray-800">
                          {selectedQuestionData.commonMistakes.map((mistake: string, idx: number) => (
                            <li key={idx}>• {mistake}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Concept Map */}
                {showSolution && selectedQuestionData.conceptMapUrl && (
                  <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                    <h4 className="font-bold text-green-900 mb-2">🧠 Concept Map</h4>
                    <img
                      src={selectedQuestionData.conceptMapUrl}
                      alt="Concept Map"
                      className="w-full rounded-lg"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 text-center">
                <p className="text-gray-600 font-semibold">
                  Select a question to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
