"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TOKEN_KEY } from "../../utils/auth";

const SUBJECT_COLOR: Record<string, string> = {
  Languages: "#3b82f6",
  Domain: "#10b981",
  "General Test": "#f97316",
};

interface Match {
  _id: string;
  round: number;
  slot: number;
  playerAUserId: string;
  playerAUserName: string;
  playerAScore?: number;
  playerBUserId?: string;
  playerBUserName?: string;
  playerBScore?: number;
  winnerUserId?: string;
  winnerUserName?: string;
  status: string;
  roundStartsAt: number;
  roundEndsAt: number;
}

interface Entry {
  _id: string;
  userId: string;
  userName: string;
  seed: number;
  currentRound: number;
  eliminatedInRound?: number;
}

interface Tournament {
  _id: string;
  name: string;
  subject?: string;
  topicSlug?: string;
  topicLabel?: string;
  status: string;
  size?: number;
  startsAt?: number;
  endsAt?: number;
  registrationClosesAt?: number;
  currentRound?: number;
  winnerUserId?: string;
  winnerUserName?: string;
}

function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MatchCard({ m, you }: { m: Match; you?: string }) {
  const isYou = (id?: string) => you && id && id === you;
  const winA = m.winnerUserId && m.winnerUserId === m.playerAUserId;
  const winB = m.winnerUserId && m.winnerUserId === m.playerBUserId;
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-3 py-2.5 text-sm">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span
          className={`font-bold truncate ${winA ? "text-emerald-700" : "text-gray-900"} ${
            isYou(m.playerAUserId) ? "underline decoration-orange-400 underline-offset-4" : ""
          }`}
        >
          {m.playerAUserName}
        </span>
        <span className="tabular-nums text-gray-500 font-bold shrink-0">
          {m.playerAScore?.toFixed(0) ?? "—"}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span
          className={`font-bold truncate ${winB ? "text-emerald-700" : "text-gray-900"} ${
            isYou(m.playerBUserId) ? "underline decoration-orange-400 underline-offset-4" : ""
          }`}
        >
          {m.playerBUserName ?? "—"}
        </span>
        <span className="tabular-nums text-gray-500 font-bold shrink-0">
          {m.playerBScore?.toFixed(0) ?? "—"}
        </span>
      </div>
      {m.status === "completed" && m.winnerUserName && (
        <p className="text-xs text-emerald-600 font-bold mt-1">🏆 {m.winnerUserName}</p>
      )}
    </div>
  );
}

