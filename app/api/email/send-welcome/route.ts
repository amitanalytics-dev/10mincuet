// @ts-nocheck
import "server-only";
import { getConvexClient } from "../../../lib/convexClient";
import { sendWelcomeDay1 } from "../../../lib/email-service";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export async function POST(req: Request) {
  try {
    const { email, name, userId } = await req.json();
    if (!email || !name || !userId) {
      return Response.json({ error: "email, name and userId are required" }, { status: 400 });
    }

    const convex = getConvexClient();
    if (!convex) return Response.json({ error: "Service unavailable" }, { status: 503 });

    // Send Day 1 immediately
    await sendWelcomeDay1(email, name);

    const now = Date.now();
    const uid = userId as Id<"users">;

    // Schedule Day 2 (24 hours) — at send time we check if mock was taken
    await convex.mutation(api.scheduledEmails.schedule, {
      userId: uid,
      email,
      type: "welcome-day2",
      scheduledFor: now + 24 * 60 * 60 * 1000,
    });

    // Schedule Day 7 (7 days)
    await convex.mutation(api.scheduledEmails.schedule, {
      userId: uid,
      email,
      type: "welcome-day7",
      scheduledFor: now + 7 * 24 * 60 * 60 * 1000,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("send-welcome error:", err);
    return Response.json({ error: "Failed to send welcome email" }, { status: 500 });
  }
}
