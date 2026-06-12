import { BASE_URL } from "@/app/lib/site";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Pricing — 10minCUET | CUET Prep Plans from ₹0",
  description: "Free diagnostic quiz forever. Single subject ₹99/month. Full bundle ₹349/month. Annual ₹999/year. No dark patterns. Earn 5 free months via referral.",
  openGraph: {
    title: "10minCUET Pricing — Start Free",
    description: "Free diagnostic. Bundle ₹349/month. Annual ₹999/year. No auto-charge.",
    url: `${BASE_URL}/pricing`,
    type: "website",
  },
  alternates: { canonical: `${BASE_URL}/pricing` },
};
export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
