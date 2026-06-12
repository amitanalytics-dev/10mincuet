import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CUET UG College Predictor 2025 — University Cutoffs by Score",
  description:
    "Find central and state universities you qualify for based on your CUET UG normalized score. Indicative cutoffs for DU, BHU, JNU, AMU, Jamia and more — filtered by category and programme.",
  alternates: {
    canonical: "https://10minjee.com/college-predictor",
  },
  openGraph: {
    type: "website",
    url: "https://10minjee.com/college-predictor",
    title: "CUET UG College Predictor 2025 — University Cutoffs by Score",
    description:
      "Find central and state universities you qualify for based on your CUET UG normalized score. Indicative cutoffs for DU, BHU, JNU, AMU, Jamia and more.",
  },
};

export default function CollegePredictorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
