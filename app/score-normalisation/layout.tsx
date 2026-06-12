import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CUET UG Score Normalisation Explained — NTA Method 2025",
  description:
    "Understand how NTA normalises CUET UG scores across shifts. Calculate your normalised marks with our interactive tool. Updated for 2025.",
  alternates: {
    canonical: "https://10minjee.com/score-normalisation",
  },
  openGraph: {
    type: "website",
    url: "https://10minjee.com/score-normalisation",
    title: "CUET UG Score Normalisation Explained — NTA Method 2025",
    description:
      "Understand how NTA normalises CUET UG scores across shifts. Calculate your normalised marks with our interactive tool. Updated for 2025.",
  },
};

export default function ScoreNormalisationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
