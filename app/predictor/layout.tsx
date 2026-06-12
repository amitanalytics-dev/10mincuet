import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CUET UG Score to Percentile Calculator 2025 | 10minCUET",
  description:
    "Convert your CUET UG raw score to percentile instantly. Based on NTA normalization data from 2020–2025 across all sessions and shifts.",
  alternates: {
    canonical: "https://10minjee.com/predictor",
  },
  openGraph: {
    type: "website",
    url: "https://10minjee.com/predictor",
    title: "CUET UG Score to Percentile Calculator 2025 | 10minCUET",
    description:
      "Convert your CUET UG raw score to percentile instantly. Based on NTA normalization data from 2020–2025 across all sessions and shifts.",
  },
};

export default function PredictorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
