import { BASE_URL } from "@/app/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CUET UG College Predictor 2026 — University Cutoffs by Score",
  description:
    "Find central and state universities you qualify for based on your CUET UG normalized score. Indicative cutoffs for DU, BHU, JNU, AMU, Jamia and more — filtered by category and programme.",
  alternates: {
    canonical: `${BASE_URL}/college-predictor`,
  },
  openGraph: {
    type: "website",
    url: `${BASE_URL}/college-predictor`,
    title: "CUET UG College Predictor 2026 — University Cutoffs by Score",
    description:
      "Find central and state universities you qualify for based on your CUET UG normalized score. Indicative cutoffs for DU, BHU, JNU, AMU, Jamia and more.",
  },
};

export default function CollegePredictorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
