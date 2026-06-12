import Link from "next/link";
import type { Metadata } from "next";
import { PublicNav } from "../components/PublicNav";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — 10minCUET",
  description:
    "Refund and cancellation policy for 10minCUET subscriptions. Operated by EAZEALLIANCE SERVICES PRIVATE LIMITED.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-black text-gray-900 mb-3">{title}</h2>
      <div className="text-sm text-gray-700 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-0">
        <Section title="Our policy in plain English.">
          <p>
            We want you to pay only for value you receive. If the platform didn&apos;t work as
            described, we refund. If you had buyer&apos;s remorse after accessing content, we
            don&apos;t. The rules below explain exactly where we draw that line.
          </p>
        </Section>

        <Section title="Monthly plans (Single Subject · Full Bundle).">
          <p>
            You may request a full refund within <strong>7 days of your first payment</strong>,
            provided you have not:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Completed more than 3 quiz or practice sessions on the platform</li>
            <li>Accessed the Bloom plan for any topic</li>
            <li>Downloaded or exported any content</li>
          </ul>
          <p>
            After 7 days, or if the above conditions are not met, no refund is issued for the
            current billing period. You may cancel at any time — access continues until the period
            end, and you will not be charged again.
          </p>
        </Section>

        <Section title="Annual plans (Annual Bundle · Parent + Kid).">
          <p>
            You may request a refund within <strong>7 days of purchase</strong>, provided you have
            not completed more than 5 sessions. After 7 days, no refund is issued. The access
            window continues until the end of the annual period.
          </p>
        </Section>

        <Section title="Free diagnostic tier.">
          <p>No payment is involved. Nothing to refund.</p>
        </Section>

        <Section title="Referral credits.">
          <p>
            Free months earned via referral have no cash value and cannot be refunded. If the
            referred friend requests a refund within their 7-day window, the month you earned for
            that referral is cancelled.
          </p>
        </Section>

        <Section title="Cancellation.">
          <p>
            Monthly plans do not auto-renew unless you opt in. When your period ends, access locks
            automatically — you are not charged again. To stop a monthly renewal, simply do not
            renew when prompted.
          </p>
          <p>Annual plans are one-time payments. There is no subscription to cancel.</p>
        </Section>

        <Section title="How to request a refund.">
          <ol className="list-decimal list-inside space-y-2 ml-2">
            <li>
              Email <strong>support@10minjee.com</strong> from your registered email address.
            </li>
            <li>Include your Razorpay payment ID (visible in your confirmation email).</li>
            <li>State the reason briefly — no long explanation needed.</li>
          </ol>
          <p>
            We acknowledge within 1 business day. Approved refunds are processed to your original
            payment method within <strong>5–10 business days</strong>. Razorpay&apos;s settlement
            timing is outside our control.
          </p>
        </Section>

        <Section title="Disputes.">
          <p>
            If you disagree with our refund decision, email us within 30 days of the decision. We
            respond within 7 business days. Unresolved disputes are subject to Indian jurisdiction
            as stated in our{" "}
            <Link href="/terms" className="text-orange-500 underline">
              Terms of Use
            </Link>
            .
          </p>
        </Section>

        <Section title="Company details.">
          <p>
            <strong>EAZEALLIANCE SERVICES PRIVATE LIMITED</strong>
            <br />
            GST: 09AAHCE2255K1ZF
            <br />
            Contact: support@10minjee.com
            <br />
            Platform: 10minjee.com
          </p>
        </Section>

      </div>
    </div>
  );
}
