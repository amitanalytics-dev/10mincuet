import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type CompareSlug =
  | "10minjee-vs-unacademy"
  | "10minjee-vs-physics-wallah"
  | "10minjee-vs-coaching"
  | "self-study-vs-coaching-jee"
  | "jee-main-vs-jee-advanced";

interface CompareData {
  slug: CompareSlug;
  title: string;
  description: string;
  h1: string;
  intro: string;
  colA: string;
  colB: string;
  rows: { feature: string; a: string; b: string; winner?: "a" | "b" | "tie" }[];
  body: string[];
  faqs: { q: string; a: string }[];
  cta: string;
}

const compareMap: Record<CompareSlug, CompareData> = {
  "10minjee-vs-unacademy": {
    slug: "10minjee-vs-unacademy",
    title: "10minCUET vs Unacademy — CUET Prep Platform Comparison 2025",
    description:
      "10minCUET vs Unacademy for CUET UG 2025. Compare session format, pricing, Bloom tracking, and student outcomes. Which platform actually improves your CUET score?",
    h1: "10minCUET vs Unacademy — CUET UG Prep Platform Compared",
    intro:
      "Unacademy is India's largest ed-tech platform, with live classes, recorded lectures, and a subscription model. 10minCUET takes a different approach: no live classes, no videos — just 10-minute adaptive Bloom-level sessions targeting your exact weak sub-concepts. Here's how they compare for CUET UG 2025 preparation.",
    colA: "10minCUET",
    colB: "Unacademy",
    rows: [
      { feature: "Session format", a: "10-min adaptive quiz per sub-concept", b: "Live classes, 60–180 min", winner: "a" },
      { feature: "Content type", a: "432 original Bloom-tagged questions", b: "Video lectures + test series", winner: "a" },
      { feature: "Bloom level tracking", a: "Per sub-concept, updated every session", b: "Not available", winner: "a" },
      { feature: "Price (annual)", a: "₹2,499/year", b: "₹7,000–15,000/year", winner: "a" },
      { feature: "Live doubt solving", a: "Not available", b: "Available", winner: "b" },
      { feature: "Video lectures", a: "Not available", b: "Extensive library", winner: "b" },
      { feature: "Score to percentile tool", a: "Free, built-in", b: "Available", winner: "tie" },
      { feature: "College predictor", a: "Free, JoSAA data", b: "Available", winner: "tie" },
      { feature: "Minimum daily time needed", a: "10 minutes", b: "60+ minutes for meaningful sessions", winner: "a" },
      { feature: "Sub-concept weak spot detection", a: "Automatic, daily", b: "Manual analysis of test results", winner: "a" },
    ],
    body: [
      "Unacademy is a legitimate platform with strong teaching faculty, especially for Physics (Sachin Sir, Sameer Banerjee) and Chemistry (Paaras Thakur). For students who learn well from video instruction and benefit from live doubt-clearing sessions, Unacademy provides real value.",
      "The core difference is the model of learning. Unacademy delivers content. 10minCUET tracks mastery. A student can watch 10 hours of Unacademy lectures on Electrostatics and still be at Bloom Level 2 (Understand) without knowing it. 10minCUET's adaptive quiz after each session tests whether you've actually reached Level 3 (Apply) — the minimum required for CUET questions on that topic.",
      "For students with limited time — Class 12 students managing boards, or working professionals' children — the 10-minute session model is a practical advantage. A 90-minute Unacademy live class requires scheduling, bandwidth, and sustained focus. A 10-minute 10minCUET session can happen before breakfast on a school day.",
      "On pricing: Unacademy subscriptions range from ₹7,000 to ₹15,000 per year depending on the plan. 10minCUET's annual plan is ₹2,499. These are not directly comparable — Unacademy offers substantially more content volume. But if the goal is targeted sub-concept mastery in minimal daily time, 10minCUET delivers that at a fraction of the cost.",
      "The platforms are not mutually exclusive. Many students use Unacademy for content delivery and 10minCUET for daily Bloom-level calibration — 10 minutes after each Unacademy session to verify what actually stuck.",
    ],
    faqs: [
      {
        q: "Is 10minCUET better than Unacademy for CUET UG?",
        a: "They serve different purposes. Unacademy delivers content through live classes and video lectures. 10minCUET tracks Bloom-level mastery per sub-concept through 10-minute adaptive sessions. Students who need content delivery benefit from Unacademy. Students who need daily mastery calibration benefit from 10minCUET. Many use both.",
      },
      {
        q: "Does 10minCUET have live teachers like Unacademy?",
        a: "No. 10minCUET has no live teachers, no live classes, and no video content. It is an adaptive question platform with Bloom-level tracking. If you need a teacher to explain concepts, use Unacademy, YouTube, or coaching. If you need to verify daily whether your understanding has reached the Apply level for CUET, use 10minCUET.",
      },
      {
        q: "Can I use both Unacademy and 10minCUET together?",
        a: "Yes — and many students do. Use Unacademy for content (watching Sachin Sir's Physics lectures, for example), then do a 10-minute 10minCUET session on the same sub-concept to test whether you've reached Bloom Level 3 (Apply). The two platforms complement each other well.",
      },
    ],
    cta: "See What 10minCUET Tracks That Unacademy Doesn't",
  },
  "10minjee-vs-physics-wallah": {
    slug: "10minjee-vs-physics-wallah",
    title: "10minCUET vs Physics Wallah (PW) — CUET Prep Comparison 2025",
    description:
      "10minCUET vs Physics Wallah for CUET UG 2025. Comparing Bloom-level tracking vs video lectures, adaptive quizzes vs PW test series. Honest breakdown.",
    h1: "10minCUET vs Physics Wallah — CUET UG Prep Compared",
    intro:
      "Physics Wallah (PW), founded by Alakh Pandey, democratised CUET prep with free YouTube content and affordable Pathshala courses. 10minCUET takes a different approach — no video content at all, only 10-minute adaptive Bloom-level sessions. Here's an honest comparison for CUET UG 2025 students.",
    colA: "10minCUET",
    colB: "Physics Wallah",
    rows: [
      { feature: "Session format", a: "10-min adaptive Bloom quiz", b: "Video lectures + Pathshala modules", winner: "tie" },
      { feature: "Free content quality", a: "One free diagnostic per subject", b: "Extensive free YouTube library", winner: "b" },
      { feature: "Bloom level tracking", a: "Per sub-concept, daily", b: "Not available", winner: "a" },
      { feature: "Price (paid plan, annual)", a: "₹2,499/year (all subjects)", b: "₹5,000–10,000/year", winner: "a" },
      { feature: "Video content", a: "None", b: "Thousands of hours", winner: "b" },
      { feature: "Test series", a: "Full mock test (NTA format)", b: "Comprehensive test series", winner: "b" },
      { feature: "Sub-concept weak spot detection", a: "Automatic, objective", b: "Manual (interpret your test results)", winner: "a" },
      { feature: "Minimum time per session", a: "10 minutes", b: "30–90 minutes per lecture", winner: "a" },
      { feature: "College predictor + tools", a: "Free, built-in", b: "Available", winner: "tie" },
      { feature: "Suitable for content learning", a: "No — quiz-only platform", b: "Yes — strong for concept building", winner: "b" },
    ],
    body: [
      "Physics Wallah is one of India's most impactful CUET prep innovations. Alakh Pandey's free YouTube lectures on Physics, Chemistry, and Math have genuinely democratised CUET preparation for students who cannot afford coaching. The Pathshala paid platform extends this with structured modules and test series.",
      "The honest limitation of Physics Wallah — and of any video-based platform — is that watching a lecture does not guarantee understanding at the Apply level. A student can watch PW's Gauss's Law lecture twice and still answer CUET-style Analyse-level questions incorrectly. The gap between 'I watched it' and 'I can apply it' is exactly what 10minCUET measures.",
      "10minCUET has no video content. This is intentional. The platform assumes students will use PW, YouTube, or coaching for content delivery. 10minCUET's job is to test what stuck — with 10-minute Bloom-level quizzes after every study session.",
      "For budget-conscious students: Physics Wallah's free YouTube content + 10minCUET's paid plan (₹2,499/year) is a compelling combination. PW delivers concept instruction at no cost. 10minCUET adds daily objective mastery tracking for ₹208/month — less than most students' monthly mobile recharge.",
      "PW's test series is comprehensive and competitive. 10minCUET's mock test is one full NTA-format paper (90 questions, 3 hours, +4/−1 marking). These serve different purposes: PW tests rank students in a peer cohort, 10minCUET tests sub-concept mastery against the CUET Bloom distribution. Both are useful. Neither replaces the other.",
    ],
    faqs: [
      {
        q: "Is 10minCUET better than Physics Wallah for CUET?",
        a: "Different tools for different jobs. Physics Wallah is better for content delivery — concept explanation, worked examples, comprehensive test series. 10minCUET is better for daily Bloom-level mastery tracking — knowing whether today's study actually brought you from Understand (L2) to Apply (L3) on a specific sub-concept.",
      },
      {
        q: "Can I use Physics Wallah free content with 10minCUET?",
        a: "Yes — this is one of the most effective combinations. Watch PW's lecture on a topic (free on YouTube), then do a 10-minute 10minCUET session on the same sub-concept to verify you've reached Apply-level understanding. Total cost: only the 10minCUET subscription.",
      },
      {
        q: "Does 10minCUET replace coaching or PW courses?",
        a: "No. 10minCUET does not replace content delivery. It adds daily objective mastery tracking on top of whatever content source you use — PW, coaching, NCERT, YouTube. The 10-minute session tests comprehension, not just exposure.",
      },
    ],
    cta: "Test Your PW Knowledge — Try 10minCUET Free",
  },
  "10minjee-vs-coaching": {
    slug: "10minjee-vs-coaching",
    title: "10minCUET vs CUET Coaching Institutes — Is Coaching Worth It? 2025",
    description:
      "10minCUET vs traditional CUET coaching (Allen, Resonance, FIITJEE). Compare cost, time, sub-concept mastery tracking, and CUET outcomes. Make an informed decision.",
    h1: "10minCUET vs CUET Coaching Institutes — Honest Comparison for 2025",
    intro:
      "CUET coaching in India — Allen, Resonance, FIITJEE, Aakash, Vibrant — is a ₹10,000+ crore industry. It works for many students. But it has real limitations that 10minCUET is designed to address. Here's an honest, data-driven comparison.",
    colA: "10minCUET",
    colB: "CUET Coaching Institute",
    rows: [
      { feature: "Annual cost", a: "₹2,499", b: "₹1.5–3 lakh", winner: "a" },
      { feature: "Daily time commitment", a: "10 minutes", b: "6–10 hours", winner: "a" },
      { feature: "Relocation required", a: "No — fully online", b: "Often yes (Kota, Delhi, Hyderabad)", winner: "a" },
      { feature: "Sub-concept mastery tracking", a: "Daily, automated, per sub-concept", b: "Weekly tests, batch-level analysis", winner: "a" },
      { feature: "Live teacher interaction", a: "Not available", b: "Daily", winner: "b" },
      { feature: "Peer competition environment", a: "Not available", b: "Strong — drives many students", winner: "b" },
      { feature: "Doubt solving", a: "Not available", b: "Available (with varying quality)", winner: "b" },
      { feature: "Parent visibility", a: "Weekly Bloom report, parent account", b: "Periodic PTMs, batch rankings", winner: "a" },
      { feature: "Content coverage", a: "24 high-frequency topics", b: "Full syllabus", winner: "b" },
      { feature: "Bloom level precision", a: "Per sub-concept, 6 levels", b: "Not measured", winner: "a" },
    ],
    body: [
      "CUET coaching institutes are not a scam. Allen Kota, Resonance, FIITJEE, and Aakash have produced thousands of IIT admits over decades. For students who thrive in structured environments, benefit from peer competition, and have the financial and logistical ability to attend full-time coaching, the model works.",
      "The limitations are structural. First, cost: Kota coaching for 2 years costs ₹3–6 lakh including hostel and living expenses. Second, time: 8–10 hours per day in coaching leaves limited space for the independent practice that builds genuine mastery. Third, feedback granularity: coaching tests tell you your rank in the batch, not which specific sub-concept is at Bloom Level 2 when CUET needs Level 3.",
      "10minCUET addresses the third limitation directly. The Bloom-level tracker identifies, per session, whether you've reached Apply-level (L3) understanding of each sub-concept. A coaching student who completes a 10-minute 10minCUET session after each day's class gets immediate feedback on what actually stuck — rather than waiting for the weekly test.",
      "Many successful CUET students use both: coaching for structure, content delivery, and peer environment; 10minCUET for daily sub-concept mastery calibration. The 10 minutes after dinner is not competing with 8 hours of coaching — it's enhancing the ROI of those 8 hours.",
      "For students considering coaching vs self-study: if you are disciplined, have access to PW or NCERT, and can study consistently without external structure, self-study with 10minCUET can work. If you benefit from a structured environment and live doubt-clearing, coaching is the right choice — and 10minCUET complements it rather than replacing it.",
    ],
    faqs: [
      {
        q: "Can 10minCUET replace CUET coaching?",
        a: "No — 10minCUET does not have teachers, live classes, or full-syllabus content delivery. It is a sub-concept mastery tracker for daily use. It can complement coaching (as a daily calibration layer) or support self-study students who are using PW or YouTube for content. It cannot replace a teacher explaining a difficult Physics concept from scratch.",
      },
      {
        q: "Is CUET coaching worth ₹3 lakh when 10minCUET costs ₹2,499?",
        a: "They are not substitutes. Coaching delivers teacher-led instruction, structured schedules, and peer competition. 10minCUET delivers daily Bloom-level tracking per sub-concept. The value of coaching depends entirely on the student — some thrive, many don't. The value of 10minCUET is the same for every student: daily objective feedback on sub-concept mastery.",
      },
      {
        q: "Which coaching institutes work best with 10minCUET?",
        a: "10minCUET works with any coaching institute. The daily 10-minute session after coaching class is independent of which institute you attend — Allen, Resonance, FIITJEE, Aakash, or any local coaching. The session tests whether today's coaching lecture actually built Apply-level understanding.",
      },
    ],
    cta: "Add Daily Precision to Your Coaching — Start 10minCUET Free",
  },
  "self-study-vs-coaching-jee": {
    slug: "self-study-vs-coaching-jee",
    title: "Self-Study vs Coaching for CUET UG 2025 — Honest Guide",
    description:
      "Self-study or coaching for CUET UG 2025? Honest data on success rates, costs, time commitment, and what actually makes the difference. Includes Bloom's Taxonomy framework.",
    h1: "Self-Study vs Coaching for CUET UG — What the Data Says in 2025",
    intro:
      "The coaching vs self-study debate for CUET UG is one of the most consequential decisions an Indian student makes at 16. This guide doesn't sell you on either approach — it gives you the framework to make the right decision for your specific situation.",
    colA: "Self-Study",
    colB: "Coaching Institute",
    rows: [
      { feature: "Total 2-year cost", a: "₹5,000–20,000 (materials + platforms)", b: "₹1.5–5 lakh", winner: "a" },
      { feature: "Daily time commitment", a: "Fully self-determined", b: "6–10 hours (structured)", winner: "tie" },
      { feature: "Concept explanation quality", a: "Depends on YouTube/NCERT quality", b: "Generally high (faculty-dependent)", winner: "b" },
      { feature: "Peer benchmarking", a: "Limited (online mock tests)", b: "Daily (batch tests, rankings)", winner: "b" },
      { feature: "Accountability", a: "Self-imposed only", b: "External (tests, faculty, peers)", winner: "b" },
      { feature: "Sub-concept mastery tracking", a: "Possible with 10minCUET", b: "Limited (batch test granularity)", winner: "tie" },
      { feature: "Success rate (AIR <10,000)", a: "Lower without strong structure", b: "Higher in structured environments", winner: "b" },
      { feature: "Suitable for", a: "Self-disciplined students, limited budget", b: "Students needing structure and live teachers", winner: "tie" },
    ],
    body: [
      "The data on self-study vs coaching for CUET is nuanced. NTA does not publish the proportion of IIT admits from coaching vs self-study. However, coaching institutes claim 60–80% of IIT admits come from their programs — a claim difficult to verify independently. What we do know: Kota coaching institutes produce a disproportionate share of top-100 AIR students annually.",
      "The argument for coaching is structure and content quality. Experienced Physics faculty at Allen or Resonance have deep institutional knowledge of the CUET paper pattern, question archetypes, and optimal time allocation. A student who doesn't know 'Projectile Motion is high-frequency but rotational dynamics is lower-priority' will discover this faster in coaching than in self-study.",
      "The argument for self-study is discipline and cost. Students who are genuinely self-motivated — who study because they want to, not because they're scheduled to — often do as well or better in self-study. The total cost advantage is substantial: ₹5,000–20,000 vs ₹1.5–5 lakh for two years of coaching.",
      "The critical variable in self-study is objective feedback. Without a teacher flagging weak sub-concepts and without batch tests providing peer benchmarking, a self-study student can study for months while stuck at Bloom Level 2 on critical topics. This is where 10minCUET's Bloom-level tracking adds the most value: it provides the objective, sub-concept-level feedback that coaching test systems provide — at ₹2,499/year instead of ₹1.5 lakh.",
      "The framework for your decision: if you are consistently self-disciplined, have access to good free content (PW, Khan Academy, NCERT), and can handle uncertainty without external structure, self-study with daily 10minCUET sessions is a viable path. If you know you need a teacher to explain concepts, need the accountability of external tests, and have the financial means, coaching is the right choice.",
    ],
    faqs: [
      {
        q: "Can self-study students crack CUET UG with a good rank?",
        a: "Yes. Multiple students crack CUET UG with ranks below 5,000 through self-study. The key differentiators are: (a) strong content sources (PW, NCERT, HC Verma), (b) consistent daily practice, and (c) objective mastery tracking — which tools like 10minCUET can provide. Self-study works best for students with strong intrinsic motivation and access to quality feedback mechanisms.",
      },
      {
        q: "What is the main advantage of coaching over self-study for CUET?",
        a: "Three advantages: (1) live teacher interaction — the ability to ask 'why does this formula work?' and get an immediate, contextual answer; (2) structured schedule — external accountability drives consistency; (3) peer benchmarking — daily batch tests calibrate where you stand among CUET-level peers.",
      },
      {
        q: "What tools help self-study CUET students the most?",
        a: "For content: Physics Wallah (YouTube, free), NCERT textbooks, HC Verma for Physics. For objective mastery tracking: 10minCUET (₹2,499/year) — daily Bloom-level sessions that identify which specific sub-concepts are at L2 when CUET needs L3. For exam strategy: 10minCUET's Score to Percentile Calculator and College Predictor, NTA mock tests.",
      },
    ],
    cta: "Self-Study Students — Track Your Bloom Level Free →",
  },
  "jee-main-vs-jee-advanced": {
    slug: "jee-main-vs-jee-advanced",
    title: "CUET UG vs CUET Advanced 2025 — Differences, Difficulty, Strategy",
    description:
      "CUET UG vs CUET Advanced explained. Eligibility, syllabus differences, Bloom-level demands, paper pattern, and strategy. Based on 10-year NTA paper analysis.",
    h1: "CUET UG vs CUET Advanced — Key Differences Every Student Must Know",
    intro:
      "CUET UG and CUET Advanced are related but distinct examinations. CUET UG is conducted by NTA (National Testing Agency) and is the gateway to NITs, IIITs, and GFTIs. CUET Advanced is conducted by IITs and is the only gateway to IIT undergraduate programmes. Understanding the differences is essential for setting the right preparation strategy.",
    colA: "CUET UG",
    colB: "CUET Advanced",
    rows: [
      { feature: "Conducted by", a: "NTA (National Testing Agency)", b: "Joint Admission Board (IITs)", winner: "tie" },
      { feature: "Number of attempts", a: "Up to 3 consecutive years, 2 sessions/year", b: "2 attempts in 2 consecutive years", winner: "tie" },
      { feature: "Eligibility", a: "Passed/appearing in 12th standard", b: "Top 2.5 lakh CUET UG rankers", winner: "tie" },
      { feature: "Questions format", a: "MCQ + Numerical (NTA pattern)", b: "MCQ + Multiple correct + Integer + Matrix", winner: "tie" },
      { feature: "Negative marking", a: "+4/−1 on MCQ", b: "+3/−1 on MCQ, +4/0 on multiple correct", winner: "tie" },
      { feature: "Bloom level demand", a: "~54% Apply (L3), ~20% Analyse (L4)", b: "~35% Analyse (L4), ~30% Evaluate (L5)", winner: "tie" },
      { feature: "Syllabus", a: "Class 11 + 12 (CBSE/NTA defined)", b: "Class 11 + 12 + some topics beyond NCERT", winner: "tie" },
      { feature: "Score normalisation", a: "Yes — across sessions and shifts", b: "No — single session per paper", winner: "tie" },
      { feature: "Qualifying marks for IIT", a: "Top 2.5 lakh ranks qualify for Advanced", b: "Category cutoffs per IIT programme", winner: "tie" },
      { feature: "Number of seats (approx)", a: "~1.7 lakh (NITs + IIITs + GFTIs)", b: "~17,000 (IITs)", winner: "tie" },
    ],
    body: [
      "CUET UG is the primary undergraduate engineering entrance examination in India, conducted by the National Testing Agency (NTA) twice a year — typically in January and April. Approximately 12–14 lakh students appear for CUET UG annually. Rank in CUET UG determines admission to 31 NITs, 25 IIITs, and 29 GFTIs through the JoSAA counselling process.",
      "CUET Advanced is a separate, harder examination conducted by the Indian Institutes of Technology (IITs) on a rotational basis. Only the top 2.5 lakh students from CUET UG are eligible to appear for CUET Advanced. Approximately 17,000 seats across 23 IITs are filled through CUET Advanced rank.",
      "The Bloom-level difference between the two exams is the most important strategic consideration. CUET UG tests approximately 54% of questions at L3 (Apply) and 20% at L4 (Analyse). CUET Advanced shifts this distribution upward significantly — roughly 35% at L4 (Analyse) and 30% at L5 (Evaluate), with some questions requiring genuine L6 (Create) thinking in the form of multi-step derivation and judgement.",
      "From a preparation strategy perspective: 10minCUET's Bloom-level tracking is calibrated to the CUET UG distribution. Students targeting CUET Advanced need to go beyond L3 on every sub-concept — reaching L4-L5. The platform's questions at L4-L5 (Analyse and Evaluate) specifically prepare students for Advanced-level thinking.",
      "Score normalisation applies only to CUET UG (not CUET Advanced). NTA conducts CUET UG across multiple sessions and 2 shifts per session. Because different shifts have different question sets, NTA uses a statistical normalisation formula to make scores comparable across sessions. The 10minCUET Score Normalisation Calculator explains and simulates this process.",
    ],
    faqs: [
      {
        q: "Is CUET UG easier than CUET Advanced?",
        a: "Yes, significantly. CUET UG tests primarily Bloom Level 3 (Apply) — students who can use formulas to solve structured problems. CUET Advanced tests Bloom Level 4-5 (Analyse, Evaluate) — students who can reason about novel situations, multi-step problems, and non-standard applications. The difficulty gap is substantial, which is why only top 2.5 lakh CUET UG qualifiers can attempt Advanced.",
      },
      {
        q: "Can CUET UG prep alone prepare you for CUET Advanced?",
        a: "Partially. CUET UG preparation builds the Apply-level (L3) foundation needed for most topics. CUET Advanced requires reaching Analyse (L4) and Evaluate (L5) on every high-frequency sub-concept. Students targeting IITs need to extend their preparation beyond the CUET UG Bloom distribution — deeper problem-solving, longer question types, and higher cognitive demand per question.",
      },
      {
        q: "What is score normalisation in CUET UG and how does it work?",
        a: "CUET UG normalisation adjusts raw scores across sessions and shifts to account for difficulty variations. If the morning shift had harder questions than the afternoon shift, students in the morning session get a statistically adjusted score. NTA uses a percentile-based normalization formula. Use 10minCUET's Score Normalisation Calculator to understand how your raw marks convert to a normalised score.",
      },
    ],
    cta: "Prepare for CUET UG with Bloom-Level Precision — Start Free →",
  },
};

