import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-100 py-8 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div>
            <p className="font-black text-gray-900 text-lg">
              10min<span className="text-orange-500">CUET</span>
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Analysis based on CUET UG 2015–2025 · NTA official papers
            </p>
          </div>
          <Link
            href="/register"
            className="bg-orange-500 text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-orange-600 transition-all shrink-0"
          >
            Start Free →
          </Link>
        </div>

        <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 text-xs text-gray-400 mb-4">
          <Link href="/topics" className="hover:text-gray-600">Topics</Link>
          <span>·</span>
          <Link href="/mock" className="hover:text-gray-600">Mock Test</Link>
          <span>·</span>
          <Link href="/predictor" className="hover:text-gray-600">Score Predictor</Link>
          <span>·</span>
          <Link href="/college-predictor" className="hover:text-gray-600">College Predictor</Link>
          <span>·</span>
          <Link href="/sprint" className="hover:text-gray-600">30-Day Sprint</Link>
          <span>·</span>
          <Link href="/pricing" className="hover:text-gray-600">Pricing</Link>
          <span>·</span>
          <Link href="/about" className="hover:text-gray-600">About</Link>
          <span>·</span>
          <Link href="/contact" className="hover:text-gray-600">Contact</Link>
          <span>·</span>
          <Link href="/privacy-policy" className="hover:text-gray-600">Privacy</Link>
          <span>·</span>
          <Link href="/refund-policy" className="hover:text-gray-600">Refunds</Link>
          <span>·</span>
          <Link href="/terms" className="hover:text-gray-600">Terms</Link>
        </div>

        <p className="text-xs text-gray-300 text-center">
          © {new Date().getFullYear()} 10minCUET · EAZEALLIANCE SERVICES PRIVATE LIMITED · GST 09AAHCE2255K1ZF
        </p>
      </div>
    </footer>
  );
}
