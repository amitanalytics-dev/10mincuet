import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My CUET Progress — Bloom Level Tracker | 10minCUET",
  description:
    "Track your Bloom level per CUET UG sub-concept. See your weakest topics, your strongest areas, and your Bloom progression over time.",
  alternates: {
    canonical: "https://10minjee.com/results",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    type: "website",
    url: "https://10minjee.com/results",
    title: "My CUET Progress — Bloom Level Tracker | 10minCUET",
    description:
      "Track your Bloom level per CUET UG sub-concept. See your weakest topics, your strongest areas, and your Bloom progression over time.",
  },
};

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
