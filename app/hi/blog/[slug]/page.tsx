import { BASE_URL } from "@/app/lib/site";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ConvexHttpClient } from "convex/browser";
import { api } from "convex/_generated/api";
import { PublicNav } from "../../../components/PublicNav";
import { BLOGS } from "../../../data/blogs";
import type { Metadata } from "next";

export const revalidate = 3600;

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makePost(b: any) {
  return {
    slug: b.slug as string,
    title: b.titleHi ?? b.title,
    content: (b.contentHi ?? b.content ?? "") as string,
    subject: (b.subject ?? "CUET") as string,
    tags: (b.tags ?? []) as string[],
    publishedAt: new Date(b.publishedAt ?? b.createdAt ?? Date.now()).toISOString(),
    category: (b.subject ?? "CUET") as string,
    readingMinutes: Math.max(1, Math.ceil(stripHtml((b.contentHi ?? b.content) ?? "").split(" ").length / 200)),
    description: b.descriptionHi
      ? (b.descriptionHi as string)
      : stripHtml((b.contentHi ?? b.content) ?? "").slice(0, 160),
  };
}

const STATIC_BY_SLUG = new Map(BLOGS.map((b) => [b.slug, b]));

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
    alternates: {
      canonical: `${BASE_URL}/hi/blog/${post.slug}`,
      languages: {
        "en-IN": `${BASE_URL}/blog/${post.slug}`,
        "hi-IN": `${BASE_URL}/hi/blog/${post.slug}`,
        "x-default": `${BASE_URL}/blog/${post.slug}`,
      },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${BASE_URL}/hi/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      locale: "hi_IN",
      authors: ["Amit Tyagi"],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const raw = await fetchRaw(slug);
  if (!raw) notFound();

  const post = makePost(raw);

  // fetch related
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
    inLanguage: "hi-IN",
    author: {
      "@type": "Person",
      name: "Amit Tyagi",
      url: `${BASE_URL}/about`,
      jobTitle: "Founder & AI Researcher",
      image: "https://assets.vercel.com/image/upload/f_auto,c_fill,w_40,h_40,q_75/contentful/image/e5382hct74si/4GkdOhqIAAZSx1RkBh6VBy/2b0608ef3769d84feb0bfe5810b2d0fd/qNCeG9WK_400x400__1_.jpg",
      sameAs: ["https://twitter.com/amit_tyagi2012", "https://linkedin.com/in/amittyagi2012"],
    },
    publisher: { "@type": "Organization", name: "10minCUET", url: BASE_URL },
    datePublished: post.publishedAt,
    url: `${BASE_URL}/hi/blog/${post.slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "होम", item: `${BASE_URL}/hi` },
      { "@type": "ListItem", position: 2, name: "ब्लॉग", item: `${BASE_URL}/hi/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${BASE_URL}/hi/blog/${post.slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-white" lang="hi">
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
          <Link href="/hi" className="hover:text-orange-500">होम</Link>
          <span>›</span>
          <Link href="/hi/blog" className="hover:text-orange-500">ब्लॉग</Link>
          <span>›</span>
          <span className="text-gray-600 truncate">{post.title}</span>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-50 text-orange-600">
            {post.category}
          </span>
          <span className="text-xs text-gray-400">{post.readingMinutes} मिनट पढ़ने का समय</span>
          <span className="text-xs text-gray-400">
            {new Date(post.publishedAt).toLocaleDateString("hi-IN", {
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
            इस विषय को 10 मिनट में प्रैक्टिस करें
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Bloom-स्तर के प्रश्न जो आपने अभी पढ़े हैं उनसे मैप किए गए।
          </p>
          <Link
            href="/hi/register"
            className="inline-block bg-orange-500 text-white font-black text-sm px-6 py-3 rounded-xl hover:bg-orange-600 transition-all"
          >
            मुफ्त शुरू करें →
          </Link>
        </div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="max-w-2xl mx-auto px-4 pb-12">
          <h2 className="text-base font-black text-gray-900 mb-4">संबंधित लेख</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/hi/blog/${r.slug}`}
                className="block border border-gray-100 rounded-xl p-4 hover:border-orange-200 hover:shadow-sm transition-all group"
              >
                <p className="text-xs font-black text-gray-800 leading-snug group-hover:text-orange-500 transition-colors">
                  {r.title}
                </p>
                <p className="text-xs text-gray-400 mt-1">{r.readingMinutes} मिनट</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
