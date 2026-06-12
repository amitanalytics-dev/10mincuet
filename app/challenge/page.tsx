"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppNav } from "../components/AppNav";
import { TOKEN_KEY } from "../utils/auth";

interface Challenge {
  _id: string;
  weekStart: number;
  weekEnd?: number;
  subject: string;
  topicSlug: string;
  topicLabel?: string;
  title?: string;
  targetScore: number;
  participants: number;
  completions?: number;
}

interface Participation {
  _id: string;
  bestScore: number;
  attemptCount: number;
  completedAt?: number;
}

interface LeaderboardEntry {
  _id: string;
  userName: string;
  bestScore: number;
  attemptCount: number;
  completedAt?: number;
}

interface Badge {
  challengeId: string;
  title: string;
  subject: string;
  topicLabel: string;
  completedAt: number;
  bestScore: number;
  targetScore: number;
}

const SUBJECT_COLOR: Record<string, string> = {
  Languages: "#3b82f6",
  Domain: "#10b981",
  "General Test": "#f97316",
};

function timeLeft(endsAt: number): string {
  const diff = endsAt - Date.now();
  if (diff <= 0) return "ended";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  if (d > 0) return `${d}d ${h}h left`;
  return `${h}h left`;
}

export default function ChallengePage() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [participation, setParticipation] = useState<Participation | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    setToken(t);
    setLoggedIn(!!t);
    fetch("/api/challenge/state", t ? { headers: { Authorization: `Bearer ${t}` } } : undefined)
      .then((r) => r.json())
      .then((data) => {
        setChallenge(data.challenge);
        setParticipation(data.myParticipation);
        setLeaderboard(data.leaderboard ?? []);
        setBadges(data.myBadges ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  async function joinChallenge() {
    if (!token || !challenge) return;
    setJoining(true);
    setError("");
    try {
      const res = await fetch("/api/challenge/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ challengeId: challenge._id }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else {
        setParticipation({
          _id: "pending",
          bestScore: 0,
          attemptCount: 0,
        });
        setChallenge({ ...challenge, participants: challenge.participants + 1 });
      }
    } finally {
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppNav />
        <div className="max-w-3xl mx-auto px-4 pt-20 text-center text-gray-400">Loading…</div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppNav />
        <div className="max-w-3xl mx-auto px-4 pt-20 text-center">
          <h1 className="text-2xl font-black text-gray-900">No active challenge</h1>
          <p className="text-sm text-gray-500 mt-2">A new weekly challenge drops every Monday at midnight IST.</p>
        </div>
      </div>
    );
  }

  const accent = SUBJECT_COLOR[challenge.subject] ?? "#6b7280";
  const endsAt = challenge.weekEnd ?? challenge.weekStart + 7 * 86400000;
  const progressPct = Math.min(100, ((participation?.bestScore ?? 0) / challenge.targetScore) * 100);
  const completed = !!participation?.completedAt;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />

      {/* Hero */}
      <section className="text-white px-4 py-12" style={{ background: `linear-gradient(135deg, ${accent}, #111827)` }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">
            Weekly Challenge · {challenge.subject}
          </p>
          <h1 className="text-3xl sm:text-4xl font-black mt-2 leading-tight">
            {challenge.title ?? `${challenge.subject} sprint: ${challenge.topicLabel ?? challenge.topicSlug}`}
          </h1>
          <p className="text-sm opacity-90 mt-3">
            Hit <span className="font-black">{challenge.targetScore}%</span> on
            <span className="font-bold"> {challenge.topicLabel ?? challenge.topicSlug}</span> to unlock the badge.
          </p>

          <div className="flex items-center gap-6 mt-6 text-sm">
            <div>
              <p className="text-xs opacity-70 font-bold uppercase tracking-wide">Time</p>
              <p className="font-black mt-0.5">{timeLeft(endsAt)}</p>
            </div>
            <div>
              <p className="text-xs opacity-70 font-bold uppercase tracking-wide">Joined</p>
              <p className="font-black mt-0.5">{challenge.participants}</p>
            </div>
            <div>
              <p className="text-xs opacity-70 font-bold uppercase tracking-wide">Completed</p>
              <p className="font-black mt-0.5">{challenge.completions ?? 0}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-10">
        {/* Personal progress */}
        {loggedIn ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Your progress</p>
            <div className="flex items-baseline justify-between mt-1 gap-3">
              <p className="text-4xl font-black text-gray-900 tabular-nums">
                {(participation?.bestScore ?? 0).toFixed(0)}
                <span className="text-base text-gray-400 font-bold ml-1">/ {challenge.targetScore}</span>
              </p>
              {completed ? (
                <span className="text-xs font-black uppercase tracking-wide text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
                  ✓ Badge unlocked
                </span>
              ) : participation ? (
                <span className="text-xs font-bold text-gray-500">{participation.attemptCount} attempts</span>
              ) : null}
            </div>
            <div className="mt-3 h-3 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full transition-all"
                style={{ width: `${progressPct}%`, background: `linear-gradient(90deg, ${accent}, ${accent})` }}
              />
            </div>

            <div className="flex items-center gap-3 mt-5">
              {!participation && (
                <button
                  onClick={joinChallenge}
                  disabled={joining}
                  className="text-sm font-bold text-white px-5 py-2.5 rounded-full transition-all disabled:opacity-50"
                  style={{ background: accent }}
                >
                  {joining ? "Joining…" : "Join the challenge"}
                </button>
              )}
              <Link
                href={`/topics/${challenge.topicSlug}`}
                className="text-sm font-bold text-gray-900 bg-white border border-gray-200 px-5 py-2.5 rounded-full hover:border-gray-400 transition-all"
              >
                {participation ? "Practice topic →" : "Start practising →"}
              </Link>
            </div>
            {error && <p className="text-xs text-amber-700 mt-3">{error}</p>}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
            <p className="text-sm text-gray-600">
              <Link href="/login" className="font-bold text-orange-500 hover:underline">Sign in</Link>{" "}
              to join the challenge and earn a badge.
            </p>
          </div>
        )}

        {/* Leaderboard */}
        <h2 className="text-lg font-black text-gray-900 mt-10 mb-3">Top of the week</h2>
        {leaderboard.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-sm text-gray-500">
            Be the first to score on this challenge.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-400">
                <tr>
                  <th className="text-left px-4 py-3">#</th>
                  <th className="text-left px-4 py-3">Player</th>
                  <th className="text-right px-4 py-3">Best</th>
                  <th className="text-right px-4 py-3">Attempts</th>
                  <th className="text-right px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leaderboard.map((e, i) => (
                  <tr key={e._id}>
                    <td className="px-4 py-2.5 font-bold text-gray-400 tabular-nums">{i + 1}</td>
                    <td className="px-4 py-2.5 font-semibold text-gray-900">{e.userName}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums font-black text-gray-900">
                      {e.bestScore.toFixed(0)}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-gray-500">{e.attemptCount}</td>
                    <td className="px-4 py-2.5 text-right">
                      {e.completedAt ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          done
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">in progress</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Past badges */}
        {badges.length > 0 && (
          <>
            <h2 className="text-lg font-black text-gray-900 mt-10 mb-3">Your badges</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {badges.map((b) => (
                <div
                  key={b.challengeId}
                  className="rounded-2xl border border-gray-200 bg-white p-4"
                  style={{ borderLeftColor: SUBJECT_COLOR[b.subject] ?? "#6b7280", borderLeftWidth: 4 }}
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{b.subject}</p>
                  <p className="font-black text-gray-900 mt-0.5 leading-tight">{b.topicLabel}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {b.bestScore.toFixed(0)}/{b.targetScore} ·{" "}
                    {new Date(b.completedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
