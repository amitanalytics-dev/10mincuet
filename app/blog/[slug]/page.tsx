import { notFound } from "next/navigation";
import Link from "next/link";
import { ConvexHttpClient } from "convex/browser";
import { api } from "convex/_generated/api";
import { PublicNav } from "../../components/PublicNav";
import { BLOGS } from "../../data/blogs";
import type { Metadata } from "next";

export const revalidate = 3600;

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makePost(b: any) {
  return {
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
  };
}

const STATIC_BY_SLUG = new Map(BLOGS.map((b) => [b.slug, b]));

// Convex-first lookup with a static CUET fallback; never throws.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchRaw(slug: string): Promise<any | null> {
  try {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (url) {
      const convex = new ConvexHttpClient(url);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw = await convex.query((api as any).blogs.getBlogBySlug, { slug });
      if (raw) return raw;
    }
  } catch {
    // fall through to static
  }
  return STATIC_BY_SLUG.get(slug) ?? null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchAllRaw(): Promise<any[]> {
  try {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (url) {
      const convex = new ConvexHttpClient(url);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const all = await convex.query((api as any).blogs.listAllBlogs, {});
      if (Array.isArray(all) && all.length > 0) return all;
    }
  } catch {
    // fall through to static
  }
  return BLOGS;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const raw = await fetchRaw(slug);
  if (!raw) return {};
  const post = makePost(raw);
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://10mincuet.com/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://10mincuet.com/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const raw = await fetchRaw(slug);
  if (!raw) notFound();

  const post = makePost(raw);

  // fetch related: all blogs, filter by same subject (fall back to any others)
  const allRaw = await fetchAllRaw();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let related = (allRaw as any[])
    .filter((b) => b.slug !== post.slug && (b.subject ?? "CUET") === post.subject)
    .slice(0, 3)
    .map(makePost);
  if (related.length === 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    related = (allRaw as any[])
      .filter((b) => b.slug !== post.slug)
      .slice(0, 3)
      .map(makePost);
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Person",
      name: "Amit Tyagi",
      url: "https://10mincuet.com/about",
    },
    publisher: { "@type": "Organization", name: "10minCUET", url: "https://10mincuet.com" },
    datePublished: post.publishedAt,
    url: `https://10mincuet.com/blog/${post.slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://10mincuet.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://10mincuet.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://10mincuet.com/blog/${post.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <article className="max-w-2xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link href="/" className="hover:text-orange-500">Home</Link>
          <span>›</span>
          <Link href="/blog" className="hover:text-orange-500">Blog</Link>
          <span>›</span>
          <span className="text-gray-600 truncate">{post.title}</span>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-50 text-orange-600">
            {post.category}
          </span>
          <span className="text-xs text-gray-400">{post.readingMinutes} min read</span>
          <span className="text-xs text-gray-400">
            {new Date(post.publishedAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </span>
        </div>

        {/* Content */}
        <div
          className="prose prose-sm max-w-none prose-headings:font-black prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-a:text-orange-500 prose-li:text-gray-700"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-100">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center">
          <p className="text-sm font-bold text-gray-800 mb-1">
            Practice this topic in 10 minutes
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Bloom-level questions mapped to exactly what you just read.
          </p>
          <Link
            href="/register"
            className="inline-block bg-orange-500 text-white font-black text-sm px-6 py-3 rounded-xl hover:bg-orange-600 transition-all"
          >
            Start free →
          </Link>
        </div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="max-w-2xl mx-auto px-4 pb-12">
          <h2 className="text-base font-black text-gray-900 mb-4">Related articles</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="block border border-gray-100 rounded-xl p-4 hover:border-orange-200 hover:shadow-sm transition-all group"
              >
                <p className="text-xs font-black text-gray-800 leading-snug group-hover:text-orange-500 transition-colors">
                  {r.title}
                </p>
                <p className="text-xs text-gray-400 mt-1">{r.readingMinutes} min</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
