import { PublicNav } from "../components/PublicNav";

export const metadata = {
  title: "Terms of Use — 10minCUET",
  description: "Terms of use for 10minCUET. All question content is original creative work. Personal use only.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNav />

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 text-sm text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-lg font-black text-gray-900 mb-3">1. Who We Are</h2>
          <p>
            10minCUET (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is an independent educational
            platform providing CUET UG preparation materials based on analysis of NTA official papers
            from 2015–2025. We are not affiliated with NTA, IITs, or any coaching institute.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-gray-900 mb-3">2. Intellectual Property</h2>
          <p className="mb-3">
            All content on this platform — including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>432 original practice questions (IDs <code className="bg-gray-100 px-1 rounded text-xs">phy-elec-1</code> through <code className="bg-gray-100 px-1 rounded text-xs">math-seq-p10</code>)</li>
            <li>Bloom&apos;s Taxonomy level classifications per question</li>
            <li>Sub-concept breakdowns and topic weightage analysis</li>
            <li>Question pool and difficulty mappings</li>
            <li>All accompanying explanations, solutions, and study plans</li>
          </ul>
          <p className="mt-3">
            — are <strong>original creative works</strong> owned exclusively by 10minCUET and are protected
            under Indian copyright law (Copyright Act, 1957) and applicable international copyright treaties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-gray-900 mb-3">3. Permitted Use</h2>
          <p>You may access and use this platform <strong>solely for your own personal, non-commercial study</strong>. Specifically, you may:</p>
          <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
            <li>View questions on screen during an active session</li>
            <li>Track your own Bloom level progress locally</li>
            <li>Share the platform URL with friends</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-black text-gray-900 mb-3">4. Prohibited Use</h2>
          <p className="mb-2">You may <strong>not</strong>:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Copy, screenshot, photograph, or record any question content</li>
            <li>Share question text in any form — WhatsApp, Telegram, Discord, PDFs, etc.</li>
            <li>Reproduce questions on any other website, app, or printed material</li>
            <li>Use question content to train AI/ML models</li>
            <li>Scrape or programmatically access our question API</li>
            <li>Reverse-engineer, decompile, or extract our question bank or Bloom mappings</li>
            <li>Re-sell, license, or commercialise any content from this platform</li>
            <li>Create derivative works based on our question content</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-black text-gray-900 mb-3">5. Access Credentials</h2>
          <p>
            Your login credentials are <strong>personal and non-transferable</strong>. Sharing your
            username and password with others — including study groups or coaching institutes — is
            a breach of these terms and will result in immediate access revocation.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-gray-900 mb-3">6. Enforcement</h2>
          <p>
            Each question carries a unique identifier (e.g., <code className="bg-gray-100 px-1 rounded text-xs">phy-elec-q07</code>).
            We use these IDs to detect unauthorised reproduction online. If we find our content
            reproduced without permission, we will pursue all available remedies including takedown
            notices and legal action.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-gray-900 mb-3">7. Disclaimer</h2>
          <p>
            This platform is provided &quot;as is&quot; for educational purposes. While we analyse
            official NTA papers, we make no guarantee of score improvement or CUET selection.
            The platform does not reproduce NTA exam questions — all questions are original
            compositions inspired by topic weightage patterns.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-gray-900 mb-3">8. Changes to These Terms</h2>
          <p>
            We may update these terms at any time. Continued use of the platform after changes
            are posted constitutes acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-black text-gray-900 mb-3">9. Contact</h2>
          <p>
            For permissions or takedown concerns:{" "}
            <span className="font-semibold text-gray-900">support@10mincuet.com</span>
          </p>
        </section>

      </div>
    </div>
  );
}
