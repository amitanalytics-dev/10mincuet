"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function DPPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examType = (searchParams.get("exam") || "neet") as "jee" | "neet" | "cuet";

  const { user } = useUser();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const dppData = useQuery(
    user ? api.questions.getTodayDPP, { userId: user.sub as any, examType } : "skip"
  );

  const submitResponse = useMutation(api.questions.submitDPPResponse);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-bold mb-4">Please sign in to access DPP</p>
          <button
            onClick={() => router.push("/api/auth/login")}
            className="px-6 py-3 bg-orange-600 text-white font-bold rounded-lg"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (!dppData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const currentQuestion = dppData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / dppData.questions.length) * 100;
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = Object.values(selectedAnswers).filter(
    (ans) => ans === dppData.questions[currentQuestionIndex]?.correctAnswer
  ).length;

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answer,
    });
  };

  const handleSubmitDPP = async () => {
    if (user && currentQuestion) {
      await submitResponse({
        userId: user.sub as any,
        examType,
        questionId: currentQuestion.id as any,
        selectedAnswer: selectedAnswers[currentQuestionIndex] || "",
        timeTaken: 60, // placeholder
      });
    }
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-gray-900">📝 Daily Practice (DPP)</h1>
            <p className="text-gray-600 mt-2">
              Today's curated questions • {dppData.questions.length} problems • {dppData.targetTime / 60} min
            </p>
          </div>
          <button
            onClick={() => router.push("/question-bank")}
            className="px-4 py-2 bg-gray-200 text-gray-900 font-bold rounded-lg hover:bg-gray-300"
          >
            ← Back
          </button>
        </div>

        {/* Topics Focus */}
        <div className="bg-white rounded-2xl p-6 border-2 border-orange-200 mb-8">
          <h3 className="font-bold text-gray-900 mb-3">Today's Focus Topics</h3>
          <div className="flex gap-2 flex-wrap">
            {dppData.topicsFocused.map((t) => (
              <span
                key={t.topic}
                className="px-4 py-2 bg-orange-100 text-orange-900 rounded-full font-semibold text-sm"
              >
                {t.subject}: {t.topic}
              </span>
            ))}
          </div>
        </div>

        {!showResults ? (
          <>
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="font-bold text-gray-900">
                  Question {currentQuestionIndex + 1}/{dppData.questions.length}
                </span>
                <span className="text-sm text-gray-600">
                  Answered: {answeredCount}/{dppData.questions.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 mb-8">
              {/* Metadata */}
              <div className="flex gap-3 mb-6">
                <span className="text-xs px-3 py-1 bg-blue-100 text-blue-900 rounded-full font-bold">
                  L{currentQuestion.bloomLevel}
                </span>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold ${
                    currentQuestion.difficulty === "easy"
                      ? "bg-green-100 text-green-900"
                      : currentQuestion.difficulty === "medium"
                      ? "bg-yellow-100 text-yellow-900"
                      : "bg-red-100 text-red-900"
                  }`}
                >
                  {currentQuestion.difficulty === "easy"
                    ? "Easy"
                    : currentQuestion.difficulty === "medium"
                    ? "Medium"
                    : "Hard"}
                </span>
                <span className="text-xs px-3 py-1 bg-purple-100 text-purple-900 rounded-full font-bold">
                  ⏱️ {currentQuestion.estimatedTime}s
                </span>
              </div>

              {/* Question */}
              <h2 className="text-2xl font-black text-gray-900 mb-8">
                {currentQuestion.question}
              </h2>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {currentQuestion.options?.map((option: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(option)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all font-semibold ${
                      selectedAnswers[currentQuestionIndex] === option
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 bg-white hover:border-orange-500"
                    }`}
                  >
                    <span className="inline-block w-8 h-8 rounded-full border-2 border-current mr-3 text-center leading-6">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex gap-4 justify-between">
                <button
                  onClick={() =>
                    setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
                  }
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-3 bg-gray-200 text-gray-900 font-bold rounded-lg disabled:opacity-50"
                >
                  ← Previous
                </button>

                {currentQuestionIndex === dppData.questions.length - 1 ? (
                  <button
                    onClick={handleSubmitDPP}
                    disabled={answeredCount < dppData.questions.length}
                    className="px-6 py-3 bg-orange-600 text-white font-bold rounded-lg disabled:opacity-50 hover:bg-orange-700"
                  >
                    Submit DPP
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      setCurrentQuestionIndex(
                        Math.min(dppData.questions.length - 1, currentQuestionIndex + 1)
                      )
                    }
                    className="px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700"
                  >
                    Next →
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Results Screen */
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border-2 border-green-200 p-12 text-center">
            <div className="mb-8">
              <div className="text-7xl font-black text-orange-600 mb-4">
                {Math.round(
                  (Object.values(selectedAnswers).filter(
                    (ans) =>
                      ans === dppData.questions[currentQuestionIndex]?.correctAnswer
                  ).length /
                    dppData.questions.length) *
                    100
                )}
                %
              </div>
              <p className="text-2xl font-black text-gray-900">Great Effort!</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
                <div className="text-4xl font-black text-green-600">
                  {Object.keys(selectedAnswers).length}
                </div>
                <p className="text-gray-600 font-semibold">Questions Solved</p>
              </div>
              <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
                <div className="text-4xl font-black text-blue-600">
                  {Math.ceil((dppData.targetTime / 60) * 0.8)} min
                </div>
                <p className="text-gray-600 font-semibold">Time Used</p>
              </div>
              <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
                <div className="text-4xl font-black text-purple-600">+25 XP</div>
                <p className="text-gray-600 font-semibold">Points Earned</p>
              </div>
            </div>

            <button
              onClick={() => router.push("/dpp")}
              className="px-8 py-4 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 text-lg"
            >
              Tomorrow's DPP →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
