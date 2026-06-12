// @ts-nocheck
import "server-only";
import { verifyToken, getAuthHeader } from "../../../lib/auth.server";
import { getConvexClient } from "../../../lib/convexClient";
import { sendPostMockEmail } from "../../../lib/email-service";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export async function POST(req: Request) {
  const payload = await verifyToken(getAuthHeader(req));
  if (!payload) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const {
      score,
      subject,
      weakTopics,
      strongTopics,
      languagesScore,
      chemScore,
      generalTestScore,
    } = await req.json();

    if (score == null || !subject) {
      return Response.json({ error: "score and subject are required" }, { status: 400 });
    }

    const convex = getConvexClient();
    if (!convex) return Response.json({ error: "Service unavailable" }, { status: 503 });

    const user = await convex.query(api.users.getById, { id: payload.sub as Id<"users"> });
    if (!user?.email || user.emailSuppressed) {
      return Response.json({ ok: true, skipped: true });
    }

    await sendPostMockEmail(
      user.email,
      user.name,
      score,
      subject,
      weakTopics ?? [],
      strongTopics ?? [],
      languagesScore,
      chemScore,
      generalTestScore
    );

    return Response.json({ ok: true });
  } catch (err) {
    console.error("post-mock email error:", err);
    return Response.json({ error: "Failed to send post-mock email" }, { status: 500 });
  }
}
