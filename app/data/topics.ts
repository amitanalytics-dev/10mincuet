import type { NCERTRef } from "./ncert-mapping";

export type SubConcept = {
  name: string;
  tip: string;
};

export type Topic = {
  name: string;
  avgQuestionsPerPaper: number;
  paperCoverage: number; // % of CUET papers (2022-2024) where it appeared
  yearsActive: string;
  difficulty: "Easy" | "Medium" | "Hard";
  marksContribution: number; // avg marks from this topic per paper
  subConcepts: SubConcept[];
  whyThisTopic: string;
  quickWin: string; // 1-line student tip
  targetClass?: "11" | "12" | "both"; // defaults to "both" when absent
  ncertRef?: NCERTRef;
  explanation?: string; // filled after batch generation
};

// CUET groups subjects into three section families:
//   "Languages"    → Section IA/IB (English etc.)
//   "General Test" → Section III
//   "Domain"       → Section II (27 subjects, grouped by stream below)
export type SubjectDomain = "Languages" | "General Test" | "Science" | "Commerce" | "Humanities";

export type Subject = {
  name: string;
  domain: SubjectDomain; // CUET section family / stream
  color: string;
  accent: string;
  totalQuestionsPerPaper: number; // CUET section size (~50, attempt ~40)
  cutoffMarks: number; // approx per-subject normalized cutoff
  topics: Topic[];
};

