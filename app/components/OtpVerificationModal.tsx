"use client";

import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

interface Props {
  onVerified: () => void;
}

export function OtpVerificationModal({ onVerified }: Props) {
  const { user, isLoading } = useUser();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone }),
      });

      if (!response.ok) throw new Error("Failed to send OTP");
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) throw new Error("Invalid OTP");
      onVerified();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 mb-2">🔐 Verify & Access</h2>
          <p className="text-gray-600">Free tier: 1 year analysis available</p>
        </div>

        {step === "email" ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                required
              />
            </div>

            {error && <div className="p-3 bg-red-100 text-red-900 rounded-lg text-sm">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-all"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                OTP sent to <span className="font-bold">{email}</span>
              </p>
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setOtp("");
                }}
                className="text-xs text-blue-600 font-bold mt-2 hover:underline"
              >
                Change email
              </button>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none text-center text-2xl tracking-widest font-bold"
                required
              />
            </div>

            {error && <div className="p-3 bg-red-100 text-red-900 rounded-lg text-sm">{error}</div>}

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-all"
            >
              {loading ? "Verifying..." : "Verify & Unlock"}
            </button>

            <p className="text-xs text-gray-600 text-center">
              Didn't receive? <button type="button" className="text-orange-600 font-bold hover:underline">Resend OTP</button>
            </p>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            ✓ Secure verification • ✓ No spam emails • ✓ 1 year paper access
          </p>
        </div>
      </div>
    </div>
  );
}
