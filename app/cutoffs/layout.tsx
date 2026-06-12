import { BASE_URL } from "@/app/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CUET UG Cutoff 2024 — NIT, IIIT, GFTI Opening & Closing Ranks",
  description:
    "CUET UG 2024 JoSAA cutoff ranks for all NITs, IIITs and GFTIs. Filter by branch, category (General/OBC/SC/ST), home state, and round.",
  alternates: {
    canonical: `${BASE_URL}/cutoffs`,
  },
  openGraph: {
    type: "website",
    url: `${BASE_URL}/cutoffs`,
    title: "CUET UG Cutoff 2024 — NIT, IIIT, GFTI Opening & Closing Ranks",
    description:
      "CUET UG 2024 JoSAA cutoff ranks for all NITs, IIITs and GFTIs. Filter by branch, category (General/OBC/SC/ST), home state, and round.",
  },
};

export default function CutoffsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
