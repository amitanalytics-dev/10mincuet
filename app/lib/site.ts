// Single source of truth for the site's canonical base URL.
// Set NEXT_PUBLIC_BASE_URL in the environment (e.g. https://10mincuet.salahlo.in)
// to override the default production domain.
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://10mincuet.com";
