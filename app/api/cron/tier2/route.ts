import { NextRequest, NextResponse } from "next/server";

/**
 * Tier 2 Differentiation Cron API Routes
 * Manual triggers for testing tier2 crons
 */

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: "Tier 2 cron endpoints not configured" }, { status: 404 });
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ error: "Tier 2 cron endpoints not configured" }, { status: 404 });
}
