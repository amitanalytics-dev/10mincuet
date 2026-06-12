import { BASE_URL } from "@/app/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — 10minCUET",
  description:
    "How 10minCUET collects, uses and protects your data. GDPR and Indian IT Act compliant. Last updated May 2025.",
  alternates: {
    canonical: `${BASE_URL}/privacy-policy`,
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    type: "website",
    url: `${BASE_URL}/privacy-policy`,
    title: "Privacy Policy — 10minCUET",
    description:
      "How 10minCUET collects, uses and protects your data. GDPR and Indian IT Act compliant. Last updated May 2025.",
  },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
