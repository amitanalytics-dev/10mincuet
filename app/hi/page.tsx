import type { Metadata } from "next";
import Link from "next/link";
import { hi } from "../i18n/translations/hi";
import { BASE_URL } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "10minCUET — रोज़ 10 मिनट में CUET UG की तैयारी",
  description:
    "भारत सब कुछ 10 मिनट में डिलीवर करता है — अब CUET की तैयारी भी। 500+ ओरिजिनल प्रश्न, Bloom-स्तर ट्रैकिंग, रोज़ 10 मिनट। Class 6 से CUET तक।",
  alternates: {
    canonical: `${BASE_URL}/hi`,
    languages: {
      "en-IN": BASE_URL,
      "hi-IN": `${BASE_URL}/hi`,
      "x-default": BASE_URL,
    },
  },
  openGraph: {
    title: "10minCUET — रोज़ 10 मिनट में CUET UG की तैयारी",
    description:
      "Swiggy 10 मिनट में बिरयानी देता है। हम 10 मिनट में पूरा CUET सेशन देते हैं। हर रोज़।",
    url: `${BASE_URL}/hi`,
    locale: "hi_IN",
    type: "website",
  },
};

const t = hi;

const STEPS = [
  { num: "01", emoji: "🎯", title: t.home_step1_title, desc: t.home_step1_desc },
  { num: "02", emoji: "⏱", title: t.home_step2_title, desc: t.home_step2_desc },
  { num: "03", emoji: "🧠", title: t.home_step3_title, desc: t.home_step3_desc },
  { num: "04", emoji: "📊", title: t.home_step4_title, desc: t.home_step4_desc },
];

const FEATURES = [
  { emoji: "🎯", title: t.home_feat1_title, desc: t.home_feat1_desc, tag: t.home_feat1_tag },
  { emoji: "🧠", title: t.home_feat2_title, desc: t.home_feat2_desc, tag: t.home_feat2_tag },
  { emoji: "⏱️", title: t.home_feat3_title, desc: t.home_feat3_desc, tag: t.home_feat3_tag },
  { emoji: "📊", title: t.home_feat4_title, desc: t.home_feat4_desc, tag: t.home_feat4_tag },
  { emoji: "🔗", title: t.home_feat5_title, desc: t.home_feat5_desc, tag: t.home_feat5_tag },
  { emoji: "👨‍👩‍👧", title: t.home_feat6_title, desc: t.home_feat6_desc, tag: t.home_feat6_tag },
];

