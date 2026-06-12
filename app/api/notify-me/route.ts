import "server-only";
import { Resend } from "resend";

const FROM = "10minCUET <noreply@10mincuet.com>";
const ADMIN = "support@10mincuet.com";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Valid email required" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY || "placeholder");

    await Promise.all([
      // Confirmation to user
      resend.emails.send({
        from: FROM,
        to: email,
        subject: "We'll notify you when 10minCUET is back — hold tight",
        html: `
          <div style="font-family:sans-serif;max-width:440px;margin:auto;padding:32px 24px">
            <div style="font-size:22px;font-weight:900;margin-bottom:4px">10min<span style="color:#f97316">CUET</span></div>
            <h2 style="font-size:18px;color:#111;margin:16px 0 8px">We're on it 🛠</h2>
            <p style="color:#555;font-size:14px;line-height:1.6">
              Our service is temporarily unavailable. You're on the list — we'll email you the moment it's back.
            </p>
            <p style="color:#555;font-size:14px;line-height:1.6;margin-top:12px">
              Average downtime: under 30 minutes. Your prep doesn't stop — write down one formula from your weakest chapter while you wait.
            </p>
            <p style="color:#9ca3af;font-size:12px;margin-top:24px">
              10minCUET · <a href="https://10mincuet.com" style="color:#f97316">10mincuet.com</a>
            </p>
          </div>
        `,
      }),

      // Admin notification
      resend.emails.send({
        from: FROM,
        to: ADMIN,
        subject: `[10minCUET] Service-down capture: ${email}`,
        html: `
          <p>User <strong>${email}</strong> hit a service-down page and requested a notification.</p>
          <p>Send them a follow-up when the service is restored.</p>
          <p style="color:#888;font-size:12px">Time: ${new Date().toISOString()}</p>
        `,
      }),
    ]);

    return Response.json({ ok: true });
  } catch (err) {
    console.error("notify-me error:", err);
    return Response.json({ error: "Failed to save" }, { status: 500 });
  }
}
