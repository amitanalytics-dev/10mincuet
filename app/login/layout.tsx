import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sign In — 10minCUET",
  description: "Sign in to your 10minCUET account to continue your CUET prep session.",
  robots: { index: false },
};
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
