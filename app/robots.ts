import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "https://10minjee.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/topics",
          "/pricing",
          "/register",
          "/login",
          "/about",
          "/methodology",
          "/blog",
          "/blog/",
          "/for/",
          "/compare/",
          "/predictor",
          "/college-predictor",
          "/score-normalisation",
          "/cutoffs",
          "/mock",
          "/sprint",
          "/contact",
          "/privacy-policy",
          "/refund-policy",
          "/terms",
          "/payment/success",
          "/payment/failed",
          "/sitemap.xml",
        ],
        disallow: [
          "/api/",
          "/bloom/",
          "/quiz/",
          "/practice/",
          "/daily/",
          "/results/",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
