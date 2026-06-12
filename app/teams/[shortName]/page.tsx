// @ts-nocheck
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConvexHttpClient } from "convex/browser";
import { api } from "convex/_generated/api";
import { AppNav } from "../../components/AppNav";

async function getTeamData(shortName: string) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return null;
  const convex = new ConvexHttpClient(url);
  const team = await convex.query(api.teams.getTeamByShortName, {
    shortName: shortName.toUpperCase(),
  });
  if (!team) return null;
  const [season, squad, standings] = await Promise.all([
    convex.query(api.teams.getCurrentSeason, {}),
    convex.query(api.teams.getTeamSquad, { teamId: team._id }),
    convex.query(api.teams.getStandings, {}),
  ]);
  const standing = standings?.standings.find((s) => s.teamId === team._id);
  return { team, season, squad, standing };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shortName: string }>;
}): Promise<Metadata> {
  const { shortName } = await params;
  const data = await getTeamData(shortName);
  if (!data) return { title: "Team not found" };
  return {
    title: `${data.team.name} — CUET × IPL Cup`,
    description: `See the ${data.team.name} CUET squad, top contributors, and standings this season.`,
  };
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ shortName: string }>;
}) {
  const { shortName } = await params;
  const data = await getTeamData(shortName);
  if (!data) notFound();

  const { team, season, squad, standing } = data;
  const members = squad?.members ?? [];
  const playingXI = members.filter((m) => m.isPlayingXI);
  const bench = members.filter((m) => !m.isPlayingXI);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />

      {/* Hero */}
      <section
        className="text-white px-4 py-12"
        style={{
          background: `linear-gradient(135deg, ${team.colorPrimary}, ${team.colorSecondary})`,
        }}
      >
        <div className="max-w-5xl mx-auto">
          <Link
            href="/teams"
            className="text-xs font-bold opacity-80 hover:opacity-100 inline-block mb-4"
          >
            ← All teams
          </Link>
          <div className="flex items-end justify-between flex-wrap gap-6">
            <div className="flex items-center gap-4">
              <span className="text-6xl">{team.emoji}</span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                  {team.shortName}
                </p>
                <h1 className="text-3xl sm:text-4xl font-black leading-tight">
                  {team.name}
                </h1>
              </div>
            </div>
            {standing && (
              <div className="text-right">
                <p className="text-5xl font-black tabular-nums leading-none">
                  #{standing.rank}
                </p>
                <p className="text-xs opacity-80 mt-1 font-bold uppercase tracking-wide">
                  current rank
                </p>
              </div>
            )}
          </div>

          {standing && (
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-4">
                <p className="text-xs opacity-80 font-bold uppercase tracking-wide">
                  Playing XI avg
                </p>
                <p className="text-3xl font-black mt-1 tabular-nums">
                  {standing.topElevenAverage.toFixed(0)}
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-4">
                <p className="text-xs opacity-80 font-bold uppercase tracking-wide">
                  Squad size
                </p>
                <p className="text-3xl font-black mt-1 tabular-nums">
                  {standing.memberCount}
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-4">
                <p className="text-xs opacity-80 font-bold uppercase tracking-wide">
                  Total team score
                </p>
                <p className="text-3xl font-black mt-1 tabular-nums">
                  {standing.totalScore.toFixed(0)}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Squad */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        {members.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-sm text-gray-500">
              No squad activity yet for {season ? season.monthLabel : "this season"}. Be the first
              to score for {team.shortName}.
            </p>
          </div>
        ) : (
          <>
            {/* Playing XI */}
            <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              <span>Playing XI</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Top contributors this season
              </span>
            </h2>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-10">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wide text-gray-400">
                  <tr>
                    <th className="text-left px-4 py-3">#</th>
                    <th className="text-left px-4 py-3">Player</th>
                    <th className="text-right px-4 py-3">Quizzes</th>
                    <th className="text-right px-4 py-3">Mocks</th>
                    <th className="text-right px-4 py-3">Accuracy</th>
                    <th className="text-right px-4 py-3">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {playingXI.map((m, i) => (
                    <tr key={m.userId}>
                      <td className="px-4 py-2.5 font-bold text-gray-400 tabular-nums">
                        {i + 1}
                      </td>
                      <td className="px-4 py-2.5 font-semibold text-gray-900">
                        {m.userName}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-gray-500">
                        {m.quizzesCount}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-gray-500">
                        {m.mocksCount}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-gray-500">
                        {m.accuracy.toFixed(0)}%
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums font-black text-gray-900">
                        {m.score.toFixed(0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bench */}
            {bench.length > 0 && (
              <>
                <h3 className="text-base font-black text-gray-900 mb-3">
                  Bench ({bench.length})
                </h3>
                <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
                  {bench.map((m, i) => (
                    <div
                      key={m.userId}
                      className="px-4 py-2.5 flex items-center gap-3 text-sm"
                    >
                      <span className="w-6 text-gray-400 font-bold tabular-nums">
                        {12 + i}
                      </span>
                      <span className="flex-1 font-semibold text-gray-900 truncate">
                        {m.userName}
                      </span>
                      <span className="text-xs text-gray-500 tabular-nums">
                        {m.score.toFixed(0)} pts
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}
