import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Pricing — 10minCUET | CUET Prep Plans from ₹0",
  description: "Free diagnostic quiz forever. Single subject ₹149/month. Full bundle ₹349/month. Annual ₹2,499. No dark patterns. Earn 5 free months via referral.",
  openGraph: {
    title: "10minCUET Pricing — Start Free",
    description: "Free diagnostic. Bundle ₹349/month. Annual ₹2,499. No auto-charge.",
    url: "https://10minjee.com/pricing",
    type: "website",
  },
  alternates: { canonical: "https://10minjee.com/pricing" },
};
export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
