import "server-only";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://10minjee.com";

// ─── Shared building blocks ───────────────────────────────────────────────────

function branded(content: string, email: string, preheader = ""): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>10minCUET</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden">${preheader}</div>` : ""}
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3f4f6">
    <tr>
      <td align="center" style="padding:40px 20px">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%">

          <!-- Brand header -->
          <tr>
            <td style="background:#f97316;padding:28px 32px;border-radius:16px 16px 0 0">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <div style="font-size:26px;font-weight:900;color:#fff;letter-spacing:-0.5px;line-height:1">
                      10min<span style="color:#fff1d0">JEE</span>
                    </div>
                    <div style="font-size:12px;color:#ffedd5;margin-top:4px">India's #1 fast JEE prep platform</div>
                  </td>
                  <td align="right">
                    <span style="font-size:36px;line-height:1">🎯</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- White body -->
          <tr>
            <td style="background:#ffffff;padding:36px 32px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 32px;border-radius:0 0 16px 16px;border:1px solid #e5e7eb;border-top:0;text-align:center">
              <p style="margin:0;font-size:12px;color:#6b7280">
                <strong style="color:#374151">10minCUET</strong> &nbsp;·&nbsp; EAZEALLIANCE SERVICES PRIVATE LIMITED
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#9ca3af">
                <a href="${BASE_URL}/topics" style="color:#f97316;text-decoration:none;font-weight:600">Continue Learning</a>
                &nbsp;·&nbsp;
                <a href="mailto:support@10minjee.com" style="color:#9ca3af;text-decoration:none">Support</a>
                &nbsp;·&nbsp;
                <a href="${BASE_URL}/unsubscribe?email=${encodeURIComponent(email)}" style="color:#9ca3af;text-decoration:none">Unsubscribe</a>
              </p>
              <p style="margin:6px 0 0;font-size:10px;color:#d1d5db">
                10minjee.com &nbsp;·&nbsp; GST 09AAHCE2255K1ZF
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function ctaButton(text: string, url: string, secondary = false): string {
  const bg = secondary ? "#111827" : "#f97316";
  return `<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto">
    <tr>
      <td align="center" bgcolor="${bg}" style="border-radius:12px">
        <a href="${url}" style="display:inline-block;padding:15px 32px;color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;border-radius:12px;background:${bg}">${text}</a>
      </td>
    </tr>
  </table>`;
}

function divider(): string {
  return `<div style="border-top:1px solid #f3f4f6;margin:28px 0"></div>`;
}

function statCard(value: string, label: string, color: string): string {
  return `<td style="text-align:center;background:#f9fafb;border-radius:12px;padding:18px 12px;border:1px solid #f3f4f6">
    <div style="font-size:28px;font-weight:900;color:${color};line-height:1">${value}</div>
    <div style="font-size:11px;color:#6b7280;margin-top:6px">${label}</div>
  </td>`;
}

// ─── 1. WELCOME SERIES ────────────────────────────────────────────────────────

