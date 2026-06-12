import "server-only";
import { Resend } from "resend";
import {
  welcomeDay1Html,
  welcomeDay2MockTakenHtml,
  welcomeDay2NoMockHtml,
  welcomeDay7Html,
  postMockHtml,
  weeklyDigestHtml,
  reEngagementDay7Html,
  reEngagementDay14Html,
  reEngagementDay21Html,
  referralFriendJoinedHtml,
  referralBothRewardHtml,
  type WeeklyStats,
} from "./email-templates";

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

const FROM_NOREPLY = "10minCUET <noreply@10mincuet.com>";
const FROM_RESULTS = "10minCUET Results <results@10mincuet.com>";
const FROM_DIGEST = "10minCUET <digest@10mincuet.com>";
const FROM_REFERRAL = "10minCUET <referral@10mincuet.com>";

// ─── Welcome Series ───────────────────────────────────────────────────────────

export async function sendWelcomeDay1(email: string, name: string) {
  return getResend().emails.send({
    from: FROM_NOREPLY,
    to: email,
    subject: "Welcome to 10minCUET! Start your first mock 🎯",
    html: welcomeDay1Html(name, email),
    tags: [{ name: "sequence", value: "welcome" }, { name: "day", value: "1" }],
  });
}

export async function sendWelcomeDay2MockTaken(
  email: string,
  name: string,
  score: number,
  bloomLevel: number
) {
  return getResend().emails.send({
    from: FROM_RESULTS,
    to: email,
    subject: `${name}, your Day 1 results breakdown is here 📊`,
    html: welcomeDay2MockTakenHtml(name, email, score, bloomLevel),
    tags: [{ name: "sequence", value: "welcome" }, { name: "day", value: "2-mock" }],
  });
}

export async function sendWelcomeDay2NoMock(email: string, name: string) {
  return getResend().emails.send({
    from: FROM_NOREPLY,
    to: email,
    subject: "Ready to see your CUET readiness score? (10 mins) 🤔",
    html: welcomeDay2NoMockHtml(name, email),
    tags: [{ name: "sequence", value: "welcome" }, { name: "day", value: "2-no-mock" }],
  });
}

export async function sendWelcomeDay7(
  email: string,
  name: string,
  improvement: number,
  topperName = "Priya S."
) {
  return getResend().emails.send({
    from: FROM_NOREPLY,
    to: email,
    subject: `You improved ${improvement}% since joining — keep it up, ${name}! 🔥`,
    html: welcomeDay7Html(name, email, improvement, topperName),
    tags: [{ name: "sequence", value: "welcome" }, { name: "day", value: "7" }],
  });
}

// ─── Post-Mock ────────────────────────────────────────────────────────────────

export async function sendPostMockEmail(
  email: string,
  name: string,
  score: number,
  subject: string,
  weakTopics: string[],
  strongTopics: string[],
  languagesScore?: number,
  chemScore?: number,
  generalTestScore?: number
) {
  return getResend().emails.send({
    from: FROM_RESULTS,
    to: email,
    subject: `You scored ${score}% on ${subject} — here's your breakdown`,
    html: postMockHtml(name, email, score, subject, weakTopics, strongTopics, languagesScore, chemScore, generalTestScore),
    tags: [{ name: "sequence", value: "post-mock" }, { name: "subject", value: subject.toLowerCase().replace(/\s/g, "-") }],
  });
}

// ─── Weekly Digest ────────────────────────────────────────────────────────────

export interface WeeklyDigestUser {
  email: string;
  name: string;
  referralCode: string;
  stats: WeeklyStats;
}

export async function sendBatchWeeklyDigest(users: WeeklyDigestUser[]) {
  const resend = getResend();
  const BATCH_SIZE = 100;
  const results = [];

  for (let i = 0; i < users.length; i += BATCH_SIZE) {
    const batch = users.slice(i, i + BATCH_SIZE);
    const emails = batch.map((u) => ({
      from: FROM_DIGEST,
      to: u.email,
      subject: `Your Weekly CUET Progress — You're ${u.stats.improvement}% closer to your goal`,
      html: weeklyDigestHtml(u.name, u.email, u.stats, u.referralCode),
      tags: [{ name: "sequence", value: "weekly-digest" }],
    }));
    const result = await resend.batch.send(emails);
    results.push(result);
  }

  return results;
}

// ─── Re-engagement Series ─────────────────────────────────────────────────────

export async function sendReEngagementDay7(
  email: string,
  name: string,
  lastTopic: string,
  bloomLevel: number
) {
  return getResend().emails.send({
    from: FROM_NOREPLY,
    to: email,
    subject: `${name}, you were so close to mastering ${lastTopic} 💪`,
    html: reEngagementDay7Html(name, email, lastTopic, bloomLevel),
    tags: [{ name: "sequence", value: "re-engagement" }, { name: "day", value: "7" }],
  });
}

export async function sendReEngagementDay14(
  email: string,
  name: string,
  friendNames: string[]
) {
  return getResend().emails.send({
    from: FROM_NOREPLY,
    to: email,
    subject: `See how your friends are progressing on 10minCUET 👀`,
    html: reEngagementDay14Html(name, email, friendNames),
    tags: [{ name: "sequence", value: "re-engagement" }, { name: "day", value: "14" }],
  });
}

export async function sendReEngagementDay21(email: string, name: string) {
  return getResend().emails.send({
    from: FROM_NOREPLY,
    to: email,
    subject: `${name}, don't let your CUET prep stall — upgrade for ₹149/mo ⏰`,
    html: reEngagementDay21Html(name, email),
    tags: [{ name: "sequence", value: "re-engagement" }, { name: "day", value: "21" }],
  });
}

// ─── Referral Series ─────────────────────────────────────────────────────────

export async function sendReferralFriendJoined(
  originalUserEmail: string,
  originalUserName: string,
  friendName: string
) {
  return getResend().emails.send({
    from: FROM_REFERRAL,
    to: originalUserEmail,
    subject: `${friendName} just started their CUET prep! 🎉`,
    html: referralFriendJoinedHtml(originalUserName, originalUserEmail, friendName),
    tags: [{ name: "sequence", value: "referral" }, { name: "event", value: "friend-joined" }],
  });
}

export async function sendReferralBothReward(
  originalUserEmail: string,
  originalUserName: string,
  newUserEmail: string,
  newUserName: string
) {
  const resend = getResend();
  await Promise.all([
    resend.emails.send({
      from: FROM_REFERRAL,
      to: originalUserEmail,
      subject: `${newUserName} just completed their first mock — you both get 50% off! 🏆`,
      html: referralBothRewardHtml(originalUserName, originalUserEmail, newUserName, false),
      tags: [{ name: "sequence", value: "referral" }, { name: "event", value: "both-reward" }],
    }),
    resend.emails.send({
      from: FROM_REFERRAL,
      to: newUserEmail,
      subject: `Welcome! ${originalUserName} invited you — you both get 50% off premium 🎁`,
      html: referralBothRewardHtml(newUserName, newUserEmail, originalUserName, true),
      tags: [{ name: "sequence", value: "referral" }, { name: "event", value: "both-reward" }],
    }),
  ]);
}