export default function HindiLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Nav ── */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/hi" className="font-black text-gray-900 text-lg">
            10min<span className="text-orange-500">CUET</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 font-medium">
              English
            </Link>
            <Link
              href="/login"
              className="text-sm text-gray-600 font-semibold px-4 py-2 rounded-full border border-gray-200 hover:border-gray-300 transition-all hidden sm:block"
            >
              {t.nav_signin}
            </Link>
            <Link
              href="/register"
              className="bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-orange-600 transition-all"
            >
              {t.nav_start_free}
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-12 text-center">
        <div className="mb-6 inline-flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-full px-4 py-2 text-sm">
          <span>🍕</span>
          <span className="text-gray-500">{t.home_india_fast}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-gray-900 leading-tight mb-4">
          रोज़ <span className="text-orange-500">10 मिनट</span> में CUET UG की तैयारी
        </h1>

        <p className="text-lg sm:text-xl text-gray-500 max-w-xl mx-auto leading-relaxed mb-8">
          {t.home_hero_sub}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/diagnostic"
            className="bg-orange-500 text-white font-black text-lg px-8 py-4 rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 active:scale-95"
          >
            2-मिनट का डायग्नोस्टिक दें — बिना साइनअप →
          </Link>
          <Link
            href="/register"
            className="border-2 border-gray-200 text-gray-600 font-semibold text-lg px-8 py-4 rounded-2xl hover:border-gray-300 transition-all"
          >
            {t.home_cta_start}
          </Link>
        </div>

        <p className="mt-4 text-xs text-gray-400">{t.home_free_tag}</p>
      </section>

      {/* ── The India Problem ── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-2">
              {t.home_irony_badge}
            </p>
            <h2 className="text-3xl font-black text-gray-900">{t.home_irony_h2}</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
              <p className="font-black text-green-700 text-lg mb-4">{t.home_delivery_yes}</p>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>🍕 पिज़्ज़ा — Swiggy (10 min)</li>
                <li>🚗 कैब — Ola (8 min)</li>
                <li>🛒 ग्रोसरी — Blinkit (10 min)</li>
                <li>💊 दवाई — 1mg (12 min)</li>
                <li>🧴 रात 2 बजे शैम्पू — Zepto (10 min)</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
              <p className="font-black text-red-600 text-lg mb-4">{t.home_study_no}</p>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>{t.home_study_b1}</li>
                <li>{t.home_study_b2}</li>
                <li>{t.home_study_b3}</li>
                <li>{t.home_study_b4}</li>
                <li>{t.home_study_b5}</li>
              </ul>
              <p className="mt-4 text-sm font-bold text-red-600">{t.home_study_gadbad}</p>
            </div>
          </div>

          <div className="bg-orange-500 rounded-2xl p-6 text-center text-white">
            <p className="text-2xl font-black mb-2">{t.home_banner}</p>
            <p className="text-orange-100 text-sm">{t.home_banner_sub}</p>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-2">
            {t.home_how_badge}
          </p>
          <h2 className="text-3xl font-black text-gray-900">{t.home_how_h2}</h2>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {STEPS.map((step) => (
            <div key={step.num} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{step.emoji}</span>
                <span className="text-xs font-black text-orange-500">{step.num}</span>
              </div>
              <h3 className="font-black text-gray-900 mb-2">{step.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-2">
              {t.home_features_badge}
            </p>
            <h2 className="text-3xl font-black text-gray-900">{t.home_features_h2}</h2>
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
        </div>
      </section>

      {/* ── Emotion ── */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-3">
              {t.home_emotion_badge}
            </p>
            <h2 className="text-3xl font-black text-gray-900 mb-4 leading-tight">
              {t.home_emotion_h2a}
              <br />
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
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-3xl p-8 text-center">
            <div className="text-6xl mb-4">🙏</div>
            <p className="text-xl font-black text-gray-900 mb-2">{t.home_quote}</p>
            <p className="text-gray-500 text-sm">{t.home_quote_trans}</p>
            <div className="mt-6 pt-6 border-t border-orange-100">
              <p className="text-xs text-gray-400">{t.home_built}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-orange-500 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <div className="text-5xl mb-4">⏱️</div>
          <h2 className="text-4xl font-black mb-4 leading-tight">10 मिनट अभी शुरू होते हैं।</h2>
          <p className="text-orange-100 text-lg mb-8 max-w-lg mx-auto">
            Swiggy ने डिलीवरी फास्ट की। Ola ने कैब्स। अब आपकी बारी है अपनी CUET की तैयारी स्मार्ट बनाने की।
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-orange-500 font-black text-xl px-10 py-5 rounded-2xl hover:bg-orange-50 transition-all shadow-xl active:scale-95"
          >
            {t.home_cta_start}
          </Link>
          <p className="mt-4 text-orange-200 text-sm">{t.general_works_on_bsnl}</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-8 text-center">
        <div className="max-w-5xl mx-auto px-4">
          <p className="font-black text-gray-900 text-lg mb-1">
            10min<span className="text-orange-500">CUET</span>
          </p>
          <div className="flex justify-center gap-4 mt-4 text-xs text-gray-400 flex-wrap">
            <Link href="/topics" className="hover:text-gray-600">{t.nav_topics}</Link>
            <span>·</span>
            <Link href="/pricing" className="hover:text-gray-600">{t.nav_pricing}</Link>
            <span>·</span>
            <Link href="/" className="hover:text-gray-600">English</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
