import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Failed — 10minCUET",
  description:
    "Your payment could not be processed. Please try again or contact support.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentFailedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
