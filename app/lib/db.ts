// Neon Postgres has been replaced by Convex.
// Use app/lib/convexClient.ts for server-side data access.
// See convex/ directory for schema and functions.
export function getDb() {
  return null; // deprecated — use getConvexClient() from convexClient.ts
}
