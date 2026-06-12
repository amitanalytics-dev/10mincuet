"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppNav } from "../../components/AppNav";
import { TOKEN_KEY } from "../../utils/auth";

interface Variant {
  key: string;
  label: string;
  allocationPct: number;
}

interface Test {
  _id: string;
  testKey: string;
  name: string;
  description?: string;
  variants: Variant[];
  primaryMetric: string;
  status: "draft" | "running" | "completed" | "paused";
  startedAt?: number;
  completedAt?: number;
  winnerVariantKey?: string;
  pValue?: number;
  createdAt: number;
}

const STATUS_STYLE: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  running: "bg-emerald-100 text-emerald-700",
  completed: "bg-blue-100 text-blue-700",
  paused: "bg-amber-100 text-amber-700",
};

export default function ExperimentsAdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    testKey: "",
    name: "",
    description: "",
    primaryMetric: "signup_complete",
    controlLabel: "Control",
    treatmentLabel: "Treatment",
    splitPct: 50,
  });
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (!t) {
      setDenied(true);
      return;
    }
    setToken(t);
    fetch("/api/admin/experiments", { headers: { Authorization: `Bearer ${t}` } })
      .then((r) => (r.status === 403 ? null : r.json()))
      .then((data) => {
        if (data === null) setDenied(true);
        else setTests(data.tests ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  async function createTest(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setCreateError("");
    const variants = [
      { key: "control", label: form.controlLabel, allocationPct: 100 - form.splitPct },
      { key: "treatment", label: form.treatmentLabel, allocationPct: form.splitPct },
    ];
    const res = await fetch("/api/admin/experiments", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        action: "create",
        testKey: form.testKey,
        name: form.name,
        description: form.description,
        primaryMetric: form.primaryMetric,
        variants,
      }),
    });
    const data = await res.json();
    if (data.error) {
      setCreateError(data.error);
      return;
    }
    setShowCreate(false);
    setForm({ ...form, testKey: "", name: "", description: "" });
    location.reload();
  }

  async function setStatus(testId: string, status: string) {
    if (!token) return;
    await fetch("/api/admin/experiments", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: "setStatus", testId, status }),
    });
    location.reload();
  }

  if (denied) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppNav />
        <div className="max-w-3xl mx-auto px-4 pt-20 text-center">
          <h1 className="text-2xl font-black text-gray-900">Forbidden</h1>
          <p className="text-sm text-gray-500 mt-2">Founders only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />

      <section className="max-w-5xl mx-auto px-4 pt-12 pb-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <div>
            <Link href="/admin" className="text-xs font-bold text-gray-400 hover:text-gray-600 inline-block mb-2">
              ← Admin
            </Link>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">A/B experiments</h1>
            <p className="text-sm text-gray-500 mt-2">
              Two-proportion Z-test, evaluated weekly. Auto-declares winner at p &lt; 0.05.
            </p>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="text-sm font-bold text-white bg-orange-500 px-4 py-2 rounded-full hover:bg-orange-600 transition-all"
          >
            {showCreate ? "Cancel" : "+ New experiment"}
          </button>
        </div>

        {showCreate && (
          <form
            onSubmit={createTest}
            className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">
                <span className="font-bold text-gray-700">Key</span>
                <input
                  required
                  type="text"
                  value={form.testKey}
                  onChange={(e) => setForm({ ...form, testKey: e.target.value })}
                  placeholder="pricing_v2"
                  className="mt-1 w-full font-mono text-sm px-3 py-2 border border-gray-200 rounded-lg"
                />
              </label>
              <label className="text-sm">
                <span className="font-bold text-gray-700">Name</span>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Pricing card v2"
                  className="mt-1 w-full text-sm px-3 py-2 border border-gray-200 rounded-lg"
                />
              </label>
            </div>
            <label className="text-sm block">
              <span className="font-bold text-gray-700">Description</span>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="mt-1 w-full text-sm px-3 py-2 border border-gray-200 rounded-lg"
              />
            </label>
            <div className="grid grid-cols-3 gap-3">
              <label className="text-sm">
                <span className="font-bold text-gray-700">Primary metric</span>
                <input
                  type="text"
                  value={form.primaryMetric}
                  onChange={(e) => setForm({ ...form, primaryMetric: e.target.value })}
                  className="mt-1 w-full font-mono text-sm px-3 py-2 border border-gray-200 rounded-lg"
                />
              </label>
              <label className="text-sm">
                <span className="font-bold text-gray-700">Control label</span>
                <input
                  type="text"
                  value={form.controlLabel}
                  onChange={(e) => setForm({ ...form, controlLabel: e.target.value })}
                  className="mt-1 w-full text-sm px-3 py-2 border border-gray-200 rounded-lg"
                />
              </label>
              <label className="text-sm">
                <span className="font-bold text-gray-700">Treatment label</span>
                <input
                  type="text"
                  value={form.treatmentLabel}
                  onChange={(e) => setForm({ ...form, treatmentLabel: e.target.value })}
                  className="mt-1 w-full text-sm px-3 py-2 border border-gray-200 rounded-lg"
                />
              </label>
            </div>
            <label className="text-sm block">
              <span className="font-bold text-gray-700">Treatment allocation (%)</span>
              <input
                type="number"
                min={1}
                max={99}
                value={form.splitPct}
                onChange={(e) => setForm({ ...form, splitPct: Number(e.target.value) })}
                className="mt-1 w-24 text-sm px-3 py-2 border border-gray-200 rounded-lg"
              />
            </label>
            {createError && <p className="text-xs text-red-600">{createError}</p>}
            <button
              type="submit"
              className="text-sm font-bold text-white bg-gray-900 px-4 py-2 rounded-full"
            >
              Create draft
            </button>
          </form>
        )}

        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading…</div>
        ) : tests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-sm text-gray-500">
            No experiments yet. Create one to start testing.
          </div>
        ) : (
          <div className="space-y-3">
            {tests.map((t) => (
              <div key={t._id} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                  <div className="min-w-0">
                    <p className="text-xs font-mono text-gray-400">{t.testKey}</p>
                    <h2 className="font-black text-lg text-gray-900 mt-0.5">{t.name}</h2>
                    {t.description && <p className="text-sm text-gray-500 mt-1">{t.description}</p>}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${STATUS_STYLE[t.status]}`}>
                    {t.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                  <span>
                    Metric: <span className="font-mono text-gray-700">{t.primaryMetric}</span>
                  </span>
                  <span>·</span>
                  <span>
                    Variants:{" "}
                    {t.variants
                      .map((v) => `${v.label} (${v.allocationPct}%)`)
                      .join(" / ")}
                  </span>
                  {t.pValue !== undefined && (
                    <>
                      <span>·</span>
                      <span>
                        p = <span className="font-mono">{t.pValue.toFixed(3)}</span>
                      </span>
                    </>
                  )}
                  {t.winnerVariantKey && (
                    <>
                      <span>·</span>
                      <span className="font-bold text-emerald-700">🏆 {t.winnerVariantKey}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Link
                    href={`/admin/experiments/${t.testKey}`}
                    className="text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors"
                  >
                    Results →
                  </Link>
                  {t.status === "draft" && (
                    <button
                      onClick={() => setStatus(t._id, "running")}
                      className="text-xs font-bold text-white bg-emerald-600 px-3 py-1.5 rounded-full hover:bg-emerald-700 transition-colors"
                    >
                      Start
                    </button>
                  )}
                  {t.status === "running" && (
                    <>
                      <button
                        onClick={() => setStatus(t._id, "paused")}
                        className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors"
                      >
                        Pause
                      </button>
                      <button
                        onClick={() => setStatus(t._id, "completed")}
                        className="text-xs font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        Stop
                      </button>
                    </>
                  )}
                  {t.status === "paused" && (
                    <button
                      onClick={() => setStatus(t._id, "running")}
                      className="text-xs font-bold text-white bg-emerald-600 px-3 py-1.5 rounded-full hover:bg-emerald-700 transition-colors"
                    >
                      Resume
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
