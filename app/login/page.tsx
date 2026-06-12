"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const TOKEN_KEY = "jee_token_v1";
const AUTH_KEY = "jee_auth_v1";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/topics";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (localStorage.getItem(AUTH_KEY) === "1") {
      router.replace(from);
    }
  }, [from, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim().toLowerCase(), password }),
      });

      if (res.ok) {
        const { token } = await res.json();
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(AUTH_KEY, "1");
        router.replace(from);
      } else {
        // If login fails, offer to create account with this email
        setError(`No account found. Create one with ${username} or try a different email.`);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
              ⏱
            </div>
            <div className="text-2xl font-black text-gray-900">
              10min<span className="text-orange-500">CUET</span>
            </div>
          </Link>
          <p className="text-sm text-gray-400 mt-1">Sign in to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
              placeholder="Enter your email"
              autoComplete="email"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all pr-12"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs px-1"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}

          <div className="flex justify-end -mt-1">
            <Link
              href="/contact?subject=Password+Reset+Request"
              className="text-xs text-orange-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 active:scale-95 text-white font-bold py-3.5 rounded-xl transition-all mt-2 shadow-md shadow-orange-100"
          >
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          New here?{" "}
          <Link href="/register" className="text-orange-500 font-semibold hover:underline">
            Create free account →
          </Link>
        </p>
        <p className="text-center text-xs text-gray-300 mt-2">
          <Link href="/" className="hover:text-gray-400">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