export function welcomeDay1Html(name: string, email: string): string {
  const content = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:900;color:#111">
      Welcome, ${name}! 🎉
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6">
      Your 10minCUET account is live. You're now on the fastest path to cracking JEE.
    </p>

    <!-- Hero card -->
    <div style="background:linear-gradient(135deg,#fff7ed 0%,#ffedd5 100%);border-radius:16px;padding:28px;border:1px solid #fed7aa;margin-bottom:28px">
      <div style="font-size:40px;text-align:center;margin-bottom:12px">🚀</div>
      <h2 style="margin:0 0 10px;font-size:18px;font-weight:800;color:#c2410c;text-align:center">
        10 minutes a day beats 2 hours of passive reading
      </h2>
      <p style="margin:0;font-size:13px;color:#9a3412;text-align:center;line-height:1.6">
        Our Bloom-level adaptive system pinpoints exactly what you don't know — so you never waste a minute.
      </p>
    </div>

    <!-- 3 steps -->
    <h3 style="margin:0 0 16px;font-size:14px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.05em">Your first 3 steps</h3>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="width:36px;height:36px;background:#fff7ed;border-radius:50%;text-align:center;vertical-align:middle;font-weight:900;color:#f97316;font-size:14px">1</td>
              <td style="padding-left:12px;font-size:14px;color:#374151">Take a <strong>5-minute topic quiz</strong> — see your Bloom level instantly</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="width:36px;height:36px;background:#fff7ed;border-radius:50%;text-align:center;vertical-align:middle;font-weight:900;color:#f97316;font-size:14px">2</td>
              <td style="padding-left:12px;font-size:14px;color:#374151">Review your <strong>weakest sub-concepts</strong> — we highlight them for you</td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 0">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="width:36px;height:36px;background:#fff7ed;border-radius:50%;text-align:center;vertical-align:middle;font-weight:900;color:#f97316;font-size:14px">3</td>
              <td style="padding-left:12px;font-size:14px;color:#374151">Repeat daily — <strong>watch your Bloom level climb</strong> week by week</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${divider()}

    <div style="text-align:center">
      ${ctaButton("Take your first mock →", `${BASE_URL}/mock`)}
      <p style="margin:16px 0 0;font-size:12px;color:#9ca3af">Takes only 10 minutes. No pressure.</p>
    </div>
  `;
  return branded(content, email, `You're in! Take your first 10-minute mock and see your JEE readiness score.`);
}

export function welcomeDay2MockTakenHtml(name: string, email: string, score: number, bloomLevel: number): string {
  const bloom = ["", "Remember", "Understand", "Apply", "Analyse", "Evaluate", "Create"][bloomLevel] ?? "Apply";
  const content = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:900;color:#111">
      ${name}, here's your results breakdown 📊
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6">
      You scored <strong style="color:#f97316">${score}%</strong> on your first mock. Here's what that means for your JEE prep.
    </p>

    <div style="background:#f0fdf4;border-radius:12px;padding:20px;border-left:4px solid #16a34a;margin-bottom:24px">
      <p style="margin:0;font-size:14px;color:#166534">
        <strong>Your Bloom Level: ${bloom} (L${bloomLevel})</strong> — You're already thinking at a solid conceptual level.
        ${bloomLevel >= 3 ? "Focus on application problems to push higher." : "Work on understanding the 'why' behind formulas — it unlocks L3+."}
      </p>
    </div>

    <h3 style="margin:0 0 12px;font-size:14px;font-weight:700;color:#374151">What's next?</h3>
    <p style="margin:0 0 20px;font-size:14px;color:#6b7280;line-height:1.6">
      Keep the momentum going. Students who practice every day for 2 weeks improve their Bloom level by an average of 1.4 points.
    </p>

    <div style="text-align:center">
      ${ctaButton("Continue your session →", `${BASE_URL}/topics`)}
    </div>
  `;
  return branded(content, email, `Your Day 1 results are in — Bloom L${bloomLevel}. Here's your personalised next step.`);
}

export function welcomeDay2NoMockHtml(name: string, email: string): string {
  const content = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:900;color:#111">
      ${name}, ready to test yourself? 🤔
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6">
      Most students who delay their first mock score <strong>22% lower</strong> in their final JEE attempt. Don't be that student.
    </p>

    <!-- Urgency block -->
    <div style="background:#fef2f2;border-radius:12px;padding:20px;border-left:4px solid #ef4444;margin-bottom:24px">
      <p style="margin:0;font-size:14px;color:#991b1b;line-height:1.6">
        <strong>⏰ Only 10 minutes needed.</strong> Our diagnostic mock instantly shows you where you stand across Physics, Chemistry, and Maths — so you can study smarter from Day 1.
      </p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px">
      <tr>
        <td width="32%" ${statCard("10 min", "Time needed", "#f97316")}></td>
        <td width="4%"></td>
        <td width="32%" ${statCard("3", "Subjects diagnosed", "#8b5cf6")}></td>
        <td width="4%"></td>
        <td width="32%" ${statCard("Free", "No credit card", "#16a34a")}></td>
      </tr>
    </table>

    <div style="text-align:center">
      ${ctaButton("Take the free diagnostic mock →", `${BASE_URL}/mock`)}
    </div>
  `;
  return branded(content, email, `You haven't taken your first mock yet — it takes only 10 minutes!`);
}

