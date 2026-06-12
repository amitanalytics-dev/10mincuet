"use client";

import Link from "next/link";
import { AUTH_KEY, TOKEN_KEY } from "../utils/auth";

export function NavActions() {
  function handleLogout() {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/";
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Link
        href="/mock"
        className="text-xs font-bold px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all hidden sm:inline-flex items-center gap-1"
      >
        📝 Mock
      </Link>
      <Link
        href="/sprint"
        className="text-xs font-bold px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all hidden sm:inline-flex items-center gap-1"
      >
        ⚡ Sprint
      </Link>
      <Link
        href="/results"
        className="text-xs font-bold px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
      >
        📊 Results
      </Link>
      <button
        onClick={handleLogout}
        className="text-xs font-semibold px-3 py-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition-all"
      >
        Sign Out
      </button>
    </div>
  );
}
