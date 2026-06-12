import "server-only";
import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

const FROM = "10minCUET <noreply@10mincuet.com>";

export async function sendOtp(email: string, code: string) {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Your 10minCUET verification code: ${code}`,
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto">
        <h2 style="color:#f97316">10min<span style="color:#111">CUET</span></h2>
        <p>Your verification code is:</p>
        <div style="font-size:36px;font-weight:900;letter-spacing:8px;color:#111;padding:20px;background:#f9fafb;border-radius:12px;text-align:center">${code}</div>
        <p style="color:#888;font-size:12px">Expires in 10 minutes. Do not share this code.</p>
      </div>
    `,
  });
}

export async function sendWeeklyReport(email: string, name: string, reportHtml: string) {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Your 10minCUET weekly progress — ${new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}`,
    html: reportHtml,
  });
}

// Plan labels for GST invoice
const PLAN_LABELS: Record<string, string> = {
  physics: "Physics — Single Subject (₹99/month)",
  chemistry: "Chemistry — Single Subject (₹99/month)",
  math: "Math — Single Subject (₹99/month)",
  bundle: "Full Bundle — Physics + Chemistry + Math (₹349/month)",
  annual: "Annual Bundle — Full Access, 12 months (₹999/year)",
  parent_kid: "Parent + Kid — Full Access, 12 months (₹1,499/year)",
  mock_pack: "Mock Test Pack — 10 Full NTA-Pattern Mocks (₹499 one-time)",
};

export async function sendGstInvoice({
  email,
  name,
  tier,
  amountPaise,
  paymentId,
}: {
  email: string;
  name: string;
  tier: string;
  amountPaise: number;
  paymentId: string;
}) {
  const date = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const invoiceNo = `INV-${new Date().getFullYear()}-${paymentId.slice(-8).toUpperCase()}`;
  const totalRs = amountPaise / 100;
  // IGST 18% inclusive in price
  const taxableValue = +(totalRs / 1.18).toFixed(2);
  const igst = +(totalRs - taxableValue).toFixed(2);
  const planLabel = PLAN_LABELS[tier] ?? tier;

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
      <!-- Header -->
      <div style="background:#f97316;padding:24px 28px;display:flex;align-items:center;justify-content:space-between">
        <div>
          <div style="font-size:22px;font-weight:900;color:#fff">10min<span style="color:#fff1d0">CUET</span></div>
          <div style="font-size:11px;color:#fff1d0;margin-top:2px">EAZEALLIANCE SERVICES PRIVATE LIMITED</div>
        </div>
        <div style="text-align:right">
          <div style="color:#fff;font-size:16px;font-weight:700">Tax Invoice</div>
          <div style="color:#fff1d0;font-size:11px">${invoiceNo}</div>
        </div>
      </div>

      <!-- Billed To / Seller -->
      <div style="display:flex;gap:16px;padding:20px 28px;background:#fafafa;border-bottom:1px solid #e5e7eb">
        <div style="flex:1">
          <div style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Seller</div>
          <div style="font-weight:700;color:#111">EAZEALLIANCE SERVICES PVT LTD</div>
          <div style="color:#6b7280;font-size:12px">GSTIN: 09AAHCE2255K1ZF</div>
          <div style="color:#6b7280;font-size:12px">Email: support@10mincuet.com</div>
          <div style="color:#6b7280;font-size:12px">Web: 10mincuet.com</div>
        </div>
        <div style="flex:1">
          <div style="font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Billed To</div>
          <div style="font-weight:700;color:#111">${name}</div>
          <div style="color:#6b7280;font-size:12px">${email}</div>
          <div style="color:#6b7280;font-size:12px;margin-top:4px">Invoice Date: ${date}</div>
          <div style="color:#6b7280;font-size:12px">Payment ID: ${paymentId}</div>
        </div>
      </div>

      <!-- Table -->
      <div style="padding:20px 28px">
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead>
            <tr style="background:#f3f4f6">
              <th style="text-align:left;padding:8px 10px;color:#6b7280;font-weight:600">#</th>
              <th style="text-align:left;padding:8px 10px;color:#6b7280;font-weight:600">Description</th>
              <th style="text-align:right;padding:8px 10px;color:#6b7280;font-weight:600">Taxable Value</th>
              <th style="text-align:right;padding:8px 10px;color:#6b7280;font-weight:600">IGST 18%</th>
              <th style="text-align:right;padding:8px 10px;color:#6b7280;font-weight:600">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid #e5e7eb">
              <td style="padding:10px">1</td>
              <td style="padding:10px;color:#111;font-weight:500">${planLabel}</td>
              <td style="padding:10px;text-align:right">₹${taxableValue.toLocaleString("en-IN")}</td>
              <td style="padding:10px;text-align:right">₹${igst.toLocaleString("en-IN")}</td>
              <td style="padding:10px;text-align:right;font-weight:700">₹${totalRs.toLocaleString("en-IN")}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" style="padding:12px 10px;text-align:right;font-weight:700;color:#111">Total Amount</td>
              <td style="padding:12px 10px;text-align:right;font-weight:900;font-size:16px;color:#f97316">₹${totalRs.toLocaleString("en-IN")}</td>
            </tr>
          </tfoot>
        </table>
        <p style="font-size:11px;color:#9ca3af;margin-top:8px">
          * This is a digitally generated invoice. GST (IGST @ 18%) is included in the total amount above.
          SAC Code: 999299 (Online educational support services).
        </p>
      </div>

      <!-- Footer -->
      <div style="padding:16px 28px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center">
        <p style="font-size:12px;color:#6b7280;margin:0">Thank you for choosing 10minCUET. Questions? Email <a href="mailto:support@10mincuet.com" style="color:#f97316">support@10mincuet.com</a></p>
        <p style="font-size:11px;color:#9ca3af;margin-top:4px">10mincuet.com · EAZEALLIANCE SERVICES PRIVATE LIMITED · GST 09AAHCE2255K1ZF</p>
      </div>
    </div>
  `;

  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Payment Receipt & GST Invoice — ${invoiceNo} — 10minCUET`,
    html,
  });
}
