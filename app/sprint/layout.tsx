import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "30-Day CUET UG Sprint Plan — Personalised Daily Schedule",
  description:
    "Custom 30-day CUET UG study plan from today to your exam. Covers Physics, Chemistry, Math based on your weak sub-concepts. Free.",
  alternates: {
    canonical: "https://10mincuet.com/sprint",
  },
  openGraph: {
    type: "website",
    url: "https://10mincuet.com/sprint",
    title: "30-Day CUET UG Sprint Plan — Personalised Daily Schedule",
    description:
      "Custom 30-day CUET UG study plan from today to your exam. Covers Physics, Chemistry, Math based on your weak sub-concepts. Free.",
  },
};

export default function SprintLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
