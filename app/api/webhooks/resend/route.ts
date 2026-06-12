// @ts-nocheck
import "server-only";
import { getConvexClient } from "../../../lib/convexClient";
import { api } from "convex/_generated/api";

// Resend webhook: https://resend.com/docs/dashboard/webhooks/event-types
export async function POST(req: Request) {
  try {
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

    if (webhookSecret) {
      const svixId = req.headers.get("svix-id");
      const svixTimestamp = req.headers.get("svix-timestamp");
      const svixSignature = req.headers.get("svix-signature");

      if (!svixId || !svixTimestamp || !svixSignature) {
        return new Response("Missing webhook signature headers", { status: 400 });
      }

      const rawBody = await req.text();
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(webhookSecret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signedPayload = encoder.encode(`${svixId}.${svixTimestamp}.${rawBody}`);
      const sig = await crypto.subtle.sign("HMAC", key, signedPayload);
      const b64Sig = btoa(String.fromCharCode(...new Uint8Array(sig)));
      const expectedSig = `v1,${b64Sig}`;
      const receivedSigs = svixSignature.split(" ");

      if (!receivedSigs.some((s) => s === expectedSig)) {
        return new Response("Invalid signature", { status: 401 });
      }

      await processEvent(JSON.parse(rawBody));
    } else {
      await processEvent(await req.json());
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Resend webhook error:", err);
    return new Response("Internal error", { status: 500 });
  }
}

async function processEvent(event: Record<string, unknown>) {
  const convex = getConvexClient();
  if (!convex) return;

  const eventType = event.type as string;
  const data = (event.data ?? {}) as Record<string, unknown>;
  const toRaw = data.to;
  const toEmail = Array.isArray(toRaw) ? toRaw[0] : (toRaw as string | undefined) ?? "";
  const resendId = (data.email_id as string | undefined) ?? "";

  if (!toEmail) return;

  const eventTypeMap: Record<string, "delivered" | "opened" | "clicked" | "bounced" | "complained"> = {
    "email.delivered": "delivered",
    "email.opened": "opened",
    "email.clicked": "clicked",
    "email.bounced": "bounced",
    "email.complained": "complained",
  };

  const mappedType = eventTypeMap[eventType];
  if (!mappedType) return;

  const tags = (data.tags as Record<string, string> | undefined) ?? {};
  const emailType = tags["sequence"] ?? "unknown";

  await convex.mutation(api.emailEvents.logEmailEvent, {
    email: toEmail,
    emailType,
    eventType: mappedType,
    link: (data.click as Record<string, string> | undefined)?.link,
    resendId,
  });

  if (eventType === "email.bounced") {
    const bounceType = (data.bounce as Record<string, string> | undefined)?.type ?? "";
    if (bounceType === "hard") {
      await convex.mutation(api.users.setSuppressed, { email: toEmail, reason: "hard_bounce" });
    }
  }

  if (eventType === "email.complained") {
    await convex.mutation(api.users.setSuppressed, { email: toEmail, reason: "spam_complaint" });
  }
}
