"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AppNav } from "../components/AppNav";
import { TOKEN_KEY } from "../utils/auth";

interface SubjectSummary {
  subject: string;
  avgBloom: number;
  avgScore: number | null;
  topicsStudied: number;
}

interface Kid {
  id: string;
  name: string;
  createdAt: number;
  lastLoginAt?: number;
  subjectSummary: SubjectSummary[];
  totalTopicsStudied: number;
  avgBloomOverall: number;
}

const BLOOM_LABELS = ["", "Remember", "Understand", "Apply", "Analyse", "Evaluate", "Create"];
const BLOOM_COLORS = ["", "#6b7280", "#3b82f6", "#10b981", "#f59e0b", "#f97316", "#8b5cf6"];

const SUBJECT_ACCENT: Record<string, string> = {
  Languages: "#3b82f6",
  Domain: "#10b981",
  "General Test": "#f97316",
  Other: "#9ca3af",
};

function BloomBadge({ level }: { level: number }) {
  const l = Math.min(Math.max(Math.round(level), 1), 6);
  return (
    <span
      className="text-xs font-black px-2 py-0.5 rounded-full text-white"
      style={{ backgroundColor: BLOOM_COLORS[l] }}
    >
      L{l} · {BLOOM_LABELS[l]}
    </span>
  );
}

