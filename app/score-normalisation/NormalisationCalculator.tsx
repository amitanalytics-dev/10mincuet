"use client";

import { useState } from "react";
import { scoreToPercentile } from "../predictor/page";

export default function NormalisationCalculator() {
  const [rawScore, setRawScore] = useState(175);
  const [rawInput, setRawInput] = useState("175");
  const [session, setSession] = useState<"jan" | "april">("april");

  // April session is typically harder → similar raw score → lower percentile
  // Apply a small session difficulty offset for illustrative purposes
  const sessionOffset = session === "april" ? -2 : 0;
  const basePercentile = scoreToPercentile(rawScore);
  const adjustedPercentile = Math.max(0.1, Math.min(100, basePercentile + sessionOffset));

  function handleRawInput(val: string) {
    setRawInput(val);
    const n = parseInt(val, 10);
    if (!isNaN(n) && n >= -90 && n <= 360) setRawScore(n);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mt-6">
      <h3 className="font-black text-gray-900 text-base mb-1">
        🧮 Try it: Raw score → Percentile
      </h3>
      <p className="text-xs text-gray-400 mb-4">
        See how the same score gives different percentiles across sessions
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Raw score (out of 360)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={-90}
              max={360}
              step={1}
              value={rawScore}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                setRawScore(v);
                setRawInput(String(v));
              }}
              className="flex-1 accent-orange-500"
            />
            <input
              type="number"
              value={rawInput}
              min={-90}
              max={360}
              onChange={(e) => handleRawInput(e.target.value)}
              className="w-20 border border-gray-200 rounded-xl px-2 py-1.5 text-sm font-bold text-center focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Session
          </label>
          <div className="flex gap-2">
            {(["jan", "april"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSession(s)}
                className={`flex-1 text-sm font-bold py-2 px-4 rounded-xl border-2 transition-all ${
                  session === s
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "border-gray-200 text-gray-500 hover:border-orange-300"
                }`}
              >
                {s === "jan" ? "January" : "April"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-center">
            <div className="text-3xl font-black text-orange-500 leading-none">
              {rawScore}
            </div>
            <div className="text-[10px] font-semibold text-orange-400 mt-1 uppercase tracking-wide">
              Raw score
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
            <div className="text-3xl font-black text-gray-800 leading-none">
              {adjustedPercentile.toFixed(1)}
            </div>
            <div className="text-[10px] font-semibold text-gray-400 mt-1 uppercase tracking-wide">
              Est. percentile ({session === "april" ? "April" : "January"})
            </div>
          </div>
        </div>

        {session === "april" && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
            <p className="text-xs text-blue-700 font-medium">
              April session historically has more competition. Same raw score may yield ~1-3 percentile points lower than January.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
