import type { Metadata } from "next";
import Link from "next/link";
import { PublicNav } from "../../components/PublicNav";

export const metadata: Metadata = {
  title: "10minCUET for Teachers — Assign to Your Students",
  description:
    "CUET coaching teachers: assign 10minCUET to your students for 10-minute daily practice with Bloom-level tracking. ₹999/month for 60 students.",
  alternates: { canonical: "https://10mincuet.com/for/teachers" },
};

export default function TeachersPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            👨‍🏫 For CUET Coaching Teachers
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            Your students. Their weak spots. Tracked daily.
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Assign 10minCUET to your batch. Every student gets a 10-minute daily
            session. You see exactly who is stuck and where.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: "📊",
              title: "Bloom tracking per student",
              desc: "See every student's cognitive level on every sub-concept. Know who needs help before they fail.",
            },
            {
              icon: "⏱",
              title: "10 minutes a day",
              desc: "Students are more likely to complete 10-minute sessions daily than 3-hour classes weekly.",
            },
            {
              icon: "📱",
              title: "Works on any phone",
              desc: "No app install required. Works in browser. Students in Kota, tier-2 cities — no barriers.",
            },
          ].map((f) => (
            <div key={f.title} className="bg-gray-50 rounded-2xl p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-orange-500 text-white rounded-3xl p-8 text-center mb-12">
          <div className="text-4xl font-black mb-2">
            ₹999
            <span className="text-xl font-normal opacity-70">/month</span>
          </div>
          <div className="text-lg opacity-90 mb-1">Up to 60 students</div>
          <div className="text-sm opacity-70 mb-6">
            That&apos;s ₹16.65 per student per month
          </div>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSf_placeholder/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-orange-500 font-black py-4 px-8 rounded-xl hover:bg-orange-50 transition-all inline-block"
          >
            Apply for Teacher Plan →
          </a>
          <p className="text-xs opacity-60 mt-3">
            First 50 teachers get 3 months free. No contract.
          </p>
        </div>

        <div className="text-center">
          <p className="text-gray-500 mb-4">Questions? Talk to us directly.</p>
          <Link
            href="/contact"
            className="text-orange-500 hover:underline font-semibold"
          >
            Contact us →
          </Link>
        </div>
      </div>
    </div>
  );
}
