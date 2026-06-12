import "server-only";
import { ConvexHttpClient } from "convex/browser";

export function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  // Reject missing or local-dev URLs — cloud URLs always start with https://
  if (!url || !url.startsWith("https://")) return null;
  return new ConvexHttpClient(url);
}
