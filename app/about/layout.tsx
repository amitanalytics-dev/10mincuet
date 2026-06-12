import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About 10minCUET — Built for India's CUET Students | 10minCUET",
  description:
    "How Amit Tyagi, ISB graduate, built 10minCUET after analysing a decade of CUET UG papers. A prep platform built on Bloom's Taxonomy, not long videos.",
  alternates: {
    canonical: "https://10minjee.com/about",
  },
  openGraph: {
    type: "website",
    url: "https://10minjee.com/about",
    title: "About 10minCUET — Built for India's CUET Students | 10minCUET",
    description:
      "How Amit Tyagi, ISB graduate, built 10minCUET after analysing a decade of CUET UG papers. A prep platform built on Bloom's Taxonomy, not long videos.",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
