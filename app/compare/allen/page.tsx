import Link from 'next/link';

const features = [
  {
    category: 'CUET Coverage',
    embibeRating: 2,
    minCUETRating: 5,
    embibe: 'General prep platform; CUET is one of many exams covered.',
    mincuet: 'Built exclusively for CUET. Every question, mock, and concept maps to NTA CUET syllabus.',
  },
  {
    category: 'Languages Section',
    embibeRating: 2,
    minCUETRating: 5,
    embibe: 'Limited language comprehension practice for CUET-specific format.',
    mincuet: 'Full CUET Languages section practice — English & Hindi comprehension, grammar, vocabulary.',
  },
  {
    category: 'Domain Subject',
    embibeRating: 3,
    minCUETRating: 5,
    embibe: 'Domain content exists but not mapped to CUET marking pattern.',
    mincuet: 'Domain Subject questions aligned to CUET NTA syllabus; covers all 27 domain subjects.',
  },
  {
    category: 'General Test',
    embibeRating: 3,
    minCUETRating: 5,
    embibe: 'QA and Reasoning practice available but not CUET-specific.',
    mincuet: '50 dedicated General Test questions per mock: QA, Logical Reasoning, GK, English Comprehension.',
  },
  {
    category: 'Mock Test Format',
    embibeRating: 2,
    minCUETRating: 5,
    embibe: 'Mock tests exist but may not mirror CUET\'s 3-section × 50Q × 60min format.',
    mincuet: 'Exact CUET format: 3 sections, 50 questions each, 60 minutes each, +5/−1 marking.',
  },
  {
    category: 'Session Length',
    embibeRating: 2,
    minCUETRating: 5,
    embibe: 'Long-form study modules; requires 1–2 hour sessions.',
    mincuet: 'Designed for 10-minute daily sessions — perfect for Class 12 students balancing boards + CUET.',
  },
  {
    category: 'Central University Focus',
    embibeRating: 2,
    minCUETRating: 5,
    embibe: 'General college admission content; not DU/JNU/BHU-specific.',
    mincuet: 'Content and guidance tailored to DU, JNU, BHU, and other Central University admissions.',
  },
  {
    category: 'Pricing',
    embibeRating: 2,
    minCUETRating: 5,
    embibe: '₹15,000–₹50,000/year for full CUET coaching bundles.',
    mincuet: 'Free to start. No credit card. Practice unlimited with full mocks at no cost.',
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-lg ${i < count ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
      ))}
    </div>
  );
}

const subjects = [
  { name: 'Languages (English/Hindi)', cuet: '✓ Full coverage', embibe: '△ Partial' },
  { name: 'Domain Subject', cuet: '✓ All 27 domains', embibe: '△ Limited CUET mapping' },
  { name: 'General Test', cuet: '✓ CUET-pattern QA, LR, GK, English', embibe: '△ Generic aptitude' },
];

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/" className="text-brand-600 font-bold text-lg">← 10minCUET</Link>
          <span className="text-gray-400 text-sm">/ Compare with Embibe</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-block bg-brand-100 text-brand-700 text-sm font-semibold px-3 py-1 rounded-full mb-4">
            CUET Platform Comparison
          </div>
          <h1 className="text-4xl font-extrabold mb-4">10minCUET vs Embibe</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Embibe is a great general-purpose learning platform. But CUET prep is different — it needs a platform built for NTA CUET, Central University admissions, and your Class 12 reality.
          </p>
        </div>

        {/* Pricing callout */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="text-sm text-gray-400 font-medium mb-1">Embibe CUET Coaching</div>
            <div className="text-4xl font-extrabold text-gray-800 mb-2">₹15K–₹50K<span className="text-base font-normal text-gray-400">/year</span></div>
            <ul className="text-sm text-gray-500 space-y-2">
              <li>• Subscription-based full access</li>
              <li>• General exam content adapted for CUET</li>
              <li>• Large platform, not CUET-first</li>
              <li>• Long-form video lectures</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-brand-600 to-indigo-700 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full">
              Recommended
            </div>
            <div className="text-sm text-brand-200 font-medium mb-1">10minCUET</div>
            <div className="text-4xl font-extrabold mb-2">₹0<span className="text-base font-normal text-brand-200"> free to start</span></div>
            <ul className="text-sm text-brand-100 space-y-2">
              <li>• Built exclusively for NTA CUET</li>
              <li>• 10-minute sessions for busy Class 12 students</li>
              <li>• Full mock: 3×50Q×60min, +5/−1 marking</li>
              <li>• Central University (DU/JNU/BHU) focused</li>
            </ul>
            <Link href="/mock" className="mt-5 inline-block bg-white text-brand-600 font-bold px-6 py-2.5 rounded-xl hover:bg-brand-50 transition-colors text-sm">
              Start Free Mock →
            </Link>
          </div>
        </div>

        {/* Subject coverage table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-12">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">CUET Section Coverage</h2>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="grid grid-cols-3 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              <span>CUET Section</span>
              <span className="text-center">10minCUET</span>
              <span className="text-center">Embibe</span>
            </div>
            {subjects.map((s) => (
              <div key={s.name} className="grid grid-cols-3 px-6 py-4 text-sm items-center">
                <span className="text-gray-700 font-medium">{s.name}</span>
                <span className="text-center text-green-600 font-medium">{s.cuet}</span>
                <span className="text-center text-orange-500">{s.embibe}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed comparison */}
        <h2 className="text-2xl font-bold mb-8 text-center">Feature-by-Feature Comparison</h2>
        <div className="space-y-6">
          {features.map((f) => (
            <div key={f.category} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-700">{f.category}</span>
              </div>
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-brand-600">10minCUET</span>
                    <Stars count={f.minCUETRating} />
                  </div>
                  <p className="text-sm text-gray-600">{f.mincuet}</p>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-500">Embibe</span>
                    <Stars count={f.embibeRating} />
                  </div>
                  <p className="text-sm text-gray-500">{f.embibe}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Competitors note */}
        <div className="mt-12 bg-gray-100 rounded-2xl p-6 text-sm text-gray-500 text-center">
          <p>
            <strong className="text-gray-700">Other CUET platforms</strong> — Vidyamandir Classes, Vedantu CUET, Unacademy CUET — charge ₹10K–₹40K/year and offer similar full-course structures.
            10minCUET's edge: <strong className="text-gray-700">10-minute daily sessions + exact NTA mock format + free to start.</strong>
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Start your CUET prep today — it's free.</h2>
          <p className="text-gray-500 mb-8">No coaching fees. No subscription. Just focused CUET practice.</p>
          <Link
            href="/mock"
            className="bg-brand-600 text-white font-bold px-10 py-4 rounded-xl hover:bg-brand-700 transition-colors text-lg inline-block"
          >
            Take Free CUET Mock →
          </Link>
        </div>
      </div>
    </div>
  );
}
