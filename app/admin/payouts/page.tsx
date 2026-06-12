"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppNav } from "../../components/AppNav";
import { TOKEN_KEY } from "../../utils/auth";

interface Payout {
  _id: string;
  educatorName: string;
  monthLabel: string;
  followerCountAtPayout: number;
  tier: "small" | "mid" | "large";
  amountInr: number;
  status: "pending" | "paid" | "failed" | "skipped";
  razorpayPayoutId?: string;
  note?: string;
  createdAt: number;
  paidAt?: number;
}

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
  skipped: "bg-gray-100 text-gray-700",
};

const TIER_LABEL: Record<string, string> = {
  small: "Small (<100)",
  mid: "Mid (100–499)",
  large: "Large (500+)",
};

export default function PayoutsAdminPage() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (!t) {
      setDenied(true);
      return;
    }
    setToken(t);
    fetch("/api/admin/payouts", { headers: { Authorization: `Bearer ${t}` } })
      .then((r) => (r.status === 403 ? null : r.json()))
      .then((data) => {
        if (data === null) setDenied(true);
        else setPayouts(data.payouts ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  async function markPaid(payoutId: string) {
    if (!token) return;
    const razorpayPayoutId = prompt("Razorpay payout ID (optional):") ?? "";
    await fetch("/api/admin/payouts", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: "markPaid", payoutId, razorpayPayoutId }),
    });
    location.reload();
  }

  async function markFailed(payoutId: string) {
    if (!token) return;
    const note = prompt("Failure reason:") ?? "Marked failed";
    await fetch("/api/admin/payouts", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: "markFailed", payoutId, note }),
    });
    location.reload();
  }

  if (denied) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppNav />
        <div className="max-w-3xl mx-auto px-4 pt-20 text-center">
          <h1 className="text-2xl font-black text-gray-900">Forbidden</h1>
        </div>
      </div>
    );
  }

  const totals = {
    pending: payouts.filter((p) => p.status === "pending").reduce((a, p) => a + p.amountInr, 0),
    paid: payouts.filter((p) => p.status === "paid").reduce((a, p) => a + p.amountInr, 0),
    skipped: payouts.filter((p) => p.status === "skipped").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />

      <section className="max-w-5xl mx-auto px-4 pt-12 pb-20">
        <Link href="/admin" className="text-xs font-bold text-gray-400 hover:text-gray-600 inline-block mb-2">
          ← Admin
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">Educator payouts</h1>
        <p className="text-sm text-gray-500 mt-2">
          Generated monthly on the 1st at 00:30 IST. Mark each row paid after sending via Razorpay Payouts.
        </p>

        {/* Totals */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Pending</p>
            <p className="text-3xl font-black text-amber-700 mt-1 tabular-nums">
              ₹{totals.pending.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Paid (lifetime)</p>
            <p className="text-3xl font-black text-emerald-700 mt-1 tabular-nums">
              ₹{totals.paid.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Skipped (no bank details)</p>
            <p className="text-3xl font-black text-gray-900 mt-1 tabular-nums">{totals.skipped}</p>
          </div>
        </div>

        {/* Table */}
        <h2 className="text-lg font-black text-gray-900 mt-10 mb-3">All payouts</h2>
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading…</div>
        ) : payouts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <p className="text-sm text-gray-500">
              No payouts yet. The monthly cron will populate this on the 1st of next month.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-400">
                <tr>
                  <th className="text-left px-4 py-3">Month</th>
                  <th className="text-left px-4 py-3">Educator</th>
                  <th className="text-left px-4 py-3">Tier</th>
                  <th className="text-right px-4 py-3">Followers</th>
                  <th className="text-right px-4 py-3">Amount</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payouts.map((p) => (
                  <tr key={p._id}>
                    <td className="px-4 py-2.5 font-mono text-xs text-gray-900">{p.monthLabel}</td>
                    <td className="px-4 py-2.5 font-semibold text-gray-900">{p.educatorName}</td>
                    <td className="px-4 py-2.5 text-gray-700">{TIER_LABEL[p.tier]}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-gray-500">{p.followerCountAtPayout}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums font-black text-gray-900">
                      ₹{p.amountInr.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${STATUS_STYLE[p.status]}`}>
                        {p.status}
                      </span>
                      {p.note && <p className="text-xs text-gray-400 mt-1">{p.note}</p>}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {p.status === "pending" && (
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => markPaid(p._id)}
                            className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1.5 rounded-full transition-colors"
                          >
                            Mark paid
                          </button>
                          <button
                            onClick={() => markFailed(p._id)}
                            className="text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-full transition-colors"
                          >
                            Failed
                          </button>
                        </div>
                      )}
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
