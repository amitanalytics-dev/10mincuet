"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { useState } from "react";
import { PricingModal } from "@/app/components/PricingModal";

export default function PreviousPapersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examType = (searchParams.get("exam") || "neet") as "jee" | "neet" | "cuet";

  const availableYears = useQuery(api.papers.getAvailableYears, { examType });
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showPricing, setShowPricing] = useState(false);

  if (!availableYears) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading papers...</p>
        </div>
      </div>
    );
  }

  const handleSelectYear = (year: number) => {
    setSelectedYear(year);
    router.push(`/previous-papers/${year}?exam=${examType}`);
  };

  const examLabels = {
    jee: "JEE Main/Advanced",
    neet: "NEET",
    cuet: "CUET",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            📊 Previous Year Papers Analyzer
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Understand exam patterns: which topics, difficulty levels, and marks distribution.
          </p>
          <p className="text-lg text-orange-600 font-semibold">
            {examLabels[examType]} • {availableYears.length} years available
          </p>
        </div>

        {/* Exam Switcher */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {(["neet", "jee", "cuet"] as const).map((exam) => (
            <button
              key={exam}
              onClick={() => router.push(`/previous-papers?exam=${exam}`)}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                examType === exam
                  ? "bg-orange-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-500"
              }`}
            >
              {examLabels[exam]}
            </button>
          ))}
        </div>

        {/* Year Selection Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Select Year to Analyze</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => handleSelectYear(year)}
                className="p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-orange-500 hover:bg-orange-50 transition-all font-black text-lg text-gray-900"
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border-2 border-blue-200">
            <div className="text-4xl mb-2">📈</div>
            <h3 className="font-black text-gray-900 mb-2">Topic Frequency</h3>
            <p className="text-sm text-gray-600">
              See which topics repeat across years and their frequency
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-green-200">
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="font-black text-gray-900 mb-2">Difficulty Levels</h3>
            <p className="text-sm text-gray-600">
              Understand Bloom's levels distribution (Easy to Expert)
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-purple-200">
            <div className="text-4xl mb-2">💡</div>
            <h3 className="font-black text-gray-900 mb-2">Mark Distribution</h3>
            <p className="text-sm text-gray-600">
              Know exactly how many marks per subject and subtopic
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-2xl p-8 border-2 border-orange-200 text-center">
          <p className="text-gray-600 mb-4">
            ✨ <span className="font-bold">Free tier:</span> Access 1 year analysis
          </p>
          <button
            onClick={() => setShowPricing(true)}
            className="px-6 py-3 bg-orange-600 text-white font-black rounded-lg hover:bg-orange-700"
          >
            Unlock All Years
          </button>
        </div>
      </div>

      {showPricing && <PricingModal onClose={() => setShowPricing(false)} />}
    </div>
  );
}