export const subjects: Subject[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // LANGUAGES (Section IA) — English
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: "English",
    domain: "Languages",
    color: "rose",
    accent: "#E11D48",
    totalQuestionsPerPaper: 50,
    cutoffMarks: 160,
    topics: [
      {
        name: "Reading Comprehension",
        avgQuestionsPerPaper: 12,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 60,
        whyThisTopic:
          "RC is the single largest chunk of the CUET English section — factual, literary and narrative passages each carry 5–6 questions. Speed-reading plus inference accuracy decides your English percentile.",
        quickWin: "Read the questions first, then scan. Most answers are 'directly stated' or 'one-step inference' — never over-think.",
        subConcepts: [
          { name: "Factual Passages", tip: "Answer lies in the text — locate the line, don't reason from outside knowledge" },
          { name: "Literary / Narrative Passages", tip: "Track tone, character and the author's attitude — mark emotive words" },
          { name: "Inference & Conclusion", tip: "Pick the option the passage *implies*, not the most dramatic one" },
          { name: "Main Idea & Title", tip: "The central theme runs through every paragraph; reject options that fit only one line" },
          { name: "Vocabulary in Context", tip: "Replace the word with each option and re-read the sentence" },
        ],
      },
      {
        name: "Grammar & Sentence Correction",
        avgQuestionsPerPaper: 10,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 50,
        whyThisTopic:
          "NTA tests core CBSE grammar — tense, subject-verb agreement, prepositions and narration. A fixed rule-set answers most questions, making this a high-accuracy zone.",
        quickWin: "Master subject-verb agreement and tense consistency — they cover the majority of error-spotting questions.",
        subConcepts: [
          { name: "Subject-Verb Agreement", tip: "Singular subject → singular verb; ignore words between subject and verb" },
          { name: "Tenses & Sequence", tip: "Keep tense consistent across a sentence unless time clearly shifts" },
          { name: "Articles & Prepositions", tip: "Learn fixed collocations (good at, married to, capable of) by heart" },
          { name: "Narration & Voice", tip: "Direct↔Indirect: shift tense back, change pronouns and time words" },
          { name: "Error Spotting", tip: "Read for the one rule violation; the rest of the sentence is a distractor" },
        ],
      },
      {
        name: "Vocabulary",
        avgQuestionsPerPaper: 9,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Easy",
        marksContribution: 45,
        whyThisTopic:
          "Synonyms, antonyms, one-word substitutions and idioms are pure recall — a strong word bank converts directly into marks with near-zero solving time.",
        quickWin: "Learn 20 high-frequency idioms and root words (bene-, mal-, -phobia). Roots let you decode unseen words.",
        subConcepts: [
          { name: "Synonyms & Antonyms", tip: "Use root words and prefixes to eliminate clearly-wrong options" },
          { name: "One-Word Substitution", tip: "Common ones repeat yearly — 'misanthrope', 'philanthropist', 'omnipotent'" },
          { name: "Idioms & Phrases", tip: "Never read literally; learn the figurative meaning" },
          { name: "Spelling & Word Usage", tip: "Watch commonly confused pairs: stationary/stationery, principal/principle" },
        ],
      },
      {
        name: "Verbal Ability",
        avgQuestionsPerPaper: 9,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 45,
        whyThisTopic:
          "Para-jumbles, sentence rearrangement and cloze tests reward logical sequencing of ideas — a skill that transfers across the whole English paper.",
        quickWin: "In para-jumbles, fix the opening sentence first, then chain pronouns and connectors.",
        subConcepts: [
          { name: "Para-jumbles / Rearrangement", tip: "Find the independent opening line, then follow 'this/that/such' links" },
          { name: "Cloze Test", tip: "Read the whole paragraph once for tone before filling any blank" },
          { name: "Sentence Completion", tip: "Watch contrast words (but, however) — they flip the expected meaning" },
          { name: "Coherence & Connectors", tip: "Therefore/however/moreover signal the logical relation between sentences" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // GENERAL TEST (Section III)
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: "General Test",
    domain: "General Test",
    color: "amber",
    accent: "#D97706",
    totalQuestionsPerPaper: 60,
    cutoffMarks: 190,
    topics: [
      {
        name: "Quantitative Aptitude",
        avgQuestionsPerPaper: 15,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 75,
        whyThisTopic:
          "Class 8-level arithmetic dominates the General Test — percentage, ratio, profit-loss and average. High weightage and fully formula-driven.",
        quickWin: "Drill percentage↔fraction conversions and the profit-loss base formula; they unlock half the quant questions.",
        subConcepts: [
          { name: "Percentage, Profit & Loss", tip: "CP is always the base; %profit = (SP−CP)/CP × 100" },
          { name: "Ratio, Proportion & Partnership", tip: "Convert ratios to a common total before dividing" },
          { name: "Average, Mixture & Alligation", tip: "Average = sum/count; use alligation for two-group mixtures" },
          { name: "Time, Speed & Distance", tip: "Speed = distance/time; keep units consistent (km/h vs m/s)" },
          { name: "Time & Work", tip: "Take total work as LCM of days; add per-day rates" },
          { name: "Simple & Compound Interest", tip: "SI is linear; CI compounds — for 2 yrs CI = SI + interest-on-interest" },
        ],
      },
      {
        name: "Logical & Analytical Reasoning",
        avgQuestionsPerPaper: 15,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 75,
        whyThisTopic:
          "Reasoning is the most scoring General Test block — pattern-based puzzles with definite answers and no syllabus to memorise.",
        quickWin: "For series and analogy, find the rule (×, +, square) on the first two terms, then verify forward.",
        subConcepts: [
          { name: "Series (Number & Letter)", tip: "Check differences, then ratios, then squares/cubes" },
          { name: "Analogy & Classification", tip: "State the relationship in words before matching options" },
          { name: "Coding-Decoding", tip: "Map letter↔position; look for +1/−1 shifts" },
          { name: "Blood Relations & Directions", tip: "Draw a family tree / compass — never solve in your head" },
          { name: "Seating Arrangement & Puzzles", tip: "Fix the certain clue first, then build outward" },
          { name: "Syllogism", tip: "Use Venn diagrams; 'some' and 'all' have strict logical rules" },
        ],
      },
      {
        name: "General Knowledge & Current Affairs",
        avgQuestionsPerPaper: 18,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 90,
        whyThisTopic:
          "Static GK plus the last 12 months of current affairs form the largest single block of the General Test — broad, but high-yield with consistent revision.",
        quickWin: "Maintain a one-line-a-day current-affairs note; revise national awards, sports and summits before the exam.",
        subConcepts: [
          { name: "Indian History & Freedom Struggle", tip: "Focus on movements, dates and personalities asked repeatedly" },
          { name: "Indian Polity & Constitution", tip: "Know Fundamental Rights, key Articles and constitutional bodies" },
          { name: "Geography (India & World)", tip: "Rivers, mountain ranges, states & capitals are recurring favourites" },
          { name: "Science & Everyday Technology", tip: "Basic biology, chemistry of daily life and recent ISRO missions" },
          { name: "Current Affairs (last 12 months)", tip: "National schemes, awards, sports events and summits" },
          { name: "Static GK (awards, books, sports)", tip: "Authors, Nobel/Padma awards and sports championships repeat yearly" },
        ],
      },
      {
        name: "General Mental Ability",
        avgQuestionsPerPaper: 12,
        paperCoverage: 95,
        yearsActive: "2022–2024",
        difficulty: "Easy",
        marksContribution: 60,
        whyThisTopic:
          "Numerical ability, data interpretation and simple geometry round out the General Test. Quick, mechanical questions ideal for boosting accuracy.",
        quickWin: "For DI, read the chart legend and units first; most questions are direct percentage or ratio reads.",
        subConcepts: [
          { name: "Number System & Simplification", tip: "Apply BODMAS; learn divisibility rules for fast elimination" },
          { name: "Data Interpretation (tables, charts)", tip: "Note units and totals before computing any value" },
          { name: "Mensuration (area, perimeter, volume)", tip: "Memorise area/volume formulas for circle, triangle, cuboid, cylinder" },
          { name: "Clocks & Calendars", tip: "Clock: 30° per hour, 6° per minute; calendar: odd-days method" },
          { name: "Permutation & Combination (basic)", tip: "Arrangement → P; selection → C; watch for 'at least/at most'" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DOMAIN — SCIENCE STREAM
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: "Physics",
    domain: "Science",
    color: "blue",
    accent: "#3B82F6",
    totalQuestionsPerPaper: 50,
    cutoffMarks: 170,
    topics: [
      {
        name: "Electrostatics & Capacitance",
        avgQuestionsPerPaper: 4,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 20,
        whyThisTopic:
          "Class 12 NCERT electrostatics is a CUET staple — Coulomb's law, Gauss's law and capacitors give predictable, formula-based questions.",
        quickWin: "Master Gauss's law geometries and the parallel-plate capacitor with dielectric — two near-guaranteed questions.",
        subConcepts: [
          { name: "Coulomb's Law & Electric Field", tip: "Vector-add fields from multiple charges; E points away from +q" },
          { name: "Gauss's Law", tip: "Pick the right Gaussian surface; know field for shell, wire and plane" },
          { name: "Electric Potential & Potential Energy", tip: "V = kQ/r is scalar; W = q(V_A − V_B)" },
          { name: "Capacitors & Dielectrics", tip: "C = κε₀A/d; series adds reciprocals, parallel adds directly" },
        ],
      },
      {
        name: "Current Electricity",
        avgQuestionsPerPaper: 3,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 15,
        whyThisTopic:
          "Ohm's law, Kirchhoff's rules and the Wheatstone bridge are NCERT favourites with a high marks-per-hour ratio.",
        quickWin: "Practise Kirchhoff loops on 5 circuits and the balanced Wheatstone condition P/Q = R/S.",
        subConcepts: [
          { name: "Ohm's Law & Resistance Combinations", tip: "Series adds R; parallel adds 1/R" },
          { name: "Kirchhoff's Laws", tip: "KCL at junctions, KVL around loops; assign current directions and stick to them" },
          { name: "Wheatstone Bridge & Meter Bridge", tip: "Balanced when P/Q = R/S — no current through galvanometer" },
          { name: "Electrical Power & Heating", tip: "P = I²R = V²/R; convert between all three forms" },
        ],
      },
      {
        name: "Magnetism & EMI",
        avgQuestionsPerPaper: 3,
        paperCoverage: 95,
        yearsActive: "2022–2024",
        difficulty: "Hard",
        marksContribution: 15,
        whyThisTopic:
          "Moving charges, magnetism and electromagnetic induction connect into AC circuits — a recurring CUET cluster.",
        quickWin: "Lenz's law for direction + motional EMF (BLv) cover most induction questions.",
        subConcepts: [
          { name: "Magnetic Force on Charge & Wire", tip: "F = qvB sinθ; F = BIL for a current-carrying wire" },
          { name: "Faraday's & Lenz's Law", tip: "EMF = −dΦ/dt; induced current opposes the change" },
          { name: "Self & Mutual Inductance", tip: "Energy stored = ½LI²" },
          { name: "AC & LCR Circuits", tip: "At resonance X_L = X_C, impedance = R" },
        ],
      },
      {
        name: "Optics",
        avgQuestionsPerPaper: 3,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 15,
        whyThisTopic:
          "Ray and wave optics appear every year — lens/mirror formula, refraction and Young's double-slit are standard.",
        quickWin: "Know the lens formula sign convention and YDSE fringe width β = λD/d.",
        subConcepts: [
          { name: "Reflection & Mirror Formula", tip: "1/v + 1/u = 1/f; apply the sign convention strictly" },
          { name: "Refraction & Lens Formula", tip: "n = sin i / sin r; lens-maker's formula for combinations" },
          { name: "Total Internal Reflection", tip: "Occurs beyond critical angle sinθc = 1/n" },
          { name: "Young's Double Slit Experiment", tip: "Fringe width β = λD/d; bright fringes at path diff = nλ" },
        ],
      },
      {
        name: "Modern Physics",
        avgQuestionsPerPaper: 3,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Easy",
        marksContribution: 15,
        whyThisTopic:
          "Dual nature, atoms, nuclei and semiconductors are formula-light and high-yield — excellent marks-per-hour.",
        quickWin: "Six formulas (photoelectric, Bohr energy, de Broglie, half-life) cover most questions.",
        subConcepts: [
          { name: "Photoelectric Effect", tip: "KE_max = hν − φ; stopping potential eV₀ = KE_max" },
          { name: "Bohr Model & Atomic Spectra", tip: "E_n = −13.6/n² eV; rₙ = n²a₀" },
          { name: "Nuclei & Radioactivity", tip: "N = N₀(½)^(t/T); Q = Δm × 931.5 MeV" },
          { name: "Semiconductors & Logic Gates", tip: "Diode conducts in forward bias; know AND/OR/NOT truth tables" },
        ],
      },
    ],
  },
  {
    name: "Chemistry",
    domain: "Science",
    color: "green",
    accent: "#10B981",
    totalQuestionsPerPaper: 50,
    cutoffMarks: 170,
    topics: [
      {
        name: "Chemical Bonding & Structure",
        avgQuestionsPerPaper: 3,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 15,
        whyThisTopic:
          "VSEPR shapes, hybridisation and bond polarity are conceptual but rule-based — reliable CUET marks every year.",
        quickWin: "Learn VSEPR geometries up to 6 electron pairs and hybridisation by counting σ-bonds + lone pairs.",
        subConcepts: [
          { name: "Ionic & Covalent Bonding", tip: "Electronegativity difference decides bond character" },
          { name: "VSEPR & Molecular Geometry", tip: "Count bond pairs + lone pairs to predict shape" },
          { name: "Hybridisation", tip: "σ-bonds + lone pairs = steric number → sp/sp²/sp³" },
          { name: "Molecular Orbital Theory", tip: "Bond order = (Nb − Na)/2; predicts magnetism of O₂" },
        ],
      },
      {
        name: "Equilibrium & Thermodynamics",
        avgQuestionsPerPaper: 3,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 15,
        whyThisTopic:
          "Chemical and ionic equilibrium plus thermodynamics give numerical questions with clear formulas — high accuracy zone.",
        quickWin: "Le Chatelier's principle plus Kc/Kp relation answer most equilibrium questions.",
        subConcepts: [
          { name: "Chemical Equilibrium & Kc/Kp", tip: "Kp = Kc(RT)^Δn; Le Chatelier predicts shift direction" },
          { name: "Ionic Equilibrium & pH", tip: "pH = −log[H⁺]; for buffers use Henderson equation" },
          { name: "First Law & Enthalpy", tip: "ΔU = q + W; Hess's law for enthalpy of reaction" },
          { name: "Spontaneity & Gibbs Energy", tip: "ΔG = ΔH − TΔS; spontaneous when ΔG < 0" },
        ],
      },
      {
        name: "Electrochemistry & Kinetics",
        avgQuestionsPerPaper: 3,
        paperCoverage: 95,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 15,
        whyThisTopic:
          "Nernst equation, cell EMF and rate laws are formula-driven and appear in nearly every CUET Chemistry paper.",
        quickWin: "Memorise the Nernst equation and the first-order rate expression.",
        subConcepts: [
          { name: "Electrochemical Cells & EMF", tip: "E°cell = E°cathode − E°anode" },
          { name: "Nernst Equation & Conductance", tip: "E = E° − (0.059/n)log Q at 298 K" },
          { name: "Rate Law & Order", tip: "Rate = k[A]^m[B]^n; order is experimental" },
          { name: "First-Order Kinetics & Half-Life", tip: "t½ = 0.693/k for first order" },
        ],
      },
      {
        name: "Organic Chemistry",
        avgQuestionsPerPaper: 4,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Hard",
        marksContribution: 20,
        whyThisTopic:
          "GOC, hydrocarbons and functional groups carry the most Domain weight — reaction mechanisms decide your Chemistry score.",
        quickWin: "Master inductive/resonance effects and the major named reactions (Markovnikov, aldol, Cannizzaro).",
        subConcepts: [
          { name: "GOC: Inductive, Resonance, Hyperconjugation", tip: "Stability of carbocations/carbanions follows these effects" },
          { name: "Hydrocarbons & Reaction Mechanisms", tip: "Markovnikov vs anti-Markovnikov addition" },
          { name: "Alcohols, Aldehydes & Acids", tip: "Know oxidation ladder and carbonyl reactions" },
          { name: "Amines & Biomolecules", tip: "Basicity of amines; carbohydrate and protein basics" },
        ],
      },
      {
        name: "Inorganic Chemistry",
        avgQuestionsPerPaper: 3,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 15,
        whyThisTopic:
          "Periodic trends, p-block and coordination compounds are recall-heavy and reward systematic revision.",
        quickWin: "Learn periodic trends (size, IE, electronegativity) and the crystal-field colour/magnetism logic.",
        subConcepts: [
          { name: "Periodic Trends", tip: "Atomic size decreases across, increases down; IE opposite" },
          { name: "p-Block Elements", tip: "Group anomalies and oxidation states repeat yearly" },
          { name: "d & f Block / Transition Metals", tip: "Variable oxidation states and coloured ions" },
          { name: "Coordination Compounds", tip: "Use crystal-field theory for colour and magnetism" },
        ],
      },
    ],
  },
  {
    name: "Biology",
    domain: "Science",
    color: "emerald",
    accent: "#059669",
    totalQuestionsPerPaper: 50,
    cutoffMarks: 175,
    topics: [
      {
        name: "Cell Biology & Genetics",
        avgQuestionsPerPaper: 5,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 25,
        whyThisTopic:
          "Cell structure, division and Mendelian genetics form the conceptual core of CUET Biology with consistently high weightage.",
        quickWin: "Master meiosis phases and monohybrid/dihybrid ratios — they answer most genetics questions.",
        subConcepts: [
          { name: "Cell Structure & Organelles", tip: "Know functions of mitochondria, ER, Golgi, ribosomes" },
          { name: "Cell Cycle & Division", tip: "Mitosis = 2 identical cells; meiosis = 4 with crossing over" },
          { name: "Mendelian Genetics", tip: "Monohybrid 3:1, dihybrid 9:3:3:1" },
          { name: "Molecular Basis of Inheritance", tip: "DNA → RNA → protein; central dogma and replication" },
        ],
      },
      {
        name: "Human Physiology",
        avgQuestionsPerPaper: 5,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 25,
        whyThisTopic:
          "Digestion, circulation, respiration and the nervous system are heavily tested NCERT chapters with diagram-based recall.",
        quickWin: "Learn the labelled diagrams (heart, nephron, neuron) — CUET asks structure-function matches.",
        subConcepts: [
          { name: "Digestion & Absorption", tip: "Enzyme-substrate pairs and where each acts" },
          { name: "Circulation & Breathing", tip: "Double circulation; oxygen transport via haemoglobin" },
          { name: "Excretion & Nephron", tip: "Filtration, reabsorption, secretion in the nephron" },
          { name: "Neural & Chemical Control", tip: "Reflex arc; major hormones and their glands" },
        ],
      },
      {
        name: "Plant Physiology",
        avgQuestionsPerPaper: 4,
        paperCoverage: 95,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 20,
        whyThisTopic:
          "Photosynthesis, respiration and plant transport are concept-plus-recall chapters that recur every CUET cycle.",
        quickWin: "Know the light and dark reactions of photosynthesis and the C3/C4 distinction.",
        subConcepts: [
          { name: "Photosynthesis", tip: "Light reactions in thylakoid; Calvin cycle in stroma" },
          { name: "Respiration in Plants", tip: "Glycolysis → Krebs → ETC; net ATP count" },
          { name: "Transport in Plants", tip: "Transpiration pull; xylem vs phloem function" },
          { name: "Plant Growth & Hormones", tip: "Auxin, gibberellin, cytokinin roles" },
        ],
      },
      {
        name: "Ecology & Environment",
        avgQuestionsPerPaper: 4,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Easy",
        marksContribution: 20,
        whyThisTopic:
          "Ecosystems, biodiversity and environmental issues are scoring, recall-based chapters — low effort, steady marks.",
        quickWin: "Learn ecological pyramids and the nitrogen/carbon cycles for quick wins.",
        subConcepts: [
          { name: "Ecosystem & Energy Flow", tip: "10% energy transfer rule across trophic levels" },
          { name: "Biodiversity & Conservation", tip: "In-situ vs ex-situ; hotspots and red-list categories" },
          { name: "Population & Ecology", tip: "Exponential vs logistic growth curves" },
          { name: "Environmental Issues", tip: "Greenhouse gases, ozone depletion, eutrophication" },
        ],
      },
      {
        name: "Biotechnology & Human Welfare",
        avgQuestionsPerPaper: 4,
        paperCoverage: 95,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 20,
        whyThisTopic:
          "rDNA technology, microbes and human health are modern, application-oriented chapters tested every CUET year.",
        quickWin: "Understand the steps of recombinant DNA technology and common biotech tools (PCR, restriction enzymes).",
        subConcepts: [
          { name: "Recombinant DNA Technology", tip: "Restriction enzymes cut, ligase joins, vector carries the gene" },
          { name: "Microbes in Human Welfare", tip: "Microbes in food, antibiotics and sewage treatment" },
          { name: "Human Health & Disease", tip: "Pathogen-disease pairs and immune response basics" },
          { name: "Reproductive Health", tip: "Contraception methods and assisted reproductive tech" },
        ],
      },
    ],
  },
  {
    name: "Mathematics",
    domain: "Science",
    color: "indigo",
    accent: "#6366F1",
    totalQuestionsPerPaper: 50,
    cutoffMarks: 165,
    topics: [
      {
        name: "Calculus",
        avgQuestionsPerPaper: 6,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 30,
        whyThisTopic:
          "Limits, derivatives and integrals are the largest Mathematics block in CUET — both conceptual and high-weight.",
        quickWin: "Master standard derivatives/integrals and the application-of-derivatives sign test for maxima/minima.",
        subConcepts: [
          { name: "Limits & Continuity", tip: "Factor, rationalise or use L'Hôpital for 0/0 forms" },
          { name: "Differentiation", tip: "Product, quotient and chain rules cover most problems" },
          { name: "Application of Derivatives", tip: "f'=0 for critical points; f'' sign for maxima/minima" },
          { name: "Integration & Area", tip: "Reverse standard derivatives; substitution and by-parts" },
        ],
      },
      {
        name: "Algebra",
        avgQuestionsPerPaper: 5,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 25,
        whyThisTopic:
          "Matrices, determinants and complex numbers are formula-driven with mechanical solution paths — reliable marks.",
        quickWin: "Determinant properties (row operations) and A⁻¹ = adj(A)/|A| answer most matrix questions.",
        subConcepts: [
          { name: "Matrices & Determinants", tip: "|AB| = |A||B|; A⁻¹ exists iff |A| ≠ 0" },
          { name: "Complex Numbers", tip: "|z|² = z·z̄; argument adds on multiplication" },
          { name: "Quadratic Equations", tip: "Sum = −b/a, product = c/a; discriminant decides roots" },
          { name: "Sequences & Series", tip: "AP sum = n/2(2a+(n−1)d); GP sum = a(rⁿ−1)/(r−1)" },
        ],
      },
      {
        name: "Coordinate Geometry & Vectors",
        avgQuestionsPerPaper: 4,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 20,
        whyThisTopic:
          "Straight lines, conics and 3D vectors give standard, formula-based questions that recur every CUET paper.",
        quickWin: "Learn line forms, conic standard equations and the vector dot/cross product geometry.",
        subConcepts: [
          { name: "Straight Lines & Circles", tip: "Slope forms; circle (x−h)²+(y−k)²=r²" },
          { name: "Conic Sections", tip: "Parabola y²=4ax; ellipse and hyperbola eccentricity" },
          { name: "Vectors", tip: "Dot product for angle; cross product for area/perpendicular" },
          { name: "3D Geometry", tip: "Direction cosines; line and plane equations" },
        ],
      },
      {
        name: "Probability & Statistics",
        avgQuestionsPerPaper: 4,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 20,
        whyThisTopic:
          "Probability (including Bayes' theorem) and statistics are mechanical once the question type is identified.",
        quickWin: "Bayes' theorem and binomial distribution mean/variance cover most probability questions.",
        subConcepts: [
          { name: "Probability & Conditional Probability", tip: "P(A|B) = P(A∩B)/P(B)" },
          { name: "Bayes' Theorem", tip: "Use a tree diagram to organise the conditional paths" },
          { name: "Random Variables & Distributions", tip: "Binomial mean = np, variance = npq" },
          { name: "Measures of Central Tendency", tip: "Mean, median, mode and standard deviation formulas" },
        ],
      },
      {
        name: "Relations, Functions & Trigonometry",
        avgQuestionsPerPaper: 4,
        paperCoverage: 95,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 20,
        whyThisTopic:
          "Relations, inverse trig and identities provide conceptual and formula-based questions across CUET papers.",
        quickWin: "Memorise trig identities and inverse-trig principal value ranges.",
        subConcepts: [
          { name: "Relations & Functions", tip: "Check one-one (injective) and onto (surjective) carefully" },
          { name: "Inverse Trigonometric Functions", tip: "Know principal value branches for each function" },
          { name: "Trigonometric Identities", tip: "sin²+cos²=1; compound and multiple-angle formulas" },
          { name: "Linear Equations via Matrices", tip: "Solve AX = B using A⁻¹ when |A| ≠ 0" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DOMAIN — COMMERCE STREAM
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: "Accountancy",
    domain: "Commerce",
    color: "teal",
    accent: "#14B8A6",
    totalQuestionsPerPaper: 50,
    cutoffMarks: 165,
    topics: [
      {
        name: "Partnership Accounts",
        avgQuestionsPerPaper: 6,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 30,
        whyThisTopic:
          "Partnership — fundamentals, admission, retirement and dissolution — is the single largest CUET Accountancy block.",
        quickWin: "Master the revaluation account and goodwill treatment on admission/retirement.",
        subConcepts: [
          { name: "Partnership Fundamentals", tip: "Profit-sharing ratio, interest on capital, drawings" },
          { name: "Goodwill Valuation", tip: "Average-profit, super-profit and capitalisation methods" },
          { name: "Admission & Retirement", tip: "Sacrificing vs gaining ratio; revaluation of assets" },
          { name: "Dissolution of Firm", tip: "Realisation account closes all assets and liabilities" },
        ],
      },
      {
        name: "Company Accounts",
        avgQuestionsPerPaper: 5,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 25,
        whyThisTopic:
          "Share and debenture accounting are format-and-entry questions — high accuracy once journal entries are learnt.",
        quickWin: "Learn the journal entries for share issue, forfeiture and re-issue.",
        subConcepts: [
          { name: "Issue of Shares", tip: "At par/premium; application, allotment, calls" },
          { name: "Forfeiture & Re-issue", tip: "Forfeit unpaid shares; balance to capital reserve" },
          { name: "Issue & Redemption of Debentures", tip: "Debenture issue at discount/premium and redemption" },
          { name: "Financial Statements of Companies", tip: "Schedule III format of Balance Sheet" },
        ],
      },
      {
        name: "Financial Statement Analysis",
        avgQuestionsPerPaper: 5,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 25,
        whyThisTopic:
          "Ratio analysis and cash-flow statements give computation-based questions with definite answers.",
        quickWin: "Memorise the key liquidity, solvency and profitability ratios and the cash-flow categories.",
        subConcepts: [
          { name: "Accounting Ratios", tip: "Current ratio, debt-equity, gross/net profit margin" },
          { name: "Cash Flow Statement", tip: "Operating, investing and financing activities" },
          { name: "Comparative & Common-Size Statements", tip: "Express items as % of revenue/total" },
          { name: "Tools of Analysis", tip: "Trend analysis and the purpose of each tool" },
        ],
      },
      {
        name: "Not-for-Profit & Accounting Basics",
        avgQuestionsPerPaper: 4,
        paperCoverage: 95,
        yearsActive: "2022–2024",
        difficulty: "Easy",
        marksContribution: 20,
        whyThisTopic:
          "NPO accounts and accounting basics are scoring, format-driven chapters — quick marks for the prepared student.",
        quickWin: "Distinguish receipts-and-payments from income-and-expenditure accounts.",
        subConcepts: [
          { name: "Receipts & Payments Account", tip: "Cash summary — all receipts and payments, any period" },
          { name: "Income & Expenditure Account", tip: "Accrual basis; only revenue items of current year" },
          { name: "Accounting Concepts & Principles", tip: "Going concern, accrual, prudence, consistency" },
          { name: "Computerised Accounting", tip: "Basics of accounting software and databases" },
        ],
      },
    ],
  },
  {
    name: "Business Studies",
    domain: "Commerce",
    color: "cyan",
    accent: "#06B6D4",
    totalQuestionsPerPaper: 50,
    cutoffMarks: 165,
    topics: [
      {
        name: "Principles & Functions of Management",
        avgQuestionsPerPaper: 6,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 30,
        whyThisTopic:
          "Nature of management, principles (Fayol, Taylor) and the functions form the conceptual backbone of CUET Business Studies.",
        quickWin: "Learn Fayol's 14 principles and Taylor's scientific management techniques by keyword.",
        subConcepts: [
          { name: "Nature & Importance of Management", tip: "Management as art, science and profession" },
          { name: "Fayol's & Taylor's Principles", tip: "Fayol = general principles; Taylor = scientific techniques" },
          { name: "Planning & Organising", tip: "Planning is futuristic; organising assigns authority" },
          { name: "Staffing, Directing & Controlling", tip: "Controlling compares actual vs planned performance" },
        ],
      },
      {
        name: "Business Environment & Finance",
        avgQuestionsPerPaper: 5,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 25,
        whyThisTopic:
          "Business environment, financial management and markets are application-based and heavily tested.",
        quickWin: "Know the dimensions of business environment and the factors affecting capital structure.",
        subConcepts: [
          { name: "Business Environment", tip: "Economic, social, political, legal, technological dimensions" },
          { name: "Financial Management", tip: "Objective = wealth maximisation; capital structure decisions" },
          { name: "Financial Markets", tip: "Money market vs capital market; SEBI's role" },
          { name: "Sources of Business Finance", tip: "Owners' funds vs borrowed funds" },
        ],
      },
      {
        name: "Marketing Management",
        avgQuestionsPerPaper: 5,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 25,
        whyThisTopic:
          "The marketing mix (4 Ps) and consumer protection are scoring, definition-and-application chapters.",
        quickWin: "Master the 4 Ps and the consumer rights/responsibilities under the Consumer Protection Act.",
        subConcepts: [
          { name: "Marketing Mix (4 Ps)", tip: "Product, Price, Place, Promotion" },
          { name: "Promotion & Advertising", tip: "Advertising, personal selling, sales promotion, publicity" },
          { name: "Consumer Protection", tip: "Consumer rights and redressal machinery" },
          { name: "Pricing & Channels", tip: "Factors affecting price; levels of distribution channels" },
        ],
      },
      {
        name: "Business & Entrepreneurship Basics",
        avgQuestionsPerPaper: 4,
        paperCoverage: 95,
        yearsActive: "2022–2024",
        difficulty: "Easy",
        marksContribution: 20,
        whyThisTopic:
          "Forms of business, entrepreneurship and emerging modes of business are recall-friendly, scoring chapters.",
        quickWin: "Compare sole proprietorship, partnership and company on liability and continuity.",
        subConcepts: [
          { name: "Forms of Business Organisation", tip: "Liability, continuity and control differ by form" },
          { name: "Entrepreneurship Development", tip: "Functions and competencies of an entrepreneur" },
          { name: "Emerging Modes of Business", tip: "e-business, outsourcing and BPO/KPO" },
          { name: "Social Responsibility & Ethics", tip: "Responsibility towards stakeholders and society" },
        ],
      },
    ],
  },
  {
    name: "Economics",
    domain: "Commerce",
    color: "lime",
    accent: "#65A30D",
    totalQuestionsPerPaper: 50,
    cutoffMarks: 165,
    topics: [
      {
        name: "Microeconomics",
        avgQuestionsPerPaper: 6,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 30,
        whyThisTopic:
          "Demand, supply, elasticity and market forms are the conceptual heart of CUET Economics with the most weight.",
        quickWin: "Master the law of demand, elasticity formula and equilibrium price determination.",
        subConcepts: [
          { name: "Demand & Elasticity", tip: "Ed = %ΔQ/%ΔP; demand slopes downward" },
          { name: "Production & Cost", tip: "TC = TFC + TVC; law of variable proportions" },
          { name: "Market Equilibrium", tip: "Equilibrium where demand = supply" },
          { name: "Forms of Market", tip: "Perfect competition, monopoly, monopolistic, oligopoly" },
        ],
      },
      {
        name: "Macroeconomics",
        avgQuestionsPerPaper: 6,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 30,
        whyThisTopic:
          "National income, money, banking and government budget are formula-and-concept chapters tested every CUET year.",
        quickWin: "Learn the national income aggregates (GDP, GNP, NNP) and the money multiplier.",
        subConcepts: [
          { name: "National Income Aggregates", tip: "GDP, GNP, NNP; income/expenditure/value-added methods" },
          { name: "Money & Banking", tip: "Functions of money; credit creation by banks" },
          { name: "Income Determination", tip: "AD = AS at equilibrium; multiplier = 1/(1−MPC)" },
          { name: "Government Budget & Economy", tip: "Revenue vs capital; fiscal deficit" },
        ],
      },
      {
        name: "Indian Economic Development",
        avgQuestionsPerPaper: 5,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Easy",
        marksContribution: 25,
        whyThisTopic:
          "Indian economy since independence, reforms and current challenges are recall-heavy and high-scoring.",
        quickWin: "Know the 1991 reforms (LPG) and major Five-Year-Plan objectives.",
        subConcepts: [
          { name: "Economy on the Eve of Independence", tip: "Colonial impact on agriculture and industry" },
          { name: "Economic Reforms since 1991", tip: "Liberalisation, Privatisation, Globalisation (LPG)" },
          { name: "Poverty & Human Capital", tip: "Poverty line; role of education and health" },
          { name: "Employment & Infrastructure", tip: "Formal vs informal sector; infrastructure types" },
        ],
      },
      {
        name: "Statistics & Development Issues",
        avgQuestionsPerPaper: 4,
        paperCoverage: 95,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 20,
        whyThisTopic:
          "Statistics for economics and current development issues give computational and analytical CUET questions.",
        quickWin: "Master mean, median, mode and index numbers for the statistics questions.",
        subConcepts: [
          { name: "Measures of Central Tendency", tip: "Mean, median, mode for grouped/ungrouped data" },
          { name: "Index Numbers", tip: "Price index measures cost-of-living change" },
          { name: "Correlation & Dispersion", tip: "Correlation direction; range and standard deviation" },
          { name: "Sustainable Development", tip: "Environment and intergenerational equity" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // DOMAIN — HUMANITIES STREAM
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: "History",
    domain: "Humanities",
    color: "orange",
    accent: "#EA580C",
    totalQuestionsPerPaper: 50,
    cutoffMarks: 160,
    topics: [
      {
        name: "Ancient India",
        avgQuestionsPerPaper: 5,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 25,
        whyThisTopic:
          "Harappan civilisation, Mauryan and Gupta empires and early sources are foundational CUET History topics.",
        quickWin: "Learn Harappan town planning and the Mauryan administration (Ashoka's edicts).",
        subConcepts: [
          { name: "Harappan Civilisation", tip: "Town planning, drainage, seals and trade" },
          { name: "Vedic Age & Early States", tip: "Mahajanapadas; transition to early kingdoms" },
          { name: "Mauryan Empire", tip: "Ashoka's edicts and dhamma policy" },
          { name: "Gupta Age & Culture", tip: "Golden age — science, art and literature" },
        ],
      },
      {
        name: "Medieval India",
        avgQuestionsPerPaper: 5,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 25,
        whyThisTopic:
          "Delhi Sultanate, the Mughals and Bhakti-Sufi movements are heavily tested with source-based recall.",
        quickWin: "Track Mughal administration (mansabdari, zabt) and the Bhakti-Sufi saints.",
        subConcepts: [
          { name: "Delhi Sultanate", tip: "Major dynasties and administrative reforms" },
          { name: "Mughal Empire", tip: "Mansabdari and zabt revenue systems" },
          { name: "Bhakti & Sufi Movements", tip: "Saints, ideas and social impact" },
          { name: "Vijayanagara & Regional States", tip: "Hampi architecture and administration" },
        ],
      },
      {
        name: "Modern India & Freedom Struggle",
        avgQuestionsPerPaper: 6,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 30,
        whyThisTopic:
          "Colonialism, the 1857 revolt, the national movement and Partition carry the highest CUET History weight.",
        quickWin: "Sequence the national movement (Non-cooperation → Civil Disobedience → Quit India) with dates.",
        subConcepts: [
          { name: "Colonialism & 1857 Revolt", tip: "Causes, course and consequences of 1857" },
          { name: "Indian National Movement", tip: "Phases of the Congress-led struggle" },
          { name: "Gandhian Era", tip: "Non-cooperation, Civil Disobedience, Quit India" },
          { name: "Partition & Independence", tip: "Towards 1947 — Mountbatten plan and Partition" },
        ],
      },
    ],
  },
  {
    name: "Geography",
    domain: "Humanities",
    color: "sky",
    accent: "#0EA5E9",
    totalQuestionsPerPaper: 50,
    cutoffMarks: 160,
    topics: [
      {
        name: "Physical Geography",
        avgQuestionsPerPaper: 6,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 30,
        whyThisTopic:
          "Geomorphology, climatology and oceanography form the conceptual core of CUET Geography.",
        quickWin: "Learn landform processes and the global pressure-and-wind belts.",
        subConcepts: [
          { name: "Geomorphology", tip: "Earth's interior, plate tectonics, landforms" },
          { name: "Climatology", tip: "Atmosphere layers, pressure belts, winds" },
          { name: "Oceanography", tip: "Ocean currents, salinity, relief features" },
          { name: "Biogeography", tip: "Soils, natural vegetation and biomes" },
        ],
      },
      {
        name: "Human & Economic Geography",
        avgQuestionsPerPaper: 5,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 25,
        whyThisTopic:
          "Population, settlements and economic activities connect physical geography to human use — recurring CUET themes.",
        quickWin: "Know the demographic transition model and the classification of economic activities.",
        subConcepts: [
          { name: "Population & Migration", tip: "Demographic transition; density and growth" },
          { name: "Human Settlements", tip: "Rural-urban classification and functions" },
          { name: "Economic Activities", tip: "Primary, secondary, tertiary, quaternary" },
          { name: "Transport & Trade", tip: "Networks and international trade patterns" },
        ],
      },
      {
        name: "Geography of India",
        avgQuestionsPerPaper: 5,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Easy",
        marksContribution: 25,
        whyThisTopic:
          "India's physiography, resources and agriculture are recall-heavy, high-scoring CUET chapters.",
        quickWin: "Memorise India's physiographic divisions, major rivers and crop regions.",
        subConcepts: [
          { name: "Physiography of India", tip: "Himalayas, plains, plateau, coasts, islands" },
          { name: "Drainage & Climate", tip: "Himalayan vs peninsular rivers; monsoon mechanism" },
          { name: "Resources & Agriculture", tip: "Soil types and major cropping patterns" },
          { name: "Industries & Map Work", tip: "Industrial regions; locate features on the map" },
        ],
      },
    ],
  },
  {
    name: "Political Science",
    domain: "Humanities",
    color: "violet",
    accent: "#8B5CF6",
    totalQuestionsPerPaper: 50,
    cutoffMarks: 160,
    topics: [
      {
        name: "Indian Constitution & Politics",
        avgQuestionsPerPaper: 6,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 30,
        whyThisTopic:
          "The Constitution, rights and the organs of government are the most heavily tested CUET Political Science block.",
        quickWin: "Master Fundamental Rights, the Directive Principles and the structure of the three organs.",
        subConcepts: [
          { name: "Constitution & Philosophy", tip: "Preamble, features and making of the Constitution" },
          { name: "Fundamental Rights & Duties", tip: "Six fundamental rights and key Articles" },
          { name: "Executive, Legislature & Judiciary", tip: "Powers and relations of the three organs" },
          { name: "Federalism & Local Government", tip: "Centre-state relations; Panchayati Raj" },
        ],
      },
      {
        name: "Political Theory",
        avgQuestionsPerPaper: 5,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 25,
        whyThisTopic:
          "Core concepts — liberty, equality, justice, rights — are definition-and-analysis questions tested every year.",
        quickWin: "Learn the meanings and inter-relations of liberty, equality and justice.",
        subConcepts: [
          { name: "Liberty & Freedom", tip: "Negative vs positive liberty" },
          { name: "Equality & Justice", tip: "Equality of opportunity; distributive justice" },
          { name: "Rights & Citizenship", tip: "Legal vs moral rights; citizenship debates" },
          { name: "Secularism & Democracy", tip: "Indian model of secularism" },
        ],
      },
      {
        name: "International Relations & Contemporary World",
        avgQuestionsPerPaper: 5,
        paperCoverage: 100,
        yearsActive: "2022–2024",
        difficulty: "Medium",
        marksContribution: 25,
        whyThisTopic:
          "Cold War, the post-1991 world order and India's foreign policy are current-affairs-linked, high-yield topics.",
        quickWin: "Trace the Cold War to the unipolar world and India's non-alignment stance.",
        subConcepts: [
          { name: "Cold War Era", tip: "Bipolarity, blocs and the Non-Aligned Movement" },
          { name: "Post-Cold War World", tip: "US hegemony and rise of new centres of power" },
          { name: "India's Foreign Policy", tip: "Non-alignment, nuclear policy and neighbours" },
          { name: "International Organisations", tip: "UN, its organs and global governance" },
        ],
      },
    ],
  },
];

export function getCoveragePercent(subject: Subject): number {
  const totalMarks = subject.totalQuestionsPerPaper * 5; // CUET: +5 per correct
  const topicMarks = subject.topics.reduce((s, t) => s + t.marksContribution, 0);
  return Math.min(100, Math.round((topicMarks / totalMarks) * 100));
}
