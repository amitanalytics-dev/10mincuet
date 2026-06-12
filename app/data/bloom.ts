// Bloom's Taxonomy — 6 cognitive levels
// Each level represents a deeper stage of mastery

export type BloomLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type BloomInfo = {
  level: BloomLevel;
  name: string;
  verb: string;         // What the student does at this level
  description: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: string;
  gateTask: string;     // What the student must do to advance
};

export const BLOOM_LEVELS: BloomInfo[] = [
  {
    level: 1,
    name: "Remember",
    verb: "Recall",
    description: "Can state formulas and facts from memory",
    color: "#94A3B8",
    bgColor: "#F1F5F9",
    textColor: "#475569",
    icon: "📌",
    gateTask: "Recall 3 key formulas without looking",
  },
  {
    level: 2,
    name: "Understand",
    verb: "Explain",
    description: "Can explain why a formula works and when to use it",
    color: "#60A5FA",
    bgColor: "#EFF6FF",
    textColor: "#1D4ED8",
    icon: "💡",
    gateTask: "Explain the concept in your own words",
  },
  {
    level: 3,
    name: "Apply",
    verb: "Solve",
    description: "Can solve standard CUET-type numerical problems",
    color: "#34D399",
    bgColor: "#ECFDF5",
    textColor: "#065F46",
    icon: "🔧",
    gateTask: "Solve 2 problems without hints",
  },
  {
    level: 4,
    name: "Analyze",
    verb: "Break down",
    description: "Can identify which concept applies in a complex problem",
    color: "#FBBF24",
    bgColor: "#FFFBEB",
    textColor: "#92400E",
    icon: "🔍",
    gateTask: "Identify the concept and method before solving",
  },
  {
    level: 5,
    name: "Evaluate",
    verb: "Judge",
    description: "Can spot errors in solutions and compare approaches",
    color: "#F97316",
    bgColor: "#FFF7ED",
    textColor: "#9A3412",
    icon: "⚖️",
    gateTask: "Find the error in a flawed solution",
  },
  {
    level: 6,
    name: "Create",
    verb: "Derive",
    description: "Can derive results and construct novel solutions",
    color: "#A855F7",
    bgColor: "#FAF5FF",
    textColor: "#6B21A8",
    icon: "✨",
    gateTask: "Derive the formula from first principles",
  },
];

export function getBloomInfo(level: BloomLevel): BloomInfo {
  return BLOOM_LEVELS[level - 1];
}

export function getNextLevel(level: BloomLevel): BloomLevel | null {
  if (level >= 6) return null;
  return (level + 1) as BloomLevel;
}

// Gate questions: 3 questions shown between levels to validate advancement
// Keyed by: `${topicSlug}__${subConcept}__L${level}` → questions to pass to advance to level+1
export type GateQuestion = {
  id: string;
  text: string;
  options: string[];
  correct: number;
  bloomLevel: BloomLevel;
  explanation: string;
  subConcept: string;
};

export type GateBank = Record<string, GateQuestion[]>;

// Sub-concept Bloom progress stored in localStorage
export type SubConceptProgress = {
  bloomLevel: BloomLevel;
  lastQuizScore: number; // 0-100
  gatesPassed: BloomLevel[]; // which gate levels have been cleared
  updatedAt: string;
};

export type TopicBloomProgress = Record<string, SubConceptProgress>; // key = subConcept name

export type BloomStore = Record<string, TopicBloomProgress>; // key = topicSlug

const BLOOM_STORAGE_KEY = "jee_bloom_v1";

export function loadBloomStore(): BloomStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(BLOOM_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveBloomStore(store: BloomStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(BLOOM_STORAGE_KEY, JSON.stringify(store));
}

export function getTopicProgress(topicSlug: string): TopicBloomProgress {
  const store = loadBloomStore();
  return store[topicSlug] ?? {};
}

export function updateSubConceptLevel(
  topicSlug: string,
  subConcept: string,
  bloomLevel: BloomLevel,
  quizScore: number
): void {
  const store = loadBloomStore();
  if (!store[topicSlug]) store[topicSlug] = {};
  const existing = store[topicSlug][subConcept];
  store[topicSlug][subConcept] = {
    bloomLevel: Math.max(bloomLevel, existing?.bloomLevel ?? 1) as BloomLevel,
    lastQuizScore: quizScore,
    gatesPassed: existing?.gatesPassed ?? [],
    updatedAt: new Date().toISOString(),
  };
  saveBloomStore(store);
}

export function markGatePassed(
  topicSlug: string,
  subConcept: string,
  level: BloomLevel
): void {
  const store = loadBloomStore();
  if (!store[topicSlug]) store[topicSlug] = {};
  if (!store[topicSlug][subConcept]) {
    store[topicSlug][subConcept] = {
      bloomLevel: level,
      lastQuizScore: 0,
      gatesPassed: [],
      updatedAt: new Date().toISOString(),
    };
  }
  const sc = store[topicSlug][subConcept];
  if (!sc.gatesPassed.includes(level)) sc.gatesPassed.push(level);
  sc.bloomLevel = Math.max(sc.bloomLevel, (level + 1) as BloomLevel) as BloomLevel;
  sc.updatedAt = new Date().toISOString();
  saveBloomStore(store);
}

// Infer Bloom level from quiz performance
// score 0-40% → L1, 40-60% → L2, 60-75% → L3, 75-90% → L4, 90-100% → L5
export function inferBloomLevel(scorePercent: number): BloomLevel {
  if (scorePercent >= 90) return 5;
  if (scorePercent >= 75) return 4;
  if (scorePercent >= 60) return 3;
  if (scorePercent >= 40) return 2;
  return 1;
}

// Content feedback stored in localStorage
export type ContentRating = "easy" | "right" | "hard";

export type ContentFeedback = {
  rating: ContentRating;
  updatedAt: string;
};

const FEEDBACK_KEY = "jee_feedback_v1";

export function getContentFeedback(topicSlug: string, contentId: string): ContentRating | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    const store = raw ? JSON.parse(raw) : {};
    return store[`${topicSlug}__${contentId}`]?.rating ?? null;
  } catch {
    return null;
  }
}

