import { BASE_URL } from "@/app/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use — 10minCUET",
  description:
    "Terms of use for 10minCUET platform by EAZEALLIANCE SERVICES PRIVATE LIMITED. Covers subscriptions, referral program, and content usage.",
  alternates: {
    canonical: `${BASE_URL}/terms`,
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    type: "website",
    url: `${BASE_URL}/terms`,
    title: "Terms of Use — 10minCUET",
    description:
      "Terms of use for 10minCUET platform by EAZEALLIANCE SERVICES PRIVATE LIMITED. Covers subscriptions, referral program, and content usage.",
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
