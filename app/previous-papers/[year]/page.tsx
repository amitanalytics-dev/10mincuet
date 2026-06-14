"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useState, useEffect } from "react";
import { PaperAnalysisChart } from "@/app/components/PaperAnalysisChart";
import { OtpVerificationModal } from "@/app/components/OtpVerificationModal";
import { PricingModal } from "@/app/components/PricingModal";

export default function PaperAnalysisPage({ params }: { params: { year: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examType = (searchParams.get("exam") || "neet") as "jee" | "neet" | "cuet";
  const year = parseInt(params.year);

  const { user } = useUser();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otpPhone, setOtpPhone] = useState("");
  const [isFreeTierUser, setIsFreeTierUser] = useState(false);

  const paperAnalysis = useQuery(api.papers.getPaperAnalysis, { examType, year });
  const userAccessibleYears = useQuery(
    user ? api.papers.getUserAccessibleYears, { userId: user.sub as any, examType } : "skip"
  );
  const canAccess = useQuery(
    user ? api.papers.canAccessPaper, { userId: user.sub as any, examType, year } : "skip"
  );

  useEffect(() => {
    // Check if user is authenticated and has access
    if (!user) {
      setShowOtpModal(true);
      setIsFreeTierUser(true);
    } else if (canAccess === false) {
      setShowPricing(true);
    }
  }, [user, canAccess]);

  if (!paperAnalysis) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis...</p>
        </div>
      </div>
    );
  }

  const handleOtpVerified = async () => {
    // Grant free tier access to 1 year
    if (user) {
      try {
        await (api.papers.grantPaperAccess as any)({
          userId: user.sub,
          examType,
          year,
          tier: "free",
        });
        setShowOtpModal(false);
      } catch (error) {
        console.error("Error granting access:", error);
      }
    }
  };

  if (isFreeTierUser && showOtpModal) {
    return <OtpVerificationModal onVerified={handleOtpVerified} />;
  }

  if (!user || canAccess === false) {
    return <PricingModal onClose={() => router.push("/previous-papers")} />;
  }

  const examLabels = {
    jee: "JEE Main/Advanced",
    neet: "NEET",
    cuet: "CUET",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <button
              onClick={() => router.push("/previous-papers")}
              className="text-orange-600 font-bold mb-4 hover:underline"
            >
              ← Back to Years
            </button>
            <h1 className="text-4xl font-black text-gray-900">
              {examLabels[examType]} {year} Analysis
            </h1>
            <p className="text-gray-600 mt-2">Complete pattern breakdown</p>
          </div>
          <button
            onClick={() => router.push("/previous-papers")}
            className="px-6 py-3 bg-orange-100 text-orange-600 font-bold rounded-lg hover:bg-orange-200"
          >
            Select Different Year
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <div className="text-sm text-gray-600 font-semibold mb-2">Total Marks</div>
            <div className="text-4xl font-black text-orange-600">
              {paperAnalysis.totalMarks}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <div className="text-sm text-gray-600 font-semibold mb-2">Subjects</div>
            <div className="text-4xl font-black text-blue-600">
              {paperAnalysis.subjects.length}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <div className="text-sm text-gray-600 font-semibold mb-2">Total Topics</div>
            <div className="text-4xl font-black text-green-600">
              {paperAnalysis.subjects.reduce((sum, s) => sum + s.subtopics.length, 0)}
            </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6">📊 Difficulty Distribution</h2>
          <PaperAnalysisChart paper={paperAnalysis} />
        </div>

        {/* Subject Breakdown */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6">📚 Subject-wise Breakdown</h2>
          <div className="space-y-8">
            {paperAnalysis.subjects.map((subject) => (
              <div key={subject.name} className="bg-white rounded-2xl p-6 border-2 border-gray-200">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-black text-gray-900">{subject.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {subject.totalMarks} marks • {subject.totalQuestions} questions
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-orange-600">
                      {subject.totalMarks}
                    </div>
                    <div className="text-xs text-gray-600">marks</div>
                  </div>
                </div>

                {/* Topics Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-black text-gray-900">Topic</th>
                        <th className="text-center py-3 px-4 font-black text-gray-900">
                          Bloom Level
                        </th>
                        <th className="text-center py-3 px-4 font-black text-gray-900">
                          Marks
                        </th>
                        <th className="text-center py-3 px-4 font-black text-gray-900">
                          Questions
                        </th>
                        <th className="text-center py-3 px-4 font-black text-gray-900">Pattern</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subject.subtopics.map((topic, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-orange-50">
                          <td className="py-3 px-4 text-gray-700 font-semibold">
                            {topic.name}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-black ${
                                topic.bloomLevel <= 2
                                  ? "bg-green-100 text-green-900"
                                  : topic.bloomLevel <= 4
                                  ? "bg-yellow-100 text-yellow-900"
                                  : "bg-red-100 text-red-900"
                              }`}
                            >
                              L{topic.bloomLevel}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-gray-900">
                            {topic.marks}
                          </td>
                          <td className="py-3 px-4 text-center text-gray-700">
                            {topic.questionCount}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="text-xs font-bold text-gray-600 uppercase">
                              {topic.pattern === "mcq" ? "MCQ" : "Numeric"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
          <h2 className="text-2xl font-black text-gray-900 mb-6">💡 Key Insights</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-black text-lg flex-shrink-0">→</span>
              <span className="text-gray-700">
                Most questions focus on difficulty level 3-4 (application & analysis)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-black text-lg flex-shrink-0">→</span>
              <span className="text-gray-700">
                Mixed MCQ & numeric pattern — prepare both answering types
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-black text-lg flex-shrink-0">→</span>
              <span className="text-gray-700">
                Compare with other years to identify repeating topics
              </span>
            </li>
          </ul>

          <button
            onClick={() => router.push("/previous-papers")}
            className="mt-6 px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700"
          >
            View Other Years
          </button>
        </div>
      </div>
    </div>
  );
}
