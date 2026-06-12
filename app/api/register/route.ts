// @ts-nocheck
import { BASE_URL } from "@/app/lib/site";
// Run 'npx convex dev' first to generate convex/_generated/
import "server-only";
import bcrypt from "bcryptjs";
import { getConvexClient } from "../../lib/convexClient";
import { signToken } from "../../lib/auth.server";
import { api } from "convex/_generated/api";

function generateReferralCode(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function POST(req: Request) {
  const convex = getConvexClient();
  if (!convex) return Response.json({ error: "Registration unavailable" }, { status: 503 });

  try {
    const { name, email, password, referralCode } = await req.json();

    if (!name?.trim()) return Response.json({ error: "Name is required" }, { status: 400 });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return Response.json({ error: "Valid email required" }, { status: 400 });
    if (!password || password.length < 8)
      return Response.json({ error: "Password must be 8+ characters" }, { status: 400 });

    const e = email.toLowerCase().trim();
    const existing = await convex.query(api.users.getByEmail, { email: e });
    if (existing) return Response.json({ error: "Email already registered" }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, 10);

    // Generate unique referral code
    let myReferralCode = "";
    for (let i = 0; i < 10; i++) {
      const code = generateReferralCode();
      const taken = await convex.query(api.users.getByReferralCode, { code });
      if (!taken) { myReferralCode = code; break; }
    }
    if (!myReferralCode) return Response.json({ error: "Try again" }, { status: 500 });

    const createArgs: {
      email: string;
      name: string;
      passwordHash: string;
      referralCode: string;
      referredByCode?: string;
    } = {
      email: e,
      name: name.trim(),
      passwordHash,
      referralCode: myReferralCode,
    };
    const trimmedRef = referralCode?.trim();
    if (trimmedRef) createArgs.referredByCode = trimmedRef;

    const userId = await convex.mutation(api.users.create, createArgs);

    await convex.mutation(api.subscriptions.createFree, { userId });

    // If referred, record referral and notify the referrer
    if (referralCode?.trim()) {
      const referrer = await convex.query(api.users.getByReferralCode, { code: referralCode.trim() });
      if (referrer) {
        await convex.mutation(api.referrals.create, { referrerId: referrer._id, referredId: userId });

        // Notify referrer that their friend joined (fire and forget)
        if (referrer.email) {
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? BASE_URL;
          fetch(`${baseUrl}/api/email/referral`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event: "friend_joined",
              newUserEmail: e,
              originalUserEmail: referrer.email,
              newUserName: name.trim(),
              originalUserName: referrer.name,
            }),
          }).catch((err) => console.error("Referral email trigger failed:", err));
        }
      }
    }

    const token = await signToken({ sub: userId.toString(), email: e });
    return Response.json({ token, userId });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Register error:", msg, err);
    return Response.json({ error: "Registration failed: " + msg }, { status: 500 });
  }
}
