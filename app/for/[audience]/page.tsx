import Link from 'next/link';

interface AudienceConfig {
  title: string;
  subtitle: string;
  description: string;
  painPoints: string[];
  howWeHelp: string[];
  universities: string[];
  cta: string;
  badge: string;
}

const audienceMap: Record<string, AudienceConfig> = {
  'class-12-students': {
    title: 'CUET Prep for Class 12 Students',
    subtitle: 'Balance boards and CUET without burning out.',
    badge: 'Class 12 — All Streams',
    description:
      "You're already handling board exams, practicals, and college applications. CUET is one more thing — and most platforms expect you to have 3 hours a day. We don't. 10minCUET is built for 10-minute daily sessions that fit between your board prep.",
    painPoints: [
      'Board exams and CUET syllabus overlap — but not completely',
      'CUET has 3 distinct sections (Languages, Domain, General Test)',
      'Most coaching platforms are too long-form for daily use',
      'General Test (QA + Reasoning + GK) is often ignored until it\'s too late',
    ],
    howWeHelp: [
      '10-minute focused sessions — one concept, one section, every day',
      'Separate practice tracks for Languages, Domain Subject, and General Test',
      'Mock tests in exact CUET format (50Q × 60min × 3 sections, +5/−1)',
      'No subscription needed to start — practice free from day one',
    ],
    universities: ['Delhi University (DU)', 'JNU', 'BHU', 'Hyderabad Central University', 'Jamia Millia Islamia', 'AMU'],
    cta: 'Start Free CUET Mock',
  },
  'arts-students': {
    title: 'CUET for Arts & Humanities Students',
    subtitle: 'History, Polity, Geography — your domain. We have the questions.',
    badge: 'Humanities Stream',
    description:
      'Arts students are among the biggest CUET stakeholders — DU\'s BA (Hons) programmes are among the most competitive seats in India. Your Domain Subject choices (History, Political Science, Geography, Economics) need specific preparation, not generic MCQs.',
    painPoints: [
      'Domain Subject questions must match NTA syllabus for Humanities',
      'Languages section needs focused reading comprehension practice',
      'General Test is often unfamiliar territory for Arts students',
      'Competition for DU BA Hons seats is extremely high',
    ],
    howWeHelp: [
      'Domain Subject practice for History, Political Science, Geography, Economics, Sociology',
      'Languages section: English & Hindi comprehension, grammar, vocabulary',
      'General Test: Quantitative Aptitude made approachable, Logical Reasoning, GK',
      'Mock tests calibrated for Humanities stream CUET scores',
    ],
    universities: ['DU – BA (Hons) History', 'DU – BA (Hons) Political Science', 'JNU – BA Social Sciences', 'BHU – BA', 'Jamia Millia Islamia'],
    cta: 'Start Arts CUET Practice',
  },
  'commerce-students': {
    title: 'CUET for Commerce Students',
    subtitle: 'Accountancy, Business Studies, Economics — ace your Domain Subject.',
    badge: 'Commerce Stream',
    description:
      'BCom (Hons) at DU, BBA at Central Universities, and Economics Honours programmes are among the most sought-after seats. Your CUET Domain Subject (Accountancy, Business Studies, Economics) combined with a strong General Test score determines whether you get in.',
    painPoints: [
      'Accountancy and Business Studies CUET questions differ from board pattern',
      'Economics in CUET needs conceptual clarity beyond textbooks',
      'General Test — Quantitative Aptitude — is often a weak area',
      'Multiple application options mean you need scores across several domains',
    ],
    howWeHelp: [
      'Domain Subject tracks for Accountancy, Business Studies, Economics',
      'General Test: Strong QA focus — percentages, profit/loss, SI/CI, DI',
      'Languages: Vocabulary and comprehension for CUET Languages section',
      'Full mock: practise across all 3 sections in one sitting',
    ],
    universities: ['DU – BCom (Hons)', 'DU – BA (Hons) Economics', 'JNU – Economics', 'BHU – BCom', 'IGNOU (Central)'],
    cta: 'Start Commerce CUET Practice',
  },
  'science-students': {
    title: 'CUET for Science Students',
    subtitle: 'Physics, Chemistry, Biology, Mathematics — your domain, our questions.',
    badge: 'Science Stream',
    description:
      'BSc (Hons) programmes at DU and BHU are highly competitive. While you\'re preparing for board practicals and possibly entrance exams, CUET demands a separate focused effort on Domain Subjects in NTA\'s MCQ format — different from how you\'ve been studying.',
    painPoints: [
      'Science CUET questions are MCQ-based — different from board descriptive answers',
      'Need to practise Physics, Chemistry, Biology, or Mathematics in CUET format',
      'General Test is entirely outside the Science syllabus',
      'Time crunch: boards + CUET + practicals all at once',
    ],
    howWeHelp: [
      'Domain Subject MCQ practice: Physics, Chemistry, Biology, Mathematics',
      'General Test: Logical Reasoning and QA practice that is manageable in 10 minutes',
      'Languages section practice without needing hours of preparation',
      '10-minute sessions designed for students with heavy Science workloads',
    ],
    universities: ['DU – BSc (Hons) Physics', 'DU – BSc (Hons) Chemistry', 'BHU – BSc', 'JNU – MSc (via BSc foundation)', 'HCU – Science'],
    cta: 'Start Science CUET Practice',
  },
  'domain-subject-seekers': {
    title: 'CUET Domain Subject Practice',
    subtitle: 'Choose your subject. Practice in NTA format. Get your target score.',
    badge: 'Domain Subject — All Streams',
    description:
      'The CUET Domain Subject section directly determines your eligibility for specific programmes. A high Domain Subject score is the single biggest factor in getting into your chosen BA/BCom/BSc Honours programme. We provide targeted practice for all 27 CUET domain subjects.',
    painPoints: [
      'Domain Subject syllabus is NTA-specific — not a carbon copy of board textbooks',
      'MCQ format requires a different approach than written answers',
      'You need 50 well-chosen questions per session, not a random shuffle',
      'Explanations matter: understanding why the right answer is right',
    ],
    howWeHelp: [
      'Questions mapped to NTA CUET Domain Subject syllabus for all 27 subjects',
      'Bloom\'s taxonomy-tagged questions: from Remember to Evaluate',
      'Detailed explanations for every answer — not just the correct option',
      'Mock format: 50 Domain Subject questions, 60 minutes, +5/−1',
    ],
    universities: ['Any programme requiring a specific Domain Subject score', 'DU', 'JNU', 'BHU', 'All 54 Central Universities accepting CUET'],
    cta: 'Practice Domain Subject',
  },
  'du-aspirants': {
    title: 'CUET Prep for Delhi University (DU)',
    subtitle: 'DU cut-offs are set by CUET scores. We help you hit them.',
    badge: 'Delhi University',
    description:
      'Delhi University has moved entirely to CUET for admissions. Every BA Hons, BCom Hons, and BSc Hons seat is allocated based on your CUET score. There are no board-percentage cut-offs anymore. Your CUET score is everything.',
    painPoints: [
      'DU cut-offs in CUET scores are extremely high for top programmes',
      'You need to score well in the specific Domain Subject for your programme',
      'General Test score matters for many DU programmes',
      'Competition from students across India — not just your city',
    ],
    howWeHelp: [
      'Practice focused on Domain Subjects relevant to popular DU programmes',
      'General Test practice: QA, Reasoning, GK, English Comprehension',
      'Mocks calibrated to realistic DU-qualifying CUET score targets',
      '10-minute sessions to maintain momentum during board exam season',
    ],
    universities: ['Lady Shri Ram College', 'Miranda House', 'SRCC', 'Hindu College', 'Kirori Mal College', 'St. Stephen\'s College'],
    cta: 'Start DU-Focused CUET Prep',
  },
};

