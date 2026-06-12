"use client";

import { useState } from "react";
import { Analytics } from "../lib/analytics";

interface Props {
  tier: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function RazorpayButton({ tier, label, className, children }: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [payError, setPayError] = useState<string>("");

  async function handlePay() {
    Analytics.upgradeClicked("pricing_page");
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("jee_token_v1") : null;

    if (!token) {
      window.location.href = "/register";
      return;
    }

    try {
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (!res.ok) { setPayError(data.error ?? "Payment failed. Please try again."); setLoading(false); return; }

      const loaded = await loadRazorpay();
      if (!loaded) { setPayError("Failed to load payment gateway. Refresh and try again."); setLoading(false); return; }

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "10minCUET",
        description: data.planLabel,
        order_id: data.orderId,
        prefill: { name: data.userName, email: data.userEmail },
        theme: { color: "#f97316" },
        handler: function() {
          setDone(true);
          setLoading(false);
          setTimeout(() => { window.location.href = "/topics?upgraded=1"; }, 2000);
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.open();
    } catch {
      setPayError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="block text-center font-bold py-3 rounded-xl bg-green-500 text-white text-sm">
        ✅ Payment successful! Redirecting…
      </div>
    );
  }

  return (
    <>
    {payError && <p className="text-red-500 text-xs mt-1 mb-2">{payError}</p>}
    <button
      onClick={handlePay}
      disabled={loading}
      className={className}
    >
      {loading ? "Processing…" : children}
    </button>
    </>
  );
}
