"use client";
import { usePathname } from "next/navigation";
import { SiteFooter } from "./SiteFooter";

// Renders SiteFooter on all pages except those with their own UI (payment flow)
const SKIP_PATHS = ["/payment"];

export function LayoutFooter() {
  const pathname = usePathname();
  if (SKIP_PATHS.some((p) => pathname.startsWith(p))) return null;
  return <SiteFooter />;
}
