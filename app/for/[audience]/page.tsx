import { BASE_URL } from "@/app/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type AudienceSlug =
  | "droppers"
  | "class-12-students"
  | "class-11-students"
  | "self-study"
  | "kota-students"
  | "parents";

interface AudienceData {
  slug: AudienceSlug;
  label: string;
  title: string;
  description: string;
  hero: string;
  subhero: string;
  pain: string;
  features: { emoji: string; title: string; desc: string }[];
  bodyParagraphs: string[];
  ctaLabel: string;
}

const audienceMap: Record<AudienceSlug, AudienceData> = {
  droppers: {
    slug: "droppers",
    label: "CUET Droppers",
    title: "10minCUET for CUET Droppers — Smarter Prep, Not Harder",
    description:
      "Dropped a year for CUET? 10minCUET tracks exactly which sub-concepts cost you marks last attempt. Fix the gap in 10 minutes a day. No coaching needed.",
    hero: "You gave a year. Don't waste another on the same mistakes.",
    subhero:
      "Most droppers repeat the same weak sub-concepts without knowing it. 10minCUET shows you exactly where you lost marks — and fixes it daily in 10 minutes.",
    pain:
      "You already know most of Physics, Chemistry, and Math. The problem isn't volume — it's precision. A few sub-concepts at Bloom Level 2 (Understand) instead of Level 3 (Apply) can cost 20-30 marks. That's the difference between AIR 5,000 and AIR 15,000.",
    features: [
      {
        emoji: "🎯",
        title: "Sub-concept gap analysis",
        desc: "After one diagnostic session, 10minCUET identifies your exact weak sub-concepts from 432 tagged questions. Not just 'Electrostatics is weak' — but 'Gauss's Law at L2, needs to reach L3'.",
      },
      {
        emoji: "⏱️",
        title: "10-minute daily top-up",
        desc: "You've already built the foundation. Daily 10-minute sessions target only your gaps — not revision of things you already know. Maximum efficiency for a dropper year.",
      },
      {
        emoji: "📊",
        title: "Bloom level progression tracking",
        desc: "Track your Bloom level per sub-concept across your entire dropper year. See the precise trajectory of improvement. Know when you're exam-ready.",
      },
    ],
    bodyParagraphs: [
      "The CUET UG dropper year is one of the most high-pressure academic journeys in India. Students who choose to drop typically scored 95+ percentile and are targeting 98.5+ or an IIT rank below 5,000. The margin of error is narrow.",
      "10minCUET was designed with droppers in mind. The 432 original questions — spanning Physics, Chemistry, and Math — are mapped at the sub-concept level to Bloom's Taxonomy. When you complete a diagnostic, the platform identifies not just which topics need work, but at which cognitive level you're operating. A student who can Apply (L3) Coulomb's Law but cannot Analyse (L4) a multi-conductor system will see that specific gap highlighted.",
      "The 10-minute daily session format works especially well for droppers who are also dealing with mental fatigue from their previous attempt. Rather than 6-hour cramming marathons, consistent daily 10-minute sessions deliver stronger long-term retention — backed by spaced repetition research (Cepeda et al., 2006).",
      "For CUET 2025 and CUET 2026, the NTA has maintained a consistent pattern: roughly 54% of questions test Bloom Level 3 (Apply), 20% test Level 4 (Analyse), and only 5% test basic recall. Droppers who reach L3-L4 on all high-frequency sub-concepts dramatically outperform those stuck at L2.",
      "10minCUET also includes the Score to Percentile Calculator, the JoSAA College Predictor, and the 30-Day Sprint Planner — all free tools that help droppers plan their final exam window strategically.",
    ],
    ctaLabel: "Start Free for CUET Droppers",
  },
  "class-12-students": {
    slug: "class-12-students",
    label: "Class 12 Students",
    title: "10minCUET for Class 12 Students — CUET Prep Alongside Boards",
    description:
      "Preparing for CUET UG while managing Class 12 boards? 10minCUET gives you a 10-minute daily session targeting your weakest CUET sub-concepts. No time wasted.",
    hero: "Boards + CUET. Two exams. One 10-minute window a day.",
    subhero:
      "Class 12 is brutal: boards, practicals, family pressure, and CUET in parallel. 10minCUET fits into the gap — targeted, fast, no wasted revision.",
    pain:
      "You don't have 6 hours for CUET prep on a school day. You have maybe 1 hour if you're lucky. 10minCUET makes that 1 hour count — with 10 minutes focused precisely on your weakest CUET sub-concept. Not a full topic. Not a random chapter. The exact sub-concept costing you marks.",
    features: [
      {
        emoji: "⚡",
        title: "Fits inside school days",
        desc: "A complete adaptive CUET session in 10 minutes. Works on your phone. Works on BSNL. No download needed. Done before breakfast or between practicals.",
      },
      {
        emoji: "🧠",
        title: "Bloom-level calibration from Day 1",
        desc: "Class 12 students typically have strong L1-L2 foundation from NCERT. 10minCUET immediately identifies where you need to go deeper and serves L3-L4 questions on those specific sub-concepts.",
      },
      {
        emoji: "📅",
        title: "30-Day Sprint to exam",
        desc: "Generate a personalised 30-day CUET sprint plan from any date to your exam. Automatically adjusts for your weak sub-concepts and the time you have left.",
      },
    ],
    bodyParagraphs: [
      "Class 12 is the most common entry point for CUET UG preparation in India. Students simultaneously preparing for CBSE or state board examinations while targeting CUET face a unique time constraint that most prep platforms ignore.",
      "10minCUET was designed for exactly this constraint. The platform's 10-minute session model — one sub-concept, five adaptive questions, Bloom level update — delivers meaningful CUET preparation in the time between two chapters of board revision.",
      "The Bloom's Taxonomy framework is particularly useful for Class 12 students because NCERT and board exams primarily test L1 (Remember) and L2 (Understand). CUET UG tests L3 (Apply) and L4 (Analyse). The gap between what boards require and what CUET requires is precisely what 10minCUET bridges.",
      "Physics topics like Current Electricity, Electrostatics, and Optics; Chemistry topics like Equilibrium, Electrochemistry, and Organic Reactions; Math topics like Calculus, Coordinate Geometry, and Sequences — these are areas where NCERT builds L1-L2 and CUET demands L3-L4. 10minCUET's 432 original questions target this gap.",
      "The Score to Percentile Calculator and College Predictor tools help Class 12 students set realistic CUET targets early — so they know whether they're aiming for NIT Trichy CSE (requires ~98.5 percentile) or a state GFTI (may require 85 percentile). Clear targets drive better preparation decisions.",
    ],
    ctaLabel: "Start Free for Class 12 Students",
  },
  "class-11-students": {
    slug: "class-11-students",
    label: "Class 11 Students",
    title: "10minCUET for Class 11 Students — Build the Foundation Early",
    description:
      "Starting CUET prep in Class 11? 10minCUET builds your Bloom level from L1 to L4 per sub-concept across 2 years. 10 minutes a day — consistent beats intense.",
    hero: "You have 2 years. Use them the smart way.",
    subhero:
      "Most Class 11 students waste the first year on passive learning. 10minCUET builds active recall and application from Day 1 — 10 minutes at a time.",
    pain:
      "Two years sounds like a lot of time. It isn't, if you're building L1-L2 habits that CUET won't reward. 10minCUET starts building L3-L4 skills from Class 11 itself — so by Class 12, you're not starting from scratch on Apply-level questions.",
    features: [
      {
        emoji: "🏗️",
        title: "Bloom foundation from Class 11",
        desc: "Start at L1-L2 for each sub-concept. The platform tracks your progression to L3-L4 across two years. By CUET time, you'll have genuine Apply and Analyse-level mastery — not just cramming.",
      },
      {
        emoji: "📊",
        title: "Two-year visibility",
        desc: "Your Bloom level dashboard grows with you. Every sub-concept you've worked on is tracked. You'll see your exact growth trajectory across Class 11 and 12.",
      },
      {
        emoji: "💰",
        title: "Annual plan — lock in early",
        desc: "The Annual plan at ₹999/year saves ₹3,189 vs monthly. For Class 11 students with two years ahead, this is the highest-ROI CUET investment you can make.",
      },
    ],
    bodyParagraphs: [
      "Class 11 is when CUET preparation should begin — but most students don't use the year effectively. The first year is often spent on passive coaching attendance, NCERT reading, and formula memorisation (L1-L2 skills) without building the application-level thinking (L3-L4) that CUET actually rewards.",
      "10minCUET for Class 11 students is about building the right cognitive habits early. When you complete a 10-minute session on Projectile Motion in Class 11, you're not just learning the formula — you're being pushed to Apply it in a CUET-style scenario. That L3 habit, built daily, compounds enormously by Class 12.",
      "The platform covers the full CUET UG syllabus across Physics, Chemistry, and Math — all 24 high-frequency topics, broken into sub-concepts, each tagged to a Bloom level. Class 11 students start at L1-L2 for most sub-concepts. The goal by end of Class 12 is L3-L4 across all high-frequency areas.",
      "Spaced repetition over two years is dramatically more effective than intensive preparation in the final 6 months. Research by Roediger and Karpicke (2006) showed that students who tested themselves regularly over long periods outperformed those who studied for longer in concentrated bursts — by a factor of 2x in retention.",
      "For Class 11 students considering Kota, coaching institutes, or self-study combinations: 10minCUET serves as a daily calibration tool regardless of which coaching you attend. It tells you which sub-concepts from today's lecture you've actually mastered — and which ones you've only understood superficially.",
    ],
    ctaLabel: "Start Free for Class 11 Students",
  },
  "self-study": {
    slug: "self-study",
    label: "Self-Study Students",
    title: "10minCUET for Self-Study CUET Students — No Coaching, No Problem",
    description:
      "Preparing for CUET UG without a coaching institute? 10minCUET gives you Bloom-level tracking, 432 original questions, and a daily plan. All you need.",
    hero: "No coaching. No tutor. Just you and 10 minutes a day.",
    subhero:
      "Self-study CUET students have one problem: no one tells them which sub-concepts they're actually weak on. 10minCUET does. Precisely.",
    pain:
      "The biggest risk in self-study CUET prep is not studying the wrong topic — it's studying the right topic at the wrong cognitive level. You can spend 40 hours on Thermodynamics and still fail to score on CUET Apply-level questions if you've only built L2 understanding. 10minCUET shows you exactly where your Bloom level needs to go.",
    features: [
      {
        emoji: "🧭",
        title: "Your daily study direction",
        desc: "10minCUET replaces the coaching timetable. Every day, the platform identifies your single highest-priority weak sub-concept and serves a targeted session. No decisions needed — just open and study.",
      },
      {
        emoji: "📈",
        title: "Progress you can measure",
        desc: "Without a teacher, it's hard to know if you're improving. 10minCUET's Bloom level tracker gives you an objective, sub-concept-level progress measure. If Gauss's Law is at L3 today and L4 next week, that's real progress.",
      },
      {
        emoji: "🔧",
        title: "Free tools for exam strategy",
        desc: "Score to Percentile Calculator, JoSAA College Predictor, 30-Day Sprint Planner, Full Mock Test. All free. All designed for the self-study student who needs to plan without a counsellor.",
      },
    ],
    bodyParagraphs: [
      "Self-study CUET preparation is growing in India — driven by the availability of free content on YouTube (Physics Wallah, Khan Academy), NCERT, and online forums. However, the gap between consuming content and building exam-ready skills remains wide for most self-study students.",
      "The core problem for self-study CUET aspirants is the absence of feedback. A coaching student gets tests, rankings, doubt sessions, and a teacher who notices when they're stuck. A self-study student has none of this. 10minCUET fills the feedback gap with Bloom-level tracking: objective, sub-concept-specific, updated after every session.",
      "The 432 original questions on 10minCUET are not sourced from previous year papers (PYQs). They are original questions written to target specific Bloom levels at specific sub-concepts. This matters for self-study students because PYQ revision alone builds pattern recognition — not genuine understanding. 10minCUET builds genuine L3-L4 understanding.",
      "The 30-Day CUET Sprint Planner is particularly valuable for self-study students approaching their exam window. Enter your exam date, your target percentile, and your current Bloom map — the planner generates a daily study schedule covering your weakest sub-concepts in priority order.",
      "For self-study students considering whether to join coaching in the final year: the data from 10minCUET's Bloom tracker can help you make this decision. If your Bloom levels are at L3+ across all high-frequency topics, you're likely ready without additional coaching. If several key topics are at L2, targeted coaching may help — but knowing which topics, specifically, makes that decision much clearer.",
    ],
    ctaLabel: "Start Free — Self Study Mode",
  },
  "kota-students": {
    slug: "kota-students",
    label: "Kota Students",
    title: "10minCUET for Kota Students — Supplement Coaching with Precision",
    description:
      "At coaching in Kota for CUET? 10minCUET tells you which sub-concepts from today's lecture you've actually mastered. 10 minutes after class. Track real progress.",
    hero: "Kota gives you the content. 10minCUET tells you what actually stuck.",
    subhero:
      "8 hours of coaching per day doesn't guarantee retention. 10minCUET's daily 10-minute Bloom quiz tests what you learned today — and flags what needs revisiting tomorrow.",
    pain:
      "The Kota model is lecture-heavy and test-heavy. But tests are weekly, not daily. In the gap between lectures, most students don't know what they've truly understood vs what they've only heard. 10minCUET fills that daily gap — with a 10-minute Bloom-level calibration after each day's coaching.",
    features: [
      {
        emoji: "✅",
        title: "Daily post-lecture calibration",
        desc: "After each coaching session, do one 10-minute 10minCUET session on the topic you just covered. See if you've reached L3 (Apply) or are still at L2 (Understand). Know today — not at the weekly test.",
      },
      {
        emoji: "🔍",
        title: "Identify gaps your coaching won't catch",
        desc: "Coaching tests rank you against peers. 10minCUET tracks you against the CUET Bloom distribution. You might rank 40th in batch but be at L4 on 90% of sub-concepts — or vice versa.",
      },
      {
        emoji: "📱",
        title: "Works on phone. Even in Kota hostels.",
        desc: "No download needed. Open in browser. 10 minutes before lights-out. Works on slow connections.",
      },
    ],
    bodyParagraphs: [
      "Kota, Rajasthan is home to India's most intense CUET coaching ecosystem — Allen, Resonance, FIITJEE, and Vibrant attract over 150,000 CUET aspirants annually. The coaching model delivers exceptional content, experienced faculty, and a competitive peer environment. But it has a blind spot: daily retention verification.",
      "Most Kota coaching institutes run weekly or bi-weekly tests. In the 5–7 days between tests, students attend lectures on multiple topics without knowing which sub-concepts from earlier lectures have truly been understood at the Apply level (L3) vs merely recalled (L1-L2). 10minCUET fills this gap with a daily, targeted 10-minute calibration.",
      "The platform's 432 original questions cover the same topics covered in Kota coaching syllabi — Current Electricity, Wave Optics, Coordination Chemistry, Organic Named Reactions, Integral Calculus, Probability, and more. After a Kota lecture on Gauss's Law, a 10-minute 10minCUET session tests whether you can Apply (L3) it — not just state it.",
      "Kota students who use 10minCUET report one common insight: they discover weak sub-concepts 2–3 weeks before their batch test would have caught them. This allows for targeted revision before the test, rather than reactive cramming after a poor score.",
      "The Score to Percentile Calculator and JoSAA College Predictor are useful for Kota students setting targets mid-year. If your Kota test rank converts to an estimated CUET percentile of 96, and your target college requires 98.5, the gap is 12-15 marks. 10minCUET's Bloom map identifies exactly which sub-concepts, when pushed from L2 to L3, would close that gap.",
    ],
    ctaLabel: "Start Free for Kota Students",
  },
  parents: {
    slug: "parents",
    label: "Parents",
    title: "10minCUET for Parents — Track Your Child's CUET Prep Objectively",
    description:
      "Parent evaluating CUET prep for your child? 10minCUET uses Bloom's Taxonomy to track exact sub-concept mastery. One subscription, parent + kid accounts. Clear progress.",
    hero: "You're investing in your child's CUET prep. Know exactly where they stand.",
    subhero:
      "Not just 'they studied 4 hours today.' Exact Bloom-level progress per sub-concept. Science-backed. Transparent. 10 minutes a day.",
    pain:
      "As a parent, you're spending lakhs on coaching fees, study material, and often relocation — but you have very little visibility into your child's actual progress. 10minCUET's parent account gives you weekly Bloom-level reports: which sub-concepts your child has mastered, which are still weak, and whether they're on track for their target percentile.",
    features: [
      {
        emoji: "👨‍👩‍👧",
        title: "Parent + Kid account model",
        desc: "You subscribe once. Your child gets a 6-digit login code to access from anywhere — their phone, school computer, anywhere. No email required for the student. You see their weekly progress report.",
      },
      {
        emoji: "📊",
        title: "Objective Bloom-level reporting",
        desc: "Not just a score. A Bloom-level map: for each high-frequency CUET sub-concept, you see whether your child is at Remember (L1), Understand (L2), Apply (L3), or Analyse (L4). This is exam-relevant data.",
      },
      {
        emoji: "💰",
        title: "Fraction of coaching cost",
        desc: "Kota coaching: ₹1.5–3 lakh/year. 10minCUET annual plan: ₹999. Not a replacement for coaching — but a daily precision layer that most coaching fees don't provide.",
      },
    ],
    bodyParagraphs: [
      "Indian parents invest enormously in CUET preparation for their children — from coaching fees averaging ₹1.5–3 lakh per year in Kota to relocation, hostel, and study material costs. Yet visibility into actual learning progress is remarkably limited: weekly test ranks and percentages, which measure performance relative to peers but not readiness for CUET itself.",
      "10minCUET gives parents an objective, science-backed view of their child's CUET readiness. Bloom's Taxonomy — the same framework used in educational research and curriculum design worldwide — tracks cognitive mastery at six levels. When your child is at L3 (Apply) on Current Electricity but L2 (Understand) on Wave Optics, you know exactly where to focus.",
      "The Parent + Kid account model is designed for Indian family dynamics. You purchase the subscription once. Your child receives a 6-digit access code that works on any device — no registration, no email, no password for the student to manage. You receive a weekly Bloom-level progress summary showing which sub-concepts have improved and which remain at risk.",
      "10minCUET is not a replacement for coaching. It is a daily calibration layer — 10 minutes per day — that tells you whether today's coaching session actually built Apply-level (L3) understanding, or just Recall-level (L1) exposure. Used alongside coaching, it significantly increases the ROI on your coaching investment.",
      "For parents evaluating CUET prep options for a Class 11 student, 10minCUET's Annual plan at ₹999 represents the lowest-cost way to get objective, sub-concept-level CUET readiness tracking for two full years. The platform covers all 24 high-frequency CUET topics across Physics, Chemistry, and Math — the same topics that account for 60% of CUET marks every year.",
    ],
    ctaLabel: "Start Free for Your Child",
  },
};

