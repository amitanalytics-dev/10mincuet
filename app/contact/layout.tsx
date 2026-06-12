import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact 10minCUET — Support, Feedback & Partnerships",
  description:
    "Reach the 10minCUET team. For support, refunds, bulk access, coaching partnerships, or press enquiries. We reply within 24 hours.",
  alternates: {
    canonical: "https://10mincuet.com/contact",
  },
  openGraph: {
    type: "website",
    url: "https://10mincuet.com/contact",
    title: "Contact 10minCUET — Support, Feedback & Partnerships",
    description:
      "Reach the 10minCUET team. For support, refunds, bulk access, coaching partnerships, or press enquiries. We reply within 24 hours.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
