"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppNav } from "../components/AppNav";
import { TOKEN_KEY } from "../utils/auth";

interface CronLog {
  _id: string;
  cronName: string;
  status: "success" | "failed";
  startedAt: number;
  durationMs: number;
  recordsAffected?: number;
  result?: string;
  errorMessage?: string;
}

interface AdminTodo {
  _id: string;
  title: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "open" | "done";
  createdAt: number;
}

interface KpiSnapshot {
  _id: string;
  dateLabel: string;
  capturedAt: number;
  totalUsers: number;
  newSignups24h: number;
  newSignups7d: number;
  dau: number;
  wau: number;
  mau: number;
  dauWauRatio: number;
  paidCount: number;
  freeCount: number;
  mrr: number;
  retention7d: number;
  retention30d: number;
}

const PRIORITY_STYLE: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-amber-100 text-amber-700",
  critical: "bg-red-100 text-red-700",
};

function KpiCard({ label, value, accent }: { label: string; value: string; accent: "orange" | "blue" | "emerald" | "gray" }) {
  const colors: Record<string, string> = {
    orange: "text-orange-600",
    blue: "text-blue-600",
    emerald: "text-emerald-600",
    gray: "text-gray-900",
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
      <p className={`text-2xl font-black mt-1 tabular-nums ${colors[accent]}`}>{value}</p>
    </div>
  );
}