const defaultAudience = audienceMap['class-12-students'];

export function generateStaticParams() {
  return Object.keys(audienceMap).map((audience) => ({ audience }));
}

export default function AudiencePage({ params }: { params: { audience: string } }) {
  const config = audienceMap[params.audience] ?? defaultAudience;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/" className="text-brand-600 font-bold text-lg">← 10minCUET</Link>
          <span className="text-gray-400 text-sm">/ For {config.badge}</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-600 to-indigo-800 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-white/15 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
            {config.badge}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{config.title}</h1>
          <p className="text-xl text-brand-200">{config.subtitle}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Description */}
        <p className="text-lg text-gray-700 leading-relaxed mb-14 max-w-2xl">{config.description}</p>

        <div className="grid md:grid-cols-2 gap-8 mb-14">
          {/* Pain points */}
          <div className="bg-white rounded-2xl border border-red-100 p-6 shadow-sm">
            <h2 className="font-bold text-lg mb-4 text-red-600">The Challenges You Face</h2>
            <ul className="space-y-3">
              {config.painPoints.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* How we help */}
          <div className="bg-white rounded-2xl border border-green-100 p-6 shadow-sm">
            <h2 className="font-bold text-lg mb-4 text-green-600">How 10minCUET Helps</h2>
            <ul className="space-y-3">
              {config.howWeHelp.map((h) => (
                <li key={h} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Target universities */}
        <div className="bg-brand-50 rounded-2xl p-6 mb-14">
          <h2 className="font-bold text-lg mb-4 text-brand-700">Target Universities</h2>
          <div className="flex flex-wrap gap-2">
            {config.universities.map((u) => (
              <span key={u} className="bg-white border border-brand-200 text-brand-700 text-sm px-3 py-1.5 rounded-full">
                {u}
              </span>
            ))}
          </div>
        </div>

        {/* Other audiences */}
        <div className="mb-14">
          <h2 className="font-bold text-lg mb-4 text-gray-800">Also Relevant For</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(audienceMap)
              .filter(([key]) => key !== params.audience)
              .slice(0, 5)
              .map(([key, val]) => (
                <Link
                  key={key}
                  href={`/for/${key}`}
                  className="bg-white border border-gray-200 text-gray-600 text-sm px-4 py-2 rounded-full hover:border-brand-400 hover:text-brand-600 transition-colors"
                >
                  {val.badge}
                </Link>
              ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-brand-600 to-indigo-700 rounded-2xl p-10 text-white text-center">
          <h2 className="text-3xl font-extrabold mb-3">Ready to start?</h2>
          <p className="text-brand-200 mb-8">
            Free CUET mock test. NTA pattern. No signup needed.
          </p>
          <Link
            href="/mock"
            className="bg-white text-brand-600 font-bold px-10 py-4 rounded-xl hover:bg-brand-50 transition-colors text-lg inline-block shadow-lg"
          >
            {config.cta} →
          </Link>
        </div>
      </div>
    </div>
  );
}
