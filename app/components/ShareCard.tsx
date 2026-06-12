"use client";
import { BASE_URL } from "@/app/lib/site";
import { useState } from "react";

interface ShareCardProps {
  type: "rank" | "streak" | "bloom";
  data: {
    // rank card
    score?: number;
    percentile?: number;
    // streak card
    streakDays?: number;
    // bloom card
    topic?: string;
    fromLevel?: number;
    toLevel?: number;
    subject?: string;
  };
}

export function ShareCard({ type, data }: ShareCardProps) {
  const [copied, setCopied] = useState(false);

  const shareText = {
    rank: `🎯 I scored ${data.score}/360 (${data.percentile}th percentile) on 10minCUET mock test! 10 minutes a day is all it takes. Can you beat me? ${BASE_URL}`,
    streak: `🔥 Day ${data.streakDays} streak on 10minCUET! Consistent beats intense. Join me: ${BASE_URL}`,
    bloom: `📈 Just leveled up in ${data.topic}! Went from Bloom Level ${data.fromLevel} to ${data.toLevel} on 10minCUET. Your weak spots don't lie. ${BASE_URL}`,
  }[type];

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({ text: shareText, url: BASE_URL });
    } else {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const cardStyle = {
    rank: "from-orange-500 to-amber-400",
    streak: "from-red-500 to-orange-400",
    bloom: "from-blue-500 to-cyan-400",
  }[type];

  const canNativeShare =
    typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div className="space-y-3">
      {/* Visual card preview */}
      <div
        className={`bg-gradient-to-br ${cardStyle} rounded-2xl p-6 text-white text-center shadow-xl`}
      >
        {type === "rank" && (
          <>
            <div className="text-5xl font-black mb-1">
              {data.score}
              <span className="text-2xl opacity-70">/360</span>
            </div>
            <div className="text-xl font-bold opacity-90">
              {data.percentile}th Percentile
            </div>
            <div className="text-sm opacity-75 mt-2">10minCUET Mock Test</div>
          </>
        )}
        {type === "streak" && (
          <>
            <div className="text-6xl mb-2">🔥</div>
            <div className="text-5xl font-black mb-1">{data.streakDays}</div>
            <div className="text-xl font-bold opacity-90">Day Streak</div>
            <div className="text-sm opacity-75 mt-2">
              10minCUET Daily Practice
            </div>
          </>
        )}
        {type === "bloom" && (
          <>
            <div className="text-sm uppercase tracking-widest opacity-75 mb-2">
              {data.subject} · {data.topic}
            </div>
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="text-center">
                <div className="text-3xl font-black">L{data.fromLevel}</div>
                <div className="text-xs opacity-70">was</div>
              </div>
              <div className="text-2xl">→</div>
              <div className="text-center">
                <div className="text-3xl font-black">L{data.toLevel}</div>
                <div className="text-xs opacity-70">now</div>
              </div>
            </div>
            <div className="text-sm font-bold opacity-90">
              Bloom Level Upgrade
            </div>
            <div className="text-xs opacity-70 mt-1">10minCUET</div>
          </>
        )}
      </div>

      {/* Share button */}
      <button
        onClick={handleShare}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        <span>{copied ? "✓ Copied!" : "📤 Share"}</span>
        <span className="text-xs opacity-60">
          {canNativeShare ? "Share" : "Copy text"}
        </span>
      </button>

      {/* WhatsApp quick share */}
      <a
        href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 block text-center"
      >
        💬 Share on WhatsApp
      </a>
    </div>
  );
}
