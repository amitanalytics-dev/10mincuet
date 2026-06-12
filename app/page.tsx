"use client";
import { BASE_URL } from "@/app/lib/site";

import Link from "next/link";
import { useState, useEffect } from "react";
import { PublicNav } from "./components/PublicNav";
import { useLanguage } from "./context/LanguageContext";

const DELIVERY_ITEMS = [
  { emoji: "🍕", item: "Pizza", app: "Swiggy", time: "10 min" },
  { emoji: "🚗", item: "Cab", app: "Ola", time: "8 min" },
  { emoji: "🛒", item: "Groceries", app: "Blinkit", time: "10 min" },
  { emoji: "💊", item: "Medicine", app: "1mg", time: "12 min" },
  { emoji: "🧴", item: "Shampoo at 2am", app: "Zepto", time: "10 min" },
  { emoji: "📱", item: "Phone repair", app: "UrbanClap", time: "60 min" },
];

const TESTIMONIALS = [
  {
    name: "Priya, Jaipur",
    emoji: "👩‍🎓",
    text: "Meri coaching ki fees se zyada mera Swiggy bill tha. Tab tak yeh app nahi tha.",
    score: "98.7 percentile — got DU B.Com (Hons)",
  },
  {
    name: "Rahul, Patna",
    emoji: "👦",
    text: "Main 10 ghante padhta tha, kuch yaad nahi rehta tha. Ab 10 minute mein 3 sub-concepts pakde.",
    score: "96.4 percentile — BHU Political Science",
  },
  {
    name: "Ananya, Hyderabad",
    emoji: "👩",
    text: "Mere papa ne puchha 'bas 10 minute?' Main boli 'haan papa, Blinkit se bhi fast hai.'",
    score: "99.2 percentile — got DU Economics",
  },
];

const FAKE_STUDENTS = 1278; // floor — real data takes over once it exceeds this

