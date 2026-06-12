"use client";

import Link from "next/link";
import { AppNav } from "../components/AppNav";

export default function ChampionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <AppNav />

      <section className="max-w-3xl mx-auto px-4 pt-32 pb-20 text-center">
        <div className="inline-block bg-orange-100 text-orange-600 text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wide">
          Coming Soon
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-5">
          Real IITians. Real mentors.{" "}
          <span className="text-orange-500">Coming soon.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed mb-10">
          We&apos;re onboarding verified IIT alumni for CUET 2027 batch.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-orange-500 text-white font-black text-base px-8 py-4 rounded-2xl hover:bg-orange-600 transition-all shadow-lg"
        >
          Apply to mentor &rarr;
        </Link>
      </section>
    </div>
  );
}
