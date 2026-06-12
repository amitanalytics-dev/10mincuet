"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { NavActions } from "../../../components/NavActions";
import { snippetBank, type Formula, type Example, type QuickFire } from "../../../data/snippets";
import { subjects } from "../../../data/topics";
import { NCERT_MAP } from "../../../data/ncert-mapping";
import { slugify } from "../../../utils/slug";
import {
  saveContentFeedback,
  getContentFeedback,
  type ContentRating,
} from "../../../data/bloom";

// ─── Content feedback row ─────────────────────────────────────────────────────
// Shows three buttons: Too Easy / Just Right / Too Hard

function FeedbackRow({
  topicSlug,
  contentId,
}: {
  topicSlug: string;
  contentId: string;
}) {
  const [rating, setRating] = useState<ContentRating | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const existing = getContentFeedback(topicSlug, contentId);
    if (existing) setRating(existing);
  }, [topicSlug, contentId]);

  function choose(r: ContentRating) {
    setRating(r);
    saveContentFeedback(topicSlug, contentId, r);
  }

  if (!mounted) return null;

  const opts: { r: ContentRating; label: string; cls: string }[] = [
    { r: "easy", label: "Too Easy", cls: "bg-sky-50 text-sky-600 border-sky-200" },
    { r: "right", label: "Just Right", cls: "bg-emerald-50 text-emerald-600 border-emerald-200" },
    { r: "hard", label: "Too Hard", cls: "bg-orange-50 text-orange-600 border-orange-200" },
  ];

  return (
    <div className="mt-3 pt-3 border-t border-gray-50">
      <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wide font-semibold">
        How was this?
      </p>
      <div className="flex gap-2">
        {opts.map(({ r, label, cls }) => (
          <button
            key={r}
            onClick={() => choose(r)}
            className={`flex-1 text-[10px] font-semibold py-1.5 rounded-lg border transition-all ${
              rating === r
                ? cls + " shadow-sm scale-105 font-bold"
                : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100"
            }`}
          >
            {rating === r ? "✓ " : ""}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function FormulaCard({ f, idx, accent, topicSlug }: { f: Formula; idx: number; accent: string; topicSlug: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <button
        className="w-full flex items-start justify-between px-5 py-4 text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex-1 min-w-0 pr-3">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
            {f.name}
          </div>
          <div className="font-mono text-sm font-bold" style={{ color: accent }}>
            {f.formula}
          </div>
        </div>
        <span className="shrink-0 text-gray-300 text-xs mt-1">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-5 pb-4 border-t border-gray-50">
          <p className="text-sm text-gray-600 leading-relaxed pt-3">{f.note}</p>
          <FeedbackRow topicSlug={topicSlug} contentId={`formula_${idx}`} />
        </div>
      )}
    </div>
  );
}

function ExampleCard({ e, idx, accent, topicSlug }: { e: Example; idx: number; accent: string; topicSlug: string }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-3">
        <span
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ backgroundColor: accent }}
        >
          {idx + 1}
        </span>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Problem</span>
      </div>
      <p className="text-sm text-gray-800 leading-relaxed mb-4">{e.problem}</p>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="text-sm font-semibold px-4 py-2 rounded-xl border-2 transition-all hover:opacity-80"
          style={{ color: accent, borderColor: accent }}
        >
          Show Solution
        </button>
      ) : (
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Solution
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{e.solution}</p>
          </div>
          <div
            className="rounded-xl p-3"
            style={{ backgroundColor: accent + "18" }}
          >
            <p
              className="text-xs font-bold uppercase tracking-wide mb-1"
              style={{ color: accent }}
            >
              🔑 Key Step
            </p>
            <p className="text-sm text-gray-800">{e.keyStep}</p>
          </div>
          <FeedbackRow topicSlug={topicSlug} contentId={`example_${idx}`} />
        </div>
      )}
    </div>
  );
}

