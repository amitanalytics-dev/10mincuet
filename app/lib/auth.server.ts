import "server-only";
import { SignJWT, jwtVerify } from "jose";

function getSecret(): Uint8Array {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET environment variable is required");
  return new TextEncoder().encode(s);
}
const secret = getSecret;

export const JWT_EXPIRY = "30d"; // 30-day session

/** Sign a JWT with the server secret. Only runs server-side. */
export async function signToken(payload: Record<string, string>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(secret());
}

/** Verify a Bearer token from the Authorization header. Returns payload or null. */
export async function verifyToken(authHeader: string | null): Promise<Record<string, string> | null> {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as Record<string, string>;
  } catch {
    return null;
  }
}

/** Extract auth header from a Request. */
export function getAuthHeader(req: Request): string | null {
  return req.headers.get("Authorization");
}
