import "server-only";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  subject: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readingMinutes: number;
  content: string;
}

// ─── CUET UG blog seed data ──────────────────────────────────────────────────
// Static fallback so /blog and /blog/[slug] always render, even if Convex is
// unavailable or its blogs table is empty. Replaces the legacy JEE dataset.
export const BLOGS: BlogPost[] = [
  {
    slug: "cuet-ug-2025-complete-strategy-guide",
    title: "CUET UG 2025: A Complete Preparation Strategy",
    description:
      "A section-by-section CUET UG game plan — Languages, Domain Subjects and the General Test — with a realistic 90-day timetable and scoring strategy.",
    subject: "Strategy",
    category: "Strategy",
    tags: ["CUET UG", "strategy", "NTA", "timetable", "preparation"],
    publishedAt: "2026-05-20",
    readingMinutes: 7,
    content: `<h1>CUET UG 2025: A Complete Preparation Strategy</h1>
<p>CUET UG is one exam that opens the door to 280+ central, state and private universities — including DU, BHU, JNU, AMU, Jamia and Allahabad. Unlike a single-subject entrance, it tests you across three section families, so your strategy must be section-aware from day one.</p>
<h2>Understand the three sections</h2>
<ul>
<li><strong>Section IA/IB — Languages:</strong> 50 questions, attempt 40, 60 minutes. Reading comprehension, grammar and vocabulary dominate.</li>
<li><strong>Section II — Domain Subjects:</strong> up to six chosen subjects, ~50 questions each (attempt 40), 60 minutes per subject, mapped to NCERT Class 12.</li>
<li><strong>Section III — General Test:</strong> 60 questions, attempt 50, 60 minutes — quantitative aptitude, reasoning, GK and current affairs.</li>
</ul>
<h2>The marking scheme changes everything</h2>
<p>CUET awards <strong>+5 for a correct answer and −1 for a wrong one</strong>. With that ratio, blind guessing hurts. Only attempt a question when you can eliminate at least two options. Accuracy beats attempt count.</p>
<h2>A realistic 90-day plan</h2>
<ul>
<li><strong>Days 1–40:</strong> Finish NCERT for your domain subjects and build a daily current-affairs habit.</li>
<li><strong>Days 41–70:</strong> Sectional tests — one Language, one Domain, one General Test paper every alternate day.</li>
<li><strong>Days 71–90:</strong> Full-length mocks under the 60-minute-per-section clock, plus error logs.</li>
</ul>
<p>Practise 10-minute Bloom-level drills on <a href="/topics">10minCUET</a> to convert reading into recall.</p>`,
  },
  {
    slug: "understanding-cuet-nta-exam-pattern-marking",
    title: "The CUET Exam Pattern and Marking Scheme, Explained",
    description:
      "How the NTA structures CUET UG — section sizes, the 60-minute sections, optional questions, and why the +5/−1 marking rewards accuracy over volume.",
    subject: "Exam Analysis",
    category: "Exam Analysis",
    tags: ["CUET pattern", "NTA", "marking scheme", "exam analysis"],
    publishedAt: "2026-05-18",
    readingMinutes: 5,
    content: `<h1>The CUET Exam Pattern and Marking Scheme, Explained</h1>
<p>Before you study a single chapter, understand the machine you are feeding answers into. The NTA designs CUET UG as a sectional, time-boxed test, and small structural details decide big marks.</p>
<h2>Section structure</h2>
<p>Each subject paper has around 50 questions of which you attempt 40 (the General Test has 60, attempt 50). Every section runs for <strong>60 minutes</strong>, and you choose your subjects during the application.</p>
<h2>Marking: +5, −1, 0</h2>
<p>A correct answer earns <strong>+5</strong>, a wrong answer loses <strong>−1</strong>, and an unattempted question is <strong>0</strong>. The penalty is small relative to the reward, but over a 200-question paper it compounds. The break-even guess accuracy is roughly one-in-six, so eliminate before you guess.</p>
<h2>Why optional questions matter</h2>
<p>Because you attempt 40 of ~50, you can skip the two or three nastiest questions per section with zero penalty. Train yourself to recognise and abandon time-sinks quickly.</p>
<h2>Normalisation</h2>
<p>CUET runs in multiple shifts, so raw scores are normalised into percentiles. Focus on accuracy and consistency rather than chasing a specific raw number. Read more on our <a href="/score-normalisation">score normalisation guide</a>.</p>`,
  },
  {
    slug: "cuet-general-test-preparation-guide",
    title: "Cracking the CUET General Test: Quant, Reasoning and GK",
    description:
      "The General Test is the most underrated CUET section. Here is how to build quantitative aptitude, logical reasoning and current-affairs muscle efficiently.",
    subject: "Topic Deep-Dive",
    category: "Topic Deep-Dive",
    tags: ["General Test", "quantitative aptitude", "reasoning", "current affairs"],
    publishedAt: "2026-05-15",
    readingMinutes: 6,
    content: `<h1>Cracking the CUET General Test: Quant, Reasoning and GK</h1>
<p>For DU and many central universities, the General Test is a deciding section for several courses. It rewards breadth and speed rather than depth, which makes it highly trainable.</p>
<h2>Quantitative aptitude</h2>
<p>The maths is Class 8–10 level: percentage, ratio, profit and loss, averages, time-speed-distance and simple interest. Drill percentage↔fraction conversions until they are automatic — they unlock half the section.</p>
<h2>Logical and analytical reasoning</h2>
<p>Series, analogies, coding-decoding, blood relations and syllogisms appear every year. Always commit clues to paper — draw the family tree, the seating circle or the Venn diagram. Mental solving is where students lose marks.</p>
<h2>General knowledge and current affairs</h2>
<p>Maintain a one-line-a-day current-affairs note covering national schemes, awards, sports and summits from the last twelve months. Pair it with static GK — polity, geography and history basics.</p>
<h2>Practice cadence</h2>
<p>Two 10-minute reasoning sets and one current-affairs review per day beats a weekend cram. Track your Bloom level on each sub-topic on <a href="/topics">10minCUET</a>.</p>`,
  },
  {
    slug: "cuet-english-reading-comprehension-mastery",
    title: "CUET English: How to Master Reading Comprehension",
    description:
      "Reading comprehension carries the most weight in the CUET English paper. Learn the question-first method, inference traps, and how to read for tone.",
    subject: "Topic Deep-Dive",
    category: "Topic Deep-Dive",
    tags: ["English", "reading comprehension", "Languages", "verbal ability"],
    publishedAt: "2026-05-12",
    readingMinutes: 5,
    content: `<h1>CUET English: How to Master Reading Comprehension</h1>
<p>Reading comprehension is the single largest block in the CUET English section, and it is also the most learnable. The skill is not vocabulary — it is disciplined reading.</p>
<h2>The question-first method</h2>
<p>Skim the questions before the passage. You will know whether to hunt for a fact, an inference or the main idea, and you will read with purpose instead of re-reading.</p>
<h2>Three question types</h2>
<ul>
<li><strong>Factual:</strong> the answer is in the text — locate the line, do not reason from outside knowledge.</li>
<li><strong>Inference:</strong> pick the option the passage <em>implies</em>, not the most dramatic one.</li>
<li><strong>Main idea / title:</strong> the right answer runs through every paragraph; reject options that fit only one line.</li>
</ul>
<h2>Reading for tone</h2>
<p>Literary and narrative passages test attitude. Mark emotive words — 'forced a smile', 'reluctantly agreed' — to track how the author feels about the subject.</p>
<p>Build speed with timed RC sets on <a href="/topics">10minCUET</a>.</p>`,
  },
  {
    slug: "cuet-domain-science-physics-chemistry-biology",
    title: "CUET Domain Guide: Physics, Chemistry, Biology and Maths",
    description:
      "A subject-wise map of the high-frequency Class 12 NCERT chapters for CUET science domain papers, with what to prioritise per subject.",
    subject: "Topic Deep-Dive",
    category: "Topic Deep-Dive",
    tags: ["Domain Subjects", "Science", "Physics", "Chemistry", "Biology", "Mathematics"],
    publishedAt: "2026-05-10",
    readingMinutes: 6,
    content: `<h1>CUET Domain Guide: Physics, Chemistry, Biology and Maths</h1>
<p>CUET domain papers are built almost entirely from NCERT Class 12. If you know the high-frequency chapters, you can plan a focused revision that beats undirected effort.</p>
<h2>Physics</h2>
<p>Electrostatics, current electricity, magnetism and EMI, optics and modern physics recur every year. Modern physics is formula-light and high-yield — start there for quick wins.</p>
<h2>Chemistry</h2>
<p>Organic chemistry carries the most weight; master GOC (inductive, resonance, hyperconjugation) and named reactions. Equilibrium and electrochemistry give clean, formula-based marks.</p>
<h2>Biology</h2>
<p>Cell biology and genetics, human physiology and ecology dominate. Learn the labelled diagrams — CUET loves structure-function matches.</p>
<h2>Mathematics</h2>
<p>Calculus is the largest block, followed by algebra and coordinate geometry. Probability is mechanical once you identify the question type.</p>
<p>Each chapter on <a href="/topics">10minCUET</a> is broken into sub-concepts with Bloom-level practice.</p>`,
  },
  {
    slug: "cuet-domain-commerce-accountancy-business-economics",
    title: "CUET Commerce Domain: Accountancy, Business Studies, Economics",
    description:
      "The three commerce domain subjects in CUET, the chapters that repeat, and how to balance numerical accountancy with theory-heavy business studies.",
    subject: "Topic Deep-Dive",
    category: "Topic Deep-Dive",
    tags: ["Domain Subjects", "Commerce", "Accountancy", "Business Studies", "Economics"],
    publishedAt: "2026-05-08",
    readingMinutes: 5,
    content: `<h1>CUET Commerce Domain: Accountancy, Business Studies, Economics</h1>
<p>Commerce aspirants targeting DU's SRCC, Hindu and Hansraj or BHU's commerce programmes usually pick Accountancy, Business Studies and Economics as their domain subjects. Each rewards a different study style.</p>
<h2>Accountancy</h2>
<p>Partnership accounts are the single largest block — fundamentals, admission, retirement and dissolution. Master the revaluation account and goodwill treatment, then company accounts (share and debenture entries).</p>
<h2>Business Studies</h2>
<p>This is theory-heavy. Learn Fayol's 14 principles and Taylor's techniques by keyword, then the functions of management and the marketing mix (4 Ps).</p>
<h2>Economics</h2>
<p>Split your time between micro (demand, elasticity, market forms) and macro (national income, money and banking, government budget). Indian Economic Development is recall-friendly and high-scoring.</p>
<p>Practise sub-concept drills for all three on <a href="/topics">10minCUET</a>.</p>`,
  },
  {
    slug: "cuet-domain-humanities-history-geography-polsci",
    title: "CUET Humanities Domain: History, Geography, Political Science",
    description:
      "How to prepare the humanities domain subjects for CUET — the recurring themes in History, Geography and Political Science and how to revise them.",
    subject: "Topic Deep-Dive",
    category: "Topic Deep-Dive",
    tags: ["Domain Subjects", "Humanities", "History", "Geography", "Political Science"],
    publishedAt: "2026-05-06",
    readingMinutes: 5,
    content: `<h1>CUET Humanities Domain: History, Geography, Political Science</h1>
<p>Humanities domain papers reward structured recall. The NCERT text is your scripture; supplement it with maps and timelines.</p>
<h2>History</h2>
<p>Ancient (Harappan, Mauryan, Gupta), medieval (Delhi Sultanate, Mughals, Bhakti-Sufi) and modern India (1857, the national movement, Partition) form the three pillars. The freedom-struggle sequence with dates is non-negotiable.</p>
<h2>Geography</h2>
<p>Balance physical geography (geomorphology, climatology) with human and economic geography, then the geography of India. Practise map work weekly.</p>
<h2>Political Science</h2>
<p>The Indian Constitution and political theory (liberty, equality, justice) dominate, with international relations linked to current affairs. Know your Fundamental Rights and key Articles cold.</p>
<p>Track your Bloom level chapter by chapter on <a href="/topics">10minCUET</a>.</p>`,
  },
  {
    slug: "cuet-du-cutoffs-2024-what-to-expect",
    title: "DU CUET Cutoffs: Reading the 2024 Numbers for 2025",
    description:
      "What the 2024 CUET-based Delhi University admission cutoffs tell you about realistic targets for popular programmes and colleges.",
    subject: "Exam Analysis",
    category: "Exam Analysis",
    tags: ["DU", "cutoffs", "CUET", "admissions", "percentile"],
    publishedAt: "2026-05-04",
    readingMinutes: 6,
    content: `<h1>DU CUET Cutoffs: Reading the 2024 Numbers for 2025</h1>
<p>Since 2022, Delhi University admits undergraduates purely on CUET normalised scores allocated through the CSAS portal. Understanding the 2024 pattern helps you set a realistic target.</p>
<h2>How CSAS works</h2>
<p>You submit your CUET marks plus a college-and-programme preference list. DU computes a combined score from your relevant sections, and seats are allotted by merit and preference across rounds.</p>
<h2>What 2024 told us</h2>
<p>Flagship programmes — Economics (Hons) and B.Com (Hons) at SRCC and Hindu, English and Political Science at top colleges — required very high normalised scores, often in the upper-99th percentile band. Newer colleges and less-rushed combinations cleared at noticeably lower scores.</p>
<h2>Plan your preference list</h2>
<p>Mix dream, target and safe options. A long, honest preference list is the single biggest lever you control after the exam. Estimate your reach with our <a href="/predictor">CUET college predictor</a>.</p>
<p><em>These are indicative observations based on 2024 admissions and will shift year to year.</em></p>`,
  },
  {
    slug: "cuet-central-universities-bhu-jnu-amu-jamia",
    title: "Beyond DU: BHU, JNU, AMU and Jamia Through CUET",
    description:
      "CUET is your gateway to far more than Delhi University. A tour of admissions at BHU, JNU, AMU, Jamia and Allahabad and how their requirements differ.",
    subject: "Strategy",
    category: "Strategy",
    tags: ["BHU", "JNU", "AMU", "Jamia", "central universities", "CUET"],
    publishedAt: "2026-05-02",
    readingMinutes: 5,
    content: `<h1>Beyond DU: BHU, JNU, AMU and Jamia Through CUET</h1>
<p>Students often equate CUET with Delhi University, but the same scorecard is accepted by 280+ universities. Casting a wider net dramatically improves your admission odds.</p>
<h2>BHU (Banaras Hindu University)</h2>
<p>One of India's largest universities, BHU offers a vast spread of undergraduate programmes across science, commerce and humanities, all through CUET.</p>
<h2>JNU</h2>
<p>JNU's undergraduate language and area-studies programmes admit via CUET, prizing strong language and General Test performance.</p>
<h2>AMU and Jamia Millia Islamia</h2>
<p>Both participate in CUET for a range of undergraduate courses; check each year which programmes are inside or outside CUET, as some retain internal tests.</p>
<h2>Allahabad and others</h2>
<p>The University of Allahabad and dozens of other central and state universities accept CUET scores. Build a wide, honest preference strategy rather than betting on a single campus.</p>`,
  },
  {
    slug: "cuet-time-management-60-minute-sections",
    title: "Time Management for CUET's 60-Minute Sections",
    description:
      "Each CUET section is a separate 60-minute sprint. Here is a per-section clock strategy to maximise attempts without sacrificing accuracy.",
    subject: "Strategy",
    category: "Strategy",
    tags: ["time management", "CUET", "exam strategy", "sections"],
    publishedAt: "2026-04-30",
    readingMinutes: 4,
    content: `<h1>Time Management for CUET's 60-Minute Sections</h1>
<p>CUET is not one long paper — it is a sequence of independent 60-minute sections, each with its own clock. That structure demands a different time strategy from a single three-hour exam.</p>
<h2>The two-pass approach</h2>
<p>In the first 40 minutes, answer every question you find easy or medium and skip anything that smells like a time-sink. In the next 15 minutes, return to flagged questions. Keep the final 5 minutes for review.</p>
<h2>Respect the optional-question rule</h2>
<p>Because you attempt 40 of ~50, you can drop the hardest few with no penalty. Do not let one stubborn question eat five minutes — that is five easy marks elsewhere.</p>
<h2>Section-specific pacing</h2>
<ul>
<li><strong>Languages:</strong> budget time per passage, not per question.</li>
<li><strong>Domain:</strong> numerical subjects need a steady pace; do not stall.</li>
<li><strong>General Test:</strong> reasoning is fast — bank time here for tougher sections.</li>
</ul>
<p>Rehearse the clock with full mocks on <a href="/mock">10minCUET</a>.</p>`,
  },
  {
    slug: "cuet-current-affairs-strategy-general-test",
    title: "A Current-Affairs System for the CUET General Test",
    description:
      "Current affairs feels infinite. Here is a lightweight, repeatable system to cover the last twelve months without drowning in news.",
    subject: "Topic Deep-Dive",
    category: "Topic Deep-Dive",
    tags: ["current affairs", "General Test", "GK", "CUET"],
    publishedAt: "2026-04-28",
    readingMinutes: 4,
    content: `<h1>A Current-Affairs System for the CUET General Test</h1>
<p>Current affairs is the most anxiety-inducing part of the General Test because it has no syllabus. The fix is a system, not more reading.</p>
<h2>The one-line-a-day note</h2>
<p>Each day, write a single line capturing the most exam-relevant event — a scheme, an award, a summit, a sports result. Over a year that is 365 high-yield facts in one place.</p>
<h2>Theme buckets</h2>
<p>Sort your notes into buckets: national schemes, awards and honours, sports, science and technology, and international summits. CUET questions cluster in these areas.</p>
<h2>Spaced revision</h2>
<p>Revise the last month weekly and the last year monthly. Pair current affairs with static GK so the two reinforce each other.</p>
<p>Test your retention with General Test sets on <a href="/topics">10minCUET</a>.</p>`,
  },
  {
    slug: "cuet-vs-board-exams-balancing-both",
    title: "CUET vs Board Exams: How to Prepare for Both at Once",
    description:
      "CUET draws from the same NCERT syllabus as your boards, but tests it differently. Here is how to prepare for both without doubling your workload.",
    subject: "Strategy",
    category: "Strategy",
    tags: ["CUET", "board exams", "Class 12", "NCERT", "strategy"],
    publishedAt: "2026-04-26",
    readingMinutes: 5,
    content: `<h1>CUET vs Board Exams: How to Prepare for Both at Once</h1>
<p>The good news: CUET domain papers and your Class 12 boards share the NCERT syllabus. The work overlaps more than it conflicts — if you understand the difference in format.</p>
<h2>Same content, different test</h2>
<p>Boards reward long-form writing and presentation; CUET rewards fast, accurate MCQ recognition. Your conceptual base serves both, but the output skill differs.</p>
<h2>One pass, two outputs</h2>
<p>Study each NCERT chapter once, deeply. Then practise it twice — once with board-style questions and once with timed MCQs. The second pass is where CUET marks are made.</p>
<h2>Sequencing the year</h2>
<p>Front-load NCERT mastery before the board exams, then pivot to intensive MCQ and mock practice for CUET in the weeks between boards and the CUET window.</p>
<p>Bridge the two with Bloom-level practice on <a href="/topics">10minCUET</a>.</p>`,
  },
];
