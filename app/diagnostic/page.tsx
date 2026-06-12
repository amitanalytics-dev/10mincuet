import type { Metadata } from "next";
import { BASE_URL } from "@/app/lib/site";
import { CUET_QUESTIONS } from "../data/cuet-questions";
import { DiagnosticClient, type DiagQuestion } from "./DiagnosticClient";

export const metadata: Metadata = {
  title: "Free 2-Minute CUET Diagnostic — No Signup | 10minCUET",
  description:
    "Take a free 6-question CUET UG diagnostic — 2 English, 2 General Test, 2 from your stream (Science, Commerce or Humanities). Instant feedback, no signup needed.",
  alternates: { canonical: `${BASE_URL}/diagnostic` },
  openGraph: {
    title: "Free 2-Minute CUET Diagnostic — No Signup | 10minCUET",
    description:
      "6 quick CUET questions. Instant feedback. Find your weakest area in 2 minutes — no signup.",
    url: `${BASE_URL}/diagnostic`,
  },
};

// Topic slugs per pool
const ENGLISH_TOPICS = [
  "reading-comprehension",
  "grammar-and-sentence-correction",
  "vocabulary",
  "verbal-ability",
];
const GENERAL_TOPICS = [
  "quantitative-aptitude",
  "logical-and-analytical-reasoning",
  "general-knowledge-and-current-affairs",
  "general-mental-ability",
];
const STREAM_TOPICS: Record<string, string[]> = {
  science: [
    "electrostatics-and-capacitance",
    "chemical-bonding-and-structure",
    "cell-biology-and-genetics",
    "calculus",
    "optics",
    "organic-chemistry",
  ],
  commerce: [
    "partnership-accounts",
    "principles-and-functions-of-management",
    "microeconomics",
    "company-accounts",
    "marketing-management",
    "macroeconomics",
  ],
  humanities: [
    "ancient-india",
    "physical-geography",
    "indian-constitution-and-politics",
    "modern-india-and-freedom-struggle",
    "human-and-economic-geography",
    "political-theory",
  ],
};

function pick(topics: string[], count: number, area: string): DiagQuestion[] {
  // Deterministic-per-render sampling: shuffle topic order, take the first
  // question of each topic until we have `count`.
  const shuffled = [...topics].sort(() => Math.random() - 0.5);
  const out: DiagQuestion[] = [];
  for (const slug of shuffled) {
    const pool = CUET_QUESTIONS[slug];
    if (!pool || pool.length === 0) continue;
    const q = pool[Math.floor(Math.random() * pool.length)];
    out.push({
      id: q.id,
      text: q.text,
      options: q.options,
      correct: q.correct,
      explanation: q.explanation,
      area,
      topic: slug,
    });
    if (out.length === count) break;
  }
  return out;
}

// Re-sample on every request so repeat visitors see fresh questions.
export const dynamic = "force-dynamic";

export default function DiagnosticPage() {
  const data = {
    english: pick(ENGLISH_TOPICS, 2, "English"),
    general: pick(GENERAL_TOPICS, 2, "General Test"),
    science: pick(STREAM_TOPICS.science, 2, "Science domain"),
    commerce: pick(STREAM_TOPICS.commerce, 2, "Commerce domain"),
    humanities: pick(STREAM_TOPICS.humanities, 2, "Humanities domain"),
  };
  return <DiagnosticClient data={data} />;
}
