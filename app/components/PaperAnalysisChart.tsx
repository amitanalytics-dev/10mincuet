"use client";

import { useMemo } from "react";

interface Subtopic {
  name: string;
  bloomLevel: number;
  marks: number;
  questionCount: number;
  pattern: "mcq" | "numeric";
  frequency: number;
}

interface Subject {
  name: string;
  subtopics: Subtopic[];
  totalMarks: number;
  totalQuestions: number;
}

interface Paper {
  subjects: Subject[];
  totalMarks: number;
}

export function PaperAnalysisChart({ paper }: { paper: Paper }) {
  const { bloomDistribution, subjectMarks, topicList } = useMemo(() => {
    const bloom = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    const subject: Record<string, number> = {};
    const topics: Array<{ name: string; marks: number; level: number }> = [];

    paper.subjects.forEach((s) => {
      subject[s.name] = s.totalMarks;
      s.subtopics.forEach((t) => {
        bloom[t.bloomLevel as any]++;
        topics.push({ name: t.name, marks: t.marks, level: t.bloomLevel });
      });
    });

    return {
      bloomDistribution: bloom,
      subjectMarks: subject,
      topicList: topics.sort((a, b) => b.marks - a.marks).slice(0, 10),
    };
  }, [paper]);

  const bloomLabels = {
    1: "Remember",
    2: "Understand",
    3: "Apply",
    4: "Analyze",
    5: "Evaluate",
    6: "Create",
  };

  const bloomColors = {
    1: "#10b981",
    2: "#84cc16",
    3: "#eab308",
    4: "#f97316",
    5: "#ef4444",
    6: "#8b5cf6",
  };

  const maxBloom = Math.max(...Object.values(bloomDistribution));
  const maxMarks = Math.max(...Object.values(subjectMarks));

  return (
    <div className="space-y-12">
      {/* Bloom's Distribution */}
      <div>
        <h3 className="font-bold text-gray-900 mb-6">Difficulty Distribution (Bloom's Levels)</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <div key={level}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-700">
                  L{level}: {bloomLabels[level as keyof typeof bloomLabels]}
                </span>
                <span className="font-black text-gray-900">
                  {bloomDistribution[level as keyof typeof bloomDistribution]}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${((bloomDistribution[level as keyof typeof bloomDistribution] || 0) / maxBloom) * 100}%`,
                    backgroundColor: bloomColors[level as keyof typeof bloomColors],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject-wise Marks */}
      <div>
        <h3 className="font-bold text-gray-900 mb-6">Marks Distribution by Subject</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(subjectMarks).map(([subject, marks]) => (
            <div key={subject} className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between items-end mb-2">
                <span className="font-semibold text-gray-900">{subject}</span>
                <span className="text-2xl font-black text-orange-600">{marks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
                  style={{ width: `${(marks / maxMarks) * 100}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {((marks / paper.totalMarks) * 100).toFixed(1)}% of total
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Topics by Marks */}
      <div>
        <h3 className="font-bold text-gray-900 mb-6">Top 10 Topics by Marks</h3>
        <div className="space-y-3">
          {topicList.map((topic, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <span className="text-xs font-black bg-orange-100 text-orange-900 px-3 py-1 rounded-full">
                #{idx + 1}
              </span>
              <span className="flex-1 text-gray-900 font-semibold">{topic.name}</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-black ${
                  topic.level <= 2
                    ? "bg-green-100 text-green-900"
                    : topic.level <= 4
                    ? "bg-yellow-100 text-yellow-900"
                    : "bg-red-100 text-red-900"
                }`}
              >
                L{topic.level}
              </span>
              <span className="text-xl font-black text-orange-600 min-w-fit">{topic.marks}M</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
