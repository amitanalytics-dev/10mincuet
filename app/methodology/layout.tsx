import { BASE_URL } from "@/app/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "10minCUET Methodology — Bloom's Taxonomy Applied to CUET UG",
  description:
    "The research-backed methodology behind 10minCUET. Bloom's Taxonomy (Bloom 1956, Anderson & Krathwohl 2001) applied to CUET UG sub-concepts. 432 questions mapped across 10 years of NTA papers.",
  alternates: {
    canonical: `${BASE_URL}/methodology`,
  },
  openGraph: {
    type: "website",
    url: `${BASE_URL}/methodology`,
    title: "10minCUET Methodology — Bloom's Taxonomy Applied to CUET UG",
    description:
      "Research-backed methodology. Bloom's Taxonomy applied to CUET UG. Spaced repetition science from Cepeda et al. (2006). 432 questions mapped across 10 NTA years.",
  },
};

export default function MethodologyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
