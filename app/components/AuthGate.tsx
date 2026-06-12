"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const AUTH_KEY = "jee_auth_v1";

// Routes that don't require authentication
const PUBLIC_PATHS = [
  "/", "/terms", "/register", "/login", "/pricing",
  "/payment/success", "/payment/failed",
  "/refund-policy", "/privacy-policy", "/contact",
  "/college-predictor", "/cutoffs", "/predictor", "/score-normalisation",
  // Blog (public, no signup needed)
  "/blog",
  // Free mock test (public, no signup needed)
  "/mock",
  // Public leaderboard
  "/leaderboard",
  // Public teams + season standings
  "/teams",
  // Public weekly challenge (browseable; join requires auth)
  "/challenge",
  // Public tournaments (browseable; register requires auth)
  "/tournaments",
  // Champions page is public (browse without login)
  "/champions",
];

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [authed, setAuthed] = useState(false);

  // Public routes bypass auth entirely — render immediately, no flash
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || (pathname.startsWith(p + "/") && p !== "/"));

  useEffect(() => {
    setMounted(true);
    const ok = localStorage.getItem(AUTH_KEY) === "1";
    setAuthed(ok);

    // Redirect unauthenticated visitors of protected routes
    if (!ok && !isPublic) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, router, isPublic]);

  // Public routes: render immediately, no auth needed
  if (isPublic) return <>{children}</>;

  // Show spinner while JS hydrates (avoids blank white flash)
  if (!mounted) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  // Mounted but not authed — redirect is in flight, show nothing to avoid flash of content
  if (!authed) return null;

  return <>{children}</>;
}
