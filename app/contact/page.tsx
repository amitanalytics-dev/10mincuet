import Link from "next/link";
import type { Metadata } from "next";
import { PublicNav } from "../components/PublicNav";

export const metadata: Metadata = {
  title: "Contact — 10minCUET",
  description:
    "Contact 10minCUET for support, refunds, or queries. Operated by EAZEALLIANCE SERVICES PRIVATE LIMITED.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="text-2xl mb-3">📧</div>
            <h2 className="font-black text-gray-900 mb-1">Email Support</h2>
            <p className="text-sm text-gray-500 mb-3">
              For payments, refunds, technical issues, and general queries.
            </p>
            <a
              href="mailto:support@10minjee.com"
              className="text-orange-500 font-semibold text-sm hover:underline"
            >
              support@10minjee.com
            </a>
            <p className="text-xs text-gray-400 mt-2">We respond within 1 business day.</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="text-2xl mb-3">💳</div>
            <h2 className="font-black text-gray-900 mb-1">Payment Issues</h2>
            <p className="text-sm text-gray-500 mb-3">
              Money deducted but access not granted? Email with your Razorpay payment ID.
            </p>
            <a
              href="mailto:support@10minjee.com?subject=Payment%20Issue%20%E2%80%94%2010minCUET"
              className="text-orange-500 font-semibold text-sm hover:underline"
            >
              Report a payment issue →
            </a>
            <p className="text-xs text-gray-400 mt-2">Resolved within 2 business days.</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="text-2xl mb-3">🔄</div>
            <h2 className="font-black text-gray-900 mb-1">Refund Requests</h2>
            <p className="text-sm text-gray-500 mb-3">
              Read our refund policy, then email with your payment ID and the reason.
            </p>
            <Link href="/refund-policy" className="text-orange-500 font-semibold text-sm hover:underline">
              View refund policy →
            </Link>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="text-2xl mb-3">🏢</div>
            <h2 className="font-black text-gray-900 mb-1">Company Details</h2>
            <p className="text-sm text-gray-700 font-semibold">
              EAZEALLIANCE SERVICES PRIVATE LIMITED
            </p>
            <p className="text-xs text-gray-500 mt-1">GST: 09AAHCE2255K1ZF</p>
            <p className="text-xs text-gray-500">Platform: 10minjee.com</p>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center">
          <h3 className="font-black text-gray-900 mb-1">Response time commitment</h3>
          <p className="text-sm text-gray-600">
            General queries — 1 business day.
            <br />
            Payment issues — 2 business days.
            <br />
            Refund requests — acknowledged within 1 day, processed in 5–10 business days.
          </p>
        </div>

      </div>
    </div>
  );
}