export function generateStaticParams() {
  return Object.keys(compareMap).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = compareMap[slug as CompareSlug];
  if (!data) return {};
  return {
    title: data.title,
    description: data.description,
    alternates: { canonical: `https://10minjee.com/compare/${slug}` },
    openGraph: {
      type: "website",
      url: `https://10minjee.com/compare/${slug}`,
      title: data.title,
      description: data.description,
    },
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = compareMap[slug as CompareSlug];
  if (!data) notFound();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white">
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
      <section className="max-w-4xl mx-auto px-4 pt-16 pb-10 text-center">
        <p className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-4">
          Comparison
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-6">
          {data.h1}
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          {data.intro}
        </p>
      </section>

      {/* Comparison table */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_1fr_1fr] bg-gray-50 border-b border-gray-100">
            <div className="p-4 text-sm font-black text-gray-500">Feature</div>
            <div className="p-4 text-sm font-black text-orange-600 border-l border-gray-100">
              {data.colA}
            </div>
            <div className="p-4 text-sm font-black text-gray-700 border-l border-gray-100">
              {data.colB}
            </div>
          </div>
          {/* Data rows */}
          {data.rows.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-[1fr_1fr_1fr] border-b border-gray-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
            >
              <div className="p-4 text-sm text-gray-600 font-medium">{row.feature}</div>
              <div
                className={`p-4 text-sm border-l border-gray-100 ${row.winner === "a" ? "text-orange-600 font-bold" : "text-gray-600"}`}
              >
                {row.a}
                {row.winner === "a" && (
                  <span className="ml-1 text-xs bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-semibold">
                    ✓
                  </span>
                )}
              </div>
              <div
                className={`p-4 text-sm border-l border-gray-100 ${row.winner === "b" ? "text-gray-900 font-bold" : "text-gray-500"}`}
              >
                {row.b}
                {row.winner === "b" && (
                  <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full font-semibold">
                    ✓
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Body content */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-black text-gray-900 mb-6">The full picture</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            {data.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-black text-gray-900 mb-8">Frequently asked questions</h2>
        <div className="space-y-6">
          {data.faqs.map((faq) => (
            <div key={faq.q} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h3 className="font-black text-gray-900 mb-3">{faq.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange-500 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-black mb-4">{data.cta}</h2>
          <p className="text-orange-100 text-lg mb-8">
            One free diagnostic. No card needed. See your Bloom level in 10 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-block bg-white text-orange-500 font-black text-lg px-8 py-4 rounded-2xl hover:bg-orange-50 transition-all shadow-xl"
            >
              Start Free →
            </Link>
            <Link
              href="/pricing"
              className="inline-block border-2 border-white/50 text-white font-semibold text-lg px-8 py-4 rounded-2xl hover:border-white transition-all"
            >
              See Pricing
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