export function generateStaticParams() {
  return Object.keys(audienceMap).map((slug) => ({ audience: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ audience: string }>;
}): Promise<Metadata> {
  const { audience } = await params;
  const data = audienceMap[audience as AudienceSlug];
  if (!data) return {};
  return {
    title: data.title,
    description: data.description,
    alternates: { canonical: `${BASE_URL}/for/${data.slug}` },
    openGraph: {
      type: "website",
      url: `${BASE_URL}/for/${data.slug}`,
      title: data.title,
      description: data.description,
    },
  };
}

export default async function AudiencePage({
  params,
}: {
  params: Promise<{ audience: string }>;
}) {
  const { audience } = await params;
  const data = audienceMap[audience as AudienceSlug];
  if (!data) notFound();

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${BASE_URL}/for/${data.slug}`,
    name: data.title,
    description: data.description,
    url: `${BASE_URL}/for/${data.slug}`,
    inLanguage: "en-IN",
    isPartOf: {
      "@id": `${BASE_URL}/#website`,
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
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
          For {data.label}
        </p>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-6">
          {data.hero}
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-8">
          {data.subhero}
        </p>
        <Link
          href="/register"
          className="inline-block bg-orange-500 text-white font-black text-lg px-8 py-4 rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
        >
          {data.ctaLabel} →
        </Link>
      </section>

      {/* Pain */}
      <section className="bg-orange-50 border-y border-orange-100 py-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-gray-700 text-lg leading-relaxed">{data.pain}</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-4xl mx-auto px-4">
        <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-6 text-center">
          What 10minCUET gives {data.label}
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {data.features.map((f) => (
            <div key={f.title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="text-3xl mb-3">{f.emoji}</div>
              <h2 className="font-black text-gray-900 mb-2">{f.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Body content — entity-rich, 400+ words */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-black text-gray-900 mb-6">
            Why {data.label} choose 10minCUET
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            {data.bodyParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial placeholder */}
      {/* TODO: replace with real student reviews once collected
      <section className="py-16 max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">
          What {data.label} say about 10minCUET
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          [testimonials here]
        </div>
      </section>
      */}

      {/* CTA + internal links */}
      <section className="bg-orange-500 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-black mb-4">
            10 minutes. Every day. Starting now.
          </h2>
          <p className="text-orange-100 text-lg mb-8">
            Free to start. No card required. Works on any device.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-block bg-white text-orange-500 font-black text-lg px-8 py-4 rounded-2xl hover:bg-orange-50 transition-all shadow-xl"
            >
              {data.ctaLabel} →
            </Link>
            <Link
              href="/pricing"
              className="inline-block border-2 border-white/50 text-white font-semibold text-lg px-8 py-4 rounded-2xl hover:border-white transition-all"
            >
              See Pricing
            </Link>
          </div>
          <p className="mt-6 text-orange-200 text-sm">
            Or explore{" "}
            <Link href="/topics" className="underline hover:text-white">
              all CUET topics →
            </Link>
          </p>
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
            <Link href="/pricing" className="hover:text-gray-600">Pricing</Link>
            <span>·</span>
            <Link href="/about" className="hover:text-gray-600">About</Link>
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
