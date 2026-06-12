// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import "server-only";
import { getConvexClient } from "../../lib/convexClient";
import { signToken } from "../../lib/auth.server";
import { api } from "convex/_generated/api";

export async function POST(req: Request) {
  const convex = getConvexClient();
  if (!convex) return Response.json({ error: "Service unavailable" }, { status: 503 });

  try {
    const { kidCode } = await req.json();
    if (!kidCode) return Response.json({ error: "Kid code required" }, { status: 400 });

    const row = await convex.query(api.kidCodes.getByCode, { code: kidCode.toUpperCase().trim() });
    if (!row) return Response.json({ error: "Invalid kid code" }, { status: 401 });

    const token = await signToken({ sub: row.userId, name: row.name, role: "kid" });
    return Response.json({ token, name: row.name });
  } catch (err) {
    console.error("Kid login error:", err);
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}