export function welcomeDay7Html(name: string, email: string, improvement: number, topperName: string): string {
  const content = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:900;color:#111">
      ${name}, you've improved ${improvement}% since joining 🔥
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6">
      One week in. Your Bloom level is climbing. Here's how students like you are cracking JEE with 10minCUET.
    </p>

    <!-- Topper story -->
    <div style="background:linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%);border-radius:16px;padding:24px;border:1px solid #fde68a;margin-bottom:24px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
        <div style="width:44px;height:44px;background:#f97316;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px">🏆</div>
        <div>
          <div style="font-weight:800;color:#92400e;font-size:15px">${topperName}</div>
          <div style="font-size:12px;color:#b45309">JEE Advanced 2024 — AIR 847</div>
        </div>
      </div>
      <p style="margin:0;font-size:13px;color:#78350f;line-height:1.7;font-style:italic">
        "I used to study 6 hours a day and still felt lost. After switching to 10minCUET's Bloom-level approach, I realised I was memorising instead of understanding. The 10-minute daily sessions forced me to actually apply concepts. Within 3 months, my mock scores jumped from 45% to 78%."
      </p>
    </div>

    <!-- Upgrade nudge -->
    <div style="background:#f5f3ff;border-radius:12px;padding:20px;border-left:4px solid #7c3aed;margin-bottom:24px">
      <h3 style="margin:0 0 8px;font-size:14px;font-weight:700;color:#5b21b6">Unlock your full potential</h3>
      <p style="margin:0;font-size:13px;color:#6d28d9;line-height:1.6">
        Premium users see <strong>3× faster Bloom-level growth</strong> with unlimited practice, full JEE mock tests, and personalised weak-topic drilling. Starting at ₹149/month.
      </p>
    </div>

    <div style="text-align:center">
      ${ctaButton("See premium plans →", `${BASE_URL}/pricing`)}
      <p style="margin:16px 0 0;font-size:12px;color:#9ca3af">No commitment. Cancel anytime.</p>
    </div>
  `;
  return branded(content, email, `You've improved ${improvement}% in your first week! Here's how toppers use 10minCUET.`);
}

// ─── 2. POST-MOCK ─────────────────────────────────────────────────────────────

export function postMockHtml(
  name: string,
  email: string,
  score: number,
  subject: string,
  weakTopics: string[],
  strongTopics: string[],
  languagesScore?: number,
  chemScore?: number,
  generalTestScore?: number
): string {
  const scoreColor = score >= 70 ? "#16a34a" : score >= 45 ? "#f59e0b" : "#ef4444";
  const scoreLabel = score >= 70 ? "Excellent! 🌟" : score >= 45 ? "Good effort 💪" : "Keep going! 🔥";

  const weakItems = weakTopics.slice(0, 3).map((t, i) => {
    const badges = ["🔴", "🟠", "🟡"];
    return `<tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f9fafb">
        <span style="font-size:16px">${badges[i]}</span>
        <span style="margin-left:8px;font-size:13px;color:#374151;font-weight:600">${t}</span>
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #f9fafb;text-align:right">
        <a href="${BASE_URL}/topics" style="font-size:12px;color:#f97316;text-decoration:none;font-weight:600">Practice →</a>
      </td>
    </tr>`;
  }).join("");

  const strongItems = strongTopics.slice(0, 3).map((t, i) => {
    const badges = ["🥇", "🥈", "🥉"];
    return `<tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f9fafb">
        <span style="font-size:16px">${badges[i]}</span>
        <span style="margin-left:8px;font-size:13px;color:#374151;font-weight:600">${t}</span>
      </td>
    </tr>`;
  }).join("");

  const subjectBreakdown = (languagesScore !== undefined && chemScore !== undefined && generalTestScore !== undefined)
    ? `
    <h3 style="margin:0 0 12px;font-size:13px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.05em">Subject breakdown</h3>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px">
      <tr>
        <td width="31%" ${statCard(`${languagesScore}%`, "Physics", "#3b82f6")}></td>
        <td width="4%"></td>
        <td width="31%" ${statCard(`${chemScore}%`, "Chemistry", "#10b981")}></td>
        <td width="4%"></td>
        <td width="31%" ${statCard(`${generalTestScore}%`, "Maths", "#8b5cf6")}></td>
      </tr>
    </table>` : "";

  const whatsappText = encodeURIComponent(`I just scored ${score}% on a ${subject} mock on 10minCUET! 🎯 My Bloom analysis shows exactly where I need to improve. Try it free: ${BASE_URL}`);

  const content = `
    <h1 style="margin:0 0 6px;font-size:22px;font-weight:900;color:#111">
      ${name}, your mock results are in! 📋
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:#6b7280">${subject} · ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>

    <!-- Score card -->
    <div style="background:linear-gradient(135deg,#fff7ed 0%,#ffedd5 100%);border-radius:16px;padding:28px;text-align:center;border:1px solid #fed7aa;margin-bottom:28px">
      <div style="font-size:13px;color:#9a3412;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px">Your Score</div>
      <div style="font-size:56px;font-weight:900;color:${scoreColor};line-height:1">${score}%</div>
      <div style="font-size:15px;color:#c2410c;margin-top:8px;font-weight:600">${scoreLabel}</div>
    </div>

    ${subjectBreakdown}

    ${weakItems ? `
    <h3 style="margin:0 0 8px;font-size:13px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.05em">⚡ Your 3 weakest areas</h3>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fafafa;border-radius:12px;border:1px solid #f3f4f6;margin-bottom:24px">
      ${weakItems}
    </table>
    ` : ""}

    ${strongItems ? `
    <h3 style="margin:0 0 8px;font-size:13px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.05em">✅ Your 3 strongest areas</h3>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fafafa;border-radius:12px;border:1px solid #f3f4f6;margin-bottom:24px">
      ${strongItems}
    </table>
    ` : ""}

    ${divider()}

    <div style="text-align:center">
      ${ctaButton("Get full personalised report →", `${BASE_URL}/pricing`)}
    </div>

    <div style="text-align:center;margin-top:16px">
      <a href="https://wa.me/?text=${whatsappText}" style="display:inline-flex;align-items:center;gap:8px;background:#25d366;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600">
        <span>📱</span> Share my score on WhatsApp
      </a>
    </div>
  `;
  return branded(content, email, `You scored ${score}% — here's your personalised weak-topic breakdown.`);
}

