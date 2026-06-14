import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <Link href="/hi" className="text-2xl font-bold tracking-tight mb-8">
        10min<span className="text-orange-500">CUET</span>
      </Link>

      <p className="text-7xl font-extrabold text-gray-100 select-none">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-gray-900">पृष्ठ नहीं मिला</h1>
      <p className="mt-2 text-gray-500">यह पृष्ठ मौजूद नहीं है या स्थानांतरित किया गया है।</p>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link
          href="/hi/topics"
          className="px-5 py-2.5 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
        >
          पढ़ना शुरू करें
        </Link>
        <Link
          href="/hi/pricing"
          className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          मूल्य निर्धारण
        </Link>
        <Link
          href="/hi/blog"
          className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          ब्लॉग
        </Link>
      </div>
    </div>
  );
}