function ago(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function AdminPage() {
  const [authStatus, setAuthStatus] = useState<"checking" | "ok" | "denied">("checking");
  const [logs, setLogs] = useState<CronLog[]>([]);
  const [todos, setTodos] = useState<AdminTodo[]>([]);
  const [kpis, setKpis] = useState<KpiSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (!t) {
      setAuthStatus("denied");
      return;
    }
    setToken(t);
    // Probe the admin endpoint to confirm founder access
    fetch("/api/admin/cron-logs", { headers: { Authorization: `Bearer ${t}` } })
      .then((r) => {
        if (r.status === 403 || r.status === 401) {
          setAuthStatus("denied");
          return null;
        }
        setAuthStatus("ok");
        return r.json();
      })
      .then((data) => {
        if (data) setLogs(data.logs ?? []);
      });
  }, []);

  useEffect(() => {
    if (authStatus !== "ok" || !token) return;
    Promise.all([
      fetch("/api/admin/todos", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch("/api/admin/kpis", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
    ])
      .then(([todoData, kpiData]) => {
        setTodos(todoData.todos ?? []);
        setKpis(kpiData.snapshots ?? []);
      })
      .finally(() => setLoading(false));
  }, [authStatus, token]);

  async function markDone(todoId: string) {
    if (!token) return;
    await fetch("/api/admin/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ todoId }),
    });
    setTodos((prev) => prev.filter((t) => t._id !== todoId));
  }

  if (authStatus === "checking") {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppNav />
        <div className="max-w-3xl mx-auto px-4 pt-20 text-center text-gray-400">
          Loading…
        </div>
      </div>
    );
  }

  if (authStatus === "denied") {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppNav />
        <div className="max-w-3xl mx-auto px-4 pt-20 text-center">
          <h1 className="text-2xl font-black text-gray-900">Forbidden</h1>
          <p className="text-sm text-gray-500 mt-2">
            This page is for 10minCUET founders only.
          </p>
          <Link
            href="/login"
            className="inline-block mt-6 bg-orange-500 text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-orange-600 transition-all"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  const successCount = logs.filter((l) => l.status === "success").length;
  const failCount = logs.filter((l) => l.status === "failed").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />

      <section className="max-w-5xl mx-auto px-4 pt-12 pb-20">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
          Admin
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Operational dashboard for 10minCUET founders.
        </p>

        {/* KPI hero — latest snapshot */}
        {kpis.length > 0 && (
          <div className="mt-8">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-lg font-black text-gray-900">Today's KPIs</h2>
              <p className="text-xs text-gray-400">
                {kpis[0].dateLabel} · captured {ago(kpis[0].capturedAt)}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <KpiCard label="MRR" value={`₹${kpis[0].mrr.toLocaleString("en-IN")}`} accent="orange" />
              <KpiCard label="DAU" value={kpis[0].dau.toString()} accent="blue" />
              <KpiCard label="Paid" value={kpis[0].paidCount.toString()} accent="emerald" />
              <KpiCard label="Total users" value={kpis[0].totalUsers.toLocaleString("en-IN")} accent="gray" />
              <KpiCard label="WAU" value={kpis[0].wau.toString()} accent="gray" />
              <KpiCard label="MAU" value={kpis[0].mau.toString()} accent="gray" />
              <KpiCard label="7d retention" value={`${kpis[0].retention7d}%`} accent="gray" />
              <KpiCard label="DAU/WAU" value={`${kpis[0].dauWauRatio}%`} accent="gray" />
            </div>
          </div>
        )}

        {/* Trend */}
        {kpis.length > 1 && (
          <div className="mt-8">
            <h2 className="text-lg font-black text-gray-900 mb-3">Last 30 days</h2>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-400">
                  <tr>
                    <th className="text-left px-4 py-3">Date</th>
                    <th className="text-right px-4 py-3">DAU</th>
                    <th className="text-right px-4 py-3">WAU</th>
                    <th className="text-right px-4 py-3">MAU</th>
                    <th className="text-right px-4 py-3">New 24h</th>
                    <th className="text-right px-4 py-3">Paid</th>
                    <th className="text-right px-4 py-3">MRR (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {kpis.map((k) => (
                    <tr key={k._id}>
                      <td className="px-4 py-2 font-mono text-xs text-gray-900">{k.dateLabel}</td>
                      <td className="px-4 py-2 text-right tabular-nums text-gray-700">{k.dau}</td>
                      <td className="px-4 py-2 text-right tabular-nums text-gray-700">{k.wau}</td>
                      <td className="px-4 py-2 text-right tabular-nums text-gray-700">{k.mau}</td>
                      <td className="px-4 py-2 text-right tabular-nums text-blue-600">{k.newSignups24h}</td>
                      <td className="px-4 py-2 text-right tabular-nums text-emerald-700">{k.paidCount}</td>
                      <td className="px-4 py-2 text-right tabular-nums font-black text-gray-900">
                        {k.mrr.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Health summary */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Open todos</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{todos.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Cron successes (50 latest)
            </p>
            <p className="text-3xl font-black text-emerald-600 mt-1">{successCount}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Cron failures (50 latest)
            </p>
            <p className={`text-3xl font-black mt-1 ${failCount > 0 ? "text-red-600" : "text-gray-300"}`}>
              {failCount}
            </p>
          </div>
        </div>

        {/* Open todos */}
        <div className="mt-10">
          <h2 className="text-lg font-black text-gray-900 mb-4">Open todos</h2>
          {loading ? (
            <p className="text-sm text-gray-400">Loading…</p>
          ) : todos.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <p className="text-sm text-gray-500">No open todos. Inbox zero.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todos.map((t) => (
                <div
                  key={t._id}
                  className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3"
                >
                  <span
                    className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${PRIORITY_STYLE[t.priority]}`}
                  >
                    {t.priority}
                  </span>
                  <p className="flex-1 text-sm font-semibold text-gray-900 min-w-0 truncate">
                    {t.title}
                  </p>
                  <p className="text-xs text-gray-400 shrink-0">{ago(t.createdAt)}</p>
                  <button
                    onClick={() => markDone(t._id)}
                    className="text-xs font-bold px-3 py-1.5 rounded-full bg-gray-900 text-white hover:bg-gray-700 transition-colors shrink-0"
                  >
                    Done
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cron history */}
        <div className="mt-12">
          <h2 className="text-lg font-black text-gray-900 mb-4">Cron history (latest 50)</h2>
          {logs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <p className="text-sm text-gray-500">
                No cron runs logged yet. Logged crons will appear here after their next scheduled run.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-400">
                  <tr>
                    <th className="text-left px-4 py-3">Cron</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-right px-4 py-3">Duration</th>
                    <th className="text-right px-4 py-3">Affected</th>
                    <th className="text-right px-4 py-3">Started</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.map((l) => (
                    <tr key={l._id}>
                      <td className="px-4 py-2.5 font-mono text-xs text-gray-900">{l.cronName}</td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                            l.status === "success"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {l.status}
                        </span>
                        {l.errorMessage && (
                          <p className="text-xs text-red-500 mt-1 truncate max-w-xs">
                            {l.errorMessage}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-gray-500">
                        {l.durationMs}ms
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-gray-500">
                        {l.recordsAffected ?? "—"}
                      </td>
                      <td className="px-4 py-2.5 text-right text-gray-400">{ago(l.startedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
