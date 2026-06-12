import "server-only";
import { verifyToken, getAuthHeader } from "./auth.server";

// Founders who can see /admin. Same set as the daily-report cron recipients.
const FOUNDER_EMAILS = new Set([
  "mehrotrarishabh41@gmail.com",
  "amit@berriesadvisory.com",
]);

export async function requireFounder(req: Request): Promise<{ email: string } | null> {
  const payload = await verifyToken(getAuthHeader(req));
  if (!payload?.email) return null;
  const email = String(payload.email).toLowerCase();
  return FOUNDER_EMAILS.has(email) ? { email } : null;
}

export const FOUNDER_EMAIL_LIST = Array.from(FOUNDER_EMAILS);