// ─── 3. WEEKLY DIGEST ────────────────────────────────────────────────────────

export interface WeeklyStats {
  quizzesTaken: number;
  topicsMastered: number;
  avgBloom: number;
  weakestArea: string;
  strongestArea: string;
  improvement: number;
}

export function weeklyDigestHtml(
  name: string,
  email: string,
  stats: WeeklyStats,
  referralCode: string
): string {
  const bloom = ["", "Remember", "Understand", "Apply", "Analyse", "Evaluate", "Create"][Math.round(stats.avgBloom)] ?? "Apply";
  const referralUrl = `${BASE_URL}?ref=${referralCode}`;
  const whatsappReferral = encodeURIComponent(`Join me on 10minCUET — India's fastest JEE prep platform! Use my invite link and we both get 50% off premium: ${referralUrl}`);

  const content = `
    <h1 style="margin:0 0 6px;font-size:22px;font-weight:900;color:#111">
      Your weekly JEE progress, ${name} 📈
    </h1>
    <p style="margin:0 0 24px;font-size:14px;color:#6b7280">
      You're <strong style="color:#f97316">${stats.improvement}% closer</strong> to your goal this week
    </p>

    <!-- Stats row -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px">
      <tr>
        <td width="31%" ${statCard(String(stats.quizzesTaken), "Quizzes this week", "#f97316")}></td>
        <td width="4%"></td>
        <td width="31%" ${statCard(String(stats.topicsMastered), "Topics mastered", "#16a34a")}></td>
        <td width="4%"></td>
        <td width="31%" ${statCard(`L${stats.avgBloom.toFixed(1)}`, "Avg Bloom level", "#8b5cf6")}></td>
      </tr>
    </table>

    <!-- Bloom level label -->
    <div style="background:#eff6ff;border-radius:12px;padding:16px;border-left:4px solid #3b82f6;margin-bottom:24px">
      <p style="margin:0;font-size:13px;color:#1e40af;line-height:1.6">
        <strong>Bloom Level: ${bloom}</strong> —
        ${stats.avgBloom < 2 ? "Focus on understanding the core concepts — ask 'why' before 'how'." :
          stats.avgBloom < 4 ? "Great! Push towards Apply (L3) — solve more practice problems." :
          "Outstanding! You're analysing at a high level. Keep it up!"}
      </p>
    </div>

    <!-- Weakest area -->
    ${stats.weakestArea ? `
    <div style="background:#fef2f2;border-radius:12px;padding:16px;border-left:4px solid #ef4444;margin-bottom:16px">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#b91c1c;text-transform:uppercase;letter-spacing:0.05em">Focus area this week</p>
      <p style="margin:0;font-size:14px;color:#991b1b;font-weight:600">${stats.weakestArea}</p>
      <a href="${BASE_URL}/topics" style="display:inline-block;margin-top:8px;font-size:12px;color:#ef4444;font-weight:600;text-decoration:none">Practice this topic →</a>
    </div>
    ` : ""}

    <!-- Strongest area -->
    ${stats.strongestArea ? `
    <div style="background:#f0fdf4;border-radius:12px;padding:16px;border-left:4px solid #16a34a;margin-bottom:24px">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:0.05em">Your strength 🏆</p>
      <p style="margin:0;font-size:14px;color:#166534;font-weight:600">${stats.strongestArea}</p>
    </div>
    ` : ""}

    ${divider()}

    <!-- Referral offer -->
    <div style="background:linear-gradient(135deg,#fff7ed 0%,#ffedd5 100%);border-radius:16px;padding:24px;border:1px solid #fed7aa;margin-bottom:24px;text-align:center">
      <div style="font-size:28px;margin-bottom:8px">🎁</div>
      <h3 style="margin:0 0 8px;font-size:16px;font-weight:800;color:#c2410c">Invite a friend, both get 50% off</h3>
      <p style="margin:0 0 16px;font-size:13px;color:#9a3412;line-height:1.6">
        Share your referral link. When they take their first mock, you both unlock 50% off premium this month.
      </p>
      <div style="background:#fff;border-radius:8px;padding:10px 16px;border:1px dashed #fb923c;margin-bottom:16px;font-family:monospace;font-size:13px;color:#ea580c;word-break:break-all">
        ${referralUrl}
      </div>
      <a href="https://wa.me/?text=${whatsappReferral}" style="display:inline-block;background:#25d366;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-size:13px;font-weight:600">
        📱 Share on WhatsApp
      </a>
    </div>

    <div style="text-align:center">
      ${ctaButton("Continue practising →", `${BASE_URL}/topics`)}
    </div>
  `;
  return branded(content, email, `You improved ${stats.improvement}% this week. Your weakest area: ${stats.weakestArea}`);
}

