import { BASE_URL } from "@/app/lib/site";
import type { MetadataRoute } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "convex/_generated/api";
import { subjects } from "./data/topics";
import { BLOGS } from "./data/blogs";

const base = BASE_URL;
const now = new Date();

// ─── Audience landing page slugs ─────────────────────────────────────────────
const AUDIENCE_SLUGS = [
  "droppers",
  "class-12-students",
  "class-11-students",
  "self-study",
  "parents",
];

// ─── Static compare pages (not under [slug]) ─────────────────────────────────
const STATIC_COMPARE_PAGES = [
  { path: "allen" },
  { path: "byjus" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ─── Blog posts — fetched from Convex ────────────────────────────────────────
  let blogPosts: { slug: string; publishedAt: string }[] = [];
  try {
    const convex = new ConvexHttpClient(
      process.env.NEXT_PUBLIC_CONVEX_URL ?? "https://knowing-cobra-413.convex.cloud/"
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const blogs = await convex.query((api as any).blogs.listAllBlogs, {});
    blogPosts = (blogs as any[]).map((b) => ({
      slug: b.slug as string,
      publishedAt: new Date(b.publishedAt ?? b.createdAt).toISOString(),
    }));
    if (blogPosts.length === 0) throw new Error("empty");
  } catch {
    // Convex unavailable at build time — fall back to the static blog catalogue
    blogPosts = BLOGS.map((b) => ({
      slug: b.slug,
      publishedAt: new Date(b.publishedAt).toISOString(),
    }));
  }
  // ── Core pages ──────────────────────────────────────────────────────────────
  const core: MetadataRoute.Sitemap = [
    { url: base,                              lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/topics`,                  lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/foundation`,              lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/mock`,                    lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/blog`,                    lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${base}/teams`,                   lastModified: now, changeFrequency: "hourly",  priority: 0.8 },
    { url: `${base}/challenge`,               lastModified: now, changeFrequency: "daily",   priority: 0.7 },
    { url: `${base}/tournaments`,             lastModified: now, changeFrequency: "daily",   priority: 0.7 },
    { url: `${base}/pricing`,                 lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/register`,                lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`,                   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/toppers`,                 lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/methodology`,             lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/sprint`,                  lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/predictor`,               lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/college-predictor`,       lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/score-normalisation`,     lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/cutoffs`,                 lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`,                 lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/login`,                   lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/terms`,                   lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/refund-policy`,           lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/privacy-policy`,          lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/champions`,               lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/educators`,               lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${base}/pledge`,                  lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/for/teachers`,            lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  // ── Audience landing pages (/for/[audience]) ─────────────────────────────────
  const audiencePages: MetadataRoute.Sitemap = AUDIENCE_SLUGS.map((slug) => ({
    url: `${base}/for/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // ── Blog post pages (/blog/[slug]) ────────────────────────────────────────────
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // ── CUET topic SEO pages (/cuet/[subject]/[topic]) ───────────────────────────
  const cuetTopicPages: MetadataRoute.Sitemap = [];
  for (const subj of subjects) {
    const subjectSlug = subj.name.toLowerCase().replace(/\s+/g, "-");
    for (const topic of subj.topics) {
      const topicSlug = topic.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      cuetTopicPages.push({
        url: `${base}/cuet/${subjectSlug}/${topicSlug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      });
    }
  }
  // Hub page
  cuetTopicPages.push({
    url: `${base}/cuet`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  });

  // ── Static compare pages (/compare/allen, /compare/byjus) ───────────────────
  const staticComparePages: MetadataRoute.Sitemap = STATIC_COMPARE_PAGES.map(({ path }) => ({
    url: `${base}/compare/${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...core, ...audiencePages, ...staticComparePages, ...blogPages, ...cuetTopicPages];
}
