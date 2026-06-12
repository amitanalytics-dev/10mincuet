import type { Metadata } from "next";
import Link from "next/link";
import { AppNav } from "../components/AppNav";
import { SubjectLeaderboard } from "../components/SubjectLeaderboard";

export const metadata: Metadata = {
  title: "CUET Leaderboard",
  description:
    "See top CUET aspirants across Physics, Chemistry, Math and Overall — updated hourly. Compete on quizzes, mock tests and topics mastered.",
};

type Period = "weekly" | "monthly" | "all-time";

const PERIODS: { id: Period; label: string }[] = [
  { id: "weekly", label: "This week" },
  { id: "monthly", label: "This month" },
  { id: "all-time", label: "All time" },
];

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period: periodRaw } = await searchParams;
  const period: Period = (PERIODS.find((p) => p.id === periodRaw)?.id ?? "weekly");

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />

      <section className="max-w-5xl mx-auto px-4 pt-12 pb-6">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
              CUET Leaderboard
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Top aspirants across Physics, Chemistry, Math and Overall — updated hourly.
            </p>
          </div>
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full p-1 shadow-sm">
            {PERIODS.map((p) => {
              const active = p.id === period;
              return (
                <Link
                  key={p.id}
                  href={`/leaderboard?period=${p.id}`}
                  className={`text-xs font-bold px-4 py-1.5 rounded-full transition-colors ${
                    active
                      ? "bg-orange-500 text-white shadow"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {p.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SubjectLeaderboard subject="Overall" period={period} />
          <SubjectLeaderboard subject="Languages" period={period} />
          <SubjectLeaderboard subject="Domain" period={period} />
          <SubjectLeaderboard subject="General Test" period={period} />
        </div>
      </section>
    </div>
  );
}
