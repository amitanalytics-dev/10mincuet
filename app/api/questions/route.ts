import { verifyToken, getAuthHeader } from "../../lib/auth.server";
import { CUET_QUESTIONS, TOPIC_SLUG_TO_SECTION } from "../../data/cuet-questions";
import type { Question } from "../../data/questions";

// ─── CUET question bank (server-side only) ───────────────────────────────────
const mergedBank: Record<string, Question[]> = {};
for (const [slug, qs] of Object.entries(CUET_QUESTIONS)) {
  mergedBank[slug] = qs.map((q) => ({ ...q }));
}

// ─── Simple in-memory rate limiter ───────────────────────────────────────────
// Resets on cold start. Deters casual scrapers; upgrade to Redis for prod.
const rateMap = new Map<string, { count: number; windowStart: number }>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX ?? "60", 10);

function checkRateLimit(deviceId: string): { ok: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateMap.get(deviceId);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    rateMap.set(deviceId, { count: 1, windowStart: now });
    return { ok: true, remaining: MAX_REQUESTS - 1 };
  }

  entry.count++;
  if (entry.count > MAX_REQUESTS) {
    return { ok: false, remaining: 0 };
  }
  return { ok: true, remaining: MAX_REQUESTS - entry.count };
}

// Evict stale entries to prevent memory leak
setInterval(() => {
  const cutoff = Date.now() - WINDOW_MS;
  for (const [id, entry] of rateMap.entries()) {
    if (entry.windowStart < cutoff) rateMap.delete(id);
  }
}, WINDOW_MS);

// ─── GET /api/questions?topic=<slug> ─────────────────────────────────────────

export async function GET(req: Request) {
  // Get topic first to check if it's a public endpoint
  const url = new URL(req.url);
  const topic = url.searchParams.get("topic");

  // 1. Verify JWT (skip for _mock which is public)
  let payload;
  if (topic !== "_mock") {
    payload = await verifyToken(getAuthHeader(req));
    if (!payload) {
      return Response.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }
  }

  // 2. Rate limiting by device ID (passed as query param)
  const deviceId = url.searchParams.get("did") ?? payload?.sub ?? "anonymous";

  const { ok, remaining } = checkRateLimit(deviceId);
  if (!ok) {
    return Response.json(
      { error: "Rate limit exceeded. Try again in an hour." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": "0",
          "Retry-After": "3600",
        },
      }
    );
  }

  // 3. Return questions for topic
  if (!topic) {
    return Response.json({ error: "topic param required" }, { status: 400 });
  }

  // ─── Mock mode: CUET 3-section paper (Languages / Domain / General Test) ────
  // Each section ~ up to 50 questions, +5/−1 marking, served by section tag.
  if (topic === "_mock") {
    const bySection: Record<"languages" | "domain" | "general", Question[]> = {
      languages: [],
      domain: [],
      general: [],
    };
    for (const [slug, qs] of Object.entries(mergedBank)) {
      const section = TOPIC_SLUG_TO_SECTION[slug] ?? "domain";
      for (const q of qs) bySection[section].push(q);
    }

    const pick = (arr: Question[], n: number, subject: "languages" | "domain" | "general") =>
      arr
        .sort(() => Math.random() - 0.5)
        .slice(0, n)
        .map((q) => ({ ...q, subject }));

    const mock = [
      ...pick(bySection.languages, 50, "languages"),
      ...pick(bySection.domain, 50, "domain"),
      ...pick(bySection.general, 50, "general"),
    ];

    return Response.json(mock, {
      headers: {
        "X-RateLimit-Remaining": String(remaining),
        "Cache-Control": "no-store",
      },
    });
  }

  const questions = mergedBank[topic] ?? [];

  return Response.json(
    { questions, total: questions.length },
    {
      headers: {
        "X-RateLimit-Remaining": String(remaining),
        // Prevent client-side caching of question data
        "Cache-Control": "no-store",
      },
    }
  );
}