export function TournamentClient({
  tournament,
  entries,
  matches,
}: {
  tournament: Tournament;
  entries: Entry[];
  matches: Match[];
}) {
  const [registered, setRegistered] = useState(false);
  const [you, setYou] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    setToken(t);
    if (!t) return;
    try {
      const payload = JSON.parse(atob(t.split(".")[1]));
      setYou(payload.sub);
      setRegistered(entries.some((e) => e.userId === payload.sub));
    } catch {
      // ignore
    }
  }, [entries]);

  async function register() {
    if (!token) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/tournaments/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tournamentId: tournament._id }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else {
        setRegistered(true);
        // Reload to reflect new entry
        setTimeout(() => location.reload(), 500);
      }
    } finally {
      setBusy(false);
    }
  }

  const accent = SUBJECT_COLOR[tournament.subject ?? ""] ?? "#6b7280";
  const r1 = matches.filter((m) => m.round === 1);
  const r2 = matches.filter((m) => m.round === 2);
  const r3 = matches.filter((m) => m.round === 3);
  const myMatch = matches.find(
    (m) =>
      m.status === "pending" &&
      (m.playerAUserId === you || m.playerBUserId === you)
  );

  return (
    <>
      <section className="text-white px-4 py-12" style={{ background: `linear-gradient(135deg, ${accent}, #111827)` }}>
        <div className="max-w-3xl mx-auto">
          <Link
            href="/tournaments"
            className="text-xs font-bold opacity-80 hover:opacity-100 inline-block mb-4"
          >
            ← All tournaments
          </Link>
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">
            {tournament.subject} Cup
          </p>
          <h1 className="text-3xl sm:text-4xl font-black mt-2 leading-tight">{tournament.name}</h1>
          {tournament.startsAt && tournament.endsAt && (
            <p className="text-sm opacity-90 mt-3">
              {fmtDate(tournament.startsAt)} → {fmtDate(tournament.endsAt)}
            </p>
          )}
          <p className="text-sm opacity-90 mt-2">
            {entries.length}/{tournament.size ?? 8} registered ·{" "}
            <span className="font-black uppercase tracking-wide">{tournament.status}</span>
            {tournament.winnerUserName && <> · 🏆 {tournament.winnerUserName}</>}
          </p>

          {tournament.status === "registration" &&
            (registered ? (
              <p className="mt-4 inline-block text-xs font-bold uppercase tracking-wide text-white bg-white/20 px-3 py-1.5 rounded-full">
                ✓ You're registered (seed #{entries.find((e) => e.userId === you)?.seed ?? "?"})
              </p>
            ) : (
              <button
                onClick={register}
                disabled={busy || !token}
                className="mt-4 inline-block text-sm font-bold text-gray-900 bg-white px-5 py-2.5 rounded-full hover:bg-gray-100 transition-all disabled:opacity-50"
              >
                {token ? (busy ? "Registering…" : "Register") : "Sign in to register"}
              </button>
            ))}
          {error && <p className="text-xs text-amber-200 mt-2">{error}</p>}
        </div>
      </section>

      {/* Your match callout */}
      {myMatch && tournament.topicSlug && (
        <section className="max-w-3xl mx-auto px-4 pt-8">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-orange-700">
              Your next match — round {myMatch.round}
            </p>
            <p className="text-lg font-black text-gray-900 mt-1">
              vs{" "}
              {myMatch.playerAUserId === you
                ? myMatch.playerBUserName ?? "bye"
                : myMatch.playerAUserName}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Submit your best quiz score on{" "}
              <span className="font-bold">{tournament.topicLabel ?? tournament.topicSlug}</span> before{" "}
              {fmtDate(myMatch.roundEndsAt)}
            </p>
            <Link
              href={`/topics/${tournament.topicSlug}`}
              className="mt-3 inline-block text-sm font-bold text-white bg-orange-500 px-5 py-2.5 rounded-full hover:bg-orange-600 transition-all"
            >
              Play topic quiz →
            </Link>
          </div>
        </section>
      )}

      {/* Bracket */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <h2 className="text-lg font-black text-gray-900 mb-4">Bracket</h2>
        {matches.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <p className="text-sm text-gray-500">
              {tournament.status === "registration"
                ? "Bracket will be drawn once 8 players have registered."
                : tournament.status === "cancelled"
                ? "Tournament cancelled — didn't reach 8 players."
                : "Bracket draw pending."}
            </p>
            {tournament.status === "registration" && entries.length > 0 && (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {entries.map((e) => (
                  <div
                    key={e._id}
                    className="bg-gray-50 rounded-xl px-3 py-2 text-sm text-gray-900 font-semibold flex items-center gap-2"
                  >
                    <span className="text-xs font-bold text-gray-400 tabular-nums">#{e.seed}</span>
                    <span className="truncate">{e.userName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Quarter-final</p>
              <div className="space-y-3">
                {r1.map((m) => (
                  <MatchCard key={m._id} m={m} you={you} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Semi-final</p>
              <div className="space-y-3 pt-6">
                {r2.length === 0 ? (
                  <p className="text-xs text-gray-400">tbd</p>
                ) : (
                  r2.map((m) => <MatchCard key={m._id} m={m} you={you} />)
                )}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Final</p>
              <div className="space-y-3 pt-12">
                {r3.length === 0 ? (
                  <p className="text-xs text-gray-400">tbd</p>
                ) : (
                  r3.map((m) => <MatchCard key={m._id} m={m} you={you} />)
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
