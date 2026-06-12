"use client";

import { useEffect, useState } from "react";
import { ConvexHttpClient } from "convex/browser";
import { api } from "convex/_generated/api";
import { TOKEN_KEY } from "../utils/auth";

const SESSION_KEY = "ab_session_v1";

function getOrCreateSession(): string {
  if (typeof window === "undefined") return "ssr";
  let s = localStorage.getItem(SESSION_KEY);
  if (!s) {
    s = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, s);
  }
  return s;
}

function userIdFromToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const tok = localStorage.getItem(TOKEN_KEY);
  if (!tok) return undefined;
  try {
    const payload = JSON.parse(atob(tok.split(".")[1]));
    return payload.sub;
  } catch {
    return undefined;
  }
}

// Returns the assigned variant key for the given experiment.
// Logs an exposure on first render. Returns null while loading or if
// the test isn't running.
export function useVariant(testKey: string): string | null {
  const [variant, setVariant] = useState<string | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) return;
    const convex = new ConvexHttpClient(url);
    const sessionId = getOrCreateSession();
    const userId = userIdFromToken();
    const identityKey = userId ?? sessionId;

    let mounted = true;
    convex
      .query(api.abTests.assign, { testKey, identityKey })
      .then(async (assignment) => {
        if (!mounted || !assignment?.variantKey) {
          setVariant(null);
          return;
        }
        setVariant(assignment.variantKey);
        await convex.mutation(api.abTests.recordExposure, {
          testKey,
          variantKey: assignment.variantKey,
          sessionId,
          userId: userId as any,
        });
      })
      .catch(() => setVariant(null));

    return () => {
      mounted = false;
    };
  }, [testKey]);

  return variant;
}

// Call this from your code (e.g. on signup complete, mock submitted) to
// record a conversion against the user's currently-assigned variant.
export async function recordConversion(testKey: string, variantKey: string, userId: string) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url || typeof window === "undefined") return;
  const convex = new ConvexHttpClient(url);
  await convex.mutation(api.abTests.recordConversion, {
    testKey,
    variantKey,
    userId: userId as any,
  });
}
