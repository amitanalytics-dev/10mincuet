import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "CUET Topic Intelligence — High-Frequency Topics 2015–2025 | 10minCUET",
  description: "Master the 24 topics that appear in 60%+ of every CUET UG paper. Physics, Chemistry, Math — mapped by Bloom level, marks contribution, and paper frequency from 2015–2025.",
  openGraph: {
    title: "CUET Topic Intelligence — 10minCUET",
    description: "The 24 topics that cover 60%+ of every CUET UG paper. 10 years of NTA data.",
    url: "https://10minjee.com/topics",
    type: "website",
  },
  alternates: { canonical: "https://10minjee.com/topics" },
};
export default function TopicsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
