import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Successful — 10minCUET",
};

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Payment successful!</h1>
        <p className="text-gray-500 text-sm mb-6">
          Your plan is now active. All topics, practice sessions, and daily plans are unlocked.
          A confirmation email has been sent to your registered address.
        </p>
        <Link
          href="/topics"
          className="block bg-orange-500 text-white font-black py-4 px-8 rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 text-lg mb-4"
        >
          Start studying →
        </Link>
        <Link href="/results" className="text-sm text-gray-400 hover:text-gray-600 underline">
          View my progress dashboard
        </Link>
        <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-300 space-y-1">
          <p>Payment processed by Razorpay</p>
          <p>EAZEALLIANCE SERVICES PRIVATE LIMITED · GST 09AAHCE2255K1ZF</p>
          <p>10minjee.com · support@10minjee.com</p>
        </div>
      </div>
    </div>
  );
}
