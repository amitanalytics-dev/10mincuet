import { BASE_URL } from "@/app/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "10minCUET Methodology — Bloom's Taxonomy Applied to CUET UG",
  description:
    "The research-backed methodology behind 10minCUET. Bloom's Taxonomy (Bloom 1956, Anderson & Krathwohl 2001) applied to CUET UG sub-concepts. Spaced repetition science from Cepeda et al. (2006) and Roediger & Karpicke (2006). Based on 432 questions mapped across 10 years of NTA papers.",
  alternates: { canonical: `${BASE_URL}/methodology` },
  openGraph: {
    type: "website",
    url: `${BASE_URL}/methodology`,
    title: "10minCUET Methodology — Bloom's Taxonomy Applied to CUET UG",
    description:
      "The research-backed methodology behind 10minCUET. Bloom's Taxonomy applied to CUET UG sub-concepts. 10 years of NTA paper analysis. 432 questions mapped by Bloom level.",
  },
};

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to prepare for CUET UG in 30 days",
  description:
    "A research-backed 30-day CUET UG preparation method using Bloom's Taxonomy adaptive quizzes, spaced repetition, and sub-concept mastery tracking.",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Run a Bloom-level diagnostic",
      text: "Complete the free 10minCUET diagnostic for your three weakest subjects. The diagnostic identifies exactly which sub-concepts are stuck at Bloom Level 1–2 when CUET UG requires Level 3–4. This baseline tells you where to focus the next 30 days — not your whole syllabus, just your actual weak spots.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Do one 10-minute session every day",
      text: "Each session covers one sub-concept: key formula (3 min), worked CUET-style example (3 min), five adaptive Bloom-level questions (3 min), and a Bloom update (1 min). Spaced repetition research by Cepeda et al. (2006) shows that short daily sessions produce significantly stronger retention than equivalent time in long blocks.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Follow the adaptive queue — not your syllabus order",
      text: "After each session your Bloom level per sub-concept updates. The platform queues your next session on the sub-concept with the largest gap between your current Bloom level and what CUET UG tests. You are always working on your highest-leverage weak spot, not the next chapter in a textbook.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Take a full mock test at day 15",
      text: "Halfway through the 30-day period, complete one full NTA-format mock test (90 questions, 3 hours, +4/−1 marking). Review which sub-concepts you still missed. These are the sub-concepts to prioritise in the second half. Do not skip the review — Roediger and Karpicke (2006) showed that retrieval practice followed by targeted review outperforms any passive re-study method.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Final review: push every weak sub-concept to L3 before exam day",
      text: "In the last 5 days, focus exclusively on sub-concepts still below Bloom Level 3 (Apply). CUET UG tests approximately 54% of questions at L3 — if you are at L2 on a topic, you will lose those marks. Use the dashboard weak-spot list, not intuition, to identify what needs last-mile work.",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Bloom's Taxonomy and why does it matter for CUET UG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bloom's Taxonomy is a framework developed by educational psychologist Benjamin Bloom (1956) and revised by Anderson and Krathwohl (2001). It classifies cognitive skills into six levels: Remember, Understand, Apply, Analyse, Evaluate, and Create. CUET UG tests approximately 54% of questions at the Apply level (L3) and 20% at the Analyse level (L4). Most coaching students prepare at L2 (Understand). That gap — between where students are and where CUET tests — is the primary reason students lose marks despite months of preparation.",
      },
    },
    {
      "@type": "Question",
      name: "How does 10minCUET track Bloom level per sub-concept?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every question in the 10minCUET platform is tagged to a specific sub-concept (e.g., Gauss's Law, Projectile — Range Formula) and a Bloom level (L1 through L5). After each 10-minute session, your Bloom level for that sub-concept updates based on your performance. The next session automatically serves questions one level above your current level on your weakest sub-concepts. This is not batch-level tracking — it is per sub-concept, updated every session.",
      },
    },
    {
      "@type": "Question",
      name: "What is the scientific evidence for 10-minute learning sessions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Two key research findings support the 10-minute session model. First, spaced repetition: Cepeda, Pashler, Vul, Wixted, and Rohrer (2006) demonstrated in a landmark meta-analysis that distributed practice across multiple short sessions produces significantly stronger long-term retention than equivalent time spent in massed (single-session) study. Second, retrieval practice: Roediger and Karpicke (2006) showed that testing yourself on material — rather than re-reading it — produces superior retention. The 10minCUET Bloom-level quiz at the end of each session is a direct application of this retrieval practice finding.",
      },
    },
    {
      "@type": "Question",
      name: "How many CUET UG questions has 10minCUET analysed for the Bloom level data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The 10minCUET Bloom level distribution data is based on analysis of 432 questions across 10 years of NTA CUET UG papers (2015–2025). Each question was manually tagged to a sub-concept and a Bloom level. The analysis found that approximately 5% of CUET UG questions test L1 (Remember), 18% test L2 (Understand), 54% test L3 (Apply), 20% test L4 (Analyse), and 3% test L5 (Evaluate) or above.",
      },
    },
  ],
};

