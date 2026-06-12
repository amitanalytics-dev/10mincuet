export type ExamMarkingScheme = {
  correct: number;
  wrong: number;
  unattempted: number;
};

export type ExamConfig = {
  id: string;
  name: string;
  fullName: string;
  conductor: string;
  mode: "CBT";
  totalQuestions: number;
  attemptQuestions: number;
  durationMinutes: number;
  marking: ExamMarkingScheme;
  subjects: string[];
  sections?: { name: string; questions: number; durationMinutes: number }[];
  color: string;
  accent: string;
  tagline: string;
  acceptedBy?: string; // e.g. "280+ central universities"
  year: number; // exam year
};

export const EXAM_CONFIGS: Record<string, ExamConfig> = {
  cuet: {
    id: "cuet",
    name: "CUET UG",
    fullName: "Common University Entrance Test (Undergraduate)",
    conductor: "NTA",
    mode: "CBT",
    // v1 default: 3 most common picks (English + General Test + Mathematics).
    // Future: dynamic per-user picker over 27 domain subjects.
    totalQuestions: 150, // 50 per section × 3 sections
    attemptQuestions: 150,
    durationMinutes: 180, // 60 min per section
    marking: { correct: 5, wrong: -1, unattempted: 0 },
    subjects: ["Languages", "Domain", "General Test"],
    sections: [
      { name: "Languages", questions: 50, durationMinutes: 60 },
      { name: "Domain", questions: 50, durationMinutes: 60 },
      { name: "General Test", questions: 50, durationMinutes: 60 },
    ],
    color: "purple",
    accent: "#7C3AED",
    tagline: "One exam, 280+ central universities",
    acceptedBy: "280+ central universities including DU, JNU, BHU, Jamia",
    year: 2026,
  },
};

// Full list of CUET domain subjects (27). Users pick up to 6 during onboarding;
// v1 default treats their picks as "Domain" content.
export const CUET_DOMAIN_SUBJECTS = [
  "Accountancy", "Agriculture", "Anthropology", "Biology", "Business Studies",
  "Chemistry", "Computer Science", "Economics", "Engineering Graphics",
  "Entrepreneurship", "Environmental Studies", "Fine Arts", "Geography",
  "History", "Home Science", "Knowledge Tradition India", "Legal Studies",
  "Mass Media", "Mathematics", "Performing Arts", "Physical Education",
  "Physics", "Political Science", "Psychology", "Sanskrit", "Sociology",
  "Teaching Aptitude",
] as const;

// Languages available in CUET (Section IA + IB combined).
export const CUET_LANGUAGES = [
  "English", "Hindi", "Assamese", "Bengali", "Gujarati", "Kannada",
  "Malayalam", "Marathi", "Odia", "Punjabi", "Tamil", "Telugu", "Urdu",
] as const;

export function getExamConfig(examId: string): ExamConfig | null {
  return EXAM_CONFIGS[examId] ?? null;
}

// Max marks per exam
export function getMaxMarks(examId: string): number {
  const cfg = EXAM_CONFIGS[examId];
  if (!cfg) return 0;
  return cfg.attemptQuestions * cfg.marking.correct;
}

// Score from raw counts
export function calculateScore(
  examId: string,
  correct: number,
  wrong: number
): number {
  const cfg = EXAM_CONFIGS[examId];
  if (!cfg) return 0;
  return correct * cfg.marking.correct + wrong * cfg.marking.wrong;
}
