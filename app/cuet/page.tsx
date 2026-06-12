import type { Metadata } from "next";
import Link from "next/link";
import { subjects } from "../data/topics";
import { PublicNav } from "../components/PublicNav";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "CUET UG Topics — Complete Sub-concept Guide with NCERT Reference",
  description:
    "Master all 24 CUET UG topics across Physics, Chemistry and Maths. Bloom-level questions, NCERT page references, and sub-concept breakdown for every topic.",
  alternates: { canonical: "https://10mincuet.com/cuet" },
  openGraph: {
    title: "CUET UG Topics — Complete Guide",
    description:
      "Every high-value topic. Sub-concept breakdown. NCERT reference. Bloom-level questions.",
    url: "https://10mincuet.com/cuet",
    type: "website",
  },
  keywords: [
    "CUET UG topics",
    "CUET UG Physics Chemistry Maths",
    "CUET UG NCERT reference",
    "CUET UG sub-concepts",
    "CUET UG preparation guide",
  ],
};

function toSubjectSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

function toTopicSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CUETHubPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "CUET UG Topics — Complete Guide",
            description:
              "All 24 high-value CUET UG topics with sub-concept breakdown, NCERT reference, and Bloom-level practice.",
            url: "https://10mincuet.com/cuet",
            publisher: {
              "@type": "Organization",
              name: "10minCUET",
              url: "https://10mincuet.com",
            },
          }),
        }}
      />

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-orange-500 transition-colors">
            Home
          </Link>{" "}
          → <span className="text-gray-700">CUET Topics</span>
        </nav>

        <h1 className="text-4xl font-black text-gray-900 mb-3">
          CUET UG Topics — Complete Guide
        </h1>
        <p className="text-xl text-gray-500 mb-10">
          Every high-value topic. Sub-concept breakdown. NCERT reference.
          Bloom-level questions.
        </p>

        {subjects.map((subj) => (
          <div key={subj.name} className="mb-10">
            <h2
              className="text-2xl font-black mb-4"
              style={{ color: subj.accent }}
            >
              {subj.name}
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {subj.topics.map((topic) => {
                const topicSlug = toTopicSlug(topic.name);
                const subjectSlug = toSubjectSlug(subj.name);
                return (
                  <Link
                    key={topic.name}
                    href={`/cuet/${subjectSlug}/${topicSlug}`}
                    className="border border-gray-100 rounded-xl p-4 hover:border-orange-300 hover:shadow-sm transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-semibold text-gray-900 text-sm group-hover:text-orange-600 transition-colors">
                        {topic.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {topic.avgQuestionsPerPaper}Q / paper ·{" "}
                        {topic.paperCoverage}% coverage ·{" "}
                        <span
                          className={
                            topic.difficulty === "Hard"
                              ? "text-red-500"
                              : topic.difficulty === "Medium"
                                ? "text-amber-500"
                                : "text-green-600"
                          }
                        >
                          {topic.difficulty}
                        </span>
                      </div>
                    </div>
                    <span className="text-orange-400 text-sm ml-4">→</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Bottom CTA */}
        <div className="bg-gray-900 rounded-2xl p-8 text-center text-white mt-4">
          <h2 className="text-2xl font-black mb-3">
            Practice any topic in 10 minutes
          </h2>
          <p className="text-gray-400 mb-6">
            Bloom-level questions. Instant feedback. Know exactly where you
            stand.
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
