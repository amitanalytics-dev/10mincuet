import Link from 'next/link';

const features = [
  {
    icon: '⏱',
    title: '10-Minute Sessions',
    desc: 'Bite-sized practice designed for Class 12 students with packed schedules. One concept, one session, every day.',
  },
  {
    icon: '📚',
    title: 'All 3 CUET Sections',
    desc: 'Full coverage across Languages (English/Hindi), your Domain Subject, and the General Test — no section left behind.',
  },
  {
    icon: '🎯',
    title: 'CUET-First Questions',
    desc: 'Questions mapped to the NTA CUET syllabus and pattern — not recycled content from other exams.',
  },
  {
    icon: '🏛',
    title: 'Central University Focus',
    desc: 'Every mock, every question, every concept is aimed at getting you into DU, JNU, BHU, and other top Central Universities.',
  },
  {
    icon: '📊',
    title: 'Real CUET Mock Tests',
    desc: '3 sections × 50 questions × 60 min each. +5/−1 marking. Exactly the way NTA conducts the exam.',
  },
  {
    icon: '💡',
    title: 'Stream-Agnostic Prep',
    desc: 'Arts, Commerce, or Science — choose your Domain Subject and we personalise your preparation path.',
  },
];

const subjects = [
  { label: 'Languages', detail: 'English / Hindi (Section IA & IB)', color: 'bg-brand-50 text-brand-700' },
  { label: 'Domain Subject', detail: 'Your chosen stream subject', color: 'bg-purple-50 text-purple-700' },
  { label: 'General Test', detail: 'QA · Reasoning · GK · English', color: 'bg-indigo-50 text-indigo-700' },
];

const stats = [
  { value: '3', label: 'CUET Sections' },
  { value: '50', label: 'Questions / Section' },
  { value: '10 min', label: 'Daily Practice Sessions' },
  { value: '₹0', label: 'To Start' },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    college: 'Got into DU (Lady Shri Ram)',
    stream: 'Commerce',
    quote:
      '10minCUET was the only platform that actually matched the CUET pattern. The General Test questions were spot-on and the 10-minute sessions fit perfectly between my board prep.',
  },
  {
    name: 'Arjun Mehta',
    college: 'Admitted to JNU',
    stream: 'Humanities',
    quote:
      'I was worried about the Domain Subject section but the personalised question sets helped me focus on History and Political Science. Scored 210/300.',
  },
  {
    name: 'Sneha Reddy',
    college: 'BHU – Science stream',
    stream: 'Science',
    quote:
      'Quick sessions, great explanations. I practiced Languages and General Test every morning before school. The mock test format was exactly like the actual CUET.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand-600">
            10min<span className="text-gray-900">CUET</span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/mock" className="hover:text-brand-600 transition-colors">Mock Test</Link>
            <Link href="/for/class-12-students" className="hover:text-brand-600 transition-colors">Who It's For</Link>
            <Link href="/compare/allen" className="hover:text-brand-600 transition-colors">Compare</Link>
            <Link href="/mock" className="bg-brand-600 text-white px-4 py-1.5 rounded-full hover:bg-brand-700 transition-colors">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-800 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-white/15 text-white text-sm font-medium px-3 py-1 rounded-full mb-6">
            CUET 2025 Prep — NTA Pattern
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            Except CUET prep.<br />We fixed that.
          </h1>
          <p className="text-xl md:text-2xl text-brand-100 max-w-2xl mx-auto mb-10">
            Master Languages, your Domain Subject, and the General Test with focused 10-minute daily sessions — built exclusively for CUET and Central University admissions to DU, JNU, BHU, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/mock"
              className="bg-white text-brand-600 font-bold px-8 py-4 rounded-xl hover:bg-brand-50 transition-colors text-lg shadow-lg"
            >
              Take a Free CUET Mock
            </Link>
            <Link
              href="/for/class-12-students"
              className="border-2 border-white/50 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-lg"
            >
              Is This For Me?
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-600 py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold">{s.value}</div>
              <div className="text-brand-200 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CUET Subjects */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">All 3 CUET Sections Covered</h2>
          <p className="text-gray-500 text-center mb-12">
            NTA CUET has three distinct sections. We build dedicated practice paths for each.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {subjects.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${s.color}`}>
                  {s.label}
                </div>
                <p className="text-gray-600 text-sm">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Why 10minCUET?</h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            Most platforms weren't built for CUET. We were. Here's what that means for you.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-brand-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How 10minCUET Works</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-brand-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold mb-2">Pick Your Section</h3>
              <p className="text-gray-500 text-sm">Choose Languages, Domain Subject, or General Test. Select your stream and subject preferences.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-brand-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold mb-2">10-Minute Session</h3>
              <p className="text-gray-500 text-sm">Solve a focused set of questions. Get instant explanations. Build one concept at a time.</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-brand-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold mb-2">Full CUET Mock</h3>
              <p className="text-gray-500 text-sm">When ready, attempt a full mock — 3 sections × 50 questions × 60 min. +5/−1 marking like the real exam.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Students Who Got In</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{t.quote}"</p>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-brand-600 text-xs">{t.college}</div>
                  <div className="text-gray-400 text-xs">{t.stream} Stream</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-brand-600 to-indigo-800 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-4">Your Central University seat is 10 minutes away.</h2>
          <p className="text-brand-200 mb-8 text-lg">
            Start with a free CUET mock test. No signup needed.
          </p>
          <Link
            href="/mock"
            className="bg-white text-brand-600 font-bold px-10 py-4 rounded-xl hover:bg-brand-50 transition-colors text-lg shadow-xl inline-block"
          >
            Start Free CUET Mock →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-gray-900 text-gray-400 text-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-bold text-white text-lg">10minCUET</div>
          <div className="flex gap-6">
            <Link href="/mock" className="hover:text-white transition-colors">Mock Test</Link>
            <Link href="/compare/allen" className="hover:text-white transition-colors">Compare</Link>
            <Link href="/for/class-12-students" className="hover:text-white transition-colors">For Students</Link>
          </div>
          <div>© {new Date().getFullYear()} 10minCUET. Not affiliated with NTA.</div>
        </div>
      </footer>
    </div>
  );
}
