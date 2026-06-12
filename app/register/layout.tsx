import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Create Free Account — 10minCUET | CUET Prep in 10 Minutes",
  description: "Create a free 10minCUET account. No card required. Start your CUET UG prep with a free diagnostic quiz in 10 minutes.",
  alternates: { canonical: "https://10mincuet.com/register" },
};
export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
