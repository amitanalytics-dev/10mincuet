"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicNav } from "../components/PublicNav";
import { foundationClasses, type ClassLevel } from "../data/foundation-topics";
import { slugify } from "../utils/slug";

export default function FoundationPage() {
  const [classLevel, setClassLevel] = useState<ClassLevel>("6");
  const [subject, setSubject] = useState<string | null>(null);

  const cls = foundationClasses.find((c) => c.classLevel === classLevel)!;
  const subjectBlock = subject
    ? cls.subjects.find((s) => s.subject === subject) ?? null
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />

      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            🌱 Foundation · Class 6–10
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
            Start from Class 6
          </h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Build the NCERT foundation that feeds straight into CUET. Pick your class, choose a
            subject and practise chapter by chapter — completely free.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Class picker */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Choose a class</p>
          <div className="flex flex-wrap gap-2">
            {foundationClasses.map((c) => (
              <button
                key={c.classLevel}
                onClick={() => { setClassLevel(c.classLevel); setSubject(null); }}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  classLevel === c.classLevel
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-100"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-300"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subject picker */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Choose a subject</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {cls.subjects.map((s) => (
              <button
                key={s.subject}
                onClick={() => setSubject(s.subject)}
                className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all border ${
                  subject === s.subject
                    ? "text-white shadow-md"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                }`}
                style={subject === s.subject ? { backgroundColor: s.accent, borderColor: s.accent } : {}}
              >
                {s.subject}
              </button>
            ))}
          </div>
        </div>

        {/* Topic list */}
        {subjectBlock && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {cls.label} · {subjectBlock.subject} — pick a chapter
            </p>
            {subjectBlock.topics.map((topic) => {
              const topicSlug = slugify(topic.name);
              const subjectSlug = slugify(subjectBlock.subject);
              return (
                <Link
                  key={topicSlug}
                  href={`/foundation/${classLevel}/${subjectSlug}/${topicSlug}`}
                  className="block bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-black text-gray-900 text-sm group-hover:text-emerald-600 transition-colors mb-1">
                        {topic.name}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{topic.summary}</p>
                      {topic.feedsInto.length > 0 && (
                        <p className="text-[11px] text-emerald-600 font-semibold mt-2">
                          Feeds into CUET: {topic.feedsInto.map((f) => f.replace(/-/g, " ")).join(", ")}
                        </p>
                      )}
                    </div>
                    <span className="text-emerald-400 text-sm group-hover:translate-x-0.5 transition-transform shrink-0">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!subjectBlock && (
          <p className="text-center text-gray-400 text-sm py-6">
            Select a subject above to see its chapters.
          </p>
        )}
      </div>
    </div>
  );
}
