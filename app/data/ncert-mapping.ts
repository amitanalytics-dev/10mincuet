export interface NCERTRef {
  book: string;        // e.g. "Physics Part 1 (Class 11)"
  chapter: number;
  chapterName: string;
  pageStart: number;
  pageEnd: number;
  keyPages?: number[]; // most important pages to read
}

export const NCERT_MAP: Record<string, NCERTRef> = {
  // ─── PHYSICS ──────────────────────────────────────────────────────────────

  "Electrostatics & Capacitors": {
    book: "Physics Part 1 (Class 12)",
    chapter: 1,
    chapterName: "Electric Charges and Fields",
    pageStart: 1,
    pageEnd: 46,
    keyPages: [4, 15, 28, 35, 42],
  },

  "Current Electricity": {
    book: "Physics Part 1 (Class 12)",
    chapter: 3,
    chapterName: "Current Electricity",
    pageStart: 83,
    pageEnd: 115,
    keyPages: [85, 93, 100, 107, 112],
  },

  "Electromagnetic Induction & AC Circuits": {
    book: "Physics Part 1 (Class 12)",
    chapter: 6,
    chapterName: "Electromagnetic Induction",
    pageStart: 177,
    pageEnd: 211,
    keyPages: [179, 186, 193, 200, 207],
  },

  "Modern Physics": {
    book: "Physics Part 2 (Class 12)",
    chapter: 11,
    chapterName: "Dual Nature of Radiation and Matter",
    pageStart: 395,
    pageEnd: 515,
    keyPages: [397, 418, 440, 460, 490],
  },

  "Optics (Ray + Wave)": {
    book: "Physics Part 2 (Class 12)",
    chapter: 9,
    chapterName: "Ray Optics and Optical Instruments",
    pageStart: 309,
    pageEnd: 393,
    keyPages: [311, 328, 345, 360, 380],
  },

  "Laws of Motion & Work-Energy": {
    book: "Physics Part 1 (Class 11)",
    chapter: 5,
    chapterName: "Laws of Motion",
    pageStart: 89,
    pageEnd: 136,
    keyPages: [91, 99, 110, 120, 130],
  },

  "Rotational Motion": {
    book: "Physics Part 1 (Class 11)",
    chapter: 7,
    chapterName: "Systems of Particles and Rotational Motion",
    pageStart: 141,
    pageEnd: 181,
    keyPages: [143, 152, 160, 170, 177],
  },

  "Waves & SHM": {
    book: "Physics Part 2 (Class 11)",
    chapter: 14,
    chapterName: "Oscillations",
    pageStart: 339,
    pageEnd: 399,
    keyPages: [341, 350, 360, 372, 390],
  },

  // ─── CHEMISTRY ────────────────────────────────────────────────────────────

  "Chemical Bonding & Molecular Structure": {
    book: "Chemistry Part 1 (Class 11)",
    chapter: 4,
    chapterName: "Chemical Bonding and Molecular Structure",
    pageStart: 100,
    pageEnd: 132,
    keyPages: [103, 110, 117, 124, 129],
  },

  "Coordination Compounds": {
    book: "Chemistry Part 1 (Class 12)",
    chapter: 5,
    chapterName: "Coordination Compounds",
    pageStart: 147,
    pageEnd: 183,
    keyPages: [149, 157, 165, 172, 179],
  },

  "p-Block Elements": {
    book: "Chemistry Part 2 (Class 12)",
    chapter: 7,
    chapterName: "The p-Block Elements",
    pageStart: 167,
    pageEnd: 213,
    keyPages: [170, 180, 190, 200, 208],
  },

  "Chemical & Ionic Equilibrium": {
    book: "Chemistry Part 2 (Class 11)",
    chapter: 7,
    chapterName: "Equilibrium",
    pageStart: 191,
    pageEnd: 228,
    keyPages: [193, 200, 208, 216, 224],
  },

  "Electrochemistry": {
    book: "Chemistry Part 1 (Class 12)",
    chapter: 3,
    chapterName: "Electrochemistry",
    pageStart: 62,
    pageEnd: 98,
    keyPages: [64, 72, 80, 88, 94],
  },

  "General Organic Chemistry (GOC)": {
    book: "Chemistry Part 2 (Class 11)",
    chapter: 8,
    chapterName: "Organic Chemistry — Some Basic Principles and Techniques",
    pageStart: 228,
    pageEnd: 268,
    keyPages: [230, 238, 248, 258, 264],
  },

  "Carbonyl Compounds": {
    book: "Chemistry Part 1 (Class 12)",
    chapter: 8,
    chapterName: "Aldehydes, Ketones and Carboxylic Acids",
    pageStart: 239,
    pageEnd: 278,
    keyPages: [241, 250, 258, 266, 274],
  },

  "Polymers & Biomolecules": {
    book: "Chemistry Part 2 (Class 12)",
    chapter: 15,
    chapterName: "Polymers",
    pageStart: 404,
    pageEnd: 437,
    keyPages: [406, 413, 420, 428, 434],
  },

  // ─── MATHEMATICS ──────────────────────────────────────────────────────────

  "Calculus — Integration": {
    book: "Mathematics Part 2 (Class 12)",
    chapter: 7,
    chapterName: "Integrals",
    pageStart: 285,
    pageEnd: 376,
    keyPages: [288, 305, 325, 348, 368],
  },

  "Calculus — Limits, Continuity & Differentiability": {
    book: "Mathematics Part 1 (Class 12)",
    chapter: 5,
    chapterName: "Continuity and Differentiability",
    pageStart: 147,
    pageEnd: 193,
    keyPages: [149, 158, 167, 178, 188],
  },

  "Calculus — Application of Derivatives": {
    book: "Mathematics Part 1 (Class 12)",
    chapter: 6,
    chapterName: "Application of Derivatives",
    pageStart: 195,
    pageEnd: 238,
    keyPages: [197, 206, 215, 226, 234],
  },

  "Coordinate Geometry — Circles": {
    book: "Mathematics (Class 11)",
    chapter: 11,
    chapterName: "Conic Sections",
    pageStart: 241,
    pageEnd: 262,
    keyPages: [242, 248, 253, 258, 261],
  },

  "Coordinate Geometry — Conics": {
    book: "Mathematics (Class 11)",
    chapter: 11,
    chapterName: "Conic Sections",
    pageStart: 241,
    pageEnd: 290,
    keyPages: [263, 270, 278, 284, 288],
  },

  "Matrices & Determinants": {
    book: "Mathematics Part 1 (Class 12)",
    chapter: 3,
    chapterName: "Matrices",
    pageStart: 56,
    pageEnd: 140,
    keyPages: [58, 72, 88, 105, 128],
  },

  "Probability": {
    book: "Mathematics Part 2 (Class 12)",
    chapter: 13,
    chapterName: "Probability",
    pageStart: 530,
    pageEnd: 573,
    keyPages: [532, 541, 550, 560, 568],
  },

  "Sequences, Series & Complex Numbers": {
    book: "Mathematics (Class 11)",
    chapter: 9,
    chapterName: "Sequences and Series",
    pageStart: 177,
    pageEnd: 219,
    keyPages: [179, 188, 198, 208, 215],
  },
};
