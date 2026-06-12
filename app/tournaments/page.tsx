// @ts-nocheck
import Link from "next/link";
import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "convex/_generated/api";
import { AppNav } from "../components/AppNav";

export const metadata: Metadata = {
  title: "CUET Tournaments — 8-player Cup",
  description:
    "Single-elim 8-player tournaments on CUET topics. Score the highest on the topic each round to advance. Champion wins a profile badge and IPL-team MVP points.",
};

export const dynamic = "force-dynamic";

const SUBJECT_COLOR: Record<string, string> = {
  Languages: "#3b82f6",
  Domain: "#10b981",
  "General Test": "#f97316",
};

function statusBadge(status: string) {
  const map: Record<string, { label: string; cls: string }> = {
    registration: { label: "Registration open", cls: "bg-amber-100 text-amber-800" },
    active: { label: "Live", cls: "bg-emerald-100 text-emerald-800" },
    completed: { label: "Final", cls: "bg-gray-100 text-gray-700" },
    cancelled: { label: "Cancelled", cls: "bg-red-50 text-red-700" },
  };
  const m = map[status] ?? { label: status, cls: "bg-gray-100 text-gray-700" };
  return <span className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${m.cls}`}>{m.label}</span>;
}

export default async function TournamentsPage() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  let tournaments: any[] = [];
  if (url) {
    const convex = new ConvexHttpClient(url);
    tournaments = (await convex.query(api.tournaments.listLive, {})) ?? [];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />

      <section className="max-w-3xl mx-auto px-4 pt-12 pb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
          CUET Tournaments
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          8-player single-elim brackets. Highest topic score in the round window advances.
          New tournament opens once the current Cup wraps. Champion gets a profile badge + IPL-team MVP boost.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-4 pb-20">
        {tournaments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <p className="text-sm text-gray-500">
              No tournaments yet. The next one opens for registration when the daily cron tick runs.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tournaments.map((t) => {
              const accent = SUBJECT_COLOR[t.subject] ?? "#6b7280";
              return (
                <Link
                  key={t._id}
                  href={`/tournaments/${t._id}`}
                  className="block bg-white rounded-2xl border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="h-1.5" style={{ background: accent }} />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                          {t.subject ?? "Tournament"}
                        </p>
                        <h2 className="font-black text-lg text-gray-900 mt-0.5">{t.name}</h2>
                        {t.startsAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            Starts{" "}
                            {new Date(t.startsAt).toLocaleDateString("en-IN", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })}{" "}
                            · {t.size ?? 8} players · {t.winnerUserName ? `🏆 ${t.winnerUserName}` : ""}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0">{statusBadge(t.status)}</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
