import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CUET Foundation — Class 6 to 10 NCERT Prep",
  description:
    "Build your CUET UG base early. Free Foundation track for Classes 6–10: NCERT Science, Maths, Social Science and English, each chapter mapped to the CUET topic it feeds into.",
  alternates: { canonical: "https://10mincuet.com/foundation" },
  openGraph: {
    title: "CUET Foundation — Class 6 to 10 NCERT Prep — 10minCUET",
    description:
      "Start CUET prep from Class 6. NCERT chapters for Classes 6–10 mapped to the CUET UG topics they feed into. Completely free.",
    url: "https://10mincuet.com/foundation",
    type: "website",
  },
  keywords: [
    "CUET foundation course",
    "CUET preparation class 6",
    "CUET preparation class 8",
    "CUET preparation class 10",
    "NCERT foundation CUET",
    "early CUET prep",
  ],
};

export default function FoundationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
