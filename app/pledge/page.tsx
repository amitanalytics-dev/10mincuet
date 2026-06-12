import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "I Will Crack CUET 2026 — Make Your Public Commitment",
  description:
    "Make a public commitment to crack CUET 2026. Share your pledge on WhatsApp and Instagram to hold yourself accountable.",
};

export default function PledgePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-6xl">🎯</div>
        <h1 className="text-3xl font-black text-gray-900">
          I Will Crack CUET 2026
        </h1>
        <p className="text-gray-600">
          Make it public. Make it real. Accountability = higher success rate.
        </p>

        <div className="bg-white rounded-2xl border-2 border-orange-200 p-6 shadow-lg">
          <p className="text-lg font-bold text-gray-900 italic">
            &quot;I commit to studying 10 minutes every day until CUET UG
            2026. Consistent beats intense.&quot;
          </p>
        </div>

        <div className="space-y-3">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              "🎯 I just committed to cracking CUET 2026 with 10 minutes daily practice on 10minCUET! Consistent beats intense. Join me: https://10minjee.com/pledge"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            💬 Share pledge on WhatsApp
          </a>
          <Link
            href="/register"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all block"
          >
            Start your 10-minute practice →
          </Link>
        </div>
      </div>
    </div>
  );
}