// ─── 4. RE-ENGAGEMENT SERIES ─────────────────────────────────────────────────

export function reEngagementDay7Html(
  name: string,
  email: string,
  lastTopic: string,
  bloomLevel: number
): string {
  const bloom = ["", "Remember", "Understand", "Apply", "Analyse", "Evaluate", "Create"][bloomLevel] ?? "Apply";
  const nextBloom = ["", "Understand", "Apply", "Analyse", "Evaluate", "Create", "Master"][bloomLevel] ?? "Apply";

  const content = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:900;color:#111">
      ${name}, you were SO close 💪
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6">
      We noticed you haven't been back in 7 days. Your progress on <strong>${lastTopic}</strong> is waiting for you.
    </p>

    <!-- Progress visual -->
    <div style="background:#f9fafb;border-radius:16px;padding:24px;border:1px solid #e5e7eb;margin-bottom:24px">
      <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em">Your progress in ${lastTopic}</p>

      <!-- Bloom level bar -->
      <div style="margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <span style="font-size:12px;color:#374151">Current: <strong>${bloom} (L${bloomLevel})</strong></span>
          <span style="font-size:12px;color:#f97316">Next: <strong>${nextBloom} (L${bloomLevel + 1})</strong></span>
        </div>
        <div style="background:#e5e7eb;border-radius:99px;height:10px;overflow:hidden">
          <div style="background:linear-gradient(90deg,#f97316,#fbbf24);height:100%;width:${Math.min((bloomLevel / 6) * 100, 100)}%;border-radius:99px"></div>
        </div>
        <p style="margin:8px 0 0;font-size:12px;color:#6b7280">You're ${Math.round(((bloomLevel) / 6) * 100)}% through mastering this topic</p>
      </div>
    </div>

    <div style="background:#fff7ed;border-radius:12px;padding:16px;border-left:4px solid #f97316;margin-bottom:24px">
      <p style="margin:0;font-size:13px;color:#9a3412;line-height:1.6">
        <strong>⚡ Just 10 minutes today</strong> can push you from ${bloom} to ${nextBloom} on ${lastTopic}. That's one level closer to cracking JEE.
      </p>
    </div>

    <div style="text-align:center">
      ${ctaButton("Pick up where you left off →", `${BASE_URL}/topics`)}
    </div>
  `;
  return branded(content, email, `You were ${Math.round(((bloomLevel) / 6) * 100)}% through mastering ${lastTopic} — come back and finish it!`);
}

export function reEngagementDay14Html(
  name: string,
  email: string,
  friendNames: string[]
): string {
  const friendList = friendNames.slice(0, 3).map((f) =>
    `<tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f9fafb">
        <span style="font-size:16px">👤</span>
        <span style="margin-left:8px;font-size:13px;color:#374151;font-weight:600">${f}</span>
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #f9fafb;text-align:right">
        <span style="font-size:12px;background:#f0fdf4;color:#16a34a;padding:3px 10px;border-radius:99px;font-weight:600">Active</span>
      </td>
    </tr>`
  ).join("");

  const content = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:900;color:#111">
      ${name}, your study peers are ahead of you 👀
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6">
      It's been 14 days. While you've been away, your peers have been grinding. Here's where they stand:
    </p>

    ${friendList ? `
    <!-- Leaderboard -->
    <h3 style="margin:0 0 8px;font-size:13px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.05em">🏆 Friend leaderboard</h3>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fafafa;border-radius:12px;border:1px solid #f3f4f6;margin-bottom:24px">
      ${friendList}
    </table>
    ` : `
    <div style="background:#fef9c3;border-radius:12px;padding:16px;border-left:4px solid #eab308;margin-bottom:24px">
      <p style="margin:0;font-size:13px;color:#854d0e">
        <strong>Did you know?</strong> Students who study with friends are 2× more likely to complete their JEE prep. Invite a friend and keep each other accountable!
      </p>
    </div>
    `}

    <div style="background:#f5f3ff;border-radius:12px;padding:20px;border-left:4px solid #7c3aed;margin-bottom:24px">
      <h3 style="margin:0 0 8px;font-size:14px;font-weight:700;color:#5b21b6">Compete & unlock rewards 🏅</h3>
      <p style="margin:0;font-size:13px;color:#6d28d9;line-height:1.6">
        Beat your friends' Bloom scores this week and unlock a <strong>free premium week</strong>. Plus, invite 3 friends and get 50% off next month.
      </p>
    </div>

    <div style="text-align:center">
      ${ctaButton("Rejoin & compete now →", `${BASE_URL}/topics`)}
      <p style="margin:16px 0 0;font-size:12px;color:#9ca3af">It only takes 10 minutes to get back on track.</p>
    </div>
  `;
  return branded(content, email, `Your friends have been studying hard. Here's the leaderboard — come back and compete!`);
}