function QuickFireCard({ qf, idx, accent, topicSlug }: { qf: QuickFire; idx: number; accent: string; topicSlug: string }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-start gap-3">
        <span
          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: accent }}
        >
          {idx + 1}
        </span>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800 leading-snug">{qf.q}</p>
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="mt-2 text-xs font-semibold underline"
              style={{ color: accent }}
            >
              Reveal answer
            </button>
          ) : (
            <div>
              <div className="mt-2 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                {qf.a}
              </div>
              <FeedbackRow topicSlug={topicSlug} contentId={`quickfire_${idx}`} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type Tab = "formulas" | "examples" | "quickfire";

const TABS: { id: Tab; label: string; time: string; icon: string }[] = [
  { id: "formulas", label: "Formulas", time: "3 min", icon: "📐" },
  { id: "examples", label: "Examples", time: "8 min", icon: "✏️" },
  { id: "quickfire", label: "Quick-Fire", time: "4 min", icon: "⚡" },
];

export default function DailyPage({
  params,
}: {
  params: Promise<{ subject: string; topic: string }>;
}) {
  const { subject, topic } = use(params);

  const subjectData = subjects.find((s) => slugify(s.name) === subject);
  const topicData = subjectData?.topics.find((t) => slugify(t.name) === topic);
  const snippet = snippetBank[topic];

  const [tab, setTab] = useState<Tab>("formulas");
  const [done, setDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  const accent = subjectData?.accent ?? "#3B82F6";
  const topicName =
    topicData?.name ??
    topic.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  useEffect(() => {
    setMounted(true);
    const key = `daily_${topic}_${new Date().toDateString()}`;
    if (localStorage.getItem(key) === "1") setDone(true);
  }, [topic]);

  function markDone() {
    const key = `daily_${topic}_${new Date().toDateString()}`;
    localStorage.setItem(key, "1");
    setDone(true);
  }

  // ── Empty state
  if (!snippet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🚧</div>
          <h2 className="text-xl font-black text-gray-800">Study content coming soon</h2>
          <p className="text-gray-400 text-sm mt-2">
            Preparing 10-min snippet for <strong>{topicName}</strong>.
          </p>
          <Link href="/topics" className="mt-5 inline-block text-sm font-semibold text-blue-500 hover:underline">
            ← Back to topics
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Sticky header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <Link href="/topics" className="text-xs text-gray-400 hover:text-gray-600">
              ← All Topics
            </Link>
            <h1 className="font-black text-gray-900 text-base mt-0.5 truncate">
              {topicName}
            </h1>
            <p className="text-xs text-gray-400">10-min daily study</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {mounted && done && (
              <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-3 py-1.5 rounded-full border border-emerald-200">
                ✓ Done today
              </span>
            )}
            <NavActions />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* ── Session overview */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 flex gap-4 items-center">
          <div className="text-2xl">⏱</div>
          <div>
            <p className="text-sm font-bold text-gray-800">10-minute study session</p>
            <p className="text-xs text-gray-400">
              3 min formulas → 8 min worked examples → 4 min quick-fire recall
            </p>
          </div>
        </div>

        {/* ── NCERT reference */}
        {topicData && NCERT_MAP[topicData.name] && (
          <div className="mb-6 flex items-center gap-2 text-xs bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <span>📖</span>
            <div>
              <span className="text-blue-700 font-semibold">
                NCERT {NCERT_MAP[topicData.name].book} — Ch.{NCERT_MAP[topicData.name].chapter}: {NCERT_MAP[topicData.name].chapterName}
              </span>
              <span className="text-blue-500 ml-1">
                (Pages {NCERT_MAP[topicData.name].pageStart}–{NCERT_MAP[topicData.name].pageEnd})
              </span>
              {NCERT_MAP[topicData.name].keyPages && (
                <span className="text-blue-400 ml-1">
                  · Key pages: {NCERT_MAP[topicData.name].keyPages!.join(", ")}
                </span>
              )}
            </div>
          </div>
        )}

        {/* ── Tab switcher */}
        <div className="flex gap-2 mb-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-3 px-2 rounded-xl text-center text-xs font-semibold transition-all border ${
                tab === t.id
                  ? "text-white shadow-md border-transparent"
                  : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
              style={tab === t.id ? { backgroundColor: accent } : {}}
            >
              <div className="text-lg mb-0.5">{t.icon}</div>
              <div>{t.label}</div>
              <div className="opacity-70 font-normal">{t.time}</div>
            </button>
          ))}
        </div>

        {/* ── Formulas */}
        {tab === "formulas" && (
          <div>
            <p className="text-xs text-gray-400 mb-4">
              Read each formula carefully. Tap to expand the usage note. (~3 minutes)
            </p>
            <div className="space-y-3">
              {snippet.formulas.map((f, i) => (
                <FormulaCard key={i} f={f} idx={i} accent={accent} topicSlug={topic} />
              ))}
            </div>
            <button
              onClick={() => setTab("examples")}
              className="w-full mt-5 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: accent }}
            >
              Next: Worked Examples →
            </button>
          </div>
        )}

        {/* ── Examples */}
        {tab === "examples" && (
          <div>
            <p className="text-xs text-gray-400 mb-4">
              Try each problem yourself first, then reveal the solution. (~8 minutes)
            </p>
            <div className="space-y-4">
              {snippet.examples.map((e, i) => (
                <ExampleCard key={i} e={e} idx={i} accent={accent} topicSlug={topic} />
              ))}
            </div>
            <button
              onClick={() => setTab("quickfire")}
              className="w-full mt-5 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: accent }}
            >
              Next: Quick-Fire →
            </button>
          </div>
        )}

        {/* ── Quick-fire */}
        {tab === "quickfire" && (
          <div>
            <p className="text-xs text-gray-400 mb-4">
              Flash-card drill — recall the answer, then reveal. (~4 minutes)
            </p>
            <div className="space-y-3">
              {snippet.quickFire.map((qf, i) => (
                <QuickFireCard key={i} qf={qf} idx={i} accent={accent} topicSlug={topic} />
              ))}
            </div>

            {/* Mark done / Done state */}
            {mounted && !done && (
              <button
                onClick={markDone}
                className="w-full mt-6 py-4 rounded-2xl font-bold text-white text-base transition-all hover:opacity-90 active:scale-95 shadow-lg"
                style={{ backgroundColor: accent }}
              >
                ✓ Mark Today&apos;s Session as Done
              </button>
            )}

            {mounted && done && (
              <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
                <div className="text-3xl mb-2">🎉</div>
                <p className="font-black text-emerald-700 text-base">Today&apos;s session complete!</p>
                <p className="text-xs text-emerald-500 mt-1">
                  Come back tomorrow to keep the streak going.
                </p>
                <div className="flex gap-2 mt-4 justify-center flex-wrap">
                  <Link
                    href={`/quiz/${subject}/${topic}`}
                    className="inline-block px-5 py-2.5 text-sm font-bold rounded-xl text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: accent }}
                  >
                    Test yourself with a quiz →
                  </Link>
                  <Link
                    href={`/bloom/${subject}/${topic}`}
                    className="inline-block px-5 py-2.5 text-sm font-bold rounded-xl border-2 transition-all hover:opacity-80"
                    style={{ color: accent, borderColor: accent }}
                  >
                    📊 View Bloom Plan
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Back link */}
        <div className="mt-8 text-center">
          <Link href="/topics" className="text-sm text-gray-400 hover:text-gray-600">
            ← Back to all topics
          </Link>
        </div>
      </div>
    </div>
  );
}
