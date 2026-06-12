import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Failed — 10minCUET",
};

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-6">❌</div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Payment was not completed</h1>
        <p className="text-gray-500 text-sm mb-6">
          Your card was not charged. This could be due to a network issue, bank decline, or you cancelled the payment.
          No amount has been deducted from your account.
        </p>
        <Link
          href="/pricing"
          className="block bg-orange-500 text-white font-black py-4 px-8 rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 text-lg mb-4"
        >
          Try again →
        </Link>
        <p className="text-sm text-gray-400 mb-4">
          If money was debited but you see this page, email us with your UPI/card reference number.
        </p>
        <a
          href="mailto:support@10minjee.com?subject=Payment%20Issue%20—%2010minCUET"
          className="text-sm text-orange-500 font-semibold hover:underline"
        >
          Contact support →
        </a>
        <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-300 space-y-1">
          <p>EAZEALLIANCE SERVICES PRIVATE LIMITED · GST 09AAHCE2255K1ZF</p>
          <p>10minjee.com</p>
        </div>
      </div>
    </div>
  );
}