export function reEngagementDay21Html(name: string, email: string): string {
  const content = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:900;color:#111">
      ${name}, don't let your JEE prep stall ⏰
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6">
      It's been 3 weeks. We miss you. And your JEE score misses the daily practice.
    </p>

    <!-- Pricing comparison -->
    <h3 style="margin:0 0 12px;font-size:14px;font-weight:700;color:#374151">Unlock premium to turbocharge your prep</h3>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
      <tr style="background:#f9fafb">
        <td style="padding:10px 16px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase">Feature</td>
        <td style="padding:10px 16px;font-size:12px;font-weight:700;color:#6b7280;text-align:center">Free</td>
        <td style="padding:10px 16px;font-size:12px;font-weight:700;color:#f97316;text-align:center">Premium</td>
      </tr>
      <tr style="border-top:1px solid #f3f4f6">
        <td style="padding:10px 16px;font-size:13px;color:#374151">Full mock tests</td>
        <td style="padding:10px 16px;text-align:center;font-size:13px;color:#9ca3af">3/month</td>
        <td style="padding:10px 16px;text-align:center;font-size:13px;color:#16a34a;font-weight:700">Unlimited</td>
      </tr>
      <tr style="border-top:1px solid #f3f4f6;background:#fafafa">
        <td style="padding:10px 16px;font-size:13px;color:#374151">Personalised weak-topic drilling</td>
        <td style="padding:10px 16px;text-align:center;font-size:16px">✗</td>
        <td style="padding:10px 16px;text-align:center;font-size:16px;color:#16a34a">✓</td>
      </tr>
      <tr style="border-top:1px solid #f3f4f6">
        <td style="padding:10px 16px;font-size:13px;color:#374151">Bloom-level analytics</td>
        <td style="padding:10px 16px;text-align:center;font-size:16px">✗</td>
        <td style="padding:10px 16px;text-align:center;font-size:16px;color:#16a34a">✓</td>
      </tr>
      <tr style="border-top:1px solid #f3f4f6;background:#fafafa">
        <td style="padding:10px 16px;font-size:13px;color:#374151">Friend leaderboard</td>
        <td style="padding:10px 16px;text-align:center;font-size:16px">✗</td>
        <td style="padding:10px 16px;text-align:center;font-size:16px;color:#16a34a">✓</td>
      </tr>
    </table>

    <div style="background:#fff7ed;border-radius:12px;padding:16px;text-align:center;border:2px solid #fed7aa;margin-bottom:24px">
      <p style="margin:0;font-size:16px;font-weight:800;color:#c2410c">Starting at just ₹149/month</p>
      <p style="margin:4px 0 0;font-size:12px;color:#9a3412">Less than a cup of chai per day 🫖</p>
    </div>

    <div style="text-align:center">
      ${ctaButton("Upgrade now — start from ₹149/mo →", `${BASE_URL}/pricing`)}
      <p style="margin:16px 0 0;font-size:12px;color:#9ca3af">Cancel anytime. No questions asked.</p>
    </div>
  `;
  return branded(content, email, `Your free JEE prep streak is at risk — upgrade to premium and lock in your progress.`);
}

// ─── 5. REFERRAL SERIES ──────────────────────────────────────────────────────

export function referralFriendJoinedHtml(
  originalUserName: string,
  email: string,
  friendName: string
): string {
  const content = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:900;color:#111">
      ${originalUserName}, your friend just joined! 🎉
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6">
      <strong style="color:#f97316">${friendName}</strong> just started their JEE prep on 10minCUET — thanks to your invite!
    </p>

    <div style="background:linear-gradient(135deg,#fff7ed 0%,#ffedd5 100%);border-radius:16px;padding:24px;border:1px solid #fed7aa;margin-bottom:24px;text-align:center">
      <div style="font-size:40px;margin-bottom:12px">🎁</div>
      <h3 style="margin:0 0 8px;font-size:16px;font-weight:800;color:#c2410c">You're close to your reward!</h3>
      <p style="margin:0;font-size:13px;color:#9a3412;line-height:1.6">
        When <strong>${friendName}</strong> completes their first mock test, <strong>you both unlock 50% off premium</strong> for the next month!
      </p>
    </div>

    <div style="background:#f0fdf4;border-radius:12px;padding:16px;border-left:4px solid #16a34a;margin-bottom:24px">
      <p style="margin:0;font-size:13px;color:#166534;line-height:1.6">
        <strong>What happens next?</strong> We'll notify you the moment ${friendName} takes their first mock. Then both accounts get the 50% discount automatically applied. 🚀
      </p>
    </div>

    <div style="text-align:center">
      ${ctaButton("Continue your own prep →", `${BASE_URL}/topics`)}
    </div>
  `;
  return branded(content, email, `${friendName} just joined 10minCUET! One step away from your 50% discount.`);
}

