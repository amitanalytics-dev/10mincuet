"use client";

import { getBloomInfo, type BloomLevel } from "../data/bloom";

// ─── BloomBadge ───────────────────────────────────────────────────────────────
// Pill showing icon + level + name, coloured per Bloom level

export function BloomBadge({
  level,
  size = "sm",
}: {
  level: BloomLevel;
  size?: "xs" | "sm" | "md";
}) {
  const info = getBloomInfo(level);
  const cls =
    size === "xs"
      ? "text-[10px] px-2 py-0.5 gap-0.5"
      : size === "md"
      ? "text-sm px-3 py-1.5 gap-1.5"
      : "text-xs px-2.5 py-1 gap-1";

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold border ${cls}`}
      style={{
        backgroundColor: info.bgColor,
        color: info.textColor,
        borderColor: info.color + "60",
      }}
    >
      <span>{info.icon}</span>
      <span>
        L{level} · {info.name}
      </span>
    </span>
  );
}

// ─── BloomBar ─────────────────────────────────────────────────────────────────
// 6-segment progress bar showing which level has been reached

export function BloomBar({ level }: { level: BloomLevel }) {
  const info = getBloomInfo(level);
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {([1, 2, 3, 4, 5, 6] as BloomLevel[]).map((n) => (
          <div
            key={n}
            className="w-3.5 h-1.5 rounded-sm transition-all"
            style={{ backgroundColor: n <= level ? info.color : "#E5E7EB" }}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500 font-medium">{info.name}</span>
    </div>
  );
}
