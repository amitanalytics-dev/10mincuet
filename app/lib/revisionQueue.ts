// Spaced-repetition revision queue — localStorage only, works logged-out.
// Wrong answers are enqueued; items come due after 2, then 7, then 21 days.
// Answer correctly at each stage to advance; after stage 3 the item graduates
// (is removed). A wrong review resets the item to stage 0.

export type RevisionItem = {
  id: string;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
  topicSlug: string;
  subConcept?: string;
  area?: string;
  stage: 0 | 1 | 2;
  addedAt: number;
  dueAt: number;
};

const KEY = "cuet_revision_queue_v1";
const DAY_MS = 24 * 60 * 60 * 1000;
// Due on day 2, day 7, day 21
export const INTERVAL_DAYS = [2, 7, 21] as const;

function canStore(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadQueue(): RevisionItem[] {
  if (!canStore()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RevisionItem[]) : [];
  } catch {
    return [];
  }
}

function saveQueue(items: RevisionItem[]) {
  if (!canStore()) return;
  try {
    // keep it bounded
    localStorage.setItem(KEY, JSON.stringify(items.slice(0, 300)));
  } catch {
    /* storage full / private mode — ignore */
  }
}

export type EnqueueInput = {
  id: string;
  text: string;
  options: string[];
  correct: number;
  explanation?: string;
  topicSlug?: string;
  subConcept?: string;
  area?: string;
};

/** Add a wrongly-answered question to the queue (or reset it if present). */
export function enqueueWrongAnswer(q: EnqueueInput) {
  const now = Date.now();
  const queue = loadQueue();
  const existing = queue.find((i) => i.id === q.id);
  if (existing) {
    existing.stage = 0;
    existing.dueAt = now + INTERVAL_DAYS[0] * DAY_MS;
  } else {
    queue.push({
      id: q.id,
      text: q.text,
      options: q.options,
      correct: q.correct,
      explanation: q.explanation ?? "",
      topicSlug: q.topicSlug ?? "",
      subConcept: q.subConcept,
      area: q.area,
      stage: 0,
      addedAt: now,
      dueAt: now + INTERVAL_DAYS[0] * DAY_MS,
    });
  }
  saveQueue(queue);
}

/** Items due for review right now (oldest due first). */
export function getDueItems(now = Date.now()): RevisionItem[] {
  return loadQueue()
    .filter((i) => i.dueAt <= now)
    .sort((a, b) => a.dueAt - b.dueAt);
}

/** Count of items due — for the nav badge. */
export function countDue(now = Date.now()): number {
  return loadQueue().filter((i) => i.dueAt <= now).length;
}

/** Total queued (due or scheduled). */
export function countQueued(): number {
  return loadQueue().length;
}

/** Next dueAt timestamp among scheduled items, or null if queue empty. */
export function nextDueAt(): number | null {
  const q = loadQueue();
  if (q.length === 0) return null;
  return q.reduce((min, i) => Math.min(min, i.dueAt), Infinity);
}

/**
 * Record a review result.
 * Correct: advance stage (graduate + remove after the last stage).
 * Wrong: reset to stage 0, due again in 2 days.
 */
export function recordReview(id: string, wasCorrect: boolean) {
  const now = Date.now();
  let queue = loadQueue();
  const item = queue.find((i) => i.id === id);
  if (!item) return;
  if (wasCorrect) {
    if (item.stage >= INTERVAL_DAYS.length - 1) {
      queue = queue.filter((i) => i.id !== id); // graduated
    } else {
      item.stage = (item.stage + 1) as 0 | 1 | 2;
      item.dueAt = now + INTERVAL_DAYS[item.stage] * DAY_MS;
    }
  } else {
    item.stage = 0;
    item.dueAt = now + INTERVAL_DAYS[0] * DAY_MS;
  }
  saveQueue(queue);
}
