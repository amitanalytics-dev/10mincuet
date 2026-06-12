"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Analytics } from "../lib/analytics";

// ─── Types ────────────────────────────────────────────────────────────────────

type DiagQuestion = {
  id: string;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
  subject: "Languages" | "Domain" | "General Test";
  topicSlug: string;
  subConcept: string;
};

type UserAnswer = number | null; // index into options, or null = skipped

type Phase = "intro" | "test" | "results" | "saving";

// ─── Question bank — 5 per subject, 15 total ─────────────────────────────────
// Class 11 → Class 11-leaning topics (Laws of Motion, Waves, Bonding, Equilibrium, LCD, Sequences)
// Class 12 → Class 12 topics (Electrostatics, EMI, Coordination, Electrochemistry, Integration, Probability)
// Dropper  → Full spread across both years

const QUESTIONS_BY_CLASS: Record<
  "11" | "12" | "dropper",
  DiagQuestion[]
> = {
  "11": [
    // ── Physics (Class 11 topics) ──────────────────────────────────────
    {
      id: "diag-p1",
      text: "A 5 kg block on a frictionless surface is pushed by a 20 N force. Acceleration is:",
      options: ["4 m/s²", "100 m/s²", "0.25 m/s²", "25 m/s²"],
      correct: 0,
      explanation: "F = ma → a = 20/5 = 4 m/s².",
      subject: "Languages",
      topicSlug: "laws-of-motion-and-work-energy",
      subConcept: "Newton's Laws + FBD",
    },
    {
      id: "diag-p2",
      text: "A spring of constant k = 200 N/m is compressed by 0.1 m. Potential energy stored is:",
      options: ["1 J", "2 J", "0.5 J", "20 J"],
      correct: 0,
      explanation: "PE = ½kx² = ½ × 200 × (0.1)² = 1 J.",
      subject: "Languages",
      topicSlug: "laws-of-motion-and-work-energy",
      subConcept: "Spring force & Potential Energy",
    },
    {
      id: "diag-p3",
      text: "Two sources of frequency 400 Hz and 404 Hz produce sound. Beats heard per second are:",
      options: ["4", "2", "404", "800"],
      correct: 0,
      explanation: "Beats/s = |f₁ − f₂| = |404 − 400| = 4.",
      subject: "Languages",
      topicSlug: "waves-and-shm",
      subConcept: "Beats & Resonance (open/closed pipes)",
    },
    {
      id: "diag-p4",
      text: "Moment of inertia of a thin circular disc of mass M and radius R about its central axis is:",
      options: ["MR²", "½MR²", "2MR²/3", "2MR²/5"],
      correct: 1,
      explanation: "For a disc: I = ½MR².",
      subject: "Languages",
      topicSlug: "rotational-motion",
      subConcept: "Moment of Inertia (standard bodies)",
    },
    {
      id: "diag-p5",
      text: "Velocity of SHM is maximum when displacement is:",
      options: ["Zero", "Maximum (at amplitude)", "A/2", "A/√2"],
      correct: 0,
      explanation: "v = ω√(A²−x²). Maximum when x = 0 (mean position).",
      subject: "Languages",
      topicSlug: "waves-and-shm",
      subConcept: "SHM Equations (displacement, velocity, acceleration)",
    },

    // ── Chemistry (Class 11 topics) ───────────────────────────────────
    {
      id: "diag-c1",
      text: "Shape of H₂O molecule as per VSEPR theory is:",
      options: ["Linear", "V-shaped (bent)", "Trigonal planar", "Tetrahedral"],
      correct: 1,
      explanation: "O has 2 bond pairs + 2 lone pairs → bent molecular shape.",
      subject: "Domain",
      topicSlug: "chemical-bonding-and-molecular-structure",
      subConcept: "VSEPR Theory & Molecular Geometry",
    },
    {
      id: "diag-c2",
      text: "Hybridisation of carbon in ethyne (C₂H₂) is:",
      options: ["sp³", "sp²", "sp", "sp³d"],
      correct: 2,
      explanation: "Each carbon in C₂H₂ forms 2 sigma bonds → sp hybridisation.",
      subject: "Domain",
      topicSlug: "chemical-bonding-and-molecular-structure",
      subConcept: "Hybridisation (sp, sp², sp³, sp³d, sp³d²)",
    },
    {
      id: "diag-c3",
      text: "For the reaction N₂ + 3H₂ ⇌ 2NH₃, Kp and Kc are related as:",
      options: ["Kp = Kc(RT)⁻²", "Kp = Kc(RT)²", "Kp = Kc", "Kp = Kc/RT"],
      correct: 0,
      explanation: "Δn = 2 − 4 = −2. Kp = Kc(RT)^Δn = Kc(RT)⁻².",
      subject: "Domain",
      topicSlug: "chemical-and-ionic-equilibrium",
      subConcept: "Kp, Kc, Kx relationships",
    },
    {
      id: "diag-c4",
      text: "Stability order of carbocations is:",
      options: [
        "3° > 2° > 1° > CH₃⁺",
        "CH₃⁺ > 1° > 2° > 3°",
        "1° > 2° > 3° > CH₃⁺",
        "3° > 1° > 2° > CH₃⁺",
      ],
      correct: 0,
      explanation: "More alkyl groups → more hyperconjugation → better stabilisation → 3° > 2° > 1° > methyl.",
      subject: "Domain",
      topicSlug: "general-organic-chemistry-goc",
      subConcept: "Carbocation, Carbanion, Radical Stability",
    },
    {
      id: "diag-c5",
      text: "pH of 0.01 M HCl solution is:",
      options: ["2", "1", "12", "−2"],
      correct: 0,
      explanation: "HCl fully dissociates. [H⁺] = 10⁻². pH = −log(10⁻²) = 2.",
      subject: "Domain",
      topicSlug: "chemical-and-ionic-equilibrium",
      subConcept: "pH of weak acids & bases",
    },

    // ── Mathematics (Class 11 topics) ─────────────────────────────────
    {
      id: "diag-m1",
      text: "lim(x→0) (sin x)/x equals:",
      options: ["1", "0", "∞", "x"],
      correct: 0,
      explanation: "Standard limit: lim(x→0) sin x/x = 1.",
      subject: "General Test",
      topicSlug: "calculus-limits-continuity-and-differentiability",
      subConcept: "Standard Limits",
    },
    {
      id: "diag-m2",
      text: "In an AP with first term 3 and common difference 4, the 10th term is:",
      options: ["39", "43", "35", "40"],
      correct: 0,
      explanation: "aₙ = a + (n−1)d = 3 + 9×4 = 3 + 36 = 39.",
      subject: "General Test",
      topicSlug: "sequences-series-and-complex-numbers",
      subConcept: "Arithmetic & Geometric Progressions",
    },
    {
      id: "diag-m3",
      text: "Σn from n=1 to 10 equals:",
      options: ["55", "50", "45", "60"],
      correct: 0,
      explanation: "Σn = n(n+1)/2 = 10×11/2 = 55.",
      subject: "General Test",
      topicSlug: "sequences-series-and-complex-numbers",
      subConcept: "Sum of Special Series",
    },
    {
      id: "diag-m4",
      text: "f(x) = x² is differentiable at x = 0. Its derivative at x = 0 is:",
      options: ["0", "1", "2", "Undefined"],
      correct: 0,
      explanation: "f'(x) = 2x. At x = 0: f'(0) = 0.",
      subject: "General Test",
      topicSlug: "calculus-limits-continuity-and-differentiability",
      subConcept: "Differentiability & Non-differentiable points",
    },
    {
      id: "diag-m5",
      text: "P(A) = 0.4, P(B) = 0.3, events independent. P(A∩B) is:",
      options: ["0.12", "0.7", "0.10", "0.34"],
      correct: 0,
      explanation: "Independent events: P(A∩B) = P(A)×P(B) = 0.4×0.3 = 0.12.",
      subject: "General Test",
      topicSlug: "probability",
      subConcept: "Conditional Probability",
    },
  ],

  "12": [
    // ── Physics (Class 12 topics) ──────────────────────────────────────
    {
      id: "diag-p1",
      text: "A capacitor of capacitance 10 μF is charged to 100 V. The energy stored is:",
      options: ["0.05 J", "0.1 J", "0.5 J", "1 J"],
      correct: 0,
      explanation: "U = ½CV² = ½ × 10×10⁻⁶ × 10000 = 0.05 J.",
      subject: "Languages",
      topicSlug: "electrostatics-and-capacitors",
      subConcept: "Energy stored in capacitor",
    },
    {
      id: "diag-p2",
      text: "A coil of 100 turns has flux 0.05 Wb. When flux drops to zero in 0.1 s, EMF induced is:",
      options: ["5 V", "50 V", "0.05 V", "500 V"],
      correct: 1,
      explanation: "EMF = N dΦ/dt = 100 × 0.05/0.1 = 50 V.",
      subject: "Languages",
      topicSlug: "electromagnetic-induction-and-ac-circuits",
      subConcept: "Faraday's Law & Lenz's Law",
    },
    {
      id: "diag-p3",
      text: "Energy of electron in 2nd orbit of hydrogen atom (E₁ = −13.6 eV) is:",
      options: ["−3.4 eV", "−13.6 eV", "−1.51 eV", "−6.8 eV"],
      correct: 0,
      explanation: "E_n = −13.6/n² = −13.6/4 = −3.4 eV.",
      subject: "Languages",
      topicSlug: "modern-physics",
      subConcept: "Bohr's Atomic Model",
    },
    {
      id: "diag-p4",
      text: "In YDSE, slit separation d = 0.5 mm, screen D = 1 m, λ = 500 nm. Fringe width is:",
      options: ["1 mm", "0.5 mm", "2 mm", "0.25 mm"],
      correct: 0,
      explanation: "β = λD/d = 500×10⁻⁹ × 1 / (0.5×10⁻³) = 1 mm.",
      subject: "Languages",
      topicSlug: "optics-ray-wave",
      subConcept: "Young's Double Slit Experiment",
    },
    {
      id: "diag-p5",
      text: "In LCR series circuit, resonance occurs when:",
      options: ["X_L = R", "X_C = R", "X_L = X_C", "Z = 0"],
      correct: 2,
      explanation: "At resonance, X_L = X_C so Z = R (minimum).",
      subject: "Languages",
      topicSlug: "electromagnetic-induction-and-ac-circuits",
      subConcept: "Resonance in LCR",
    },

    // ── Chemistry (Class 12 topics) ───────────────────────────────────
    {
      id: "diag-c1",
      text: "IUPAC name of [Co(NH₃)₄Cl₂]Cl is:",
      options: [
        "Tetraamminedichlorocobalt(III) chloride",
        "Dichlorotetramminecobalt(III) chloride",
        "Tetraamminedichlorocobalt(II) chloride",
        "Cobalt tetraammine dichloride",
      ],
      correct: 0,
      explanation: "Ligands alphabetically (ammine before chloro), Co(III), outer Cl⁻.",
      subject: "Domain",
      topicSlug: "coordination-compounds",
      subConcept: "IUPAC Nomenclature",
    },
    {
      id: "diag-c2",
      text: "Standard EMF of cell: E°_cathode = +0.80V (Cu), E°_anode = −0.76V (Zn) is:",
      options: ["1.56 V", "0.04 V", "−1.56 V", "0.76 V"],
      correct: 0,
      explanation: "E°_cell = E°_cathode − E°_anode = 0.80 − (−0.76) = 1.56 V.",
      subject: "Domain",
      topicSlug: "electrochemistry",
      subConcept: "Standard Electrode Potential & Cell EMF",
    },
    {
      id: "diag-c3",
      text: "Which of the following undergoes Cannizzaro reaction?",
      options: ["HCHO", "CH₃CHO", "CH₃COCH₃", "C₂H₅CHO"],
      correct: 0,
      explanation: "Cannizzaro needs no α-H. HCHO has no α-H.",
      subject: "Domain",
      topicSlug: "carbonyl-compounds",
      subConcept: "Aldol & Cannizzaro Reactions",
    },
    {
      id: "diag-c4",
      text: "H₂SO₄ is manufactured industrially by:",
      options: ["Contact process", "Haber process", "Solvay process", "Ostwald process"],
      correct: 0,
      explanation: "Contact process: SO₂ + ½O₂ → SO₃ (V₂O₅ catalyst) → H₂SO₄.",
      subject: "Domain",
      topicSlug: "p-block-elements",
      subConcept: "Group 16 (O, S, Se)",
    },
    {
      id: "diag-c5",
      text: "Nylon-6,6 is formed by:",
      options: [
        "Condensation of hexamethylenediamine and adipic acid",
        "Addition polymerisation of caprolactam",
        "Condensation of glycol and terephthalic acid",
        "Addition of acrylonitrile",
      ],
      correct: 0,
      explanation: "Nylon-6,6: hexamethylenediamine + adipic acid → condensation polymer.",
      subject: "Domain",
      topicSlug: "polymers-and-biomolecules",
      subConcept: "Addition vs Condensation Polymers",
    },

    // ── Mathematics (Class 12 topics) ─────────────────────────────────
    {
      id: "diag-m1",
      text: "∫₀^π sin x dx equals:",
      options: ["2", "0", "1", "π"],
      correct: 0,
      explanation: "[−cos x]₀^π = −cos π + cos 0 = 1 + 1 = 2.",
      subject: "General Test",
      topicSlug: "calculus-integration",
      subConcept: "Definite Integral Properties",
    },
    {
      id: "diag-m2",
      text: "Determinant of a 2×2 matrix [[3,1],[2,4]] is:",
      options: ["10", "14", "−10", "2"],
      correct: 0,
      explanation: "|A| = 3×4 − 1×2 = 12 − 2 = 10.",
      subject: "General Test",
      topicSlug: "matrices-and-determinants",
      subConcept: "Properties of Determinants",
    },
    {
      id: "diag-m3",
      text: "P(A) = 0.5, P(B|A) = 0.4. P(A∩B) is:",
      options: ["0.2", "0.9", "0.1", "0.45"],
      correct: 0,
      explanation: "P(A∩B) = P(B|A)×P(A) = 0.4×0.5 = 0.2.",
      subject: "General Test",
      topicSlug: "probability",
      subConcept: "Conditional Probability",
    },
    {
      id: "diag-m4",
      text: "Parabola y² = 4x: the focus is at:",
      options: ["(1, 0)", "(0, 1)", "(−1, 0)", "(4, 0)"],
      correct: 0,
      explanation: "y² = 4ax → a = 1. Focus at (a, 0) = (1, 0).",
      subject: "General Test",
      topicSlug: "coordinate-geometry-conics",
      subConcept: "Parabola (standard forms & properties)",
    },
    {
      id: "diag-m5",
      text: "f(x) = x³. Value of f'(2) is:",
      options: ["12", "8", "6", "3"],
      correct: 0,
      explanation: "f'(x) = 3x². f'(2) = 3×4 = 12.",
      subject: "General Test",
      topicSlug: "calculus-application-of-derivatives",
      subConcept: "Rate of Change",
    },
  ],

  dropper: [
    // ── Physics — mix of Class 11 & 12 ────────────────────────────────
    {
      id: "diag-p1",
      text: "A battery of EMF 12V and internal resistance 2Ω drives current through a 4Ω resistor. Current is:",
      options: ["2 A", "3 A", "6 A", "1.5 A"],
      correct: 0,
      explanation: "I = EMF/(R+r) = 12/(4+2) = 2 A.",
      subject: "Languages",
      topicSlug: "current-electricity",
      subConcept: "Ohm's Law & Resistance combinations",
    },
    {
      id: "diag-p2",
      text: "Half-life of a radioactive element is 10 days. Fraction remaining after 30 days is:",
      options: ["1/8", "1/4", "1/2", "1/16"],
      correct: 0,
      explanation: "30 days = 3 half-lives. (1/2)³ = 1/8.",
      subject: "Languages",
      topicSlug: "modern-physics",
      subConcept: "Radioactive Decay (half-life)",
    },
    {
      id: "diag-p3",
      text: "A figure skater pulls in arms reducing I from 4 kg·m² to 1 kg·m². Initial ω = 2 rad/s. Final ω is:",
      options: ["8 rad/s", "0.5 rad/s", "2 rad/s", "4 rad/s"],
      correct: 0,
      explanation: "L = Iω conserved. 4×2 = 1×ω₂ → ω₂ = 8 rad/s.",
      subject: "Languages",
      topicSlug: "rotational-motion",
      subConcept: "Angular Momentum & Its Conservation",
    },
    {
      id: "diag-p4",
      text: "Critical angle for glass (n=1.5) is approximately:",
      options: ["41.8°", "30°", "60°", "45°"],
      correct: 0,
      explanation: "sin θ_c = 1/n = 1/1.5 → θ_c ≈ 41.8°.",
      subject: "Languages",
      topicSlug: "optics-ray-wave",
      subConcept: "Refraction & Snell's Law",
    },
    {
      id: "diag-p5",
      text: "Power dissipated in a 5Ω resistor carrying 2A is:",
      options: ["10 W", "20 W", "40 W", "2.5 W"],
      correct: 1,
      explanation: "P = I²R = 4 × 5 = 20 W.",
      subject: "Languages",
      topicSlug: "current-electricity",
      subConcept: "Power dissipation & efficiency",
    },

    // ── Chemistry — mix of Class 11 & 12 ─────────────────────────────
    {
      id: "diag-c1",
      text: "Bond order of O₂ molecule by MOT is:",
      options: ["2", "1", "3", "0"],
      correct: 0,
      explanation: "Bonding e⁻ = 10, antibonding = 6. BO = (10−6)/2 = 2.",
      subject: "Domain",
      topicSlug: "chemical-bonding-and-molecular-structure",
      subConcept: "Bond Order & Magnetic Properties (MOT)",
    },
    {
      id: "diag-c2",
      text: "Ksp of AgCl is 1.6×10⁻¹⁰. Solubility in pure water is:",
      options: ["1.26×10⁻⁵ M", "1.6×10⁻¹⁰ M", "4×10⁻⁵ M", "8×10⁻¹¹ M"],
      correct: 0,
      explanation: "s² = Ksp → s = √(1.6×10⁻¹⁰) = 1.26×10⁻⁵ M.",
      subject: "Domain",
      topicSlug: "chemical-and-ionic-equilibrium",
      subConcept: "Solubility Product (Ksp)",
    },
    {
      id: "diag-c3",
      text: "SN2 reaction proceeds with:",
      options: ["Inversion of configuration", "Retention", "Racemisation", "No stereochemistry change"],
      correct: 0,
      explanation: "SN2 is a concerted backside attack → Walden inversion.",
      subject: "Domain",
      topicSlug: "general-organic-chemistry-goc",
      subConcept: "Reaction Intermediates & Mechanisms",
    },
    {
      id: "diag-c4",
      text: "Which ligand causes maximum crystal field splitting?",
      options: ["CN⁻", "F⁻", "Cl⁻", "H₂O"],
      correct: 0,
      explanation: "Spectrochemical series: CN⁻ is the strongest field ligand.",
      subject: "Domain",
      topicSlug: "coordination-compounds",
      subConcept: "Crystal Field Theory (high/low spin)",
    },
    {
      id: "diag-c5",
      text: "Iodoform test is positive for:",
      options: ["CH₃COCH₃", "HCHO", "C₆H₅CHO", "HCOOH"],
      correct: 0,
      explanation: "Acetone has CH₃CO− group → reacts with I₂/NaOH → CHI₃ (iodoform).",
      subject: "Domain",
      topicSlug: "carbonyl-compounds",
      subConcept: "Haloform Reaction",
    },

    // ── Mathematics — mix of Class 11 & 12 ───────────────────────────
    {
      id: "diag-m1",
      text: "∫x eˣ dx equals:",
      options: ["eˣ(x−1) + C", "xeˣ + C", "eˣ/x + C", "x²eˣ/2 + C"],
      correct: 0,
      explanation: "Integration by parts (ILATE): u=x, dv=eˣ dx → xeˣ − eˣ + C = eˣ(x−1) + C.",
      subject: "General Test",
      topicSlug: "calculus-integration",
      subConcept: "Integration by Parts (ILATE)",
    },
    {
      id: "diag-m2",
      text: "In an AP with first term 3 and common difference 4, the 10th term is:",
      options: ["39", "43", "35", "40"],
      correct: 0,
      explanation: "aₙ = a + (n−1)d = 3 + 9×4 = 39.",
      subject: "General Test",
      topicSlug: "sequences-series-and-complex-numbers",
      subConcept: "Arithmetic & Geometric Progressions",
    },
    {
      id: "diag-m3",
      text: "Parabola y² = 4x: the focus is at:",
      options: ["(1, 0)", "(0, 1)", "(−1, 0)", "(4, 0)"],
      correct: 0,
      explanation: "y² = 4ax → a = 1. Focus at (a, 0) = (1, 0).",
      subject: "General Test",
      topicSlug: "coordinate-geometry-conics",
      subConcept: "Parabola (standard forms & properties)",
    },
    {
      id: "diag-m4",
      text: "f(x) = x³. Value of f'(2) is:",
      options: ["12", "8", "6", "3"],
      correct: 0,
      explanation: "f'(x) = 3x². f'(2) = 12.",
      subject: "General Test",
      topicSlug: "calculus-application-of-derivatives",
      subConcept: "Rate of Change",
    },
    {
      id: "diag-m5",
      text: "A coin is tossed 4 times. P(exactly 2 heads) is:",
      options: ["3/8", "1/4", "1/2", "1/8"],
      correct: 0,
      explanation: "Binomial: P(X=2) = ⁴C₂ (1/2)² (1/2)² = 6/16 = 3/8.",
      subject: "General Test",
      topicSlug: "probability",
      subConcept: "Binomial Distribution",
    },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SUBJECT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Languages:   { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200" },
  Domain: { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200" },
  "General Test":      { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
};

function bloomFromScore(correct: number, total: number): number {
  const pct = total > 0 ? correct / total : 0;
  if (pct === 0) return 1;
  if (pct <= 0.33) return 2;
  return 3;
}

// ─── Main wrapper with Suspense boundary (required for useSearchParams) ───────

export default function OnboardingPageWrapper() {
  return (
    <Suspense>
      <OnboardingPage />
    </Suspense>
  );
}

// ─── Core page ────────────────────────────────────────────────────────────────

function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classParam = (searchParams.get("class") ?? "12") as "11" | "12" | "dropper";

  const questions: DiagQuestion[] = QUESTIONS_BY_CLASS[classParam] ?? QUESTIONS_BY_CLASS["12"];

  const TOTAL = questions.length; // 15
  const TIME_LIMIT = 20 * 60; // 20 minutes in seconds

  const [phase, setPhase] = useState<Phase>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>(Array(TOTAL).fill(null));
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [showExplanation, setShowExplanation] = useState(false);
  const [saveError, setSaveError] = useState("");

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Timer ──────────────────────────────────────────────────────────────────
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleSubmit = useCallback(
    (finalAnswers: UserAnswer[]) => {
      stopTimer();
      setAnswers(finalAnswers);
      setPhase("results");
    },
    [stopTimer]
  );

  useEffect(() => {
    if (phase !== "test") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          // Auto-submit with current answers
          setAnswers((prev) => {
            handleSubmit(prev);
            return prev;
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => stopTimer();
  }, [phase, handleSubmit, stopTimer]);

  // ── Scoring ────────────────────────────────────────────────────────────────
  const scoreBySubject = useCallback(() => {
    const map: Record<string, { correct: number; total: number }> = {};
    questions.forEach((q, i) => {
      if (!map[q.subject]) map[q.subject] = { correct: 0, total: 0 };
      map[q.subject].total++;
      if (answers[i] === q.correct) map[q.subject].correct++;
    });
    return map;
  }, [questions, answers]);

  const buildResults = useCallback(() => {
    // One row per (topicSlug, subConcept) pair
    const scoreMap: Record<string, { correct: number; total: number; topicSlug: string; subConcept: string }> = {};
    questions.forEach((q, i) => {
      const key = `${q.topicSlug}__${q.subConcept}`;
      if (!scoreMap[key]) {
        scoreMap[key] = { correct: 0, total: 0, topicSlug: q.topicSlug, subConcept: q.subConcept };
      }
      scoreMap[key].total++;
      if (answers[i] === q.correct) scoreMap[key].correct++;
    });

    return Object.values(scoreMap).map((entry) => ({
      topicSlug: entry.topicSlug,
      subConcept: entry.subConcept,
      score: entry.correct,
      bloomLevel: bloomFromScore(entry.correct, entry.total),
    }));
  }, [questions, answers]);

  // ── Save & redirect ────────────────────────────────────────────────────────
  async function handleSaveAndContinue() {
    setPhase("saving");
    setSaveError("");
    const token = localStorage.getItem("jee_token_v1") ?? localStorage.getItem("jee_token");
    const results = buildResults();
    const classLevel = localStorage.getItem("jee_class_v1") || "unknown";
    const avgScore = results.length > 0 ? results.reduce((s, r) => s + r.bloomLevel, 0) / results.length : 0;
    Analytics.onboardingCompleted(classLevel, avgScore);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ results }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Save failed");
      }
      router.push("/topics?onboarded=1");
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Something went wrong");
      setPhase("results");
    }
  }

  // ── Answer selection ───────────────────────────────────────────────────────
  function selectAnswer(idx: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = idx;
      return next;
    });
    setShowExplanation(false);
  }

  function skipQuestion() {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = null;
      return next;
    });
    goNext();
  }

  function goNext() {
    setShowExplanation(false);
    if (current < TOTAL - 1) {
      setCurrent((c) => c + 1);
    } else {
      handleSubmit(answers);
    }
  }

  function goPrev() {
    setShowExplanation(false);
    if (current > 0) setCurrent((c) => c - 1);
  }

  // ── Timer formatting ───────────────────────────────────────────────────────
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, "0")}`;
  const timerUrgent = timeLeft < 120;

  // ─── Render: intro ──────────────────────────────────────────────────────────
  if (phase === "intro") {
    const classLabel =
      classParam === "11" ? "Class 11" : classParam === "12" ? "Class 12" : "Dropper";
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
              🧪
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">
              Diagnostic Test
            </h1>
            <p className="text-gray-500 text-sm">
              15 questions · 20 minutes · {classLabel} syllabus
            </p>
          </div>

          {/* Info cards */}
          <div className="space-y-3 mb-8">
            {[
              { icon: "⚡", title: "Takes 10–15 minutes", desc: "15 MCQs across Physics, Chemistry & Maths" },
              { icon: "🎯", title: "Sets your starting level", desc: "We map your Bloom level for every topic tested" },
              { icon: "📚", title: "No penalty for skipping", desc: "Skip any question — honest results beat guessing" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Subject breakdown */}
          <div className="flex gap-2 mb-8">
            {(["Languages", "Domain", "General Test"] as const).map((subj) => {
              const c = SUBJECT_COLORS[subj];
              return (
                <div key={subj} className={`flex-1 ${c.bg} border ${c.border} rounded-xl p-3 text-center`}>
                  <p className={`text-xs font-bold ${c.text}`}>{subj}</p>
                  <p className={`text-lg font-black ${c.text}`}>5</p>
                  <p className={`text-xs ${c.text} opacity-70`}>questions</p>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => { setPhase("test"); setCurrent(0); setTimeLeft(TIME_LIMIT); }}
            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold py-4 rounded-xl text-base transition-all shadow-md shadow-orange-100"
          >
            Start Test →
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">
            Timer starts when you click Start
          </p>
        </div>
      </div>
    );
  }

  // ─── Render: test ───────────────────────────────────────────────────────────
  if (phase === "test") {
    const q = questions[current];
    const selectedAnswer = answers[current];
    const subjectColor = SUBJECT_COLORS[q.subject];
    const answered = answers.filter((a) => a !== null).length;

    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100">
          <div
            className="h-full bg-orange-500 transition-all duration-300"
            style={{ width: `${((current + 1) / TOTAL) * 100}%` }}
          />
        </div>

        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-xs font-semibold text-gray-500">
            Question <span className="text-gray-900">{current + 1}</span> of {TOTAL}
          </span>

          {/* Subject badge */}
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${subjectColor.bg} ${subjectColor.text} border ${subjectColor.border}`}>
            {q.subject}
          </span>

          {/* Timer */}
          <span className={`text-xs font-mono font-bold tabular-nums px-2 py-1 rounded-lg ${timerUrgent ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-600"}`}>
            {timeStr}
          </span>
        </div>

        {/* Question */}
        <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
          <p className="text-base font-semibold text-gray-900 leading-relaxed mb-6">
            {q.text}
          </p>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {q.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              return (
                <button
                  key={idx}
                  onClick={() => selectAnswer(idx)}
                  className={`w-full text-left px-4 py-4 rounded-xl border-2 text-sm font-medium transition-all active:scale-[0.98] ${
                    isSelected
                      ? "border-orange-500 bg-orange-50 text-orange-900"
                      : "border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50/50"
                  }`}
                >
                  <span className={`inline-block w-6 h-6 rounded-full text-center text-xs font-bold mr-3 leading-6 ${
                    isSelected ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Explanation (shown after selecting) */}
          {selectedAnswer !== null && showExplanation && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-sm text-blue-800">
              <p className="font-bold mb-1">Explanation</p>
              <p>{q.explanation}</p>
            </div>
          )}
          {selectedAnswer !== null && !showExplanation && (
            <button
              onClick={() => setShowExplanation(true)}
              className="text-xs text-orange-500 hover:underline mb-4 block"
            >
              Show explanation
            </button>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={goPrev}
              disabled={current === 0}
              className="flex-none px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 disabled:opacity-30 hover:border-gray-300 transition-all"
            >
              ←
            </button>

            <button
              onClick={skipQuestion}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-all"
            >
              Skip
            </button>

            {current < TOTAL - 1 ? (
              <button
                onClick={goNext}
                className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-all active:scale-95"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={() => handleSubmit(answers)}
                className="flex-1 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-bold transition-all active:scale-95"
              >
                Submit
              </button>
            )}
          </div>

          {/* Mini progress dots */}
          <div className="flex flex-wrap gap-1.5 mt-6 justify-center">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => { setShowExplanation(false); setCurrent(i); }}
                className={`w-5 h-5 rounded-full text-[10px] font-bold transition-all ${
                  i === current
                    ? "bg-orange-500 text-white scale-110"
                    : answers[i] !== null
                    ? "bg-green-400 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-2">
            {answered} of {TOTAL} answered
          </p>
        </div>
      </div>
    );
  }

  // ─── Render: results ────────────────────────────────────────────────────────
  if (phase === "results" || phase === "saving") {
    const subjectScores = scoreBySubject();
    const totalCorrect = Object.values(subjectScores).reduce((s, v) => s + v.correct, 0);
    const overallPct = Math.round((totalCorrect / TOTAL) * 100);

    const levelLabel = (bloom: number) =>
      bloom === 1 ? "Beginner" : bloom === 2 ? "Building" : "Solid";
    const levelColor = (bloom: number) =>
      bloom === 1 ? "text-red-600 bg-red-50 border-red-200" :
      bloom === 2 ? "text-amber-600 bg-amber-50 border-amber-200" :
      "text-green-600 bg-green-50 border-green-200";

    return (
      <div className="min-h-screen bg-white flex flex-col items-center px-4 py-8">
        <div className="max-w-md w-full">
          {/* Score header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
              {overallPct >= 70 ? "🏆" : overallPct >= 40 ? "📈" : "🌱"}
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-1">
              {totalCorrect}/{TOTAL} correct
            </h1>
            <p className="text-gray-500 text-sm">
              {overallPct >= 70
                ? "Strong start — we'll start you at Level 3 on these topics."
                : overallPct >= 40
                ? "Decent base — we'll set Level 2 and build from there."
                : "Fresh start — we'll begin at Level 1, the right place."}
            </p>
          </div>

          {/* Per-subject breakdown */}
          <div className="space-y-3 mb-8">
            {(["Languages", "Domain", "General Test"] as const).map((subj) => {
              const s = subjectScores[subj] ?? { correct: 0, total: 0 };
              const bloom = bloomFromScore(s.correct, s.total);
              const c = SUBJECT_COLORS[subj];
              return (
                <div key={subj} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${c.bg} ${c.text} border ${c.border}`}>
                      {subj[0]}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{subj}</p>
                      <p className="text-xs text-gray-500">{s.correct}/{s.total} correct</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${levelColor(bloom)}`}>
                    {levelLabel(bloom)} · L{bloom}
                  </span>
                </div>
              );
            })}
          </div>

          {/* What happens next */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 text-sm">
            <p className="font-bold text-orange-800 mb-1">What happens next</p>
            <p className="text-orange-700 text-xs leading-relaxed">
              Your starting Bloom level is set for each topic. The platform will serve questions
              at the right difficulty — increasing as you improve, never overwhelming you.
            </p>
          </div>

          {saveError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700">
              {saveError} — try again below.
            </div>
          )}

          <button
            onClick={handleSaveAndContinue}
            disabled={phase === "saving"}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 active:scale-95 text-white font-bold py-4 rounded-xl text-base transition-all shadow-md shadow-orange-100"
          >
            {phase === "saving" ? "Saving your plan…" : "See My Study Plan →"}
          </button>
          <p className="text-center text-xs text-gray-400 mt-2">
            Takes you to your personalised topic list
          </p>
        </div>
      </div>
    );
  }

  return null;
}