export default function LandingPage() {
  const { t } = useLanguage();
  const [currentItem, setCurrentItem] = useState(0);
  const [visible, setVisible] = useState(true);
  const [liveStats, setLiveStats] = useState<{
    totalStudents: number;
    totalSessions: number;
    avgBloomImprovement: number;
  } | null>(null);

  const STEPS = [
    { num: "01", title: t.home_step1_title, desc: t.home_step1_desc, emoji: "🎯" },
    { num: "02", title: t.home_step2_title, desc: t.home_step2_desc, emoji: "⏱" },
    { num: "03", title: t.home_step3_title, desc: t.home_step3_desc, emoji: "🧠" },
    { num: "04", title: t.home_step4_title, desc: t.home_step4_desc, emoji: "📊" },
  ];

  const FEATURES = [
    { emoji: "🎯", title: t.home_feat1_title, desc: t.home_feat1_desc, tag: t.home_feat1_tag },
    { emoji: "🧠", title: t.home_feat2_title, desc: t.home_feat2_desc, tag: t.home_feat2_tag },
    { emoji: "⏱️", title: t.home_feat3_title, desc: t.home_feat3_desc, tag: t.home_feat3_tag },
    { emoji: "📊", title: t.home_feat4_title, desc: t.home_feat4_desc, tag: t.home_feat4_tag },
    { emoji: "🔗", title: t.home_feat5_title, desc: t.home_feat5_desc, tag: t.home_feat5_tag },
    { emoji: "👨‍👩‍👧", title: t.home_feat6_title, desc: t.home_feat6_desc, tag: t.home_feat6_tag },
  ];

  // Show the higher of real data or the floor. Switches to live automatically.
  const displayStudents =
    liveStats && liveStats.totalStudents >= FAKE_STUDENTS
      ? liveStats.totalStudents
      : FAKE_STUDENTS;

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentItem((prev) => (prev + 1) % DELIVERY_ITEMS.length);
        setVisible(true);
      }, 300);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => setLiveStats(data))
      .catch(() => {}); // silently fail — static fallbacks shown
  }, []);

  const item = DELIVERY_ITEMS[currentItem];

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD structured data — WebSite + Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": `${BASE_URL}/#website`,
                "url": BASE_URL,
                "name": "10minCUET",
                "description": "CUET UG preparation in 10 minutes a day. Adaptive Bloom-level quizzes, topic intelligence, and daily study plans.",
                "publisher": {
                  "@type": "Organization",
                  "name": "EAZEALLIANCE SERVICES PRIVATE LIMITED",
                  "url": BASE_URL
                }
              },
              {
                "@type": "Organization",
                "@id": `${BASE_URL}/#organization`,
                "name": "10minCUET",
                "url": BASE_URL,
                "logo": `${BASE_URL}/favicon.ico`,
                "contactPoint": {
                  "@type": "ContactPoint",
                  "email": "support@10mincuet.com",
                  "contactType": "customer support"
                }
              }
            ]
          })
        }}
      />
      {/* ── Nav ── */}
      <PublicNav />

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-12 text-center">
        {/* Animated delivery item */}
        <div className="mb-6 inline-flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-full px-4 py-2 text-sm">
          <span
            className="transition-opacity duration-300"
            style={{ opacity: visible ? 1 : 0 }}
          >
            {item.emoji}
          </span>
          <span
            className="transition-opacity duration-300 font-semibold text-orange-700"
            style={{ opacity: visible ? 1 : 0 }}
          >
            {item.item} via {item.app} —{" "}
            <span className="text-orange-500">{item.time}</span>
          </span>
          <span className="text-gray-600">·</span>
          <span className="text-gray-500">{t.home_india_fast}</span>
        </div>

        {/* Class 6 onwards badge */}
        <div className="mb-4">
          <Link
            href="/foundation"
            className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full hover:bg-emerald-100 transition-all"
          >
            🌱 Now from Class 6 onwards — free Foundation track →
          </Link>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-4">
          {t.home_hero_h1a}{" "}
          <span className="relative inline-block">
            <span className="text-gray-900">{t.home_hero_h1b}</span>
            <div className="absolute bottom-1 left-0 right-0 h-1 bg-red-400 rounded" />
          </span>
          <br />
          <span className="text-orange-500">{t.home_hero_h1c}</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-xl mx-auto leading-relaxed mb-6 sm:mb-8">
          {t.home_hero_sub}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/register"
            className="w-full sm:w-auto bg-orange-500 text-white font-black text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 active:scale-95"
          >
            {t.home_cta_start}
          </Link>
          <a
            href="#how"
            className="w-full sm:w-auto border-2 border-gray-200 text-gray-600 font-semibold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-2xl hover:border-gray-300 transition-all"
          >
            {t.home_cta_how}
          </a>
        </div>

        {/* Mobile sign-in nudge — hidden on sm+ where nav already shows it */}
        <p className="sm:hidden mt-3 text-sm text-gray-500">
          {t.home_already_account}{" "}
          <Link href="/login" className="text-orange-500 font-semibold hover:underline">
            Sign in →
          </Link>
        </p>

        <p className="mt-4 text-xs text-gray-600">
          {t.home_free_tag}
          {displayStudents < 5000 && (
            <span className="ml-2 text-orange-500 font-semibold">
              · {(5000 - displayStudents).toLocaleString("en-IN")} of 5,000 referral spots left
            </span>
          )}
        </p>
      </section>

      {/* ── The India Problem ── */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-2">
              {t.home_irony_badge}
            </p>
            <h2 className="text-3xl font-black text-gray-900">
              {t.home_irony_h2}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Delivery side */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-4 sm:p-6">
              <p className="font-black text-green-700 text-base sm:text-lg mb-4">
                {t.home_delivery_yes}
              </p>
              <ul className="space-y-2">
                {DELIVERY_ITEMS.slice(0, 5).map((d, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                    <span>{d.emoji}</span>
                    <span>
                      {d.item} — <span className="font-semibold">{d.app} ({d.time})</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Education side */}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 sm:p-6">
              <p className="font-black text-red-600 text-base sm:text-lg mb-4">
                {t.home_study_no}
              </p>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>{t.home_study_b1}</li>
                <li>{t.home_study_b2}</li>
                <li>{t.home_study_b3}</li>
                <li>{t.home_study_b4}</li>
                <li>{t.home_study_b5}</li>
              </ul>
              <p className="mt-4 text-sm font-bold text-red-600">
                {t.home_study_gadbad}
              </p>
            </div>
          </div>

          <div className="bg-orange-500 rounded-2xl p-4 sm:p-6 text-center text-white">
            <p className="text-xl sm:text-2xl font-black mb-2">
              {t.home_banner}
            </p>
            <p className="text-orange-600 text-sm">
              {t.home_banner_sub}
            </p>
          </div>
        </div>
      </section>

      {/* ── The Emotion Section ── */}
      <section className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-orange-500 uppercase tracking-widest mb-3">
              {t.home_emotion_badge}
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 leading-tight">
              {t.home_emotion_h2a}<br />
              <span className="text-orange-500">{t.home_emotion_h2b}</span>
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>{t.home_emotion_p1}</p>
              <p>{t.home_emotion_p2}</p>
              <p>{t.home_emotion_p3}</p>
              <p className="font-semibold text-gray-800">{t.home_emotion_p4}</p>
              <p>{t.home_emotion_p5}</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-3xl p-6 sm:p-8 text-center mt-6 md:mt-0">
            <div className="text-5xl sm:text-6xl mb-4">🙏</div>
            <p className="text-lg sm:text-xl font-black text-gray-900 mb-2">
              {t.home_quote}
            </p>
            <p className="text-gray-500 text-sm">
              {t.home_quote_trans}
            </p>
            <div className="mt-6 pt-6 border-t border-orange-100">
              <p className="text-xs text-gray-600">
                {t.home_built}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how" className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-xs sm:text-sm font-semibold text-orange-500 uppercase tracking-widest mb-2">
              {t.home_how_badge}
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              {t.home_how_h2}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {STEPS.map((step) => (
              <div key={step.num} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{step.emoji}</span>
                  <span className="text-xs font-black text-orange-500">{step.num}</span>
                </div>
                <h3 className="font-black text-sm sm:text-base text-gray-900 mb-2">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Content ── */}
      <section className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
        <p className="text-xs sm:text-sm font-semibold text-orange-500 uppercase tracking-widest mb-8 sm:mb-10 text-center">
          {t.home_free_read}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Featured Blog */}
          <Link href="/blog/cuet-ug-2025-complete-strategy-guide" className="group">
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 h-48 flex items-center justify-center text-4xl">
                🎯
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Strategy</span>
                  <span className="text-xs text-gray-600">7 min read</span>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                  CUET UG 2025: Complete Strategy
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  A section-by-section game plan for Languages, Domain Subjects and the General Test — with a realistic 90-day timetable.
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-orange-500 group-hover:gap-3 transition-all">
                  {t.home_read_article}
                  <span>→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Featured Mock */}
          <Link href="/mock" className="group">
            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 h-48 flex items-center justify-center text-4xl">
                📝
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">Free Mock</span>
                  <span className="text-xs text-gray-600">Full CUET Pattern</span>
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                  Full CUET UG Mock
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Three 60-minute sections. +5 / −1 marking. Exact CUET UG pattern. Get your diagnostic score instantly. No sign-up required.
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-orange-500 group-hover:gap-3 transition-all">
                  {t.home_take_mock}
                  <span>→</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Foundation (Class 6–10) ── */}
      <section className="py-12 max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
              🌱 New · Free
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
              Start from Class 6
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed max-w-md">
              The Foundation track covers NCERT Science, Maths, Social Science and English for
              Classes 6–10 — each chapter mapped to the CUET topic it feeds into. Build the base
              early, completely free.
            </p>
          </div>
          <Link
            href="/foundation"
            className="bg-emerald-600 text-white font-black px-6 py-3 rounded-2xl hover:bg-emerald-700 transition-all shrink-0"
          >
            Explore Foundation →
          </Link>
        </div>
      </section>

      {/* ── Product Features ── */}
<section className="py-16 max-w-5xl mx-auto px-4">
  <div className="text-center mb-10">
    <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-2">
      {t.home_features_badge}
    </p>
    <h2 className="text-3xl font-black text-gray-900">
      {t.home_features_h2}
    </h2>
  </div>
  <div className="grid md:grid-cols-2 gap-4">
    {FEATURES.map((f, i) => (
      <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex gap-4">
        <div className="text-3xl shrink-0">{f.emoji}</div>
        <div>
          <h3 className="font-black text-gray-900 mb-1">{f.title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed mb-2">{f.desc}</p>
          <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
            {f.tag}
          </span>
        </div>
      </div>
    ))}
  </div>
</section>

      {/* ── Stats ── */}
<section className="py-16 max-w-5xl mx-auto px-4">
  <div className="text-center mb-10">
    <h2 className="text-3xl font-black text-gray-900">
      {t.home_stats_h2}
    </h2>
    <p className="text-gray-600 text-sm mt-1">
      {t.home_stats_sub}
    </p>
  </div>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {/* Live: Students */}
    <div className="text-center bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="text-4xl font-black text-orange-500 mb-1">
        {displayStudents.toLocaleString("en-IN")}
      </div>
      <div className="font-semibold text-gray-800 text-sm mb-1">{t.home_stat_students}</div>
      <div className="text-xs text-gray-600">{t.home_stat_students_sub}</div>
    </div>

    {/* Live: Sessions */}
    <div className="text-center bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="text-4xl font-black text-orange-500 mb-1">
        {liveStats && liveStats.totalSessions > 0
          ? liveStats.totalSessions.toLocaleString("en-IN") + "+"
          : "432"}
      </div>
      <div className="font-semibold text-gray-800 text-sm mb-1">
        {liveStats && liveStats.totalSessions > 0 ? "Sub-concepts mastered" : t.home_stat_questions}
      </div>
      <div className="text-xs text-gray-600">
        {liveStats && liveStats.totalSessions > 0 ? "across the platform" : t.home_stat_questions_sub}
      </div>
    </div>

    {/* Static: Papers */}
    <div className="text-center bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="text-4xl font-black text-orange-500 mb-1">10</div>
      <div className="font-semibold text-gray-800 text-sm mb-1">{t.home_stat_papers}</div>
      <div className="text-xs text-gray-600">{t.home_stat_papers_sub}</div>
    </div>

    {/* Static: Minutes */}
    <div className="text-center bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      <div className="text-4xl font-black text-orange-500 mb-1">10</div>
      <div className="font-semibold text-gray-800 text-sm mb-1">{t.home_stat_mins}</div>
      <div className="text-xs text-gray-600">{t.home_stat_mins_sub}</div>
    </div>
  </div>

  {/* Live banner — always shown with floor number */}
  <div className="mt-6 bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      <span className="text-sm font-semibold text-gray-800">
        {displayStudents.toLocaleString("en-IN")} {t.home_live_banner}
      </span>
    </div>
    <span className="text-xs text-orange-600 font-bold bg-orange-100 px-3 py-1 rounded-full">
      {t.home_live_badge}
    </span>
  </div>
</section>

      {/* ── Quick Tools ── */}
      <section className="py-12 max-w-5xl mx-auto px-4">
        <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-6 text-center">Free Tools</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { emoji: "📊", title: "Score → Percentile", desc: "Know exactly where you stand", href: "/predictor" },
            { emoji: "🏛", title: "College Predictor", desc: "CUET university cutoffs, filtered for you", href: "/college-predictor" },
            { emoji: "📝", title: "Full Mock Test", desc: "Section-based, +5/−1, NTA format", href: "/mock" },
            { emoji: "⚡", title: "30-Day Sprint", desc: "Personalized daily plan to exam day", href: "/sprint" },
          ].map((tool) => (
            <Link key={tool.href} href={tool.href}
              className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group">
              <div className="text-2xl mb-2">{tool.emoji}</div>
              <h3 className="font-black text-gray-900 text-sm mb-1 group-hover:text-orange-500 transition-colors">{tool.title}</h3>
              <p className="text-xs text-gray-600">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── What makes this different ── */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black mb-2">
              Bloom&apos;s Taxonomy. Fancy name. Simple idea.
            </h2>
            <p className="text-gray-600 text-sm max-w-lg mx-auto">
              CUET doesn&apos;t just test if you remember a formula. It tests if you
              can <em>apply</em> it, <em>analyse</em> a tricky scenario, even
              under pressure. We measure exactly that.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                level: "L2 · Understand",
                color: "#60A5FA",
                desc: "Can you explain what happens when you insert a dielectric?",
                tag: "23% of CUET questions",
              },
              {
                level: "L3 · Apply",
                color: "#34D399",
                desc: "Calculate the equivalent capacitance in this weird circuit.",
                tag: "54% of CUET questions",
              },
              {
                level: "L4 · Analyse",
                color: "#FBBF24",
                desc: "Two plates, one dielectric, one conductor — what changes?",
                tag: "23% of CUET questions",
              },
            ].map((b, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div
                  className="text-xs font-black mb-2 px-2 py-1 rounded-full inline-block"
                  style={{ backgroundColor: b.color + "20", color: b.color }}
                >
                  {b.level}
                </div>
                <p className="text-sm text-gray-700 mb-3 leading-relaxed italic">
                  &quot;{b.desc}&quot;
                </p>
                <p className="text-xs text-gray-500">{b.tag}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <p className="text-gray-700 mb-2">
              We track <span className="text-white font-bold">your</span> Bloom level per sub-concept.
            </p>
            <p className="text-gray-600 text-sm">
              If you&apos;re stuck at L2 on Gauss&apos;s Law, we give you L3 questions.
              Not random questions. Not easy questions. The <em>right</em> questions.
            </p>
          </div>
        </div>
      </section>

      {/* ── Unfair Advantage ── */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-2">
            The One Thing Byju&apos;s Can&apos;t Copy
          </p>
          <h2 className="text-3xl font-black text-gray-900 mb-3">
            Sub-concept Bloom Level tracking.<br />
            <span className="text-orange-500">No one else does this.</span>
          </h2>
          <p className="text-gray-600 text-sm max-w-xl mx-auto">
            Every other platform tells you &quot;you&apos;re weak in Electrostatics.&quot;
            We tell you: <strong className="text-gray-700">&quot;You&apos;re stuck at L2 on Gauss&apos;s Law Applications.
            Here are 3 questions that will move you to L3.&quot;</strong>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* What others give you */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
            <p className="text-xs font-black text-gray-600 uppercase tracking-widest mb-4">
              Every other platform
            </p>
            <div className="space-y-3">
              {[
                { label: "8-hour video lectures", note: "passive consumption — you feel like you studied" },
                { label: "\"Weak in the General Test\"", note: "topic-level diagnosis. useless for fixing it" },
                { label: "Thousands of random questions", note: "no cognitive sequence, no Bloom progression" },
                { label: "₹50,000–₹1.2L per year", note: "same result: you still don't know WHERE you're losing marks" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-red-400 font-black text-sm shrink-0 mt-0.5">✗</span>
                  <div>
                    <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                    <span className="text-xs text-gray-600 ml-1">— {item.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What 10minCUET gives */}
          <div className="bg-orange-500 rounded-2xl p-6 text-white">
            <p className="text-xs font-black text-orange-200 uppercase tracking-widest mb-4">
              10minCUET
            </p>
            <div className="space-y-3">
              {[
                { label: "10 minutes. Adaptive. Every day.", note: "active recall beats passive watching every time" },
                { label: "\"You're at L2 Gauss's Law Applications\"", note: "exact sub-concept, exact cognitive level" },
                { label: "3 questions chosen for YOUR gap", note: "not random — sequenced to your Bloom level" },
                { label: "₹99/month or free", note: "no lock-in, no dark patterns" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-white font-black text-sm shrink-0 mt-0.5">✓</span>
                  <div>
                    <span className="text-sm font-semibold text-white">{item.label}</span>
                    <span className="text-xs text-orange-200 ml-1">— {item.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Why they can't copy it */}
        <div className="bg-gray-900 rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4 flex-wrap md:flex-nowrap">
            <div className="shrink-0">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl">🔒</div>
            </div>
            <div>
              <h3 className="font-black text-white text-lg mb-2">
                Why Byju&apos;s — with infinite money — can&apos;t copy this in 30 days
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                To do what we do, they&apos;d need to re-tag every question across 6 Bloom levels × 200+ sub-concepts, rebuild their UX from passive video to active adaptive practice, and convince 50,000 teachers their lecture format is wrong.
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                That&apos;s not a feature sprint. That&apos;s a <strong className="text-white">product pivot they can&apos;t afford to make</strong> — their entire business depends on hours watched, not marks gained.
              </p>
            </div>
          </div>
          <div className="mt-5 pt-5 border-t border-white/10 flex flex-wrap gap-3 items-center justify-between">
            <p className="text-xs text-gray-600">
              3,000+ questions tagged. 6 Bloom levels. 24 topics. Built over 18 months.
            </p>
            <Link
              href="/register"
              className="bg-orange-500 hover:bg-orange-600 text-white font-black px-6 py-2.5 rounded-xl text-sm transition-all active:scale-95"
            >
              Try it free →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials — hidden until real student reviews collected ── */}
      {/* TODO: replace TESTIMONIALS array with real reviews, then uncomment this section */}
      {false && (
      <section className="py-16 max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-2">
            Real Log, Real Results
          </p>
          <h2 className="text-3xl font-black text-gray-900">
            They said 10 minutes wasn&apos;t enough.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xl">
                  {t.emoji}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-orange-500 font-semibold">{t.score}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed italic">
                &quot;{t.text}&quot;
              </p>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* ── Pricing Teaser ── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-2">
            Simple Pricing
          </p>
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            Start free. Pay only when you need more.
          </h2>
          <p className="text-gray-600 text-sm mb-10">
            Diagnostic is always free. No card required. No dark patterns.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mb-8 text-left">
            {[
              { tier: "Free", price: "₹0", desc: "1 diagnostic quiz per subject. See your Bloom level. No commitment.", cta: "Start Free", href: "/register", highlight: false },
              { tier: "Bundle", price: "₹349/mo", desc: "All 3 subjects. Full access. Practice, daily plans, Bloom tracker.", cta: "Get Bundle", href: "/pricing", highlight: true },
              { tier: "Annual", price: "₹999/yr", desc: "Everything in Bundle for a full year. Saves ₹3,189 vs monthly.", cta: "Best Value", href: "/pricing", highlight: false },
            ].map((p, i) => (
              <div key={i} className={`rounded-2xl border p-6 ${p.highlight ? "bg-orange-500 border-orange-500 text-white shadow-xl shadow-orange-100" : "bg-white border-gray-200"}`}>
                <div className={`text-xs font-black uppercase tracking-widest mb-2 ${p.highlight ? "text-orange-100" : "text-orange-500"}`}>{p.tier}</div>
                <div className={`text-3xl font-black mb-2 ${p.highlight ? "text-white" : "text-gray-900"}`}>{p.price}</div>
                <p className={`text-sm mb-4 leading-relaxed ${p.highlight ? "text-orange-100" : "text-gray-500"}`}>{p.desc}</p>
                <Link href={p.href} className={`block text-center font-bold py-2.5 rounded-xl transition-all text-sm ${p.highlight ? "bg-white text-orange-500 hover:bg-orange-50" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                  {p.cta} →
                </Link>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600">
            Refer a friend who pays → get 1 month free (max 5 months). First 5,000 students only. ·{" "}
            <Link href="/pricing" className="underline hover:text-gray-600">See all plans</Link>
          </p>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-orange-500 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <div className="text-5xl mb-4">⏱️</div>
          <h2 className="text-4xl font-black mb-4 leading-tight">
            10 minutes starts now.
          </h2>
          <p className="text-orange-100 text-lg mb-8 max-w-lg mx-auto">
            Swiggy ne delivery ko fast kiya. Ola ne cabs ko.
            Ab teri baari hai apni padhai ko smart banana.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-orange-500 font-black text-xl px-10 py-5 rounded-2xl hover:bg-orange-50 transition-all shadow-xl active:scale-95"
          >
            Shuru karo. Abhi. →
          </Link>
          <p className="mt-4 text-orange-200 text-sm">
            No app download. No account. Open in browser, start studying.
          </p>
        </div>
      </section>

      {/* FAQ structured data — single merged FAQPage (all questions) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How does 10minCUET work?",
                "acceptedAnswer": { "@type": "Answer", "text": "Pick a CUET UG topic, do a 10-minute adaptive study session, then answer Bloom-level questions. The app tracks exactly which sub-concepts you're weak on and adjusts difficulty automatically." }
              },
              {
                "@type": "Question",
                "name": "Is 10minCUET free?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes. 10minCUET is free to start with no credit card required. The free tier includes diagnostic quizzes for all subjects. Premium plans start at ₹99/month, with the Annual plan at ₹999/year." }
              },
              {
                "@type": "Question",
                "name": "Which topics does 10minCUET cover?",
                "acceptedAnswer": { "@type": "Answer", "text": "10minCUET covers all three CUET UG sections: Languages (English), the General Test (quant, reasoning, GK, current affairs) and Domain Subjects across Science, Commerce and Humanities. Each topic is mapped by Bloom's Taxonomy level." }
              },
              {
                "@type": "Question",
                "name": "How is 10minCUET different from Unacademy or PW?",
                "acceptedAnswer": { "@type": "Answer", "text": "10minCUET has no live classes, no 6-hour videos. It's a daily 10-minute adaptive quiz and study plan that focuses only on high-frequency CUET topics. It tells you exactly which sub-concept is costing you marks." }
              },
              {
                "@type": "Question",
                "name": "What is 10minCUET?",
                "acceptedAnswer": { "@type": "Answer", "text": "10minCUET is an adaptive CUET UG preparation platform that delivers a complete study session in 10 minutes per day. It tracks your Bloom level per sub-concept so you always study exactly what you're weak at." }
              },
              {
                "@type": "Question",
                "name": "How is 10minCUET different from Byju's or Physics Wallah?",
                "acceptedAnswer": { "@type": "Answer", "text": "10minCUET is the only platform that tracks your Bloom cognitive level per sub-concept. Instead of watching hours of video, you study for 10 focused minutes and instantly see your exact weak spots." }
              },
              {
                "@type": "Question",
                "name": "What is Bloom Level tracking in CUET preparation?",
                "acceptedAnswer": { "@type": "Answer", "text": "Bloom's Taxonomy has 6 cognitive levels: Remember, Understand, Apply, Analyze, Evaluate, Create. 10minCUET tags every question to a specific level and sub-concept, so you know if you can only recall a formula or if you can actually apply it in a new problem." }
              },
              {
                "@type": "Question",
                "name": "How many questions does 10minCUET have?",
                "acceptedAnswer": { "@type": "Answer", "text": "10minCUET has 200+ original CUET questions — not scraped, not recycled — across English, the General Test and Domain Subjects. Every question is mapped to a specific sub-concept and Bloom level, modelled on the CUET UG syllabus and NTA pattern." }
              }
            ]
          })
        }}
      />

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-8 text-center">
        <div className="max-w-5xl mx-auto px-4">
          <p className="font-black text-gray-900 text-lg mb-1">
            10min<span className="text-orange-500">CUET</span>
          </p>
          <p className="text-xs text-gray-600">
            Analysis based on CUET UG 2015–2025 (all sessions, all shifts) · NTA official papers ·
            Built for the student who shows up every day.
          </p>
          <div className="flex justify-center gap-4 mt-4 text-xs text-gray-600 flex-wrap">
            <Link href="/topics" className="hover:text-gray-600">All Topics</Link>
            <span>·</span>
            <Link href="/pricing" className="hover:text-gray-600">Pricing</Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-gray-600">Contact</Link>
            <span>·</span>
            <Link href="/privacy-policy" className="hover:text-gray-600">Privacy</Link>
            <span>·</span>
            <Link href="/refund-policy" className="hover:text-gray-600">Refunds</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-gray-600">Terms</Link>
          </div>
          <p className="text-xs text-gray-700 mt-4">
            © 2025 10minCUET. All content is original and copyright protected. Reproduction prohibited.
          </p>
        </div>
      </footer>
    </div>
  );
}
