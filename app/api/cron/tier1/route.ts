import { NextRequest, NextResponse } from "next/server";

/**
 * Tier 1 Viral Cron API Routes
 * Manual triggers for testing tier1 crons
 */

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: "Tier 1 cron endpoints not configured" }, { status: 404 });
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ error: "Tier 1 cron endpoints not configured" }, { status: 404 });
}
