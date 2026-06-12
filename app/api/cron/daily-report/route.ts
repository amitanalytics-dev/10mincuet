// @ts-nocheck
import "server-only";
import { getConvexClient } from "../../../lib/convexClient";
import { api } from "convex/_generated/api";

export const runtime = "nodejs";

const REPORT_RECIPIENTS = [
  "mehrotrarishabh41@gmail.com",
  "amit@berriesadvisory.com",
];

// CUET pricing: per-subject ₹99, 5-subject bundle ₹349, annual ₹999.
// No parent+kid SKU (CUET aspirants are mostly 18yo).
const PLAN_LABELS: Record<string, string> = {
  languages: "Languages ₹99",
  domain: "Domain ₹99",
  general_test: "General Test ₹99",
  bundle: "5-Subject Bundle ₹349",
  annual: "Annual ₹999",
};

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const convex = getConvexClient();
  if (!convex) return new Response("No Convex client — set NEXT_PUBLIC_CONVEX_URL", { status: 503 });

  const stats = await convex.query(api.analytics.dailyStats, {});

  const date = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });

  const tierRows = Object.entries(stats.monetization.tierBreakdown as Record<string, number>)
    .map(([tier, count]: [string, number]) =>
      `<tr>
        <td style="padding:6px 12px;border-bottom:1px solid #f3f4f6">${PLAN_LABELS[tier] ?? tier}</td>
        <td style="padding:6px 12px;border-bottom:1px solid #f3f4f6;text-align:right;font-weight:700">${count}</td>
      </tr>`
    )
    .join("");

  const bloomRows = Object.entries(stats.engagement.bloomDist)
    .sort(([a], [b]) => +a - +b)
    .map(([level, count]: [string, unknown]) => {
      const c = Number(count);
      const labels: Record<string, string> = {
        "1": "L1 Remember",
        "2": "L2 Understand",
        "3": "L3 Apply",
        "4": "L4 Analyse",
        "5": "L5 Evaluate",
        "6": "L6 Create",
      };
      const pct =
        stats.engagement.totalProgressEntries > 0
          ? Math.round((c / stats.engagement.totalProgressEntries) * 100)
          : 0;
      return `<tr>
        <td style="padding:6px 12px;border-bottom:1px solid #f3f4f6">${labels[level] ?? `L${level}`}</td>
        <td style="padding:6px 12px;border-bottom:1px solid #f3f4f6;text-align:right">${c}</td>
        <td style="padding:6px 12px;border-bottom:1px solid #f3f4f6;text-align:right">${pct}%</td>
      </tr>`;
    })
    .join("");

  const html = `
    <div style="font-family:sans-serif;max-width:640px;margin:auto;color:#111">
      <!-- Header -->
      <div style="background:#111;padding:24px 28px;border-radius:16px 16px 0 0;display:flex;align-items:center;justify-content:space-between">
        <div>
          <div style="font-size:20px;font-weight:900;color:#f97316">10min<span style="color:#fff">JEE</span></div>
          <div style="font-size:12px;color:#9ca3af;margin-top:2px">Daily Operations Report</div>
        </div>
        <div style="text-align:right;color:#9ca3af;font-size:12px">${date} · IST</div>
      </div>

      <!-- 4 KPI cards -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:0;background:#f9fafb;border:1px solid #e5e7eb;border-top:0">
        <div style="padding:16px;text-align:center;border-right:1px solid #e5e7eb">
          <div style="font-size:26px;font-weight:900;color:#3b82f6">${stats.acquisition.newToday}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px">New today</div>
        </div>
        <div style="padding:16px;text-align:center;border-right:1px solid #e5e7eb">
          <div style="font-size:26px;font-weight:900;color:#10b981">${stats.engagement.activeToday}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px">Active today</div>
        </div>
        <div style="padding:16px;text-align:center;border-right:1px solid #e5e7eb">
          <div style="font-size:26px;font-weight:900;color:#f97316">₹${stats.monetization.mrr.toLocaleString("en-IN")}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px">MRR</div>
        </div>
        <div style="padding:16px;text-align:center">
          <div style="font-size:26px;font-weight:900;color:#8b5cf6">${stats.retention.dauMauRatio}%</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px">DAU/WAU</div>
        </div>
      </div>

      <!-- Body -->
      <div style="background:#fff;border:1px solid #e5e7eb;border-top:0;padding:24px 28px;border-radius:0 0 16px 16px">

        <!-- ACQUISITION -->
        <h2 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#f97316;margin:0 0 12px">🚀 Acquisition</h2>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px">
          <tr style="background:#f9fafb">
            <td style="padding:8px 12px;font-weight:600;color:#374151">Total registered students</td>
            <td style="padding:8px 12px;text-align:right;font-weight:900;font-size:15px">${stats.acquisition.totalStudents.toLocaleString("en-IN")}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;color:#374151">New signups today</td>
            <td style="padding:8px 12px;text-align:right;font-weight:700;color:#3b82f6">${stats.acquisition.newToday}</td>
          </tr>
          <tr style="background:#f9fafb">
            <td style="padding:8px 12px;color:#374151">New signups last 7 days</td>
            <td style="padding:8px 12px;text-align:right;font-weight:700">${stats.acquisition.newLast7}</td>
          </tr>
        </table>

        <!-- RETENTION -->
        <h2 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#10b981;margin:0 0 12px">🔄 Retention</h2>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px">
          <tr style="background:#f9fafb">
            <td style="padding:8px 12px;color:#374151">DAU (studied today)</td>
            <td style="padding:8px 12px;text-align:right;font-weight:700;color:#10b981">${stats.retention.dau}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;color:#374151">WAU (studied last 7 days)</td>
            <td style="padding:8px 12px;text-align:right;font-weight:700">${stats.retention.mau}</td>
          </tr>
          <tr style="background:#f9fafb">
            <td style="padding:8px 12px;color:#374151">DAU/WAU ratio</td>
            <td style="padding:8px 12px;text-align:right;font-weight:700">${stats.retention.dauMauRatio}%</td>
          </tr>
        </table>

        <!-- ENGAGEMENT -->
        <h2 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#8b5cf6;margin:0 0 12px">🧠 Engagement</h2>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:8px">
          <tr style="background:#f9fafb">
            <td style="padding:8px 12px;color:#374151">Total progress entries</td>
            <td style="padding:8px 12px;text-align:right;font-weight:700">${stats.engagement.totalProgressEntries.toLocaleString("en-IN")}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;color:#374151">Avg Bloom level (platform)</td>
            <td style="padding:8px 12px;text-align:right;font-weight:700">L${stats.engagement.avgBloom}</td>
          </tr>
        </table>
        ${bloomRows ? `
        <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:24px">
          <thead>
            <tr style="background:#f3f4f6">
              <th style="padding:6px 12px;text-align:left;color:#6b7280;font-weight:600">Level</th>
              <th style="padding:6px 12px;text-align:right;color:#6b7280;font-weight:600">Students</th>
              <th style="padding:6px 12px;text-align:right;color:#6b7280;font-weight:600">Share</th>
            </tr>
          </thead>
          <tbody>${bloomRows}</tbody>
        </table>
        ` : "<p style='color:#9ca3af;font-size:12px;margin-bottom:24px'>No engagement data yet</p>"}

        <!-- MONETIZATION -->
        <h2 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#f59e0b;margin:0 0 12px">💰 Monetization</h2>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:8px">
          <tr style="background:#fff7ed">
            <td style="padding:10px 12px;font-weight:700;color:#374151">Monthly Recurring Revenue</td>
            <td style="padding:10px 12px;text-align:right;font-weight:900;font-size:18px;color:#f97316">₹${stats.monetization.mrr.toLocaleString("en-IN")}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;color:#374151">Paid subscriptions (active)</td>
            <td style="padding:8px 12px;text-align:right;font-weight:700">${stats.monetization.paidCount}</td>
          </tr>
          <tr style="background:#f9fafb">
            <td style="padding:8px 12px;color:#374151">Free tier users</td>
            <td style="padding:8px 12px;text-align:right;font-weight:700">${stats.monetization.freeSubs}</td>
          </tr>
          <tr>
            <td style="padding:8px 12px;color:#374151">Conversion rate</td>
            <td style="padding:8px 12px;text-align:right;font-weight:700">
              ${stats.acquisition.totalStudents > 0
                ? Math.round((stats.monetization.paidCount / stats.acquisition.totalStudents) * 100)
                : 0}%
            </td>
          </tr>
        </table>
        ${tierRows ? `
        <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:24px">
          <thead>
            <tr style="background:#f3f4f6">
              <th style="padding:6px 12px;text-align:left;color:#6b7280;font-weight:600">Plan</th>
              <th style="padding:6px 12px;text-align:right;color:#6b7280;font-weight:600">Count</th>
            </tr>
          </thead>
          <tbody>${tierRows}</tbody>
        </table>
        ` : ""}

        <!-- Footer -->
        <div style="border-top:1px solid #f3f4f6;padding-top:16px;margin-top:8px">
          <p style="font-size:11px;color:#9ca3af;margin:0">
            10minCUET Daily Report · Auto-generated by Vercel Cron · ${new Date().toISOString()}
          </p>
          <p style="font-size:11px;color:#9ca3af;margin:4px 0 0">
            EAZEALLIANCE SERVICES PRIVATE LIMITED · GST 09AAHCE2255K1ZF
          </p>
        </div>
      </div>
    </div>
  `;

  // Send to both recipients
  const resend = await import("resend").then((m) => new m.Resend(process.env.RESEND_API_KEY ?? "placeholder"));
  await resend.emails.send({
    from: "10minCUET Reports <noreply@10minjee.com>",
    to: REPORT_RECIPIENTS,
    subject: `10minCUET Daily — ${stats.acquisition.newToday} new · ₹${stats.monetization.mrr.toLocaleString("en-IN")} MRR · ${date}`,
    html,
  });

  return new Response(`Daily report sent. MRR: ₹${stats.monetization.mrr}, New today: ${stats.acquisition.newToday}`);
}
