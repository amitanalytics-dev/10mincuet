import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CUET UG Mock Test 2025 — Section-Based NTA Pattern | 10minCUET",
  description:
    "Free full-length CUET UG mock test. Section-based (Languages, Domain, General Test), 60-minute sections, NTA +5/−1 pattern. Get your percentile estimate instantly. No signup needed.",
  alternates: {
    canonical: "https://10minjee.com/mock",
  },
  openGraph: {
    type: "website",
    url: "https://10minjee.com/mock",
    title: "CUET UG Mock Test 2025 — Section-Based NTA Pattern | 10minCUET",
    description:
      "Free full-length CUET UG mock test. Section-based, 60-minute sections, NTA +5/−1 pattern. Get your percentile estimate instantly. No signup needed.",
  },
};

export default function MockLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
