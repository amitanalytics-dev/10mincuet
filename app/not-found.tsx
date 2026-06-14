import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <Link href="/" className="text-2xl font-bold tracking-tight mb-8">
        10min<span className="text-orange-500">CUET</span>
      </Link>

      <p className="text-7xl font-extrabold text-gray-100 select-none">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-gray-900">Page not found</h1>
      <p className="mt-2 text-gray-500">This page does not exist or was moved.</p>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link
          href="/topics"
          className="px-5 py-2.5 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
        >
          Start studying
        </Link>
        <Link
          href="/pricing"
          className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Pricing
        </Link>
        <Link
          href="/blog"
          className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Blog
        </Link>
      </div>
    </div>
  );
}
