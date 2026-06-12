import type { BloomLevel } from "./bloom";
import { CUET_QUESTION_META } from "./cuet-question-meta";
// NOTE: question CONTENT lives in cuet-questions.ts (server-only) and is served
// exclusively via /api/questions. This client-safe module exposes only the
// Question type plus Bloom-distribution helpers built from id/slug/level
// metadata — no question text or answers ever enter the client bundle.

export type Question = {
  id: string;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
  subConcept: string;
  source: "original" | "pyq" | "new";
  year?: number;
  difficulty?: "easy" | "medium" | "hard";
  bloomLevel?: BloomLevel;
};

// ─── Bloom level per question (client-safe, derived from metadata) ────────────
//   L2 = Understand · L3 = Apply · L4 = Analyse · L5 = Evaluate
export const questionBloomMap: Record<string, BloomLevel> = {};
for (const [id, , level] of CUET_QUESTION_META) {
  questionBloomMap[id] = level;
}

// ─── Question ID → topic slug mapping (client-safe, no question content) ──────
export const questionIdsByTopic: Record<string, string[]> = {};
for (const [id, slug] of CUET_QUESTION_META) {
  if (!questionIdsByTopic[slug]) questionIdsByTopic[slug] = [];
  questionIdsByTopic[slug].push(id);
}

// Returns distribution of Bloom levels across all questions for a topic.
export function getTopicBloomDistribution(
  topicSlug: string
): Partial<Record<BloomLevel, number>> {
  const ids = questionIdsByTopic[topicSlug] ?? [];
  const dist: Partial<Record<BloomLevel, number>> = {};
  ids.forEach((id) => {
    const lvl: BloomLevel = (questionBloomMap[id] as BloomLevel) ?? 3;
    dist[lvl] = (dist[lvl] ?? 0) + 1;
  });
  return dist;
}

// Returns the dominant (modal) Bloom level CUET tests for this topic.
export function getTopicJEEBloomLevel(topicSlug: string): BloomLevel {
  const dist = getTopicBloomDistribution(topicSlug);
  let maxCount = 0;
  let maxLevel: BloomLevel = 3;
  (Object.entries(dist) as [string, number][]).forEach(([lvl, count]) => {
    if (count > maxCount) {
      maxCount = count;
      maxLevel = parseInt(lvl) as BloomLevel;
    }
  });
  return maxLevel;
}

// ─── Difficulty map derived from questionBloomMap ────────────────────────────
// L1-L2 → easy, L3 → medium, L4+ → hard
export const questionDifficultyMap: Record<string, "easy" | "medium" | "hard"> = Object.fromEntries(
  Object.entries(questionBloomMap).map(([id, level]) => {
    const difficulty: "easy" | "medium" | "hard" =
      level <= 2 ? "easy" : level === 3 ? "medium" : "hard";
    return [id, difficulty];
  })
);
