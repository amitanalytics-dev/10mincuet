import Link from "next/link";
import { ConvexHttpClient } from "convex/browser";
import { api } from "convex/_generated/api";
import { PublicNav } from "../components/PublicNav";
import { BLOGS } from "../data/blogs";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "CUET Prep Blog — Strategy, Topic Guides & Exam Analysis",
  description:
    "In-depth CUET UG preparation articles: section strategy, domain subject guides, General Test prep, NTA pattern breakdowns and university cutoff analysis.",
  alternates: { canonical: "https://10mincuet.com/blog" },
  openGraph: {
    title: "CUET Prep Blog — Strategy, Topic Guides & Exam Analysis",
    description: "CUET UG strategy, domain subject guides, General Test prep and exam analysis.",
    url: "https://10mincuet.com/blog",
    type: "website",
  },
};

const CATEGORIES = ["All", "Strategy", "Topic Deep-Dive", "Exam Analysis"];

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

const PAGE_SIZE = 20;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BlogView = {
  slug: string;
  title: string;
  content: string;
  subject: string;
  tags: string[];
  publishedAt: string;
  category: string;
  readingMinutes: number;
  description: string;
};

// Static CUET seed posts — always available so the page never throws on an
// empty or unreachable Convex backend.
const STATIC_BLOGS: BlogView[] = BLOGS.map((b) => ({
  slug: b.slug,
  title: b.title,
  content: b.content,
  subject: b.subject,
  tags: b.tags,
  publishedAt: new Date(b.publishedAt).toISOString(),
  category: b.category,
  readingMinutes: b.readingMinutes,
  description: b.description,
}));

async function loadBlogs(): Promise<BlogView[]> {
  // Convex is best-effort: if the env var is missing, the backend is down, or
  // the query throws, we silently fall back to the static CUET seed set.
  try {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) return STATIC_BLOGS;
    const convex = new ConvexHttpClient(url);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawBlogs = await convex.query((api as any).blogs.listAllBlogs, {});
    if (!Array.isArray(rawBlogs) || rawBlogs.length === 0) return STATIC_BLOGS;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapped: BlogView[] = (rawBlogs as any[]).map((b) => ({
      slug: b.slug as string,
      title: b.title as string,
      content: (b.content ?? "") as string,
      subject: (b.subject ?? "CUET") as string,
      tags: (b.tags ?? []) as string[],
      publishedAt: new Date(b.publishedAt ?? b.createdAt ?? Date.now()).toISOString(),
      category: (b.subject ?? "CUET") as string,
      readingMinutes: Math.max(1, Math.ceil(stripHtml(b.content ?? "").split(" ").length / 200)),
      description: b.description
        ? (b.description as string)
        : stripHtml(b.content ?? "").slice(0, 160),
    }));
    // Merge: Convex posts win, static seed fills any gaps (dedupe by slug).
    const bySlug = new Map<string, BlogView>();
    for (const s of STATIC_BLOGS) bySlug.set(s.slug, s);
    for (const m of mapped) bySlug.set(m.slug, m);
    return [...bySlug.values()];
  } catch {
    return STATIC_BLOGS;
  }
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const { category, page: pageParam } = await searchParams;
  const cat = category ?? "All";
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const blogs = await loadBlogs();

  const posts = cat === "All"
    ? blogs
    : blogs.filter(
        (b) =>
          b.category.toLowerCase().includes(cat.toLowerCase()) ||
          b.tags.some((t) => t.toLowerCase().includes(cat.toLowerCase()))
      );

  const sorted = [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const totalPosts = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginated = sorted.slice(startIndex, startIndex + PAGE_SIZE);

  function pageHref(p: number) {
    const params = new URLSearchParams();
    if (cat !== "All") params.set("category", cat);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
  }

  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      <section className="bg-gradient-to-br from-orange-50 to-amber-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            📚 CUET Prep Blog
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
            Topper Stories. Topic Guides. Real Strategy.
          </h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            {blogs.length}+ articles — updated daily. No coaching ads. No motivational fluff.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-8">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={c === "All" ? "/blog" : `/blog?category=${encodeURIComponent(c)}`}
              className={`text-xs font-bold px-4 py-1.5 rounded-full border transition-all ${
                (c === "All" && cat === "All") || cat === c
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500"
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        {/* Showing X-Y of Z */}
        {totalPosts > 0 && (
          <p className="text-xs text-gray-400 mb-4">
            Showing {startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, totalPosts)} of {totalPosts} posts
          </p>
        )}

        {/* Post grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {paginated.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group"
            >
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600">
                  {post.category}
                </span>
                <span className="text-xs text-gray-400">{post.readingMinutes} min read</span>
              </div>
              <h2 className="font-black text-gray-900 text-sm leading-snug group-hover:text-orange-500 transition-colors mb-2">
                {post.title}
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{post.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-300">
                  {new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                <span className="text-orange-400 text-xs group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>

        {totalPosts === 0 && (
          <p className="text-center text-gray-400 py-12">No posts in this category yet.</p>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-10">
            {currentPage > 1 ? (
              <Link
                href={pageHref(currentPage - 1)}
                className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors"
              >
                ← Previous
              </Link>
            ) : (
              <span className="text-sm text-gray-300 select-none">← Previous</span>
            )}
            <span className="text-xs text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages ? (
              <Link
                href={pageHref(currentPage + 1)}
                className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors"
              >
                Next →
              </Link>
            ) : (
              <span className="text-sm text-gray-300 select-none">Next →</span>
            )}
          </div>
        )}
      </section>

      <section className="bg-orange-500 py-10 px-4 text-center text-white">
        <h2 className="text-xl font-black mb-2">Ready to apply what you just read?</h2>
        <p className="text-orange-100 text-sm mb-4">10-minute Bloom-level practice — start now.</p>
        <Link
          href="/register"
          className="inline-block bg-white text-orange-500 font-black px-6 py-3 rounded-2xl hover:bg-orange-50 transition-all"
        >
          Start free →
        </Link>
      </section>
    </div>
  );
}
