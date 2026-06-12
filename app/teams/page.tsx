"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ConvexHttpClient } from "convex/browser";
import { api } from "convex/_generated/api";
import { AppNav } from "../components/AppNav";
import { TOKEN_KEY } from "../utils/auth";

interface Team {
  _id: string;
  shortName: string;
  name: string;
  colorPrimary: string;
  colorSecondary: string;
  emoji: string;
}

interface Standing {
  teamId: string;
  teamShortName: string;
  teamName: string;
  memberCount: number;
  topElevenAverage: number;
  totalScore: number;
  rank: number;
}

interface Season {
  _id: string;
  monthLabel: string;
  startsAt: number;
  endsAt: number;
}

function monthDisplay(label: string): string {
  const [y, m] = label.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [standings, setStandings] = useState<Standing[] | null>(null);
  const [season, setSeason] = useState<Season | null>(null);
  const [myTeamId, setMyTeamId] = useState<string | null>(null);
  const [memberCounts, setMemberCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    setToken(t);
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) {
      setLoading(false);
      return;
    }
    const convex = new ConvexHttpClient(url);

    Promise.all([
      convex.query(api.teams.listTeams, {}),
      convex.query(api.teams.getCurrentSeason, {}),
      convex.query(api.teams.getStandings, {}),
      convex.query(api.teams.getTeamMemberCounts, {}),
    ])
      .then(([t, s, st, mc]) => {
        setTeams(t ?? []);
        setSeason(s);
        setStandings(st?.standings ?? null);
        setMemberCounts(mc ?? {});
      })
      .finally(() => setLoading(false));

    if (t) {
      fetch("/api/teams/my-team", { headers: { Authorization: `Bearer ${t}` } })
        .then((r) => r.json())
        .then((data) => setMyTeamId(data.team?._id ?? null));
    }
  }, []);

  async function joinTeam(teamId: string) {
    if (!token) {
      setError("Sign in to join a team.");
      return;
    }
    setJoining(teamId);
    setError("");
    try {
      const res = await fetch("/api/teams/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ teamId }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setMyTeamId(teamId);
        setMemberCounts((prev) => ({
          ...prev,
          [teamId]: (prev[teamId] ?? 0) + 1,
        }));
      }
    } catch {
      setError("Failed to join team. Try again.");
    } finally {
      setJoining(null);
    }
  }

  // Sort teams by current standing rank, fall back to alpha
  const orderedTeams = [...teams].sort((a, b) => {
    const sa = standings?.find((s) => s.teamId === a._id);
    const sb = standings?.find((s) => s.teamId === b._id);
    if (sa && sb) return sa.rank - sb.rank;
    if (sa) return -1;
    if (sb) return 1;
    return a.shortName.localeCompare(b.shortName);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />

      <section className="max-w-5xl mx-auto px-4 pt-12 pb-6">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-2">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
              CUET × IPL Cup
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Pick a franchise. Score points by studying. Top-11 average wins the month.
              {season && (
                <span className="ml-2 font-semibold text-gray-700">
                  · Season: {monthDisplay(season.monthLabel)}
                </span>
              )}
            </p>
          </div>
          <Link
            href="/leaderboard"
            className="text-sm font-bold text-orange-600 hover:text-orange-700"
          >
            See individual leaderboard →
          </Link>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            {error}
          </div>
        )}
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading teams…</div>
        ) : teams.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-sm text-gray-500">
              Teams not seeded yet. Run the seed mutation from Convex dashboard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orderedTeams.map((team) => {
              const standing = standings?.find((s) => s.teamId === team._id);
              const count = memberCounts[team._id] ?? 0;
              const isMyTeam = myTeamId === team._id;
              const userHasTeam = myTeamId !== null;

              return (
                <div
                  key={team._id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Coloured header */}
                  <div
                    className="px-5 py-4 text-white"
                    style={{
                      background: `linear-gradient(135deg, ${team.colorPrimary}, ${team.colorSecondary})`,
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-3xl">{team.emoji}</span>
                        <div className="min-w-0">
                          <h2 className="font-black text-lg leading-tight truncate">
                            {team.name}
                          </h2>
                          <p className="text-xs opacity-90 mt-0.5 font-bold uppercase tracking-wide">
                            {team.shortName}
                          </p>
                        </div>
                      </div>
                      {standing && (
                        <div className="text-right shrink-0">
                          <p className="text-3xl font-black leading-none">
                            #{standing.rank}
                          </p>
                          <p className="text-xs opacity-80 mt-0.5">rank</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="px-5 py-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                          Playing XI avg
                        </p>
                        <p className="text-2xl font-black text-gray-900 mt-0.5 tabular-nums">
                          {standing ? standing.topElevenAverage.toFixed(0) : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                          Squad size
                        </p>
                        <p className="text-2xl font-black text-gray-900 mt-0.5 tabular-nums">
                          {count}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/teams/${team.shortName.toLowerCase()}`}
                        className="text-xs font-bold text-gray-600 hover:text-gray-900 px-3 py-2 rounded-full border border-gray-200 hover:border-gray-400 transition-all"
                      >
                        View squad
                      </Link>
                      {isMyTeam ? (
                        <span className="ml-auto text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-full">
                          ✓ Your team
                        </span>
                      ) : userHasTeam ? (
                        <span className="ml-auto text-xs font-semibold text-gray-400 px-3 py-2">
                          Locked this month
                        </span>
                      ) : (
                        <button
                          onClick={() => joinTeam(team._id)}
                          disabled={joining === team._id}
                          className="ml-auto text-xs font-bold text-white px-4 py-2 rounded-full transition-all disabled:opacity-50"
                          style={{ background: team.colorPrimary }}
                        >
                          {joining === team._id ? "Joining…" : "Join"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
