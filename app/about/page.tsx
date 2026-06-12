import { BASE_URL } from "@/app/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export function generateMetadata(): Metadata {
  return {
    title: "About 10minCUET — Meet Riishabh Mehrotra",
    description:
      "Meet Riishabh Mehrotra, ISB graduate and founder of 10minCUET. Built after analysing 10 years of CUET UG papers. Adaptive learning powered by Bloom's Taxonomy.",
    alternates: { canonical: `${BASE_URL}/about` },
    openGraph: {
      type: "website",
      url: `${BASE_URL}/about`,
      title: "About 10minCUET — Meet Riishabh Mehrotra",
      description:
        "Meet Riishabh Mehrotra, ISB graduate and founder of 10minCUET. Built after analysing 10 years of CUET UG papers. Adaptive learning powered by Bloom's Taxonomy.",
    },
  };
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "EAZEALLIANCE SERVICES PRIVATE LIMITED",
      alternateName: "10minCUET",
      url: BASE_URL,
      logo: `${BASE_URL}/favicon.ico`,
      foundingDate: "2024",
      description:
        "CUET UG preparation platform powered by Bloom's Taxonomy. 432 original questions, 10-minute adaptive sessions, sub-concept tracking.",
      contactPoint: {
        "@type": "ContactPoint",
        email: "support@10mincuet.com",
        contactType: "customer support",
        availableLanguage: ["en", "hi"],
      },
    },
    {
      "@type": "Person",
      "@id": `${BASE_URL}/#founder`,
      name: "Riishabh Mehrotra",
      jobTitle: "Founder & CEO",
      worksFor: {
        "@type": "Organization",
        name: "EAZEALLIANCE SERVICES PRIVATE LIMITED",
      },
      url: BASE_URL,
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Indian School of Business",
      },
      description: "Founder of 10minCUET. Built the platform after deep analysis of CUET UG patterns — turning insight into adaptive learning powered by Bloom's Taxonomy.",
    },
  ],
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-black text-gray-900 text-lg">
            10min<span className="text-orange-500">CUET</span>
          </Link>
          <Link
            href="/register"
            className="bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-orange-600 transition-all"
          >
            Start Free →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-16 pb-10 text-center">
        <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-4">
          Our Story
        </p>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-6">
          Built by a student who failed.
          <br />
          <span className="text-orange-500">Built for students who won&apos;t.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          10minCUET started with one question: if Swiggy can deliver biryani in 10 minutes,
          why does CUET prep still take 2 years of your life?
        </p>
      </section>

      {/* Founder Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-3">
                The Founder
              </p>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Riishabh Mehrotra</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed text-sm">
                <p>
                  <strong>ISB graduate and founder of 10minCUET</strong> — building at the intersection of education data, AI, and India's most consequential exam.
                </p>
                <p>
                  10minCUET was born from a simple observation: after analysing 10 years of NTA CUET UG papers, the same 24 topics produce 60% of marks — every year, every shift. Most students don't fail because they're unprepared. They fail because they prepare the wrong things.
                </p>
                <p>
                  Amit built 10minCUET to fix that. The platform maps every question to a sub-concept and a Bloom level — so students know not just <em>what</em> to study, but <em>how deeply</em> to study it.
                </p>
                <p>
                  His larger mission is one core belief:
                </p>
                <p className="font-bold italic text-gray-700">
                  "Shikshit Bharat, Viksit Bharat."
                </p>
                <p>
                  From metro cities to Tier-3 India, 10minCUET is built so that quality CUET preparation doesn't require a move to Kota or a ₹1.5 lakh coaching fee.
                </p>
                <p className="font-bold text-gray-900">
                  This is not just another EdTech company.
                  <br />
                  This is precision learning — built on data, not opinion.
                </p>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
              <div className="space-y-4">
                {[
                  { label: "Vision", value: "Viksit Bharat 2047" },
                  { label: "Mission", value: "Shikshit Bharat" },
                  { label: "Company", value: "EAZEALLIANCE SERVICES PVT LTD" },
                  { label: "Background", value: "ISB Graduate" },
                  { label: "Focus", value: "Education × AI × Impact" },
                  { label: "GST registered", value: "Yes" },
                  { label: "Payment partner", value: "Razorpay verified" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-start gap-4">
                    <span className="text-sm text-gray-500">{item.label}</span>
                    <span className="text-sm font-bold text-gray-900 text-right">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 max-w-4xl mx-auto px-4">
        <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-3">
          The Problem We Solved
        </p>
        <h2 className="text-3xl font-black text-gray-900 mb-6">
          India delivers pizza in 10 minutes. CUET prep still takes 2 years.
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              In India, Swiggy delivers biryani in 10 minutes. Ola sends a cab in 8.
              Blinkit puts groceries at your door in 10. But to prepare for CUET — one of
              the most consequential exams in a student&apos;s life — the prescription was:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-red-500 font-bold">×</span>
                <span>Move to Kota at 16. Leave your family.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-500 font-bold">×</span>
                <span>Sit in 8-hour coaching classes. Daily.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-500 font-bold">×</span>
                <span>Watch 6-hour YouTube lectures at 2x speed.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-500 font-bold">×</span>
                <span>Repeat for 2 years. Or 3. Or more.</span>
              </li>
            </ul>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
            <p className="font-black text-orange-700 text-lg mb-3">The data said otherwise.</p>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                Analysis of 10 years of NTA CUET UG papers showed that{" "}
                <strong>60% of marks concentrate in 24 topics</strong>. Every year. Every shift.
              </p>
              <p>
                Most students fail not because they don&apos;t study enough — but because they
                study the wrong things at the wrong depth.{" "}
                <strong>Bloom Level 2 (Understand) is not enough</strong> for CUET Apply questions.
              </p>
              <p>
                The gap was not effort. It was precision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Product */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-3">
            What We Built
          </p>
          <h2 className="text-3xl font-black text-gray-900 mb-8">
            432 original questions. Bloom tracking. 10-minute sessions.
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                title: "432 Original Questions",
                desc: "Every question is original — not scraped from previous papers, not recycled. Each one maps to a specific sub-concept and Bloom level.",
              },
              {
                title: "Bloom Level Tracking",
                desc: "The platform tracks whether you can Recall, Understand, Apply, Analyse, or Evaluate — per sub-concept. Not just right or wrong.",
              },
              {
                title: "10-Minute Daily Sessions",
                desc: "Five targeted questions, seeded to your weakest sub-concepts. Done in 10 minutes. Consistent beats intense. The data proves it.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-black text-gray-900 mb-3">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company */}
      <section className="py-16 max-w-4xl mx-auto px-4">
        <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-3">
          The Company
        </p>
        <h2 className="text-3xl font-black text-gray-900 mb-6">
          EAZEALLIANCE SERVICES PRIVATE LIMITED
        </h2>
        <div className="grid md:grid-cols-2 gap-8 text-gray-600 leading-relaxed">
          <div className="space-y-4">
            <p>
              10minCUET is operated by{" "}
              <strong>EAZEALLIANCE SERVICES PRIVATE LIMITED</strong>, a company incorporated
              in India. We are GST registered and use{" "}
              <strong>Razorpay</strong> for all payment processing — one of India&apos;s most
              trusted payment gateways.
            </p>
            <p>
              We do not sell your data. We do not run ads. Revenue comes from student
              subscriptions — which means our only incentive is to make you better at CUET.
            </p>
            <p>
              No VC money. No course selling. No paid faculty. Just the product.
            </p>
          </div>
          <div className="space-y-3">
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
              <p className="text-sm font-bold text-orange-700 mb-1">Trust signals</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ GST registered entity</li>
                <li>✓ Razorpay verified merchant</li>
                <li>✓ 7-day no-questions-asked refund</li>
                <li>✓ Indian IT Act compliant privacy policy</li>
                <li>✓ Student data never sold or shared</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange-500 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-black mb-4">
            10 minutes. Every day. Starting now.
          </h2>
          <p className="text-orange-100 text-lg mb-8">
            No tutor. No 6-hour video. No FOMO. Just precision CUET prep.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-orange-500 font-black text-xl px-10 py-5 rounded-2xl hover:bg-orange-50 transition-all shadow-xl"
          >
            Start Free — No Card Required →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center">
        <div className="max-w-5xl mx-auto px-4">
          <p className="font-black text-gray-900 text-lg mb-1">
            10min<span className="text-orange-500">CUET</span>
          </p>
          <div className="flex justify-center gap-4 mt-4 text-xs text-gray-400 flex-wrap">
            <Link href="/topics" className="hover:text-gray-600">Topics</Link>
            <span>·</span>
            <Link href="/methodology" className="hover:text-gray-600">How It Works</Link>
            <span>·</span>
            <Link href="/pricing" className="hover:text-gray-600">Pricing</Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-gray-600">Contact</Link>
            <span>·</span>
            <Link href="/privacy-policy" className="hover:text-gray-600">Privacy</Link>
          </div>
          <p className="text-xs text-gray-300 mt-4">
            © 2025 EAZEALLIANCE SERVICES PRIVATE LIMITED. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
