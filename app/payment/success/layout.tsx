import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Successful — 10minCUET",
  description:
    "Your 10minCUET subscription is now active. Start your first 10-minute CUET session now.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentSuccessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
