import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const region = req.headers.get("x-vercel-ip-country-region") ?? "";
  const country = req.headers.get("x-vercel-ip-country") ?? "IN";
  return NextResponse.json({ region: `${country}-${region}`, country });
}
