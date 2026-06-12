import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — 10minCUET",
  description:
    "How 10minCUET collects, uses and protects your data. GDPR and Indian IT Act compliant. Last updated May 2025.",
  alternates: {
    canonical: "https://10minjee.com/privacy-policy",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    type: "website",
    url: "https://10minjee.com/privacy-policy",
    title: "Privacy Policy — 10minCUET",
    description:
      "How 10minCUET collects, uses and protects your data. GDPR and Indian IT Act compliant. Last updated May 2025.",
  },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
