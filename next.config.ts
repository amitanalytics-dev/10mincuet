import type { NextConfig } from "next";
// next-intl/plugin is CJS-only — use createRequire for ESM compatibility
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const createNextIntlPlugin = require("next-intl/plugin");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  serverExternalPackages: ["bcryptjs"],
  async redirects() {
    return [
      { source: "/chapters", destination: "/topics", permanent: true },
      { source: "/score-predictor", destination: "/predictor", permanent: true },
      { source: "/streak", destination: "/sprint", permanent: true },
    ];
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
