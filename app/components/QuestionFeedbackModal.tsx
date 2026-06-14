"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";

export function QuestionFeedbackModal({
  questionId,
  onClose,
}: {
  questionId: string;
  onClose: () => void;
}) {
  const [ratings, setRatings] = useState({
    difficulty: 3,
    quality: 3,
    clarity: 3,
    relevance: 3,
  });
  const [notes, setNotes] = useState("");
  const submitFeedback = useMutation(api.feedback.submitQuestionFeedback);

  const handleSubmit = async () => {
    await submitFeedback({
      questionId: questionId as any,
      userId: "user_id" as any,
      examType: "neet" as any,
      difficulty: ratings.difficulty as any,
      quality: ratings.quality as any,
      clarity: ratings.clarity as any,
      relevance: ratings.relevance as any,
      notes,
      timeTaken: 60,
      correct: true,
    });
    onClose();
  };

  const StarRating = ({ label, value, onChange }: any) => (
    <div className="mb-4">
      <label className="font-semibold text-gray-900 mb-2 block">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className={`text-3xl ${value >= star ? "text-yellow-400" : "text-gray-300"}`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-black text-gray-900 mb-6">📊 Help Us Improve</h2>
        <p className="text-gray-600 mb-6">Your feedback creates our data moat. Rate this question:</p>

        <StarRating
          label="Difficulty Level"
          value={ratings.difficulty}
          onChange={(v) => setRatings({ ...ratings, difficulty: v })}
        />

        <StarRating
          label="Quality of Question"
          value={ratings.quality}
          onChange={(v) => setRatings({ ...ratings, quality: v })}
        />

        <StarRating
          label="Clarity"
          value={ratings.clarity}
          onChange={(v) => setRatings({ ...ratings, clarity: v })}
        />

        <StarRating
          label="Relevance to Exam"
          value={ratings.relevance}
          onChange={(v) => setRatings({ ...ratings, relevance: v })}
        />

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any suggestions? (optional)"
          className="w-full p-3 border-2 border-gray-200 rounded-lg mb-6 focus:outline-none focus:border-orange-500"
          rows={3}
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-900 font-bold rounded-lg hover:bg-gray-200"
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700"
          >
            Submit Feedback
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          💡 This data helps us improve DPP curation & question calibration
        </p>
      </div>
    </div>
  );
}
