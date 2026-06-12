import Link from "next/link";
import type { Metadata } from "next";
import { PublicNav } from "../components/PublicNav";

export const metadata: Metadata = {
  title: "Privacy Policy — 10minCUET",
  description:
    "Privacy policy for 10minCUET. How we collect, use, and protect your data. DPDP Act 2023 compliant. Operated by EAZEALLIANCE SERVICES PRIVATE LIMITED.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-black text-gray-900 mb-3">{title}</h2>
      <div className="text-sm text-gray-700 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />

      <div className="max-w-3xl mx-auto px-4 py-10">
        <Section title="Who we are.">
          <p>
            10minCUET is operated by{" "}
            <strong>EAZEALLIANCE SERVICES PRIVATE LIMITED</strong>, registered in India. GST:{" "}
            <strong>09AAHCE2255K1ZF</strong>. We are the data fiduciary under the Digital Personal
            Data Protection Act, 2023 (DPDP Act).
          </p>
          <p>
            This policy explains what data we collect, why, how we use it, and your rights. It
            applies to all users of <strong>10minjee.com</strong>.
          </p>
        </Section>

        <Section title="What data we collect.">
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>
              <strong>Account data:</strong> name, email address, hashed password. Collected at
              registration.
            </li>
            <li>
              <strong>Kid accounts:</strong> a 6-character login code and the parent account it is
              linked to. No email is collected from student/kid accounts.
            </li>
            <li>
              <strong>Learning progress:</strong> your Bloom level per sub-concept, quiz scores,
              and session history. Stored to personalise your study plan.
            </li>
            <li>
              <strong>Payment metadata:</strong> Razorpay payment ID, order ID, amount, and status.
              We never receive or store card numbers, CVV, or bank details — those go directly to
              Razorpay.
            </li>
            <li>
              <strong>Referral data:</strong> your referral code and who you referred (by user ID
              only).
            </li>
            <li>
              <strong>Usage data:</strong> pages visited, sessions completed, general interaction
              patterns. Used to improve the platform.
            </li>
          </ul>
        </Section>

        <Section title="Why we collect it.">
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              To deliver personalised CUET prep sessions based on your Bloom level.
            </li>
            <li>To process payments for paid plans via Razorpay.</li>
            <li>
              To send weekly progress emails (Sunday mornings) if you registered with an email.
            </li>
            <li>To send OTP verification codes during registration.</li>
            <li>To track referrals and credit free months.</li>
            <li>To improve the platform.</li>
          </ul>
          <p>We do not sell your data. We do not share your data with third parties for advertising.</p>
        </Section>

        <Section title="Sub-processors.">
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>
              <strong>Convex</strong> (US): application database and backend.
            </li>
            <li>
              <strong>Resend</strong> (US): transactional email (OTPs, weekly progress reports).
            </li>
            <li>
              <strong>Razorpay</strong> (India): payment processing. Card data never touches our
              servers.
            </li>
            <li>
              <strong>Vercel</strong> (US): website hosting.
            </li>
          </ul>
          <p>We do not share your data with anyone outside this list.</p>
        </Section>

        <Section title="How long we keep your data.">
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <strong>Active accounts:</strong> retained while account exists, plus 18 months after
              last sign-in.
            </li>
            <li>
              <strong>Learning progress:</strong> retained for the lifetime of your account.
            </li>
            <li>
              <strong>Payment records:</strong> retained for 7 years under Indian tax law.
            </li>
            <li>
              <strong>OTP codes:</strong> deleted after use or after 10-minute expiry.
            </li>
            <li>
              <strong>Closed accounts:</strong> deleted within 30 days of a closure request, except
              payment records.
            </li>
          </ul>
        </Section>

        <Section title="Your rights under the DPDP Act 2023.">
          <p>You have the right to:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Access the personal data we hold about you.</li>
            <li>Correct inaccurate data.</li>
            <li>Request erasure (subject to the 7-year payment record exception).</li>
            <li>Withdraw consent for processing at any time.</li>
            <li>Raise a complaint with the Data Protection Board of India.</li>
          </ul>
          <p>
            To exercise any right, email <strong>support@10minjee.com</strong> with subject
            line <strong>&ldquo;Data request&rdquo;</strong>. We respond within 30 days.
          </p>
        </Section>

        <Section title="Cookies.">
          <p>
            We use a single session cookie for authentication. We do not use third-party
            behavioural tracking cookies, session-replay tools, or advertising pixels.
          </p>
        </Section>

        <Section title="Data security.">
          <p>
            All data is encrypted in transit (HTTPS/TLS) and at rest. Passwords are hashed using
            bcrypt and never stored in plaintext. We will notify affected users within 72 hours of
            any confirmed breach.
          </p>
        </Section>

        <Section title="Grievance Officer.">
          <p>
            As required by the IT (Intermediary Guidelines) Rules 2021 and DPDP Act 2023, our
            Grievance Officer is <strong>Amit Tyagi</strong>, reachable at{" "}
            <strong>support@10minjee.com</strong>. We acknowledge complaints within 48 hours
            and resolve them within 15 days.
          </p>
        </Section>

        <Section title="Changes to this policy.">
          <p>
            We may update this policy. Material changes will be emailed to your registered address
            at least 7 days before taking effect.
          </p>
        </Section>

      </div>
    </div>
  );
}
