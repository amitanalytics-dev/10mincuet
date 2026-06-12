// @ts-nocheck
import "server-only";
import { verifyToken, getAuthHeader } from "../../lib/auth.server";
import { getConvexClient } from "../../lib/convexClient";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export async function POST(req: Request) {
  const payload = await verifyToken(getAuthHeader(req));
  if (!payload) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { questionId, topicSlug, perceivedDifficulty, isError, errorNote, sessionType } = body;

  if (!questionId || !topicSlug || !perceivedDifficulty || !sessionType) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!["easy", "medium", "hard"].includes(perceivedDifficulty)) {
    return Response.json({ error: "Invalid difficulty" }, { status: 400 });
  }

  const convex = getConvexClient();
  if (!convex) return Response.json({ ok: true }); // Graceful degradation

  try {
    await convex.mutation(api.feedback.submitFeedback, {
      userId: payload.sub as Id<"users">,
      questionId,
      topicSlug,
      perceivedDifficulty,
      isError: !!isError,
      errorNote: errorNote || undefined,
      sessionType,
    });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Feedback submit error:", err);
    return Response.json({ ok: true }); // Never break quiz flow for feedback failures
  }
}
