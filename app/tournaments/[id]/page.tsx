// @ts-nocheck
import { ConvexHttpClient } from "convex/browser";
import { api } from "convex/_generated/api";
import { AppNav } from "../../components/AppNav";
import { TournamentClient } from "./TournamentClient";

export const dynamic = "force-dynamic";

export default async function TournamentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppNav />
        <div className="max-w-3xl mx-auto px-4 pt-20 text-center text-gray-400">
          Convex not configured.
        </div>
      </div>
    );
  }
  const convex = new ConvexHttpClient(url);
  const tournament = await convex.query(api.tournaments.getById, {
    tournamentId: id as any,
  });
  if (!tournament) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppNav />
        <div className="max-w-3xl mx-auto px-4 pt-20 text-center">
          <h1 className="text-2xl font-black text-gray-900">Tournament not found</h1>
        </div>
      </div>
    );
  }
  const [entries, matches] = await Promise.all([
    convex.query(api.tournaments.getEntries, { tournamentId: id as any }),
    convex.query(api.tournaments.getMatches, { tournamentId: id as any }),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />
      <TournamentClient
        tournament={tournament}
        entries={entries ?? []}
        matches={matches ?? []}
      />
    </div>
  );
}