export function saveContentFeedback(
  topicSlug: string,
  contentId: string,
  rating: ContentRating
): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    const store = raw ? JSON.parse(raw) : {};
    store[`${topicSlug}__${contentId}`] = { rating, updatedAt: new Date().toISOString() };
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(store));
  } catch {}
}

// Gate questions per topic (3 per level transition, keyed by topicSlug + targetLevel)
// These are short Bloom-progressive questions shown to validate level advancement
export const gateBank: Record<string, GateQuestion[]> = {
  // Physics gates
  "electrostatics-and-capacitors__L2": [
    { id: "g-ec-L2-1", text: "Why does the electric field inside a conductor in electrostatic equilibrium equal zero?", options: ["Free charges rearrange until net force on them is zero", "Conductors absorb all electric fields", "The field cancels outside", "Gauss's law doesn't apply inside"], correct: 0, bloomLevel: 2, explanation: "Free electrons move until they create a field that exactly cancels the external one. Net field inside = 0.", subConcept: "Gauss's Law (shells, cylinders, planes)" },
    { id: "g-ec-L2-2", text: "A capacitor is charged and then disconnected from the battery. Inserting a dielectric increases capacitance. What happens to voltage?", options: ["Decreases (Q constant, C increases → V=Q/C decreases)", "Increases", "Stays same", "Becomes zero"], correct: 0, bloomLevel: 2, explanation: "Q is conserved (disconnected). V = Q/C. If C increases, V must decrease.", subConcept: "Capacitors (series/parallel, dielectric)" },
    { id: "g-ec-L2-3", text: "Why is potential constant throughout a conductor in electrostatic equilibrium?", options: ["E=0 inside → no work done moving charge → V same everywhere", "Resistance is zero", "Charge distributes evenly", "Capacitance is infinite"], correct: 0, bloomLevel: 2, explanation: "Since E=0 inside, W = q∫E·dl = 0 for any path → ΔV = 0 → V is constant.", subConcept: "Electric Potential & Potential Energy" },
  ],
  "electrostatics-and-capacitors__L3": [
    { id: "g-ec-L3-1", text: "Two parallel plates (A=0.01 m², d=0.001 m, ε₀=8.85×10⁻¹²). Find C.", options: ["88.5 pF", "8.85 pF", "885 pF", "0.885 pF"], correct: 0, bloomLevel: 3, explanation: "C = ε₀A/d = 8.85×10⁻¹²×0.01/0.001 = 88.5×10⁻¹² F = 88.5 pF.", subConcept: "Capacitors (series/parallel, dielectric)" },
    { id: "g-ec-L3-2", text: "Charge Q=6μC on capacitor C=2μF. Find energy stored.", options: ["9 μJ", "18 μJ", "6 μJ", "3 μJ"], correct: 0, bloomLevel: 3, explanation: "U = Q²/2C = (6×10⁻⁶)²/(2×2×10⁻⁶) = 36×10⁻¹²/(4×10⁻⁶) = 9×10⁻⁶ J = 9 μJ.", subConcept: "Energy stored in capacitor" },
    { id: "g-ec-L3-3", text: "Field at 0.3m from +2μC charge in air?", options: ["2×10⁵ N/C", "2×10⁴ N/C", "2×10⁶ N/C", "6×10⁴ N/C"], correct: 0, bloomLevel: 3, explanation: "E = kQ/r² = 9×10⁹×2×10⁻⁶/(0.09) = 18×10³/0.09 = 2×10⁵ N/C.", subConcept: "Coulomb's Law & Electric Field" },
  ],
  "electrostatics-and-capacitors__L4": [
    { id: "g-ec-L4-1", text: "A student says 'adding more capacitors in series always increases total capacitance'. What's wrong?", options: ["Series decreases capacitance: 1/C_eq = Σ1/Cᵢ, so C_eq < smallest C", "Correct — more capacitors means more storage", "Depends on capacitor values", "Only true for identical capacitors"], correct: 0, bloomLevel: 4, explanation: "Series connection reduces equivalent capacitance. Parallel increases it. Common confusion to catch.", subConcept: "Capacitors (series/parallel, dielectric)" },
    { id: "g-ec-L4-2", text: "Two equal charges +Q are placed 2d apart. Where on the line between them is the electric field maximum?", options: ["At the midpoint, E=0; fields cancel there — maximum is between midpoint and each charge", "At midpoint (fields add)", "At each charge", "Nowhere (uniform)"], correct: 0, bloomLevel: 4, explanation: "At midpoint, fields cancel (zero). Moving toward either charge, the nearby charge dominates. Maximum field is not at midpoint.", subConcept: "Coulomb's Law & Electric Field" },
    { id: "g-ec-L4-3", text: "If the capacitance of a capacitor is increased by inserting a dielectric while connected to battery, what quantity stays constant?", options: ["Voltage (battery maintains V)", "Charge", "Energy", "Electric field inside"], correct: 0, bloomLevel: 4, explanation: "Connected to battery → V fixed by EMF. Q = CV increases. Energy = ½CV² increases. Field E = V/d stays same.", subConcept: "Capacitors (series/parallel, dielectric)" },
  ],
  "modern-physics__L2": [
    { id: "g-mp-L2-1", text: "Why does photoelectric effect prove light is quantized (photons), not a wave?", options: ["Electrons emitted instantly regardless of intensity; only frequency matters — waves would predict delay", "Waves cannot travel in vacuum", "Electrons repel light waves", "Wave theory predicts higher current"], correct: 0, bloomLevel: 2, explanation: "Classical waves predict: more intensity = more energy = eventually emission. But below threshold frequency, NO electrons regardless of intensity — only photon model explains this.", subConcept: "Photoelectric Effect" },
    { id: "g-mp-L2-2", text: "Why does the binding energy per nucleon graph peak at iron (Fe-56)?", options: ["Fe-56 is most stable — releasing it from either direction (fusion or fission) requires energy input", "Fe has most protons", "Fe has perfect electron shells", "Nuclear forces strongest for Fe"], correct: 0, bloomLevel: 2, explanation: "Elements lighter than Fe release energy by fusion; heavier than Fe by fission. Fe is the most stable nucleus.", subConcept: "Nuclear Reactions & Mass Defect" },
    { id: "g-mp-L2-3", text: "Explain why larger orbits in Bohr model have higher energy despite being 'further' from nucleus.", options: ["Energy is negative: E_n = −13.6/n². Less negative = higher energy. Electron needs energy to escape.", "Larger orbit = more kinetic energy", "Potential energy decreases with distance", "Electron moves faster in outer orbit"], correct: 0, bloomLevel: 2, explanation: "E_n = −13.6/n² eV. As n increases, E_n becomes less negative (closer to zero). Ground state (n=1) is most bound (lowest energy).", subConcept: "Bohr's Atomic Model" },
  ],
  "calculus-integration__L2": [
    { id: "g-ci-L2-1", text: "Why does ∫f(x)dx = ∫f(a+b−x)dx for definite integrals on [a,b]?", options: ["Substitution x→(a+b−x) maps [a,b] to itself; it's a reflection around midpoint — area unchanged", "Both sides equal zero", "It only works for even functions", "It's an approximation"], correct: 0, bloomLevel: 2, explanation: "The substitution t = a+b−x transforms the integral but the limits a→b become b→a, and the −dx flips them back. The integrand changes but the area is the same geometric region.", subConcept: "Definite Integral Properties" },
    { id: "g-ci-L2-2", text: "Why is integration by parts useful when you see a product of two different function types?", options: ["Products of Algebraic×Trig, Log×Poly, etc. don't have standard forms — IBP breaks them into differentiable pieces", "It's always faster than substitution", "Substitution fails for polynomials", "It reduces order of the integral always"], correct: 0, bloomLevel: 2, explanation: "IBP: ∫u·v dx = u∫v dx − ∫(du/dx · ∫v dx)dx. Choose u=function that simplifies on differentiating (ILATE priority).", subConcept: "Integration by Parts (ILATE)" },
    { id: "g-ci-L2-3", text: "Geometrically, what does ∫_a^b f(x)dx represent when f(x) < 0?", options: ["Negative of the area between curve and x-axis (curve is below x-axis)", "Zero", "Area above x-axis", "It's undefined"], correct: 0, bloomLevel: 2, explanation: "The definite integral gives signed area. When f(x)<0, the integral is negative. To find actual area, take |∫f(x)dx|.", subConcept: "Area Under Curve" },
  ],
};
