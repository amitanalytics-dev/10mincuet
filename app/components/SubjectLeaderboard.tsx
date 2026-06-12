import type { ReactNode } from "react";

type Subject = "Languages" | "Domain" | "General Test" | "Overall";
type Period = "weekly" | "monthly" | "all-time";

interface LeaderboardEntry {
  userId: string;
  userName: string;
  score: number;
  rank: number;
  mocksCount: number;
  quizzesCount: number;
  accuracy: number;
  topicsMastered: number;
}

interface LeaderboardData {
  subject: string;
  period: string;
  entries: LeaderboardEntry[];
  updatedAt: number | null;
  userCount: number;
}

interface SubjectLeaderboardProps {
  subject: Subject;
  period?: Period;
  currentUserId?: string;
}

const SUBJECT_STYLES: Record<Subject, { header: string; ring: string; glow: string; label: string }> = {
  Languages: {
    header: "bg-blue-500 text-white",
    ring: "ring-blue-400",
    glow: "shadow-blue-200",
    label: "Languages",
  },
  Domain: {
    header: "bg-emerald-500 text-white",
    ring: "ring-emerald-400",
    glow: "shadow-emerald-200",
    label: "Domain",
  },
  "General Test": {
    header: "bg-orange-500 text-white",
    ring: "ring-orange-400",
    glow: "shadow-orange-200",
    label: "General Test",
  },
  Overall: {
    header: "bg-purple-500 text-white",
    ring: "ring-purple-400",
    glow: "shadow-purple-200",
    label: "Overall",
  },
};

const MEDAL: Record<number, string> = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};

function hoursAgo(ts: number | null): string {
  if (!ts) return "a while";
  const diff = Date.now() - ts;
  const h = Math.floor(diff / (1000 * 60 * 60));
  if (h < 1) return "less than an hour";
  if (h === 1) return "1 hour";
  return `${h} hours`;
}

function PodiumRow({ entry, isCurrentUser }: { entry: LeaderboardEntry; isCurrentUser: boolean }): ReactNode {
  const medal = MEDAL[entry.rank];
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors ${
        isCurrentUser
          ? "bg-orange-50 border border-orange-300 ring-1 ring-orange-300"
          : "bg-gray-900/60 border border-white/10 hover:bg-gray-800/60"
      }`}
    >
      <div className="w-8 text-center text-xl shrink-0">{medal}</div>
      <div className="flex-1 min-w-0">
        <p className={`font-black text-sm truncate ${isCurrentUser ? "text-orange-700" : "text-white"}`}>
          {entry.userName}
          {isCurrentUser && (
            <span className="ml-1.5 text-xs font-bold text-orange-500">(you)</span>
          )}
        </p>
        <p className={`text-xs mt-0.5 ${isCurrentUser ? "text-orange-500" : "text-gray-400"}`}>
          {entry.quizzesCount} quizzes &middot; {entry.accuracy.toFixed(0)}% accuracy
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-base font-black ${isCurrentUser ? "text-orange-600" : "text-white"}`}>
          {entry.score.toLocaleString()}
        </p>
        <p className={`text-xs ${isCurrentUser ? "text-orange-400" : "text-gray-500"}`}>pts</p>
      </div>
    </div>
  );
}

function StandardRow({ entry, isCurrentUser }: { entry: LeaderboardEntry; isCurrentUser: boolean }): ReactNode {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
        isCurrentUser
          ? "bg-orange-50 border border-orange-200"
          : "hover:bg-gray-50"
      }`}
    >
      <div className={`w-7 text-center text-xs font-black shrink-0 ${isCurrentUser ? "text-orange-500" : "text-gray-400"}`}>
        #{entry.rank}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-bold text-sm truncate ${isCurrentUser ? "text-orange-700" : "text-gray-900"}`}>
          {entry.userName}
          {isCurrentUser && (
            <span className="ml-1.5 text-xs font-semibold text-orange-500">(you)</span>
          )}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {entry.quizzesCount} quizzes &middot; {entry.accuracy.toFixed(0)}% acc
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-sm font-black ${isCurrentUser ? "text-orange-600" : "text-gray-900"}`}>
          {entry.score.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export async function SubjectLeaderboard({
  subject,
  period = "weekly",
  currentUserId,
}: SubjectLeaderboardProps) {
  const styles = SUBJECT_STYLES[subject];
  let data: LeaderboardData | null = null;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(
      `${baseUrl}/api/leaderboards/${subject}?period=${period}`,
      { next: { revalidate: 3600 } }
    );
    if (res.ok) {
      const json = await res.json();
      if (!json.error) {
        data = json as LeaderboardData;
      }
    }
  } catch {
    // Network error — fall through to empty state
  }

  const entries = data?.entries ?? [];
  const top3 = entries.filter((e) => e.rank <= 3);
  const rest = entries.filter((e) => e.rank >= 4 && e.rank <= 10);
  const isEmpty = entries.length === 0;
  const periodLabel =
    period === "weekly" ? "This Week" : period === "monthly" ? "This Month" : "All Time";

  return (
    <div className={`rounded-2xl overflow-hidden shadow-sm border border-gray-200 ${styles.glow}`}>
      {/* Header */}
      <div className={`${styles.header} px-5 py-4`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-black text-lg leading-tight">{subject} Leaderboard</h2>
            <p className="text-xs opacity-80 mt-0.5 font-semibold uppercase tracking-wide">
              {periodLabel}
            </p>
          </div>
          <div className="text-3xl select-none">
            {subject === "Languages" ? "⚡" : subject === "Domain" ? "🧪" : subject === "General Test" ? "📐" : "🏆"}
          </div>
        </div>
        {data?.userCount != null && data.userCount > 0 && (
          <p className="text-xs opacity-70 mt-2">
            {data.userCount.toLocaleString()} participants
          </p>
        )}
      </div>

      {/* Body */}
      <div className="bg-white">
        {isEmpty ? (
          <div className="px-5 py-14 text-center">
            <div className="text-4xl mb-3">🏅</div>
            <p className="font-black text-gray-900 text-base mb-1">No data yet</p>
            <p className="text-sm text-gray-500">
              Be the first to complete quizzes and claim rank #1!
            </p>
          </div>
        ) : (
          <>
            {/* Top 3 — dark gaming panel */}
            {top3.length > 0 && (
              <div className="bg-gray-900 px-4 py-4 space-y-2">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3 px-1">
                  Top Rankers
                </p>
                {top3.map((entry) => (
                  <PodiumRow
                    key={entry.userId}
                    entry={entry}
                    isCurrentUser={!!currentUserId && entry.userId === currentUserId}
                  />
                ))}
              </div>
            )}

            {/* Ranks 4-10 */}
            {rest.length > 0 && (
              <div className="px-4 py-3 space-y-0.5">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2 px-1">
                  Chasing the top
                </p>
                {rest.map((entry) => (
                  <StandardRow
                    key={entry.userId}
                    entry={entry}
                    isCurrentUser={!!currentUserId && entry.userId === currentUserId}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Updated {hoursAgo(data?.updatedAt ?? null)} ago
          </p>
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
            {period}
          </span>
        </div>
      </div>
    </div>
  );
}
