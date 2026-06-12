import type { Question } from "../data/questions";

const DEVICE_ID_KEY = "jee_device_id_v1";

// ─── Device ID ────────────────────────────────────────────────────────────────
// Persisted per browser — same student sees same daily questions on retry

export function getDeviceId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

// ─── djb2 hash ────────────────────────────────────────────────────────────────
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    hash = hash & hash; // keep 32-bit
  }
  return Math.abs(hash);
}

// ─── Mulberry32 PRNG ──────────────────────────────────────────────────────────
// Fast, seedable, produces uniform [0, 1) floats

function mulberry32(seed: number): () => number {
  let s = seed;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
}

// ─── Daily seed ───────────────────────────────────────────────────────────────
// Combines: deviceId + topic + today's date
// → Same student, same topic, same day = same 8 questions
// → Different students = different subset
// → Tomorrow = fresh rotation

export function getDailyQuizSeed(topicSlug: string, deviceId: string): number {
  const today = new Date().toDateString(); // "Mon Jan 06 2025"
  return hashString(`${deviceId}__${topicSlug}__${today}`);
}

// ─── Question selector ────────────────────────────────────────────────────────
// Fisher-Yates shuffle using seeded RNG, then take first `count`

export function selectDailyQuestions(
  pool: Question[],
  count: number,
  seed: number
): Question[] {
  const rng = mulberry32(seed);
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, Math.min(count, arr.length));
}
