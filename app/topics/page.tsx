"use client";
import { BASE_URL } from "@/app/lib/site";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { subjects, getCoveragePercent, type Subject, type SubjectDomain, type Topic } from "../data/topics";

const DOMAIN_ORDER: SubjectDomain[] = ["Languages", "General Test", "Science", "Commerce", "Humanities"];
import { NCERT_MAP } from "../data/ncert-mapping";
import { slugify } from "../utils/slug";
import { getTopicProgress, getBloomInfo, type BloomLevel } from "../data/bloom";
import { BloomBar } from "../components/BloomBadge";
import { getTopicBloomDistribution, getTopicJEEBloomLevel } from "../data/questions";
import { AppNav } from "../components/AppNav";
import { TestimonialPrompt } from "../components/TestimonialPrompt";
import { Analytics } from "../lib/analytics";

function getUserClass(): "11" | "12" | "dropper" | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("jee_class_v1") as "11" | "12" | "dropper" | null;
}

const difficultyColor: Record<string, string> = {
  Easy: "bg-emerald-100 text-emerald-700",
  Medium: "bg-amber-100 text-amber-700",
  Hard: "bg-red-100 text-red-700",
};

function SubjectBadge({ active, subject, onClick }: { active: boolean; subject: Subject; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 ${
        active
          ? "text-white shadow-lg scale-105"
          : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
      }`}
      style={active ? { backgroundColor: subject.accent } : {}}
    >
      {subject.name}
    </button>
  );
}

function TopicCard({ topic, accent, subjectSlug }: { topic: Topic; accent: string; subjectSlug: string }) {
  const [open, setOpen] = useState(false);
  const [avgBloom, setAvgBloom] = useState<BloomLevel | null>(null);
  const topicSlug = slugify(topic.name);

  const handleTopicClick = () => {
    Analytics.topicOpened(topic.name, subjectSlug);
  };

  useEffect(() => {
    const progress = getTopicProgress(topicSlug);
    const levels = Object.values(progress).map((p) => p.bloomLevel);
    if (levels.length > 0) {
      setAvgBloom(
        Math.round(levels.reduce((s, l) => s + l, 0) / levels.length) as BloomLevel
      );
    }
  }, [topicSlug]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-bold text-gray-900 text-base">{topic.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColor[topic.difficulty]}`}>
                {topic.difficulty}
              </span>
            </div>
            <p className="text-xs text-gray-400">{topic.yearsActive}</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <div className="text-center">
              <div className="text-xl font-black" style={{ color: accent }}>{topic.avgQuestionsPerPaper}</div>
              <div className="text-[10px] text-gray-400 leading-tight">avg Qs</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-black text-gray-800">~{topic.marksContribution}</div>
              <div className="text-[10px] text-gray-400 leading-tight">marks</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-black text-gray-800">{topic.paperCoverage}%</div>
              <div className="text-[10px] text-gray-400 leading-tight">papers</div>
            </div>
          </div>
        </div>

        <div className="mt-3 mb-3">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${topic.paperCoverage}%`, backgroundColor: accent }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Appeared in {topic.paperCoverage}% of papers (2015–2025)</p>
        </div>

        {/* CUET Bloom distribution — what level CUET actually tests at */}
        {(() => {
          const dist = getTopicBloomDistribution(topicSlug);
          const total = Object.values(dist).reduce((s, n) => s + (n ?? 0), 0);
          if (total === 0) return null;
          const jeeLevel = getTopicJEEBloomLevel(topicSlug);
          const jeeInfo = getBloomInfo(jeeLevel);
          return (
            <div className="mb-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                  CUET Tests At
                </p>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: jeeInfo.bgColor, color: jeeInfo.textColor }}
                >
                  {jeeInfo.icon} L{jeeLevel} {jeeInfo.name} dominant
                </span>
              </div>
              <div className="flex gap-1 h-4">
                {([2, 3, 4] as BloomLevel[]).map((lvl) => {
                  const count = dist[lvl] ?? 0;
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  if (pct === 0) return null;
                  const info = getBloomInfo(lvl);
                  return (
                    <div
                      key={lvl}
                      className="flex items-center justify-center rounded text-[9px] font-bold text-white"
                      style={{ width: `${pct}%`, backgroundColor: info.color }}
                      title={`L${lvl} ${info.name}: ${pct}%`}
                    >
                      {pct >= 15 ? `${pct}%` : ""}
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-3 mt-1.5">
                {([2, 3, 4] as BloomLevel[]).map((lvl) => {
                  const count = dist[lvl] ?? 0;
                  if (count === 0) return null;
                  const pct = Math.round((count / total) * 100);
                  const info = getBloomInfo(lvl);
                  return (
                    <span key={lvl} className="text-[9px] text-gray-500 flex items-center gap-0.5">
                      <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: info.color }} />
                      L{lvl} {pct}%
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Student Bloom progress bar (only when data exists) */}
        {avgBloom !== null && (
          <div className="mb-3 flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100">
            <div>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">
                Your Bloom Level
              </p>
              <BloomBar level={avgBloom} />
            </div>
            <Link
              href={`/bloom/${subjectSlug}/${topicSlug}`}
              className="text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all hover:opacity-80 shrink-0"
              style={{ color: accent, borderColor: accent }}
            >
              View Plan →
            </Link>
          </div>
        )}

        <div className="bg-gray-50 rounded-xl p-3 mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Why This Topic</p>
          <p className="text-sm text-gray-700 leading-relaxed">{topic.whyThisTopic}</p>
        </div>

        <div className="rounded-xl p-3 mb-3" style={{ backgroundColor: accent + "15" }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: accent }}>⚡ Quick Win</p>
          <p className="text-sm text-gray-800 leading-relaxed">{topic.quickWin}</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mb-3 flex-wrap">
          <Link
            href={`/quiz/${subjectSlug}/${slugify(topic.name)}`}
            onClick={handleTopicClick}
            className="flex-1 min-w-28 text-center text-xs font-bold py-2.5 px-3 rounded-xl text-white transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: accent }}
          >
            🎯 Full Quiz
          </Link>
          <Link
            href={`/practice/${subjectSlug}/${slugify(topic.name)}`}
            onClick={handleTopicClick}
            className="flex-1 min-w-28 text-center text-xs font-bold py-2.5 px-3 rounded-xl text-white transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#8B5CF6" }}
          >
            🧩 Sub-topics
          </Link>
          <Link
            href={`/daily/${subjectSlug}/${slugify(topic.name)}`}
            onClick={handleTopicClick}
            className="flex-1 min-w-28 text-center text-xs font-bold py-2.5 px-3 rounded-xl border-2 transition-all hover:opacity-80"
            style={{ color: accent, borderColor: accent }}
          >
            ⏱ 10 min Study
          </Link>
          <Link
            href={`/bloom/${subjectSlug}/${slugify(topic.name)}`}
            onClick={handleTopicClick}
            className="flex-1 min-w-28 text-center text-xs font-bold py-2.5 px-3 rounded-xl border-2 transition-all hover:opacity-80"
            style={{ color: "#8B5CF6", borderColor: "#8B5CF6" }}
          >
            📊 Bloom Plan
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-sm font-semibold w-full"
          style={{ color: accent }}
        >
          <span>{open ? "▲" : "▼"}</span>
          {open ? "Hide" : "Show"} sub-concepts ({topic.subConcepts.length})
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-100 divide-y divide-gray-50">
          {NCERT_MAP[topic.name] && (
            <div className="px-5 py-3">
              <div className="flex items-center gap-2 text-xs bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                <span>📖</span>
                <span className="text-blue-700 font-medium">
                  NCERT {NCERT_MAP[topic.name].book} — Ch.{NCERT_MAP[topic.name].chapter}: {NCERT_MAP[topic.name].chapterName}, Pages {NCERT_MAP[topic.name].pageStart}–{NCERT_MAP[topic.name].pageEnd}
                </span>
              </div>
            </div>
          )}
          {topic.subConcepts.map((sc, i) => (
            <div key={i} className="px-5 py-3">
              <p className="text-sm font-semibold text-gray-800 mb-0.5">{sc.name}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{sc.tip}</p>
            </div>
          ))}
          {/* Study together buttons */}
          <div className="px-5 py-3 flex flex-col gap-2">
            <a
              href={`https://wa.me/?text=Let%27s%20study%20${encodeURIComponent(topic.name)}%20together%20on%2010minCUET%20%F0%9F%93%9A%0A10%20minutes%2C%20track%20your%20Bloom%20level%3A%20${encodeURIComponent(BASE_URL)}%2Ftopics`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 text-xs font-semibold flex items-center gap-1 hover:text-green-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Study together on WhatsApp
            </a>
            <Link
              href={`/study-rooms`}
              className="text-blue-600 text-xs font-semibold flex items-center gap-1 hover:text-blue-700 transition-colors"
            >
              <span>👥</span>
              Join Study Room
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function SubjectView({ subject }: { subject: Subject }) {
  const subjectSlug = slugify(subject.name);
  const coverage = getCoveragePercent(subject);
  const totalTopicMarks = subject.topics.reduce((s, t) => s + t.marksContribution, 0);

  return (
    <div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex flex-wrap gap-6 items-center">
          <div>
            <div className="text-3xl font-black" style={{ color: subject.accent }}>{coverage}%</div>
            <div className="text-xs text-gray-400">of paper covered</div>
          </div>
          <div>
            <div className="text-3xl font-black text-gray-800">~{totalTopicMarks}</div>
            <div className="text-xs text-gray-400">marks from these topics (out of {subject.totalQuestionsPerPaper * 4})</div>
          </div>
          <div>
            <div className="text-3xl font-black text-gray-800">{subject.topics.length}</div>
            <div className="text-xs text-gray-400">high-frequency topics</div>
          </div>
          <div className="flex-1 min-w-48">
            <div className="text-xs text-gray-400 mb-1">Coverage</div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${coverage}%`, backgroundColor: subject.accent }} />
            </div>
          </div>
        </div>
        <div className="mt-3 p-3 rounded-xl text-sm" style={{ backgroundColor: subject.accent + "12" }}>
          <span className="font-semibold" style={{ color: subject.accent }}>Cutoff strategy: </span>
          <span className="text-gray-700">
            Target ~{subject.cutoffMarks} marks in {subject.name}. These {subject.topics.length} topics alone get you there. Each card shows average marks contribution per paper.
          </span>
        </div>

        {/* Subject-level Bloom summary */}
        {(() => {
          const allDist: Record<number, number> = {};
          let totalQ = 0;
          subject.topics.forEach((t) => {
            const slug = slugify(t.name);
            const d = getTopicBloomDistribution(slug);
            Object.entries(d).forEach(([lvl, cnt]) => {
              allDist[+lvl] = (allDist[+lvl] ?? 0) + (cnt ?? 0);
              totalQ += cnt ?? 0;
            });
          });
          if (totalQ === 0) return null;
          const l3pct = Math.round(((allDist[3] ?? 0) / totalQ) * 100);
          const l4pct = Math.round(((allDist[4] ?? 0) / totalQ) * 100);
          const l2pct = Math.round(((allDist[2] ?? 0) / totalQ) * 100);
          return (
            <div className="mt-3 p-3 rounded-xl bg-white border border-gray-100 text-xs text-gray-700 flex items-center gap-2 flex-wrap">
              <span className="text-gray-400 font-semibold uppercase tracking-wide text-[10px]">
                {subject.name} CUET asks:
              </span>
              <span className="font-bold" style={{ color: "#34D399" }}>🔧 Apply L3 — {l3pct}%</span>
              <span className="font-bold" style={{ color: "#FBBF24" }}>🔍 Analyze L4 — {l4pct}%</span>
              <span className="font-bold" style={{ color: "#60A5FA" }}>💡 Understand L2 — {l2pct}%</span>
              <span className="text-gray-400 text-[10px]">Target L4 to solve everything.</span>
            </div>
          );
        })()}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {subject.topics.map((topic) => (
          <TopicCard key={topic.name} topic={topic} accent={subject.accent} subjectSlug={subjectSlug} />
        ))}
      </div>
    </div>
  );
}

// Separate component so useSearchParams is isolated (satisfies Next.js Suspense rules)
function OnboardingBanner() {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (searchParams.get("onboarded") === "1") setVisible(true);
  }, [searchParams]);

  if (!visible) return null;

  return (
    <div className="bg-green-50 border-b border-green-200 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-green-800">
          <span className="text-base">🎉</span>
          <span className="font-semibold">Your study plan is ready.</span>
          <span className="text-green-600 hidden sm:inline">
            Bloom levels are set — topics marked with your starting level below.
          </span>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-green-500 hover:text-green-700 text-xs font-semibold shrink-0"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default function TopicsPage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [userClass, setUserClass] = useState<"11" | "12" | "dropper" | null>(null);

  useEffect(() => {
    setUserClass(getUserClass());
  }, []);

  // Filter topics by class: class 11 users only see topics not marked as class-12-only
  const filteredSubjects = subjects.map((subject) => ({
    ...subject,
    topics: subject.topics.filter((t) => {
      if (userClass !== "11") return true; // class 12 and droppers see everything
      return (t.targetClass ?? "both") !== "12"; // class 11 skips "12"-only topics
    }),
  }));

  const active = filteredSubjects[activeIdx];

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />
      {/* Onboarding success banner — only shown once after diagnostic test */}
      <Suspense>
        <OnboardingBanner />
      </Suspense>
      {/* Page heading */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 pt-6 pb-2">
          <h1 className="text-3xl font-black text-gray-900 mb-1">
            CUET UG Topics — Science, Commerce &amp; Humanities
          </h1>
          <p className="text-sm text-gray-500">
            12 CUET domain subjects + English + General Test — pick your stream below.
          </p>
        </div>
        {/* Subject filter strip — grouped by CUET stream */}
        <div className="max-w-6xl mx-auto px-4 py-3 space-y-3">
          {DOMAIN_ORDER.map((domain) => {
            const group = filteredSubjects
              .map((s, i) => ({ subject: s, idx: i }))
              .filter(({ subject }) => subject.domain === domain);
            if (group.length === 0) return null;
            return (
              <div key={domain} className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 w-24 shrink-0">
                  {domain}
                </span>
                {group.map(({ subject, idx }) => (
                  <SubjectBadge
                    key={subject.name}
                    subject={subject}
                    active={idx === activeIdx}
                    onClick={() => setActiveIdx(idx)}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-gray-900 mb-1">{active.name} — Key Topics</h2>
          <p className="text-gray-500 text-sm">
            Topics below cover ≥60% of every CUET UG {active.name} paper. Master these before anything else.
          </p>
          {userClass === "11" && (
            <div className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
              Showing Class 11 syllabus
            </div>
          )}
        </div>

        <SubjectView subject={active} />

        <div className="mt-10 p-4 bg-white rounded-2xl border border-gray-100 text-xs text-gray-400 text-center space-y-1">
          <p>Analysis based on CUET UG papers 2015–2025 (all sessions, all shifts) · NTA official papers</p>
          <p>
            © 2025 10minCUET. All question content (432 original questions, IDs phy-elec-1 through math-seq-p10)
            and Bloom taxonomy mappings are original creative works. Reproduction prohibited. ·{" "}
            <Link href="/terms" className="underline hover:text-gray-600">Terms of Use</Link>
          </p>
        </div>
      </div>
      <TestimonialPrompt />
    </div>
  );
}
