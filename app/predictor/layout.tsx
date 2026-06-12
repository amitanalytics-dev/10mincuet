import { BASE_URL } from "@/app/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CUET UG Score to Percentile Calculator 2026",
  description:
    "Convert your CUET UG raw score to percentile instantly. Based on NTA normalization data from 2020–2025 across all sessions and shifts.",
  alternates: {
    canonical: `${BASE_URL}/predictor`,
  },
  openGraph: {
    type: "website",
    url: `${BASE_URL}/predictor`,
    title: "CUET UG Score to Percentile Calculator 2026",
    description:
      "Convert your CUET UG raw score to percentile instantly. Based on NTA normalization data from 2020–2025 across all sessions and shifts.",
  },
};

export default function PredictorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
