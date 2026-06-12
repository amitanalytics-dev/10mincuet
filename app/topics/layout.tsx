import { BASE_URL } from "@/app/lib/site";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "CUET UG Topics — Science, Commerce & Humanities",
  description: "Master the high-frequency topics across all CUET UG streams: Science, Commerce & Humanities — 12 CUET domain subjects + English + General Test, mapped by Bloom level, marks contribution, and paper frequency.",
  openGraph: {
    title: "CUET UG Topics — Science, Commerce & Humanities — 10minCUET",
    description: "High-frequency topics across 12 CUET domain subjects + English + General Test. Mapped from NTA paper data.",
    url: `${BASE_URL}/topics`,
    type: "website",
  },
  alternates: { canonical: `${BASE_URL}/topics` },
};
export default function TopicsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
