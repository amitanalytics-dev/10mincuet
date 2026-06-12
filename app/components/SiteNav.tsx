"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ExamCountdown } from "./ExamCountdown";
import { AUTH_KEY, TOKEN_KEY } from "../utils/auth";
import { useLanguage } from "../context/LanguageContext";

export function SiteNav() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [streak, setStreak] = useState<{ streak: number; activeToday: boolean } | null>(null);
  const [access, setAccess] = useState<{ hasPremium: boolean; reason: string; daysLeft?: number } | null>(null);
  const { t } = useLanguage();

  const PUBLIC_LINKS = [
    { href: "/topics",      label: t.nav_topics },
    { href: "/mock",        label: t.nav_mock },
    { href: "/foundation",  label: "Foundation (Class 6–10)" },
    { href: "/blog",        label: "Blog" },
    { href: "/predictor",   label: t.nav_predictor },
    { href: "/pricing",     label: t.nav_pricing },
  ];

  const APP_LINKS = [
    { href: "/topics",      label: t.nav_topics },
    { href: "/mock",        label: t.nav_mock_short },
    { href: "/foundation",  label: "Foundation" },
    { href: "/sprint",      label: t.nav_sprint },
    { href: "/challenge",   label: t.nav_challenge },
    { href: "/tournaments", label: t.nav_tournaments },
    { href: "/leaderboard", label: t.nav_leaderboard },
    { href: "/teams",       label: t.nav_teams },
    { href: "/readiness",   label: t.nav_readiness },
    { href: "/study-rooms", label: t.nav_study_rooms },
    { href: "/educators",   label: t.nav_educators },
    { href: "/blog",        label: t.nav_blog },
  ];

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    setLoggedIn(!!token);
    if (!token) return;
    fetch("/api/me/streak", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (data.streak) setStreak({ streak: data.streak.streak, activeToday: data.streak.activeToday });
      })
      .catch(() => {});
    fetch("/api/me/access", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setAccess(data.access))
      .catch(() => {});
  }, []);

  function handleLogout() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/";
  }

  const links = loggedIn ? APP_LINKS : PUBLIC_LINKS;

  return (
    <nav className="border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link href={loggedIn ? "/topics" : "/"} className="font-black text-gray-900 text-lg shrink-0">
          10min<span className="text-purple-600">CUET</span>
        </Link>

        {/* Trial / access pill — only logged-in users */}
        {loggedIn && access && (access.reason === "trial" || access.reason === "expired") && (
          <Link
            href="/pricing"
            className={`hidden sm:block text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
              access.reason === "trial"
                ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                : "bg-red-100 text-red-800 hover:bg-red-200"
            }`}
          >
            {access.reason === "trial"
              ? `🎁 Trial · ${access.daysLeft}d left`
              : "🔒 Trial ended — Subscribe"}
          </Link>
        )}

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-5 flex-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-semibold transition-colors whitespace-nowrap ${
                pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href + "/"))
                  ? "text-orange-500"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          {loggedIn && streak && streak.streak > 0 && (
            <Link
              href="/sprint"
              title={streak.activeToday ? t.streak_active_today_hint : t.streak_inactive_today_hint}
              className={`text-xs font-bold px-2.5 py-1.5 rounded-full transition-colors flex items-center gap-1 ${
                streak.activeToday
                  ? "bg-orange-100 text-orange-700"
                  : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
              }`}
            >
              <span>🔥</span>
              <span className="tabular-nums">{streak.streak}</span>
            </Link>
          )}
          <LanguageSwitcher />
          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="text-sm font-semibold px-4 py-2 rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition-all hidden sm:block"
            >
              {t.nav_signout}
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-600 font-semibold px-4 py-2 rounded-full border border-gray-200 hover:border-gray-300 transition-all hidden sm:block"
              >
                {t.nav_signin}
              </Link>
              <Link
                href="/register"
                className="bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-orange-600 transition-all"
              >
                {t.nav_start_free}
              </Link>
            </>
          )}
          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Toggle menu"
            className="lg:hidden ml-1 p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Countdown strip */}
      <div className="border-t border-gray-50 px-4 py-1.5 flex justify-center lg:justify-start max-w-5xl mx-auto">
        <ExamCountdown />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className={`py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors ${
                pathname === l.href
                  ? "bg-orange-50 text-orange-500"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="border-t border-gray-100 mt-2 pt-2 flex gap-2">
            {loggedIn ? (
              <button
                onClick={() => { setMobileOpen(false); handleLogout(); }}
                className="flex-1 text-center text-sm font-semibold py-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-all"
              >
                {t.nav_signout}
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center text-sm font-semibold py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
                >
                  {t.nav_signin}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center text-sm font-bold py-2.5 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-all"
                >
                  {t.nav_start_free}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
