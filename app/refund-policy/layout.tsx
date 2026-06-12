import { BASE_URL } from "@/app/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy — 10minCUET",
  description:
    "10minCUET refund and cancellation policy. 7-day full refund on all paid plans. No questions asked.",
  alternates: {
    canonical: `${BASE_URL}/refund-policy`,
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    type: "website",
    url: `${BASE_URL}/refund-policy`,
    title: "Refund Policy — 10minCUET",
    description:
      "10minCUET refund and cancellation policy. 7-day full refund on all paid plans. No questions asked.",
  },
};

export default function RefundPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
