"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppNav } from "../../components/AppNav";
import { TOKEN_KEY } from "../../utils/auth";

interface Educator {
  _id: string;
  name: string;
  subjects: string[];
  bio: string;
  rating: number;
  totalRatings: number;
  totalStudents: number;
  isVerified: boolean;
}
interface Note {
  _id: string;
  slug: string;
  title: string;
  status: "draft" | "published";
  viewCount: number;
  updatedAt: number;
}
interface QSet {
  _id: string;
  slug: string;
  title: string;
  subject: string;
  questionIds: string[];
  status: "draft" | "published";
  attemptCount: number;
  createdAt: number;
}

interface Payout {
  _id: string;
  monthLabel: string;
  followerCountAtPayout: number;
  tier: "small" | "mid" | "large";
  amountInr: number;
  status: "pending" | "paid" | "failed" | "skipped";
  paidAt?: number;
  note?: string;
}

export default function EducatorDashboardPage() {
  const [educator, setEducator] = useState<Educator | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [sets, setSets] = useState<QSet[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [composer, setComposer] = useState<"none" | "note" | "set">("none");
  const [error, setError] = useState("");

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    setToken(t);
    if (!t) {
      setLoading(false);
      return;
    }
    fetch("/api/educator/dashboard", { headers: { Authorization: `Bearer ${t}` } })
      .then((r) => r.json())
      .then((data) => {
        setEducator(data.educator);
        setNotes(data.notes ?? []);
        setSets(data.sets ?? []);
        setPayouts(data.payouts ?? []);
        setFollowerCount(data.followerCount ?? 0);
      })
      .finally(() => setLoading(false));
  }, []);

  async function reload() {
    if (!token) return;
    const res = await fetch("/api/educator/dashboard", { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setNotes(data.notes ?? []);
    setSets(data.sets ?? []);
    setPayouts(data.payouts ?? []);
  }

  async function toggleNoteStatus(noteId: string, newStatus: "draft" | "published") {
    if (!token) return;
    await fetch("/api/educator/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: "setStatus", noteId, status: newStatus }),
    });
    reload();
  }
  async function toggleSetStatus(setId: string, newStatus: "draft" | "published") {
    if (!token) return;
    await fetch("/api/educator/question-sets", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: "setStatus", setId, status: newStatus }),
    });
    reload();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppNav />
        <div className="max-w-3xl mx-auto px-4 pt-20 text-center text-gray-400">Loading…</div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppNav />
        <div className="max-w-3xl mx-auto px-4 pt-20 text-center">
          <p className="text-sm text-gray-600">
            <Link href="/login" className="font-bold text-orange-500">Sign in</Link> to access your educator dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (!educator) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppNav />
        <div className="max-w-3xl mx-auto px-4 pt-20 text-center">
          <h1 className="text-2xl font-black text-gray-900">No educator profile yet</h1>
          <p className="text-sm text-gray-500 mt-2">
            Apply to mentor at <Link href="/champions" className="text-orange-600 font-bold">/champions</Link>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />

      <section className="max-w-4xl mx-auto px-4 pt-12 pb-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Educator</p>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mt-1">{educator.name}</h1>
            <p className="text-sm text-gray-500 mt-2">
              {educator.isVerified && <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full mr-2">Verified</span>}
              {educator.subjects.join(" · ")}
            </p>
          </div>
          <Link
            href={`/educators/${educator._id}`}
            className="text-sm font-bold text-orange-600 hover:text-orange-700"
          >
            View public profile →
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Stat label="Followers" value={followerCount.toString()} />
          <Stat label="Published notes" value={notes.filter((n) => n.status === "published").length.toString()} />
          <Stat label="Question sets" value={sets.filter((s) => s.status === "published").length.toString()} />
          <Stat label="Total set attempts" value={sets.reduce((a, s) => a + s.attemptCount, 0).toString()} />
        </div>

        {/* Composer toggles */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setComposer(composer === "note" ? "none" : "note")}
            className="text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-full transition-colors"
          >
            {composer === "note" ? "Cancel" : "+ New note"}
          </button>
          <button
            onClick={() => setComposer(composer === "set" ? "none" : "set")}
            className="text-sm font-bold text-gray-900 bg-white border border-gray-200 hover:border-gray-400 px-4 py-2 rounded-full transition-colors"
          >
            {composer === "set" ? "Cancel" : "+ New question set"}
          </button>
        </div>

        {composer === "note" && (
          <NoteComposer
            educatorId={educator._id}
            token={token}
            onCreated={() => {
              setComposer("none");
              reload();
            }}
            onError={setError}
          />
        )}
        {composer === "set" && (
          <SetComposer
            educatorId={educator._id}
            token={token}
            onCreated={() => {
              setComposer("none");
              reload();
            }}
            onError={setError}
          />
        )}
        {error && <p className="text-xs text-red-600 mb-4">{error}</p>}

        {/* Notes list */}
        <h2 className="text-lg font-black text-gray-900 mt-10 mb-3">Your notes</h2>
        {notes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-sm text-gray-500">
            No notes yet.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-400">
                <tr>
                  <th className="text-left px-4 py-3">Title</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Views</th>
                  <th className="text-right px-4 py-3">Updated</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {notes.map((n) => (
                  <tr key={n._id}>
                    <td className="px-4 py-2.5">
                      {n.status === "published" ? (
                        <Link href={`/educators/${educator._id}/notes/${n.slug}`} className="font-bold text-gray-900 hover:text-orange-500">
                          {n.title}
                        </Link>
                      ) : (
                        <span className="font-bold text-gray-900">{n.title}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${n.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-700"}`}>
                        {n.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-gray-500">{n.viewCount}</td>
                    <td className="px-4 py-2.5 text-right text-gray-400 tabular-nums">
                      {new Date(n.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => toggleNoteStatus(n._id, n.status === "published" ? "draft" : "published")}
                        className="text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors"
                      >
                        {n.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Sets list */}
        <h2 className="text-lg font-black text-gray-900 mt-10 mb-3">Your question sets</h2>
        {sets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-sm text-gray-500">
            No question sets yet.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-400">
                <tr>
                  <th className="text-left px-4 py-3">Title</th>
                  <th className="text-left px-4 py-3">Subject</th>
                  <th className="text-right px-4 py-3">Questions</th>
                  <th className="text-right px-4 py-3">Attempts</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sets.map((s) => (
                  <tr key={s._id}>
                    <td className="px-4 py-2.5 font-bold text-gray-900">{s.title}</td>
                    <td className="px-4 py-2.5 text-gray-500">{s.subject}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-gray-500">{s.questionIds.length}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-gray-500">{s.attemptCount}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${s.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-700"}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => toggleSetStatus(s._id, s.status === "published" ? "draft" : "published")}
                        className="text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors"
                      >
                        {s.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Payout history */}
        <h2 className="text-lg font-black text-gray-900 mt-10 mb-3">Payouts</h2>
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-700">Tier rates</p>
          <p className="text-sm text-gray-800 mt-2 leading-relaxed">
            Verified educators receive a monthly retainer:
            <strong className="font-black"> ₹2,000</strong> (under 100 followers),
            <strong className="font-black"> ₹5,000</strong> (100–499 followers),
            <strong className="font-black"> ₹10,000</strong> (500+ followers). Generated on the 1st of each month.
          </p>
        </div>
        {payouts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-sm text-gray-500">
            No payouts yet. Your first month's payout will appear after the 1st of next month.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-400">
                <tr>
                  <th className="text-left px-4 py-3">Month</th>
                  <th className="text-right px-4 py-3">Followers</th>
                  <th className="text-left px-4 py-3">Tier</th>
                  <th className="text-right px-4 py-3">Amount</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payouts.map((p) => (
                  <tr key={p._id}>
                    <td className="px-4 py-2.5 font-mono text-xs text-gray-900">{p.monthLabel}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-gray-500">{p.followerCountAtPayout}</td>
                    <td className="px-4 py-2.5 text-gray-700">
                      {p.tier === "small" ? "Small" : p.tier === "mid" ? "Mid" : "Large"}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums font-black text-gray-900">
                      ₹{p.amountInr.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                          p.status === "paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : p.status === "pending"
                            ? "bg-amber-50 text-amber-700"
                            : p.status === "failed"
                            ? "bg-red-50 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {p.status}
                      </span>
                      {p.note && <p className="text-xs text-gray-400 mt-1">{p.note}</p>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
      <p className="text-3xl font-black text-gray-900 mt-1 tabular-nums">{value}</p>
    </div>
  );
}

function NoteComposer({
  educatorId,
  token,
  onCreated,
  onError,
}: {
  educatorId: string;
  token: string;
  onCreated: () => void;
  onError: (e: string) => void;
}) {
  const [form, setForm] = useState({ title: "", summary: "", content: "", subject: "Languages" });
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    onError("");
    const res = await fetch("/api/educator/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: "create", educatorId, ...form }),
    });
    const data = await res.json();
    setBusy(false);
    if (data.error) onError(data.error);
    else onCreated();
  }

  return (
    <form onSubmit={submit} className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">
          <span className="font-bold text-gray-700">Title</span>
          <input
            required
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-1 w-full text-sm px-3 py-2 border border-gray-200 rounded-lg"
          />
        </label>
        <label className="text-sm">
          <span className="font-bold text-gray-700">Subject</span>
          <select
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="mt-1 w-full text-sm px-3 py-2 border border-gray-200 rounded-lg"
          >
            <option>Physics</option>
            <option>Chemistry</option>
            <option>Math</option>
          </select>
        </label>
      </div>
      <label className="text-sm block">
        <span className="font-bold text-gray-700">Summary (1–2 lines)</span>
        <input
          type="text"
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          className="mt-1 w-full text-sm px-3 py-2 border border-gray-200 rounded-lg"
        />
      </label>
      <label className="text-sm block">
        <span className="font-bold text-gray-700">Content (HTML allowed)</span>
        <textarea
          required
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={10}
          className="mt-1 w-full text-sm px-3 py-2 border border-gray-200 rounded-lg font-mono"
        />
      </label>
      <button
        type="submit"
        disabled={busy}
        className="text-sm font-bold text-white bg-gray-900 hover:bg-gray-700 px-4 py-2 rounded-full transition-colors disabled:opacity-50"
      >
        {busy ? "Saving…" : "Save draft"}
      </button>
    </form>
  );
}

function SetComposer({
  educatorId,
  token,
  onCreated,
  onError,
}: {
  educatorId: string;
  token: string;
  onCreated: () => void;
  onError: (e: string) => void;
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "Languages",
    topicSlug: "",
    difficulty: "medium",
    questionIdsRaw: "",
  });
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    onError("");
    const questionIds = form.questionIdsRaw
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (questionIds.length === 0) {
      onError("Add at least one question ID");
      setBusy(false);
      return;
    }
    const res = await fetch("/api/educator/question-sets", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        action: "create",
        educatorId,
        title: form.title,
        description: form.description,
        subject: form.subject,
        topicSlug: form.topicSlug || undefined,
        difficulty: form.difficulty,
        questionIds,
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (data.error) onError(data.error);
    else onCreated();
  }

  return (
    <form onSubmit={submit} className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">
          <span className="font-bold text-gray-700">Title</span>
          <input
            required
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-1 w-full text-sm px-3 py-2 border border-gray-200 rounded-lg"
          />
        </label>
        <label className="text-sm">
          <span className="font-bold text-gray-700">Subject</span>
          <select
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="mt-1 w-full text-sm px-3 py-2 border border-gray-200 rounded-lg"
          >
            <option>Physics</option>
            <option>Chemistry</option>
            <option>Math</option>
          </select>
        </label>
      </div>
      <label className="text-sm block">
        <span className="font-bold text-gray-700">Description</span>
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="mt-1 w-full text-sm px-3 py-2 border border-gray-200 rounded-lg"
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">
          <span className="font-bold text-gray-700">Topic slug (optional)</span>
          <input
            type="text"
            value={form.topicSlug}
            onChange={(e) => setForm({ ...form, topicSlug: e.target.value })}
            placeholder="mechanics"
            className="mt-1 w-full font-mono text-sm px-3 py-2 border border-gray-200 rounded-lg"
          />
        </label>
        <label className="text-sm">
          <span className="font-bold text-gray-700">Difficulty</span>
          <select
            value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            className="mt-1 w-full text-sm px-3 py-2 border border-gray-200 rounded-lg"
          >
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
        </label>
      </div>
      <label className="text-sm block">
        <span className="font-bold text-gray-700">Question IDs (comma or newline separated)</span>
        <textarea
          required
          value={form.questionIdsRaw}
          onChange={(e) => setForm({ ...form, questionIdsRaw: e.target.value })}
          rows={6}
          placeholder="phy-001, phy-002, phy-015"
          className="mt-1 w-full text-sm font-mono px-3 py-2 border border-gray-200 rounded-lg"
        />
      </label>
      <button
        type="submit"
        disabled={busy}
        className="text-sm font-bold text-white bg-gray-900 hover:bg-gray-700 px-4 py-2 rounded-full transition-colors disabled:opacity-50"
      >
        {busy ? "Saving…" : "Save draft"}
      </button>
    </form>
  );
}
