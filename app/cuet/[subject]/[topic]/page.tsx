import { BASE_URL } from "@/app/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { subjects } from "../../../data/topics";
import { NCERT_MAP } from "../../../data/ncert-mapping";
import { PublicNav } from "../../../components/PublicNav";

export const revalidate = 86400;

// ── Slug helpers ──────────────────────────────────────────────────────────────

function toSubjectSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

function toTopicSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ── Static params — all 24 topic pages built at compile time ──────────────────

export function generateStaticParams() {
  const params: { subject: string; topic: string }[] = [];
  for (const subj of subjects) {
    const subjectSlug = toSubjectSlug(subj.name);
    for (const topic of subj.topics) {
      params.push({ subject: subjectSlug, topic: toTopicSlug(topic.name) });
    }
  }
  return params;
}

// ── Lookup helper ─────────────────────────────────────────────────────────────

function findTopic(subjectSlug: string, topicSlug: string) {
  for (const subj of subjects) {
    if (toSubjectSlug(subj.name) !== subjectSlug) continue;
    for (const topic of subj.topics) {
      if (toTopicSlug(topic.name) === topicSlug) return { topic, subject: subj };
    }
  }
  return null;
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string; topic: string }>;
}): Promise<Metadata> {
  const { subject, topic: topicSlug } = await params;
  const found = findTopic(subject, topicSlug);
  if (!found) return {};
  const { topic, subject: subj } = found;
  return {
    title: `${topic.name} for CUET UG — Complete Guide, Questions & NCERT Reference`,
    description: `Master ${topic.name} for CUET UG. ${topic.avgQuestionsPerPaper} questions per paper, ${topic.paperCoverage}% paper coverage. Includes Bloom-level questions, sub-concepts, and NCERT chapter reference.`,
    alternates: {
      canonical: `${BASE_URL}/cuet/${subject}/${topicSlug}`,
    },
    openGraph: {
      title: `${topic.name} — CUET UG Guide`,
      description: topic.whyThisTopic,
      url: `${BASE_URL}/cuet/${subject}/${topicSlug}`,
      type: "article",
    },
    keywords: [
      `${topic.name} CUET UG`,
      `${topic.name} questions CUET`,
      `${subj.name} ${topic.name} guide`,
      `CUET UG ${topic.name} preparation`,
      `${topic.name} NCERT`,
    ],
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function TopicSEOPage({
  params,
}: {
  params: Promise<{ subject: string; topic: string }>;
}) {
  const { subject, topic: topicSlug } = await params;
  const found = findTopic(subject, topicSlug);
  if (!found) return notFound();

  const { topic, subject: subj } = found;
  const ncert = NCERT_MAP[topic.name];

  const difficultyStyle =
    topic.difficulty === "Hard"
      ? "bg-red-100 text-red-700"
      : topic.difficulty === "Medium"
        ? "bg-amber-100 text-amber-700"
        : "bg-green-100 text-green-700";

  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `${topic.name} for CUET UG — Complete Guide`,
            description: topic.whyThisTopic,
            author: { "@type": "Organization", name: "10minCUET" },
            publisher: {
              "@type": "Organization",
              name: "10minCUET",
              url: BASE_URL,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${BASE_URL}/cuet/${subject}/${topicSlug}`,
            },
          }),
        }}
      />

      {/* BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
              { "@type": "ListItem", position: 2, name: "CUET Topics", item: `${BASE_URL}/cuet` },
              {
                "@type": "ListItem",
                position: 3,
                name: topic.name,
                item: `${BASE_URL}/cuet/${subject}/${topicSlug}`,
              },
            ],
          }),
        }}
      />

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-orange-500 transition-colors">
            Home
          </Link>{" "}
          →{" "}
          <Link href="/cuet" className="hover:text-orange-500 transition-colors">
            CUET Topics
          </Link>{" "}
          → <span className="text-gray-700">{topic.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              {subj.name}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyStyle}`}>
              {topic.difficulty}
            </span>
          </div>

          <h1 className="text-4xl font-black text-gray-900 mb-4">
            {topic.name} for CUET UG
          </h1>
          <p className="text-xl text-gray-600 mb-6">{topic.whyThisTopic}</p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-2xl p-4">
            <div className="text-center">
              <div className="text-2xl font-black text-orange-500">
                {topic.avgQuestionsPerPaper}
              </div>
              <div className="text-xs text-gray-500 mt-1">avg questions / paper</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-orange-500">
                {topic.paperCoverage}%
              </div>
              <div className="text-xs text-gray-500 mt-1">paper coverage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-orange-500">
                ~{topic.marksContribution}
              </div>
              <div className="text-xs text-gray-500 mt-1">marks / paper</div>
            </div>
          </div>
        </div>

        {/* NCERT Reference */}
        {ncert && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8">
            <h2 className="font-bold text-blue-900 mb-2">NCERT Reference</h2>
            <p className="text-blue-800 text-sm">
              <strong>{ncert.book}</strong> — Chapter {ncert.chapter}:{" "}
              {ncert.chapterName}, Pages {ncert.pageStart}–{ncert.pageEnd}
            </p>
            {ncert.keyPages && ncert.keyPages.length > 0 && (
              <p className="text-blue-600 text-xs mt-1">
                Key pages to master: {ncert.keyPages.join(", ")}
              </p>
            )}
          </div>
        )}

        {/* Sub-concepts */}
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-4">
            Sub-concepts tested in CUET UG
          </h2>
          <div className="space-y-3">
            {topic.subConcepts.map((sc, i) => (
              <div
                key={i}
                className="border border-gray-100 rounded-xl p-4 hover:border-orange-200 transition-all"
              >
                <h3 className="font-bold text-gray-900 mb-1">{sc.name}</h3>
                <p className="text-sm text-gray-500">{sc.tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick win */}
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-8">
          <h2 className="font-bold text-orange-900 mb-2">Quick Win Strategy</h2>
          <p className="text-orange-800 text-sm">{topic.quickWin}</p>
        </div>

        {/* Other topics in this subject */}
        <div className="mb-10">
          <h2 className="text-xl font-black text-gray-900 mb-4">
            Other {subj.name} topics for CUET UG
          </h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {subj.topics
              .filter((t) => t.name !== topic.name)
              .map((t) => (
                <Link
                  key={t.name}
                  href={`/cuet/${toSubjectSlug(subj.name)}/${toTopicSlug(t.name)}`}
                  className="border border-gray-100 rounded-xl px-4 py-3 hover:border-orange-300 hover:shadow-sm transition-all flex items-center justify-between text-sm"
                >
                  <span className="text-gray-800 font-medium">{t.name}</span>
                  <span className="text-orange-400">→</span>
                </Link>
              ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gray-900 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-black mb-3">
            Practice {topic.name} right now
          </h2>
          <p className="text-gray-400 mb-6">
            10 minutes. Bloom-level questions. Know exactly where you stand.
          </p>
          <Link
            href="/register"
            className="bg-orange-500 hover:bg-orange-600 text-white font-black py-4 px-8 rounded-xl transition-all inline-block"
          >
            Start free practice →
          </Link>
        </div>
      </div>
    </div>
  );
}
