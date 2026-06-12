"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { subjects } from "../data/topics";
import { loadBloomStore } from "../data/bloom";
import { slugify } from "../utils/slug";
import { AUTH_KEY } from "../utils/auth";
import { PublicNav } from "../components/PublicNav";
import { AppNav } from "../components/AppNav";

// ─── Types ───────────────────────────────────────────────────────────────────

type TopicMeta = {
  subject: string;
  subjectSlug: string;
  slug: string;
  name: string;
};

type DayTask = {
  day: number;
  date: Date;
  tasks: Array<{ topic: TopicMeta & { avgBloom: number }; type: "study" | "quiz" }>;
  completed: boolean;
};

type SprintData = {
  targetSession: string;
  targetDate: string;
  generatedAt: string;
  completedDays: number[];
  plan: Array<{
    day: number;
    date: string;
    tasks: Array<{ topic: TopicMeta & { avgBloom: number }; type: "study" | "quiz" }>;
    completed: boolean;
  }>;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const JEE_SESSIONS = [
  { label: "CUET UG — January 2027", date: new Date("2027-01-22") },
  { label: "CUET UG — April 2027", date: new Date("2027-04-06") },
  { label: "Custom date", date: null },
];

const SPRINT_KEY = "jee_sprint_v1";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function daysUntil(targetDate: Date): number {
  return Math.max(0, Math.ceil((targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });
}

function getAllTopics(): TopicMeta[] {
  const topics: TopicMeta[] = [];
  subjects.forEach((subject) => {
    const subjectSlug = slugify(subject.name);
    subject.topics.forEach((topic) => {
      topics.push({
        subject: subject.name,
        subjectSlug,
        slug: slugify(topic.name),
        name: topic.name,
      });
    });
  });
  return topics;
}

function generateSprintPlan(
  bloomStore: ReturnType<typeof loadBloomStore>,
  subjectTopics: TopicMeta[]
): DayTask[] {
  const scored = subjectTopics.map((t) => {
    const progress = bloomStore[t.slug] ?? {};
    const levels = Object.values(progress as Record<string, { bloomLevel: number }>).map(
      (p) => p.bloomLevel ?? 1
    );
    const avg =
      levels.length > 0
        ? levels.reduce((s: number, l: number) => s + l, 0) / levels.length
        : 1;
    return { ...t, avgBloom: avg };
  });
  scored.sort((a, b) => a.avgBloom - b.avgBloom);

  const days: DayTask[] = [];
  for (let day = 1; day <= 30; day++) {
    const topic1 = scored[(day * 2 - 2) % scored.length];
    const topic2 = scored[(day * 2 - 1) % scored.length];
    days.push({
      day,
      date: new Date(Date.now() + (day - 1) * 24 * 60 * 60 * 1000),
      tasks: [
        { topic: topic1, type: "study" },
        { topic: topic2, type: "quiz" },
      ],
      completed: false,
    });
  }
  return days;
}

// ─── Setup Screen ─────────────────────────────────────────────────────────────

function SetupScreen({ onGenerate }: { onGenerate: (session: string, date: Date) => void }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [customDate, setCustomDate] = useState("");

  const selected = JEE_SESSIONS[selectedIdx];
  const targetDate =
    selected.date ??
    (customDate ? new Date(customDate) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));
  const remaining = daysUntil(targetDate);

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />
      <div className="flex items-center justify-center p-4 py-12">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-orange-100">
            ⚡
          </div>
          <h1 className="text-2xl font-black text-gray-900">30-Day CUET Sprint</h1>
          <p className="text-sm text-gray-400 mt-1">Your personalized daily study plan</p>
        </div>

        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Select your target session
          </p>
          <div className="space-y-2">
            {JEE_SESSIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => setSelectedIdx(i)}
                className={`w-full text-left px-4 py-3 rounded-2xl border-2 transition-all font-medium text-sm ${
                  selectedIdx === i
                    ? "border-orange-500 bg-orange-50 text-orange-700"
                    : "border-gray-100 bg-white text-gray-600 hover:border-orange-200"
                }`}
              >
                <span className="font-bold">
                  {i === 0 ? "○" : i === 1 ? "○" : "○"}
                </span>{" "}
                {s.label}
                {s.date && (
                  <span className="text-xs text-gray-400 ml-2">
                    ({s.date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {selectedIdx === 2 && (
          <div className="mb-6">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              Your exam date
            </label>
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
          </div>
        )}

        <div className="bg-orange-50 border border-orange-100 rounded-2xl px-4 py-3 mb-6 text-center">
          <p className="text-3xl font-black text-orange-500">{remaining}</p>
          <p className="text-xs text-gray-500 mt-0.5">days remaining to {selected.label}</p>
        </div>

        <button
          onClick={() => onGenerate(selected.label, targetDate)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-orange-100 active:scale-95"
        >
          Generate My Sprint Plan →
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          Based on your Bloom data. Weakest topics get more revisits.
        </p>
      </div>
      </div>
    </div>
  );
}

// ─── Day Card ─────────────────────────────────────────────────────────────────

function DayCard({
  dayTask,
  isToday,
  onToggle,
}: {
  dayTask: DayTask;
  isToday: boolean;
  onToggle: () => void;
}) {
  const studyTask = dayTask.tasks[0];
  const quizTask = dayTask.tasks[1];

  return (
    <div
      className={`bg-white rounded-2xl border-2 p-4 transition-all ${
        isToday
          ? "border-orange-400 shadow-md shadow-orange-50"
          : dayTask.completed
          ? "border-green-200 opacity-70"
          : "border-gray-100"
      }`}
    >
      {/* Day header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-black uppercase tracking-wide ${
                isToday ? "text-orange-500" : dayTask.completed ? "text-green-600" : "text-gray-400"
              }`}
            >
              {isToday ? "⚡ Today — " : ""}Day {dayTask.day}
            </span>
          </div>
          <p className="text-xs text-gray-400">{formatDate(dayTask.date)}</p>
        </div>
        {dayTask.completed && (
          <span className="text-green-500 text-xl">✓</span>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mb-3" />

      {/* Study task */}
      <div className="mb-2">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
          📚 Study
        </p>
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{studyTask.topic.name}</p>
            <p className="text-[11px] text-gray-400">{studyTask.topic.subject}</p>
          </div>
          <Link
            href={`/daily/${studyTask.topic.subjectSlug}/${studyTask.topic.slug}`}
            className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-all shrink-0"
          >
            Open →
          </Link>
        </div>
      </div>

      {/* Quiz task */}
      <div className="mb-3">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
          🧪 Quiz
        </p>
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{quizTask.topic.name}</p>
            <p className="text-[11px] text-gray-400">{quizTask.topic.subject}</p>
          </div>
          <Link
            href={`/quiz/${quizTask.topic.subjectSlug}/${quizTask.topic.slug}`}
            className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all shrink-0"
          >
            Quiz →
          </Link>
        </div>
      </div>

      {/* Done button */}
      <button
        onClick={onToggle}
        className={`w-full py-2 rounded-xl text-sm font-bold transition-all ${
          dayTask.completed
            ? "bg-green-50 text-green-600 border-2 border-green-200"
            : "bg-gray-900 text-white hover:bg-gray-700 active:scale-95"
        }`}
      >
        {dayTask.completed ? "✓ Done" : "Mark Done"}
      </button>
    </div>
  );
}

// ─── Active Sprint View ───────────────────────────────────────────────────────

function ActiveSprint({
  sprintData,
  onReset,
}: {
  sprintData: SprintData;
  onReset: () => void;
}) {
  const [completedDays, setCompletedDays] = useState<number[]>(sprintData.completedDays);
  const [confirmReset, setConfirmReset] = useState(false);

  const targetDate = new Date(sprintData.targetDate);
  const remaining = daysUntil(targetDate);
  const donePct = Math.round((completedDays.length / 30) * 100);

  // Figure out today's day in the plan (day 1 = plan start)
  const planStart = new Date(sprintData.plan[0]?.date ?? Date.now());
  const daysSinceStart = Math.floor((Date.now() - planStart.getTime()) / (1000 * 60 * 60 * 24));
  const todayDayNum = Math.min(Math.max(daysSinceStart + 1, 1), 30);

  function toggleDay(dayNum: number) {
    const updated = completedDays.includes(dayNum)
      ? completedDays.filter((d) => d !== dayNum)
      : [...completedDays, dayNum];
    setCompletedDays(updated);

    // Persist
    const stored = localStorage.getItem(SPRINT_KEY);
    if (stored) {
      const parsed: SprintData = JSON.parse(stored);
      parsed.completedDays = updated;
      localStorage.setItem(SPRINT_KEY, JSON.stringify(parsed));
    }
  }

  // Stats
  const allTopics = sprintData.plan.flatMap((d) => d.tasks.map((t) => t.topic.slug));
  const uniqueTopics = new Set(allTopics.slice(0, completedDays.length * 2)).size;
  const weakestTask = sprintData.plan[0]?.tasks[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />
      {/* Sprint progress bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
            <div>
              <p className="font-black text-gray-900 text-sm">30-Day Sprint</p>
              <p className="text-xs text-gray-400">
                Day {todayDayNum} of 30 · {donePct}% complete · {remaining} days to {sprintData.targetSession}
              </p>
            </div>
            <button
              onClick={() => setConfirmReset(true)}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-all"
            >
              Reset Sprint
            </button>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${donePct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
            <div className="text-2xl font-black text-orange-500">{completedDays.length}/30</div>
            <div className="text-xs text-gray-400 mt-0.5">Days done</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
            <div className="text-2xl font-black text-gray-800">{uniqueTopics}</div>
            <div className="text-xs text-gray-400 mt-0.5">Topics covered</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
            <div className="text-2xl font-black text-gray-800">{remaining}</div>
            <div className="text-xs text-gray-400 mt-0.5">Days to exam</div>
          </div>
        </div>

        {/* Weakest topic callout */}
        {weakestTask && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-0.5">
                Your weakest topic
              </p>
              <p className="font-bold text-gray-900">{weakestTask.topic.name}</p>
              <p className="text-xs text-gray-500">
                Avg Bloom L{weakestTask.topic.avgBloom.toFixed(1)} · {weakestTask.topic.subject}
              </p>
            </div>
            <Link
              href={`/bloom/${weakestTask.topic.subjectSlug}/${weakestTask.topic.slug}`}
              className="text-xs font-bold px-3 py-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all shrink-0"
            >
              Fix It →
            </Link>
          </div>
        )}

        {/* Day cards grid */}
        <div className="grid gap-3 sm:grid-cols-2">
          {sprintData.plan.map((dayRaw) => {
            const dayTask: DayTask = {
              ...dayRaw,
              date: new Date(dayRaw.date),
              completed: completedDays.includes(dayRaw.day),
            };
            return (
              <DayCard
                key={dayRaw.day}
                dayTask={dayTask}
                isToday={dayRaw.day === todayDayNum}
                onToggle={() => toggleDay(dayRaw.day)}
              />
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            Sprint generated on{" "}
            {new Date(sprintData.generatedAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            {" · "}
            Weakest topics cycle every day
          </p>
        </div>
      </div>

      {/* Reset confirmation modal */}
      {confirmReset && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-black text-gray-900 mb-2">Reset sprint?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This will clear your current plan and all {completedDays.length} completed days.
              You&apos;ll need to set up a new sprint from scratch.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  localStorage.removeItem(SPRINT_KEY);
                  onReset();
                }}
                className="flex-1 bg-red-500 text-white font-bold py-2.5 rounded-xl hover:bg-red-600 transition-all"
              >
                Yes, reset
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl hover:border-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SprintPage() {
  const [authed, setAuthed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sprintData, setSprintData] = useState<SprintData | null>(null);

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem(AUTH_KEY) === "1") setAuthed(true);
    const stored = localStorage.getItem(SPRINT_KEY);
    if (stored) {
      try {
        setSprintData(JSON.parse(stored));
      } catch {
        // corrupt data — ignore
      }
    }
  }, []);

  if (!mounted) return null;

  // Auth wall
  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <PublicNav />
        <div className="flex items-center justify-center p-4 py-16">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 w-full max-w-sm text-center">
            <div className="text-5xl mb-4">⚡</div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">30-Day Sprint</h1>
            <p className="text-gray-400 text-sm mb-6">
              Sign in to generate your personalized CUET sprint plan.
            </p>
            <Link
              href="/register"
              className="block bg-orange-500 text-white font-black py-3 rounded-2xl hover:bg-orange-600 transition-all"
            >
              Sign in / Register →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  function handleGenerate(session: string, date: Date) {
    const bloomStore = loadBloomStore();
    const allTopics = getAllTopics();
    const plan = generateSprintPlan(bloomStore, allTopics);

    const data: SprintData = {
      targetSession: session,
      targetDate: date.toISOString(),
      generatedAt: new Date().toISOString(),
      completedDays: [],
      plan: plan.map((d) => ({ ...d, date: d.date.toISOString() })),
    };

    localStorage.setItem(SPRINT_KEY, JSON.stringify(data));
    setSprintData(data);
  }

  if (sprintData) {
    return (
      <ActiveSprint
        sprintData={sprintData}
        onReset={() => setSprintData(null)}
      />
    );
  }

  return <SetupScreen onGenerate={handleGenerate} />;
}
