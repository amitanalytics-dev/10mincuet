import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy — 10minCUET",
  description:
    "10minCUET refund and cancellation policy. 7-day full refund on all paid plans. No questions asked.",
  alternates: {
    canonical: "https://10mincuet.com/refund-policy",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    type: "website",
    url: "https://10mincuet.com/refund-policy",
    title: "Refund Policy — 10minCUET",
    description:
      "10minCUET refund and cancellation policy. 7-day full refund on all paid plans. No questions asked.",
  },
};

export default function RefundPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
