// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import "server-only";
import { getConvexClient } from "../../lib/convexClient";
import { signToken } from "../../lib/auth.server";
import { api } from "convex/_generated/api";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://10mincuet.com";

export async function POST(req: Request) {
  const convex = getConvexClient();
  if (!convex) return Response.json({ error: "Service unavailable" }, { status: 503 });

  try {
    const { email, otp } = await req.json();
    if (!email || !otp) return Response.json({ error: "Email and OTP required" }, { status: 400 });

    const e = email.toLowerCase().trim();
    const valid = await convex.mutation(api.otpCodes.verify, { email: e, code: otp.trim() });
    if (!valid) return Response.json({ error: "Invalid or expired code" }, { status: 400 });

    const user = await convex.query(api.users.getByEmail, { email: e });
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    // Update last login timestamp (fire and forget — don't block auth on this)
    convex.mutation(api.users.updateLastLogin, { id: user._id }).catch((err) =>
      console.error("updateLastLogin failed:", err)
    );

    const isFirstLogin = !user.lastLoginAt;

    // Trigger welcome email sequence for first-time logins (fire and forget)
    if (isFirstLogin && user.email && !user.isKid) {
      fetch(`${BASE_URL}/api/email/send-welcome`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, name: user.name, userId: user._id }),
      }).catch((err) => console.error("Welcome email trigger failed:", err));
    }

    const token = await signToken({ sub: user._id.toString(), email: e, name: user.name, role: "student" });
    return Response.json({ token, userId: user._id.toString(), name: user.name });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return Response.json({ error: "Verification failed" }, { status: 500 });
  }
}
