// @ts-nocheck
import "server-only";
import { getConvexClient } from "../../../lib/convexClient";
import { api } from "convex/_generated/api";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const convex = getConvexClient();
  if (!convex) return new Response("No Convex client", { status: 503 });

  // Get all parent users (non-kid users who have kid accounts)
  const allUsers = await convex.query(api.users.getAllWithEmail, {});

  let sent = 0;
  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  for (const parent of allUsers) {
    try {
      if (!parent.email || parent.emailSuppressed || parent.isKid) continue;

      const kids = await convex.query(api.users.getKidsByParent, { parentId: parent._id });
      if (kids.length === 0) continue;

      const now = Date.now();
      const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
      const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000;

      const kidReports = await Promise.all(kids.map(async (kid) => {
        const allProgress = await convex.query(api.progress.getByUser, { userId: kid._id });
        const thisWeek = allProgress.filter(p => p.updatedAt >= weekAgo);
        const lastWeek = allProgress.filter(p => p.updatedAt >= twoWeeksAgo && p.updatedAt < weekAgo);

        const thisWeekAvg = thisWeek.length > 0
          ? thisWeek.reduce((s, r) => s + r.bloomLevel, 0) / thisWeek.length
          : 0;
        const lastWeekAvg = lastWeek.length > 0
          ? lastWeek.reduce((s, r) => s + r.bloomLevel, 0) / lastWeek.length
          : 0;

        const improvementPct = lastWeekAvg > 0
          ? Math.round(((thisWeekAvg - lastWeekAvg) / lastWeekAvg) * 100)
          : 0;

        const weakTopics = [...allProgress]
          .sort((a, b) => a.bloomLevel - b.bloomLevel)
          .slice(0, 3)
          .map(r => r.topicSlug.replace(/-/g, ' '));

        const subjectMap: Record<string, number[]> = {};
        for (const p of thisWeek) {
          const subj = topicToSubject(p.topicSlug);
          if (!subjectMap[subj]) subjectMap[subj] = [];
          subjectMap[subj].push(p.bloomLevel);
        }
        const subjectProgress = Object.entries(subjectMap).map(([subj, levels]) => ({
          subject: subj,
          avgBloom: Math.round(levels.reduce((s, l) => s + l, 0) / levels.length * 10) / 10,
          topics: levels.length,
        }));

        return {
          name: kid.name,
          topicsThisWeek: thisWeek.length,
          improvementPct,
          weakTopics,
          subjectProgress,
        };
      }));

      if (kidReports.every(k => k.topicsThisWeek === 0)) continue;

      const html = buildParentEmailHtml(parent.name, kidReports);

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "10minCUET Reports <reports@10minjee.com>",
          to: [parent.email],
          subject: `Weekly Progress Report — ${kids.map(k => k.name).join(", ")}`,
          html,
        }),
      });

      sent++;
    } catch (err) {
      console.error(`Parent weekly email failed for ${parent.email}:`, err);
    }
  }

  return Response.json({ sent });
}

function topicToSubject(topicSlug: string): string {
  const physics = ["kinematics","laws-of-motion","work-energy","rotational","gravitation","thermodynamics","waves","electrostatics","current-electricity","magnetic","electromagnetic","modern-physics","optics"];
  const chemistry = ["atomic","chemical-bonding","periodic","equilibrium","thermochemistry","electrochemistry","organic","hydrocarbons","biomolecules","polymers","coordination"];
  const math = ["sets","complex-numbers","sequences","quadratic","permutations","binomial","matrices","limits","integrals","differential","coordinate","vector","probability","statistics"];
  if (physics.some(t => topicSlug.includes(t))) return "Languages";
  if (chemistry.some(t => topicSlug.includes(t))) return "Domain";
  if (math.some(t => topicSlug.includes(t))) return "General Test";
  return "Other";
}

function buildParentEmailHtml(parentName: string, kids: any[]): string {
  const kidSections = kids.map(kid => {
    const arrow = kid.improvementPct > 0 ? "▲" : kid.improvementPct < 0 ? "▼" : "→";
    const color = kid.improvementPct > 0 ? "#10b981" : kid.improvementPct < 0 ? "#ef4444" : "#6b7280";
    const subjRows = kid.subjectProgress.map((s: any) =>
      `<tr><td style="padding:6px 12px">${s.subject}</td><td style="padding:6px 12px;text-align:center">${s.topics} topics</td><td style="padding:6px 12px;text-align:center">L${Math.round(s.avgBloom)}</td></tr>`
    ).join("");
    return `
      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin-bottom:20px">
        <h3 style="margin:0 0 12px;font-size:18px;color:#111">${kid.name}</h3>
        <div style="display:flex;gap:20px;margin-bottom:16px;flex-wrap:wrap">
          <div style="background:#f9fafb;border-radius:8px;padding:12px 16px;flex:1;min-width:120px">
            <div style="font-size:24px;font-weight:900;color:#f97316">${kid.topicsThisWeek}</div>
            <div style="font-size:11px;color:#6b7280;margin-top:2px">topics this week</div>
          </div>
          <div style="background:#f9fafb;border-radius:8px;padding:12px 16px;flex:1;min-width:120px">
            <div style="font-size:24px;font-weight:900;color:${color}">${arrow} ${Math.abs(kid.improvementPct)}%</div>
            <div style="font-size:11px;color:#6b7280;margin-top:2px">vs last week</div>
          </div>
        </div>
        ${subjRows ? `<table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:12px"><thead><tr style="background:#f9fafb"><th style="padding:6px 12px;text-align:left;color:#6b7280;font-weight:600">Subject</th><th style="padding:6px 12px;color:#6b7280;font-weight:600">Topics</th><th style="padding:6px 12px;color:#6b7280;font-weight:600">Avg Level</th></tr></thead><tbody>${subjRows}</tbody></table>` : ""}
        ${kid.weakTopics.length > 0 ? `<div style="background:#fef3c7;border-radius:8px;padding:12px;font-size:12px"><strong>Focus areas next week:</strong> ${kid.weakTopics.join(", ")}</div>` : ""}
      </div>
    `;
  }).join("");

  return `<!DOCTYPE html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9fafb;margin:0;padding:20px">
    <div style="max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#f97316,#ef4444);border-radius:12px;padding:30px;text-align:center;margin-bottom:24px">
        <h1 style="color:white;margin:0;font-size:22px">Weekly Progress Report</h1>
        <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px">Hi ${parentName} — here's how your child is doing</p>
      </div>
      ${kidSections}
      <div style="text-align:center;padding:20px;font-size:12px;color:#9ca3af">
        <a href="https://10minjee.com/parent-dashboard" style="color:#f97316;font-weight:700">View Full Dashboard →</a><br><br>
        10minCUET · <a href="https://10minjee.com/unsubscribe" style="color:#9ca3af">Unsubscribe</a>
      </div>
    </div>
  </body></html>`;
}
