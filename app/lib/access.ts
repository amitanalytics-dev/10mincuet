// Trial + paid access checker. Used both server-side (via API routes) and
// client-side (via /api/me/access). Hard paywall: once trial expires and no
// active paid subscription, premium features are blocked.

export type AccessReason = "paid" | "trial" | "expired" | "free";

export interface AccessState {
  hasPremium: boolean;
  reason: AccessReason;
  trialEndsAt?: number;
  daysLeft?: number;
}

export function computeAccess(
  user: { trialEndsAt?: number } | null,
  subscription: { status?: string } | null,
  now: number = Date.now()
): AccessState {
  if (subscription?.status === "active") {
    return { hasPremium: true, reason: "paid" };
  }
  if (user?.trialEndsAt && user.trialEndsAt > now) {
    const daysLeft = Math.ceil((user.trialEndsAt - now) / (24 * 60 * 60 * 1000));
    return {
      hasPremium: true,
      reason: "trial",
      trialEndsAt: user.trialEndsAt,
      daysLeft,
    };
  }
  if (user?.trialEndsAt && user.trialEndsAt <= now) {
    return {
      hasPremium: false,
      reason: "expired",
      trialEndsAt: user.trialEndsAt,
    };
  }
  return { hasPremium: false, reason: "free" };
}
