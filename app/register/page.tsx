"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Analytics } from "../lib/analytics";

const TOKEN_KEY = "jee_token_v1";
const AUTH_KEY = "jee_auth_v1";

type Tab = "signup" | "login" | "kid";
type Step = "form" | "class-select" | "service-down";

export default function RegisterPageWrapper() {
  return (
    <Suspense>
      <RegisterPage />
    </Suspense>
  );
}

function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>("signup");
  const [step, setStep] = useState<Step>("form");

  // Signup state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [refCode, setRefCode] = useState("");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Kid login state
  const [kidCode, setKidCode] = useState("");

  const [pendingUserId, setPendingUserId] = useState("");
  const [pendingToken, setPendingToken] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySent, setNotifySent] = useState(false);

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) setRefCode(ref.toUpperCase());
    // If already logged in, skip to topics
    if (localStorage.getItem(AUTH_KEY) === "1") router.replace("/topics");
  }, [searchParams, router]);

  function storeTokenAndRedirect(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(AUTH_KEY, "1");
    router.push("/topics");
  }

  function storeTokenAndGoOnboarding(token: string, cls: string) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(AUTH_KEY, "1");
    router.push(`/onboarding?class=${cls}`);
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    Analytics.signupStarted();
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password, referralCode: refCode.trim() || undefined }),
      });
      if (res.status === 503) { setStep("service-down"); setNotifyEmail(email.trim().toLowerCase()); return; }
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Registration failed"); return; }
      setPendingToken(data.token);
      setPendingUserId(data.userId);
      setStep("class-select");
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  }

  async function handleClassSelect(cls: "11" | "12" | "dropper") {
    setLoading(true);
    Analytics.classSelected(cls);
    try {
      await fetch("/api/set-class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: pendingUserId, currentClass: cls }),
      });
    } finally {
      localStorage.setItem("jee_class_v1", cls);
      setLoading(false);
      storeTokenAndGoOnboarding(pendingToken, cls);
    }
  }

  async function handleNotifyMe(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/notify-me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: notifyEmail }),
      });
      setNotifySent(true);
    } catch { /* silent — user still sees confirm UI */ }
    finally { setLoading(false); }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginEmail.trim().toLowerCase(), password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Wrong email or password"); return; }
      Analytics.signupCompleted(data.class || "unknown");
      storeTokenAndRedirect(data.token);
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  }

  async function handleKidLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/kid-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kidCode: kidCode.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Invalid kid code"); return; }
      storeTokenAndRedirect(data.token);
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: "signup", label: "Sign Up" },
    { id: "login", label: "Login" },
    { id: "kid", label: "Kid Code" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/">
            <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg">⏱</div>
            <h1 className="text-2xl font-black text-gray-900">10min<span className="text-orange-500">CUET</span></h1>
          </Link>
          <p className="text-xs text-gray-400 mt-1">CUET prep in 10 minutes a day</p>
          <div className="inline-flex items-center gap-1.5 bg-green-50 border border-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mt-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            1,278+ students already inside
          </div>
        </div>

        {/* Tabs — hidden during service-down and class-select */}
        {step !== "service-down" && step !== "class-select" && (
          <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setError(""); setStep("form"); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${tab === t.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {step !== "service-down" && step !== "class-select" && error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center gap-2 mb-4">
            <span>⚠</span> {error}
          </div>
        )}

        {/* Signup Tab */}
        {tab === "signup" && step === "form" && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Your Name</label>
              <input type="text" value={name} onChange={e => { setName(e.target.value); setError(""); }}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                placeholder="Arjun Sharma" autoFocus />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                placeholder="arjun@example.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all pr-12"
                  placeholder="8+ characters" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs px-1">
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Referral Code <span className="text-gray-300 font-normal">(optional)</span></label>
              <input type="text" value={refCode} onChange={e => setRefCode(e.target.value.toUpperCase())}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all font-mono tracking-widest"
                placeholder="ABC123" maxLength={8} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 active:scale-95 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-orange-100">
              {loading ? "Creating account…" : "Create Account →"}
            </button>
          </form>
        )}


        {/* Class Select Step */}
        {tab === "signup" && step === "class-select" && (
          <div className="space-y-3">
            <p className="text-center text-sm font-semibold text-gray-700 mb-4">Which class are you in?</p>
            {[
              { value: "11", label: "Class 11", desc: "Just started CUET prep" },
              { value: "12", label: "Class 12", desc: "Final year, full syllabus" },
              { value: "dropper", label: "Dropper", desc: "Repeating for better rank" },
            ].map((opt) => (
              <button key={opt.value} onClick={() => handleClassSelect(opt.value as "11" | "12" | "dropper")}
                disabled={loading}
                className="w-full border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 rounded-xl px-4 py-4 text-left transition-all disabled:opacity-60">
                <div className="font-bold text-gray-900">{opt.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>
        )}

        {/* Service Down */}
        {step === "service-down" && (
          <div className="text-center">
            {notifySent ? (
              <>
                <div className="text-4xl mb-3">📬</div>
                <h2 className="font-black text-gray-900 mb-2">You&apos;re on the list</h2>
                <p className="text-sm text-gray-500">We&apos;ll email <strong>{notifyEmail}</strong> the moment we&apos;re back.</p>
                <button onClick={() => { setStep("form"); setNotifySent(false); }} className="mt-4 text-xs text-orange-500 hover:underline">
                  ← Try again
                </button>
              </>
            ) : (
              <>
                <div className="text-4xl mb-3">🛠</div>
                <h2 className="font-black text-gray-900 mb-1">We&apos;re down briefly</h2>
                <p className="text-sm text-gray-500 mb-4">Enter your email — we&apos;ll ping you the moment we&apos;re back.</p>
                <form onSubmit={handleNotifyMe} className="space-y-3 text-left">
                  <input
                    type="email"
                    value={notifyEmail}
                    onChange={e => setNotifyEmail(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                    placeholder="your@email.com"
                    required
                  />
                  <button type="submit" disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all">
                    {loading ? "Saving…" : "Notify me →"}
                  </button>
                </form>
                <button onClick={() => setStep("form")} className="mt-3 text-xs text-gray-400 hover:text-gray-600">
                  ← Back
                </button>
              </>
            )}
          </div>
        )}

        {/* Login Tab */}
        {step !== "service-down" && tab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
              <input type="email" value={loginEmail} onChange={e => { setLoginEmail(e.target.value); setError(""); }}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                placeholder="arjun@example.com" autoFocus />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={loginPassword} onChange={e => { setLoginPassword(e.target.value); setError(""); }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all pr-12"
                  placeholder="Your password" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs px-1">
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                <Link href="/contact?subject=Password+Reset+Request" className="text-xs text-orange-500 hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 active:scale-95 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-orange-100">
              {loading ? "Signing in…" : "Sign In →"}
            </button>
            <p className="text-center text-xs text-gray-400">
              No account?{" "}
              <button type="button" onClick={() => { setTab("signup"); setError(""); }} className="text-orange-500 font-semibold hover:underline">
                Sign up free
              </button>
            </p>
          </form>
        )}

        {/* Kid Code Tab */}
        {step !== "service-down" && tab === "kid" && (
          <form onSubmit={handleKidLogin} className="space-y-4">
            <div className="text-center text-sm text-gray-500 mb-2">
              Enter the code your parent gave you
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Kid Code</label>
              <input type="text" value={kidCode} onChange={e => { setKidCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8)); setError(""); }}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xl text-gray-900 placeholder:text-gray-400 bg-white font-mono tracking-[0.5em] text-center focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                placeholder="ABC123" maxLength={8} autoFocus />
            </div>
            <button type="submit" disabled={loading || kidCode.length < 6}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 active:scale-95 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-orange-100">
              {loading ? "Logging in…" : "Enter Platform →"}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-gray-300 mt-6">
          <Link href="/" className="hover:text-gray-400">← Back to home</Link>
          {" · "}
          <Link href="/terms" className="hover:text-gray-400">Terms</Link>
        </p>
      </div>
    </div>
  );
}