export function referralBothRewardHtml(
  name: string,
  email: string,
  otherName: string,
  isNewUser: boolean
): string {
  const intro = isNewUser
    ? `<strong style="color:#f97316">${otherName}</strong> invited you to 10minCUET. And now that you've completed your first mock, <strong>you've both unlocked 50% off premium</strong> this month!`
    : `<strong style="color:#f97316">${otherName}</strong> just completed their first mock on 10minCUET. As promised, <strong>you've both unlocked 50% off premium</strong> this month!`;

  const content = `
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:900;color:#111">
      ${name}, your reward is here! 🏆
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6">${intro}</p>

    <!-- Reward card -->
    <div style="background:linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%);border-radius:16px;padding:28px;border:2px solid #86efac;margin-bottom:24px;text-align:center">
      <div style="font-size:48px;margin-bottom:8px">🎊</div>
      <div style="font-size:36px;font-weight:900;color:#16a34a;line-height:1">50% OFF</div>
      <div style="font-size:14px;color:#166534;margin-top:6px;font-weight:600">Premium — this month only</div>
      <p style="margin:12px 0 0;font-size:12px;color:#6b7280">Discount applied automatically to your account when you upgrade</p>
    </div>

    <div style="background:#eff6ff;border-radius:12px;padding:16px;border-left:4px solid #3b82f6;margin-bottom:24px">
      <p style="margin:0;font-size:13px;color:#1e40af;line-height:1.6">
        <strong>How to claim:</strong> Click the button below and your 50% discount will be applied at checkout automatically. This offer expires in 30 days.
      </p>
    </div>

    <div style="text-align:center">
      ${ctaButton("Claim 50% off premium →", `${BASE_URL}/pricing`)}
      <p style="margin:16px 0 0;font-size:12px;color:#9ca3af">Offer valid for 30 days · Cancel premium anytime</p>
    </div>
  `;
  return branded(content, email, `You and ${otherName} both unlocked 50% off premium — claim it now before it expires!`);
}