function KidCard({ kid }: { kid: Kid }) {
  const daysSinceLogin = kid.lastLoginAt
    ? Math.floor((Date.now() - kid.lastLoginAt) / 86400000)
    : null;

  const subjectsWithData = kid.subjectSummary.filter((s) => s.topicsStudied > 0);

  const recommendations: string[] = [];
  for (const s of subjectsWithData) {
    if (s.avgBloom < 2) recommendations.push(`Start more ${s.subject} quizzes to build foundation`);
    else if (s.avgBloom >= 4) recommendations.push(`${s.subject} is strong — push for L5 topics`);
    if (s.avgScore != null && s.avgScore < 60) recommendations.push(`${s.subject} accuracy needs work (${s.avgScore}%)`);
  }
  if (subjectsWithData.length < 3) recommendations.push("Encourage studying all 3 subjects daily");
  if (daysSinceLogin != null && daysSinceLogin > 3) recommendations.push("Hasn't logged in recently — check in with them");

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-white">{kid.name}</h3>
            <p className="text-xs text-orange-100 mt-0.5">
              {daysSinceLogin === 0
                ? "Active today"
                : daysSinceLogin === 1
                ? "Active yesterday"
                : daysSinceLogin != null
                ? `Last active ${daysSinceLogin} days ago`
                : "No sessions yet"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-white">{kid.totalTopicsStudied}</div>
            <div className="text-xs text-orange-100">topics practiced</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-sm font-semibold text-gray-500">Overall level:</span>
          <BloomBadge level={kid.avgBloomOverall} />
        </div>

        {subjectsWithData.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No quiz sessions yet. Encourage your child to start!</p>
        ) : (
          <div className="space-y-4 mb-5">
            {subjectsWithData.map((s) => (
              <div key={s.subject}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-gray-700">{s.subject}</span>
                  <div className="flex items-center gap-2">
                    <BloomBadge level={s.avgBloom} />
                    {s.avgScore != null && (
                      <span className="text-xs text-gray-500">{s.avgScore}% accuracy</span>
                    )}
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${((s.avgBloom - 1) / 5) * 100}%`,
                      backgroundColor: SUBJECT_ACCENT[s.subject] ?? "#6b7280",
                    }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{s.topicsStudied} topic(s) practiced</p>
              </div>
            ))}
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">Recommendations</p>
            <ul className="space-y-1.5">
              {recommendations.slice(0, 3).map((r, i) => (
                <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                  <span className="text-blue-400 mt-0.5">→</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function InviteCodeSection() {
  const [inviteCode, setInviteCode] = useState("");
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [linkCode, setLinkCode] = useState("");
  const [linking, setLinking] = useState(false);
  const [linkMsg, setLinkMsg] = useState("");

  async function generateCode() {
    setGenerating(true);
    const token = localStorage.getItem(TOKEN_KEY);
    try {
      const res = await fetch("/api/parents/link", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setInviteCode(data.inviteCode);
        setExpiresAt(data.expiresAt);
      }
    } catch {
      // ignore
    } finally {
      setGenerating(false);
    }
  }

  async function linkStudent(e: React.FormEvent) {
    e.preventDefault();
    setLinking(true);
    setLinkMsg("");
    const token = localStorage.getItem(TOKEN_KEY);
    try {
      const res = await fetch("/api/parents/link", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ inviteCode: linkCode }),
      });
      const data = await res.json();
      if (res.ok) {
        setLinkMsg("Student linked successfully! Reload to see them.");
        setLinkCode("");
      } else {
        setLinkMsg(data.error ?? "Failed to link student");
      }
    } catch {
      setLinkMsg("Error linking student");
    } finally {
      setLinking(false);
    }
  }

  function copyCode() {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
      <h3 className="font-black text-gray-900 mb-1">Link a Student Account</h3>
      <p className="text-sm text-gray-500 mb-5">
        Generate an invite code and share it with your child — or enter their code to link accounts.
      </p>
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Generate Invite Code</p>
          {inviteCode ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="font-mono text-2xl font-black tracking-widest bg-orange-50 text-orange-600 px-4 py-2 rounded-xl flex-1 text-center">
                  {inviteCode}
                </div>
                <button
                  onClick={copyCode}
                  className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              {expiresAt && (
                <p className="text-xs text-gray-400">
                  Expires {new Date(expiresAt).toLocaleDateString("en-IN")}
                </p>
              )}
            </div>
          ) : (
            <button
              onClick={generateCode}
              disabled={generating}
              className="w-full px-4 py-2.5 rounded-full bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {generating ? "Generating…" : "Generate Code"}
            </button>
          )}
        </div>
        <div>
          <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Link by Code (for students)</p>
          <form onSubmit={linkStudent} className="flex gap-2">
            <input
              type="text"
              value={linkCode}
              onChange={(e) => setLinkCode(e.target.value.toUpperCase())}
              maxLength={8}
              placeholder="8-char code"
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <button
              type="submit"
              disabled={linking || linkCode.length < 8}
              className="px-3 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {linking ? "…" : "Link"}
            </button>
          </form>
          {linkMsg && (
            <p className={`text-xs mt-2 ${linkMsg.includes("success") ? "text-green-600" : "text-red-600"}`}>
              {linkMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ParentDashboard() {
  const [kids, setKids] = useState<Kid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tier, setTier] = useState<string>("free");

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    Promise.all([
      fetch("/api/parent-dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
      fetch("/api/subscription", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    ])
      .then(([dashData, subData]) => {
        setKids(dashData.kids ?? []);
        setTier(subData.tier ?? "free");
      })
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const hasAccess = ["parent_kid", "annual", "bundle"].includes(tier);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">Parent Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your child's CUET preparation progress in real time.</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {!loading && !error && !hasAccess && (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <div className="text-5xl mb-4">👨‍👩‍👦</div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Parent Dashboard is a Premium Feature</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              Upgrade to <strong>Parent + Kid</strong> or <strong>Annual Bundle</strong> to track your child's
              progress, get weekly reports, and unlock group study rooms.
            </p>
            <Link
              href="/pricing"
              className="inline-block px-6 py-3 rounded-full bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-colors"
            >
              View Plans — from ₹349/month
            </Link>
          </div>
        )}

        {!loading && !error && hasAccess && kids.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <div className="text-5xl mb-4">🎒</div>
            <h2 className="text-xl font-black text-gray-900 mb-2">No Kid Accounts Yet</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              Create a kid account to track their CUET preparation. Kids get their own login code — no
              email or password needed.
            </p>
            <Link
              href="/pricing"
              className="inline-block px-6 py-3 rounded-full bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-colors"
            >
              Set Up Kid Account
            </Link>
          </div>
        )}

        {!loading && !error && hasAccess && (
          <InviteCodeSection />
        )}

        {!loading && !error && hasAccess && kids.length > 0 && (
          <>
            {/* Summary strip */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="text-2xl font-black text-orange-500">{kids.length}</div>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">Kid account{kids.length > 1 ? "s" : ""}</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="text-2xl font-black text-green-500">
                  {kids.reduce((s, k) => s + k.totalTopicsStudied, 0)}
                </div>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">Topics practiced (total)</p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <div className="text-2xl font-black text-blue-500">
                  L{Math.round(
                    kids.reduce((s, k) => s + k.avgBloomOverall, 0) / kids.length
                  )}
                </div>
                <p className="text-xs font-semibold text-gray-500 mt-0.5">Avg Bloom level</p>
              </div>
            </div>

            {/* Kid cards */}
            <h2 className="text-xl font-black text-gray-900 mb-4">Your Children</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {kids.map((kid) => (
                <KidCard key={kid.id} kid={kid} />
              ))}
            </div>

            {/* Weekly reports note */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-black text-gray-900 mb-2">Weekly Progress Reports</h3>
              <p className="text-sm text-gray-500 mb-4">
                Every Sunday you receive a personalised email with each child's weekly progress — topic count,
                improvement vs the previous week (e.g. "↑ 15% in Physics"), weak areas to focus on, and
                recommended topics for the week ahead.
              </p>
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                <p className="text-xs font-bold text-orange-700 mb-2 uppercase tracking-wide">Sample Report</p>
                <p className="text-sm text-gray-700 font-medium">
                  "Arjun practiced 12 topics this week — ▲ 15% improvement in Physics.
                  Focus areas: Rotational Motion, Current Electricity."
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
