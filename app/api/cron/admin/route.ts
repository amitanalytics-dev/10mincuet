import { NextRequest, NextResponse } from "next/server";

/**
 * Admin Cron API Routes
 * Manual triggers for testing admin crons
 */

export async function POST(request: NextRequest) {
  return NextResponse.json({ error: "Admin cron endpoints not configured" }, { status: 404 });
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ error: "Admin cron endpoints not configured" }, { status: 404 });
}
