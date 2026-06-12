// @ts-nocheck
// Run 'npx convex dev' first to generate convex/_generated/
import "server-only";
import { signToken } from "../../lib/auth.server";
import { getConvexClient } from "../../lib/convexClient";
import { api } from "convex/_generated/api";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  if (!username || !password) return Response.json({ error: "Missing credentials" }, { status: 400 });

  const email = username.trim().toLowerCase();

  // Require Convex to be configured
  const convex = getConvexClient();
  if (!convex) {
    return Response.json({ error: "Service unavailable" }, { status: 503 });
  }

  try {
    const user = await convex.query(api.users.getByEmail, { email });
    if (user && user.passwordHash) {
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (valid) {
        const token = await signToken({ sub: user._id.toString(), email: user.email ?? "", name: user.name, role: "student" });
        return Response.json({ token });
      }
    }
  } catch (err) {
    console.error("Convex auth error:", err);
    return Response.json({ error: "Service unavailable" }, { status: 503 });
  }

  return Response.json({ error: "Invalid credentials" }, { status: 401 });
}
