"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppNav } from "../../components/AppNav";
import { TOKEN_KEY } from "../../utils/auth";

interface RoomRow {
  roomId: string;
  name: string;
  subject: string;
  isActive: boolean;
  createdAt: number;
  participantCount: number;
  messageCount: number;
  noteCount: number;
  joinCode: string;
}

interface HostStats {
  totalRooms: number;
  activeRooms: number;
  totalParticipants: number;
  uniqueParticipants: number;
  totalMessages: number;
  totalNotes: number;
  avgParticipantsPerRoom: number;
  topSubject: string | null;
  rooms: RoomRow[];
}

const SUBJECT_COLOR: Record<string, string> = {
  Languages: "#3b82f6",
  Domain: "#10b981",
  "General Test": "#f97316",
  "All Subjects": "#6b7280",
};

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
      <p className="text-3xl font-black text-gray-900 mt-1 tabular-nums">{value}</p>
    </div>
  );
}

export default function HostAnalyticsPage() {
  const [stats, setStats] = useState<HostStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (!t) {
      setError("Sign in to see your host analytics.");
      setLoading(false);
      return;
    }
    fetch("/api/study-rooms/host-stats", { headers: { Authorization: `Bearer ${t}` } })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setStats(data.stats);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />

      <section className="max-w-5xl mx-auto px-4 pt-12 pb-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">Host analytics</h1>
            <p className="text-sm text-gray-500 mt-2">Engagement on rooms you've hosted across your time on 10minCUET.</p>
          </div>
          <Link
            href="/study-rooms"
            className="text-sm font-bold text-orange-600 hover:text-orange-700"
          >
            ← Back to study rooms
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading…</div>
        ) : error ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
            <p className="text-sm font-semibold text-amber-800">{error}</p>
            {error.includes("Sign in") && (
              <Link
                href="/login"
                className="mt-4 inline-block bg-orange-500 text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-orange-600 transition-all"
              >
                Sign in
              </Link>
            )}
          </div>
        ) : !stats || stats.totalRooms === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <div className="text-5xl mb-3">🪑</div>
            <p className="font-black text-gray-900 text-lg">You haven't hosted a room yet</p>
            <p className="text-sm text-gray-500 mt-2">Create a study room to see engagement stats here.</p>
            <Link
              href="/study-rooms"
              className="mt-6 inline-block bg-orange-500 text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-orange-600 transition-all"
            >
              Start a room
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total rooms" value={stats.totalRooms.toString()} />
              <StatCard label="Active now" value={stats.activeRooms.toString()} />
              <StatCard label="Unique participants" value={stats.uniqueParticipants.toString()} />
              <StatCard label="Avg per room" value={stats.avgParticipantsPerRoom.toFixed(1)} />
              <StatCard label="Total messages" value={stats.totalMessages.toLocaleString("en-IN")} />
              <StatCard label="Total notes" value={stats.totalNotes.toString()} />
              <StatCard label="Top subject" value={stats.topSubject ?? "—"} />
              <StatCard label="Total joins" value={stats.totalParticipants.toString()} />
            </div>

            <h2 className="text-lg font-black text-gray-900 mt-10 mb-3">Your rooms</h2>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-400">
                  <tr>
                    <th className="text-left px-4 py-3">Room</th>
                    <th className="text-left px-4 py-3">Subject</th>
                    <th className="text-right px-4 py-3">Participants</th>
                    <th className="text-right px-4 py-3">Messages</th>
                    <th className="text-right px-4 py-3">Notes</th>
                    <th className="text-right px-4 py-3">Created</th>
                    <th className="text-right px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.rooms.map((r) => (
                    <tr key={r.roomId}>
                      <td className="px-4 py-2.5 font-semibold text-gray-900">{r.name}</td>
                      <td className="px-4 py-2.5">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                          style={{ background: SUBJECT_COLOR[r.subject] ?? "#6b7280" }}
                        >
                          {r.subject}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-gray-700">{r.participantCount}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-gray-700">{r.messageCount}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-gray-700">{r.noteCount}</td>
                      <td className="px-4 py-2.5 text-right text-gray-400 tabular-nums">
                        {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {r.isActive ? (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            active
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">closed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
