import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  const { userId, currentClass } = await req.json();
  if (!userId || !currentClass) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  try {
    await convex.mutation(api.users.setClass, { userId, currentClass });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