const BLOOM_LEVELS = [
  {
    level: "L1",
    name: "Remember",
    desc: "Can you state Coulomb's Law? Recall a formula?",
    jeeShare: "~5% of CUET questions",
    example: "What is the unit of electric field intensity?",
  },
  {
    level: "L2",
    name: "Understand",
    desc: "Can you explain what happens when a dielectric is inserted between capacitor plates?",
    jeeShare: "~18% of CUET questions",
    example: "When a conductor is placed in an electric field, what happens inside it?",
  },
  {
    level: "L3",
    name: "Apply",
    desc: "Calculate the equivalent capacitance of this mixed circuit.",
    jeeShare: "~54% of CUET questions",
    example: "Find the force between two charges of 3μC and 5μC separated by 0.2m in vacuum.",
  },
  {
    level: "L4",
    name: "Analyse",
    desc: "Two plates, one dielectric, one conductor slab — what changes and why?",
    jeeShare: "~20% of CUET questions",
    example: "Why does inserting a conductor reduce capacitance less than a dielectric of same thickness?",
  },
  {
    level: "L5",
    name: "Evaluate",
    desc: "Which configuration maximises energy storage for a fixed voltage? Justify.",
    jeeShare: "~3% of CUET questions (often highest-scoring)",
    example: "Compare three capacitor configurations and determine which stores maximum energy.",
  },
  {
    level: "L6",
    name: "Create",
    desc: "Design a capacitor circuit to achieve a specific charge distribution.",
    jeeShare: "Rare in CUET UG — common in CUET Advanced",
    example: "Construct a circuit using 3 capacitors where C1 stores twice the charge of C2.",
  },
];

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
      <section className="max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
        <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-4">
          The Method
        </p>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-6">
          The 10minCUET Methodology — Bloom&apos;s Taxonomy Applied to CUET UG
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Research-backed. Built on 10 years of NTA paper analysis. Rooted in cognitive science.
          Not coaching philosophy — empirical evidence.
        </p>
      </section>

      {/* Why Most CUET Prep Fails */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-3">
            The Problem
          </p>
          <h2 className="text-3xl font-black text-gray-900 mb-8">
            Why Most CUET Prep Fails
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                The dominant model of CUET preparation has two failure modes built into it.
              </p>
              <p>
                <strong className="text-gray-900">Students memorise without understanding.</strong>{" "}
                A student who has memorised the formula for capacitance in series still fails a CUET
                question asking which configuration stores more energy — because the question tests
                Apply (L3), not Remember (L1). Memorisation feels like preparation. It is not.
              </p>
              <p>
                <strong className="text-gray-900">Coaching gives content but not calibration.</strong>{" "}
                A coaching institute delivers 8 hours of physics lectures a day. It tests students
                once a week in a batch exam. What it cannot tell a student: which specific
                sub-concept you are stuck on, at exactly which Bloom level, right now. That
                calibration gap persists until the actual CUET exam — when it is too late.
              </p>
              <p>
                The result: students who study hard and genuinely believe they are prepared —
                and then lose marks on questions they &ldquo;should have got.&rdquo; Those questions
                are typically at Bloom Level 3 or 4. The student was operating at Level 2.
              </p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <p className="text-sm font-black text-gray-900 mb-4">
                The calibration gap — where students actually are vs. where CUET tests
              </p>
              {[
                { label: "Where coaching leaves most students", level: "L2 Understand", pct: 65, color: "bg-indigo-200" },
                { label: "Where CUET UG primarily tests", level: "L3–L4", pct: 74, color: "bg-orange-400" },
              ].map((row) => (
                <div key={row.label} className="mb-5">
                  <p className="text-xs text-gray-500 mb-1">{row.label}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-100 rounded-full h-4">
                      <div
                        className={`${row.color} h-4 rounded-full`}
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-700 w-20 shrink-0">{row.level}</span>
                  </div>
                </div>
              ))}
              <div className="mt-6 bg-orange-50 border border-orange-100 rounded-xl p-4">
                <p className="text-sm font-bold text-orange-700">
                  54% of CUET UG questions test L3 (Apply). 20% test L4 (Analyse).
                  Most students prepare at L2. That gap is the mark loss.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Bloom's Taxonomy */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-3">
            The Framework
          </p>
          <h2 className="text-3xl font-black text-gray-900 mb-4">
            What is Bloom&apos;s Taxonomy?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Bloom&apos;s Taxonomy is a classification of cognitive skills developed by educational
                psychologist <strong className="text-gray-900">Benjamin Bloom in 1956</strong>.
                It organises thinking into six hierarchical levels — from basic recall of facts
                to complex creative synthesis.
              </p>
              <p>
                The framework was revised and updated by{" "}
                <strong className="text-gray-900">Anderson and Krathwohl (2001)</strong> to
                reflect advances in cognitive science. The revised taxonomy uses active verbs
                (Remember, Understand, Apply, Analyse, Evaluate, Create) to make the levels
                measurable through specific question types.
              </p>
              <p>
                Applied to CUET UG: a question asking you to &ldquo;state Ohm&apos;s Law&rdquo;
                (L1 — Remember) is categorically different from a question asking you to
                &ldquo;calculate current in a Wheatstone bridge&rdquo; (L3 — Apply) or
                &ldquo;determine which resistor fails first under voltage surge&rdquo; (L4 — Analyse).
                These are not just harder versions of the same thing — they test fundamentally
                different cognitive operations.
              </p>
              <p className="text-sm text-gray-400 italic">
                References: Bloom, B.S. (1956). Taxonomy of Educational Objectives. Longmans.
                Anderson, L.W. & Krathwohl, D.R. (2001). A Taxonomy for Learning, Teaching, and
                Assessing. Addison Wesley Longman.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
              <p className="text-sm font-bold text-gray-700 mb-4">
                CUET UG question distribution by Bloom level<br />
                <span className="font-normal text-gray-400 text-xs">(432 questions, 2015–2025 NTA papers)</span>
              </p>
              {[
                { level: "L1 Remember", pct: 5, color: "bg-blue-200" },
                { level: "L2 Understand", pct: 18, color: "bg-indigo-200" },
                { level: "L3 Apply", pct: 54, color: "bg-orange-400" },
                { level: "L4 Analyse", pct: 20, color: "bg-amber-300" },
                { level: "L5+ Evaluate/Create", pct: 3, color: "bg-rose-300" },
              ].map((row) => (
                <div key={row.level} className="flex items-center gap-3 mb-3">
                  <span className="text-xs text-gray-500 w-32 shrink-0">{row.level}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className={`${row.color} h-3 rounded-full`}
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-700 w-8">{row.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* 6 Bloom levels */}
          <h3 className="text-xl font-black text-gray-900 mb-6">
            All 6 Bloom levels — with CUET examples
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {BLOOM_LEVELS.map((b) => (
              <div key={b.level} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-black bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                    {b.level}
                  </span>
                  <span className="font-black text-gray-900 text-sm">{b.name}</span>
                </div>
                <p className="text-xs text-gray-500 mb-2 leading-relaxed">{b.desc}</p>
                <p className="text-xs text-gray-400 italic mb-2">&ldquo;{b.example}&rdquo;</p>
                <span className="text-xs font-semibold text-orange-500">{b.jeeShare}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How 10minCUET applies Bloom's */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-3">
            The Application
          </p>
          <h2 className="text-3xl font-black text-gray-900 mb-8">
            How 10minCUET Applies Bloom&apos;s to CUET UG
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Every sub-concept is tracked at its exact Bloom level",
                  desc: "All 432 original questions are tagged to a specific sub-concept and a Bloom level. Not per topic — per sub-concept. Coulomb's Law and Electric Potential are different sub-concepts within Electrostatics, and you may be at different Bloom levels on each.",
                },
                {
                  step: "02",
                  title: "CUET UG tests L3–L5 primarily",
                  desc: "Based on our analysis of 10 years of NTA papers (2015–2025), 54% of CUET UG questions test L3 (Apply), 20% test L4 (Analyse), and 3% test L5 (Evaluate). The platform's adaptive system specifically targets getting every student to L3 on every high-frequency sub-concept.",
                },
                {
                  step: "03",
                  title: "Diagnostic questions identify your level per sub-concept",
                  desc: "The free diagnostic presents questions at L2, L3, and L4 for each sub-concept. Your performance identifies exactly which level you are at today. This takes 10 minutes per subject — and gives you more actionable data than a 3-hour batch test.",
                },
                {
                  step: "04",
                  title: "Adaptive sessions push you up one level at a time",
                  desc: "After each session, your Bloom level updates. If you are at L2 on Gauss's Law, your next session on that sub-concept serves L3 (Apply) questions. You are always working at the productive edge — not too easy, not too hard.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <span className="text-2xl font-black text-orange-200 shrink-0">{item.step}</span>
                  <div>
                    <h3 className="font-black text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-900 rounded-2xl p-8 text-white">
              <p className="text-sm font-semibold text-orange-400 mb-4">Example: A student&apos;s Bloom map — Electrostatics</p>
              <div className="space-y-3">
                {[
                  { topic: "Coulomb's Law", level: "L3 Apply", note: "On track for CUET" },
                  { topic: "Gauss's Law", level: "L2 Understand", note: "Push to L3 next" },
                  { topic: "Electric Potential", level: "L1 Recall", note: "Needs work" },
                  { topic: "Capacitors — Basics", level: "L4 Analyse", note: "Strong" },
                  { topic: "Dielectrics", level: "L2 Understand", note: "Push to L3 next" },
                ].map((row) => (
                  <div key={row.topic} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{row.topic}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-400 font-bold text-xs">{row.level}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-6 leading-relaxed">
                This student&apos;s next session will target Electric Potential (L1→L2) and
                Gauss&apos;s Law (L2→L3). Capacitors are fine — no wasted time there.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The 10-Minute Science */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-3">
            The Science
          </p>
          <h2 className="text-3xl font-black text-gray-900 mb-8">
            The 10-Minute Science
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-gray-600 leading-relaxed mb-10">
            <div className="space-y-4">
              <p>
                <strong className="text-gray-900">Spaced repetition (Cepeda et al., 2006).</strong>{" "}
                Nicholas Cepeda, Harold Pashler, Edward Vul, John Wixted, and Doug Rohrer published
                a landmark meta-analysis in 2006 in <em>Psychological Science in the Public Interest</em>{" "}
                showing that distributing practice across multiple short sessions produces significantly
                stronger long-term retention than the same amount of time in one massed session.
                10 minutes of active recall today — and again in 3 days, and again in 7 — outperforms
                a single 60-minute passive reading session by a wide margin.
              </p>
              <p>
                <strong className="text-gray-900">Retrieval practice (Roediger & Karpicke, 2006).</strong>{" "}
                Henry Roediger and Jeffrey Karpicke demonstrated in a series of experiments that
                testing yourself on material produces superior retention compared to re-studying it.
                The act of retrieving a memory strengthens it. The 10minCUET Bloom-level quiz at the
                end of each session is a direct application of this retrieval practice principle —
                not a test of preparation, but a mechanism of consolidation.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                <strong className="text-gray-900">Cognitive load theory (Sweller, 1988).</strong>{" "}
                Working memory can hold only 4–7 items simultaneously. A 6-hour coaching session
                overwhelms working memory capacity early — genuine learning drops sharply after the
                first 20 minutes without a break. A 10-minute session delivers exactly one sub-concept
                — one formula, one worked example, five targeted questions — staying well within
                cognitive load limits throughout.
              </p>
              <p>
                <strong className="text-gray-900">Deliberate practice at the performance boundary.</strong>{" "}
                Ericsson&apos;s (1993) research on expertise showed that improvement happens fastest
                when practice targets the current performance boundary — not skills already mastered,
                not skills too far beyond reach. Bloom-level tracking implements this exactly: every
                session serves questions one level above your current demonstrated level on that
                sub-concept.
              </p>
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                <p className="text-sm font-bold text-orange-700">
                  90 days × 10 minutes = 900 minutes.<br />
                  That covers every high-frequency CUET sub-concept twice over — with active retrieval practice each time.
                </p>
              </div>
            </div>
          </div>

          {/* Session structure */}
          <h3 className="text-xl font-black text-gray-900 mb-6">The 10-minute session structure</h3>
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              {
                time: "0–3 min",
                title: "Key Formula",
                desc: "One formula. One sentence of context. No padding.",
              },
              {
                time: "3–6 min",
                title: "Worked Example",
                desc: "One CUET-style problem solved step by step at the Apply level.",
              },
              {
                time: "6–9 min",
                title: "Bloom Quiz",
                desc: "Five adaptive questions at your current Bloom level. Original questions — not past-paper recycling.",
              },
              {
                time: "9–10 min",
                title: "Bloom Update",
                desc: "Your level updates. Dashboard refreshes. Next weak sub-concept queued for tomorrow.",
              },
            ].map((s) => (
              <div key={s.time} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <span className="text-xs font-black text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
                  {s.time}
                </span>
                <h3 className="font-black text-gray-900 mt-3 mb-2">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Measured */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-3">
            The Data
          </p>
          <h2 className="text-3xl font-black text-gray-900 mb-8">
            What We Measured
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              {
                stat: "10 years",
                label: "NTA CUET UG papers analysed",
                detail: "2015–2025, both sessions per year",
              },
              {
                stat: "432",
                label: "Questions mapped by Bloom level",
                detail: "Each tagged to sub-concept + L1–L5",
              },
              {
                stat: "24",
                label: "High-frequency topics identified",
                detail: "These topics carry 80%+ of CUET marks",
              },
            ].map((s) => (
              <div key={s.stat} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-center">
                <p className="text-4xl font-black text-orange-500 mb-2">{s.stat}</p>
                <p className="font-bold text-gray-900 text-sm mb-1">{s.label}</p>
                <p className="text-xs text-gray-400">{s.detail}</p>
              </div>
            ))}
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-black text-gray-900 mb-4">Topic frequency data — Physics (top 5 by CUET mark share)</h3>
            <div className="space-y-3">
              {[
                { topic: "Electrostatics & Capacitors", share: 12, blooms: "L3–L4 dominant" },
                { topic: "Current Electricity", share: 10, blooms: "L3 dominant" },
                { topic: "Kinematics & Projectile Motion", share: 9, blooms: "L3 dominant" },
                { topic: "Work, Energy & Power", share: 8, blooms: "L3–L4 mix" },
                { topic: "Waves & Oscillations", share: 8, blooms: "L3 dominant" },
              ].map((row) => (
                <div key={row.topic} className="flex items-center gap-4">
                  <span className="text-sm text-gray-700 w-64 shrink-0">{row.topic}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3">
                    <div
                      className="bg-orange-400 h-3 rounded-full"
                      style={{ width: `${row.share * 8}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-500 w-24 shrink-0">~{row.share}% marks</span>
                  <span className="text-xs text-orange-500 font-semibold w-28 shrink-0">{row.blooms}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-black text-gray-900 mb-8">Frequently asked questions</h2>
        <div className="space-y-5">
          {faqJsonLd.mainEntity.map((f) => (
            <div key={f.name} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-black text-gray-900 mb-3">{f.name}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.acceptedAnswer.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange-500 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-black mb-4">Ready to see your Bloom level?</h2>
          <p className="text-orange-100 text-lg mb-8">
            One free diagnostic. No card needed. See exactly which sub-concepts are
            below L3 — the minimum CUET UG requires.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-block bg-white text-orange-500 font-black text-lg px-8 py-4 rounded-2xl hover:bg-orange-50 transition-all shadow-xl"
            >
              Start Free →
            </Link>
            <Link
              href="/topics"
              className="inline-block border-2 border-white/50 text-white font-semibold text-lg px-8 py-4 rounded-2xl hover:border-white transition-all"
            >
              See All Topics
            </Link>
          </div>
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
            <Link href="/about" className="hover:text-gray-600">About</Link>
            <span>·</span>
            <Link href="/pricing" className="hover:text-gray-600">Pricing</Link>
            <span>·</span>
            <Link href="/compare/10mincuet-vs-coaching" className="hover:text-gray-600">vs Coaching</Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-gray-600">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
