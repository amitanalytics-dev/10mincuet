import { query, internalQuery } from "./_generated/server";
import { v } from "convex/values";

/**
 * Monetization Analytics
 * Tracks ARPU, LTV, CAC, conversion rates, and referral metrics
 */

// Get subscription revenue stats
export const getRevenueStats = internalQuery({
  args: { startDate: v.optional(v.number()), endDate: v.optional(v.number()) },
  handler: async (ctx, { startDate, endDate }) => {
    const subs = await ctx.db.query("subscriptions").collect();

    const activeSubscriptions = subs.filter((s) => s.status === "active");
    const paidSubscriptions = activeSubscriptions.filter((s) => s.tier !== "free");
    const freeSubscriptions = activeSubscriptions.filter((s) => s.tier === "free");

    // Approximate revenue (assuming monthly subscriptions)
    const monthlyRevenue = paidSubscriptions.reduce((sum, sub) => {
      if (sub.tier === "bundle") return sum + 349;
      if (sub.tier === "bundle_3mo") return sum + 333; // ₹999 / 3
      if (sub.tier === "bundle_6mo") return sum + 333; // ₹1999 / 6
      if (sub.tier === "annual") return sum + 208; // ₹2499 / 12
      if (sub.tier === "parent_kid") return sum + 250; // ₹2999 / 12
      if (sub.tier === "physics" || sub.tier === "chemistry" || sub.tier === "math" || sub.tier === "biology") return sum + 149;
      return sum;
    }, 0);

    return {
      totalUsers: subs.length,
      activeUsers: activeSubscriptions.length,
      paidUsers: paidSubscriptions.length,
      freeUsers: freeSubscriptions.length,
      conversionRate: ((paidSubscriptions.length / activeSubscriptions.length) * 100).toFixed(2) + "%",
      estimatedMonthlyRevenue: "₹" + monthlyRevenue.toLocaleString("en-IN"),
      estimatedMonthlyARPU: "₹" + (monthlyRevenue / activeSubscriptions.length).toFixed(0),
      subscriptionBreakdown: {
        bundle: paidSubscriptions.filter((s) => s.tier === "bundle").length,
        bundle_3mo: paidSubscriptions.filter((s) => s.tier === "bundle_3mo").length,
        bundle_6mo: paidSubscriptions.filter((s) => s.tier === "bundle_6mo").length,
        annual: paidSubscriptions.filter((s) => s.tier === "annual").length,
        parent_kid: paidSubscriptions.filter((s) => s.tier === "parent_kid").length,
        singleSubject: paidSubscriptions.filter(
          (s) => s.tier === "physics" || s.tier === "chemistry" || s.tier === "math" || s.tier === "biology"
        ).length,
      },
    };
  },
});

// Get referral stats
export const getReferralStats = internalQuery({
  args: {},
  handler: async (ctx) => {
    const referrals = await ctx.db.query("referrals").collect();
    const paidReferrals = referrals.filter((r) => r.paidAt != null);

    // Calculate total free months earned via referrals
    const totalFreeMonthsEarned = paidReferrals.reduce((sum, r) => sum + (r.monthsCredited ?? 0), 0);

    return {
      totalReferrals: referrals.length,
      paidReferrals: paidReferrals.length,
      conversionRate: ((paidReferrals.length / referrals.length) * 100).toFixed(2) + "%",
      totalFreeMonthsEarned,
      averageFreeMonthsPerPaidReferral: (totalFreeMonthsEarned / Math.max(paidReferrals.length, 1)).toFixed(1),
      topReferrers: [] as any[], // Could be populated by grouping
    };
  },
});

// Get LTV estimate (Lifetime Value)
export const getLifetimeValueStats = internalQuery({
  args: {},
  handler: async (ctx) => {
    const subs = await ctx.db.query("subscriptions").collect();
    const paidSubs = subs.filter((s) => s.tier !== "free");

    // Assume 2-year lifecycle (typical exam prep duration)
    const estimatedLTV = paidSubs.reduce((sum, sub) => {
      const monthsRemaining = sub.currentPeriodEnd ? Math.ceil((sub.currentPeriodEnd - Date.now()) / (1000 * 60 * 60 * 24 * 30)) : 12;
      let monthlyValue = 0;

      if (sub.tier === "bundle") monthlyValue = 349;
      if (sub.tier === "annual") monthlyValue = 2499 / 12;
      if (sub.tier === "parent_kid") monthlyValue = 2999 / 12;
      if (["physics", "chemistry", "math", "biology"].includes(sub.tier)) monthlyValue = 149;

      return sum + monthlyValue * Math.min(monthsRemaining, 24); // Cap at 2 years
    }, 0);

    const averageLTV = Math.round(estimatedLTV / Math.max(paidSubs.length, 1));

    return {
      totalPaidUsers: paidSubs.length,
      estimatedTotalLTV: "₹" + Math.round(estimatedLTV).toLocaleString("en-IN"),
      averageLTVPerUser: "₹" + averageLTV,
      assumedLifecycleMonths: 24,
      note: "Estimates assume 2-year prep cycle; actual may vary",
    };
  },
});

// Get CAC estimate (Customer Acquisition Cost)
export const getCustomerAcquisitionStats = internalQuery({
  args: {},
  handler: async (ctx) => {
    const subs = await ctx.db.query("subscriptions").collect();
    const paidUsers = subs.filter((s) => s.tier !== "free");

    // CAC estimation based on referral program cost
    // Cost = 1 free month per referral = ₹349 per referred user (avg)
    const referralCAC = 349; // Cost of 1 free month

    // Organic CAC (assumed lower, based on word-of-mouth)
    const organicCAC = 500; // Estimated

    return {
      totalPaidUsers: paidUsers.length,
      estimatedReferralCAC: "₹" + referralCAC,
      estimatedOrganicCAC: "₹" + organicCAC,
      blendedCAC: "₹" + Math.round((referralCAC + organicCAC) / 2),
      paybackPeriodMonths: Math.ceil((referralCAC + organicCAC) / (349 / 2)), // Assuming 50% margin
      note: "CAC = 1 month free value + organic marketing cost (estimated)",
    };
  },
});

// Get monetization funnel (Free → Paid conversion)
export const getMonetizationFunnel = internalQuery({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const subs = await ctx.db.query("subscriptions").collect();

    const totalSignups = users.length;
    const subscriptionRecords = subs.length;
    const paidSubs = subs.filter((s) => s.tier !== "free");

    return {
      stage1_signups: totalSignups,
      stage2_subscriptionCreated: subscriptionRecords,
      stage3_paid: paidSubs.length,
      conversionSignupToSubscription: ((subscriptionRecords / totalSignups) * 100).toFixed(2) + "%",
      conversionSubscriptionToPaid: ((paidSubs.length / subscriptionRecords) * 100).toFixed(2) + "%",
      conversionSignupToPaid: ((paidSubs.length / totalSignups) * 100).toFixed(2) + "%",
      dropoffAtEachStage: {
        afterSignup: totalSignups - subscriptionRecords,
        afterSubscriptionCreated: subscriptionRecords - paidSubs.length,
      },
    };
  },
});

// Get email effectiveness (retention via email campaigns)
export const getEmailMonetizationStats = internalQuery({
  args: {},
  handler: async (ctx) => {
    const emails = await ctx.db.query("scheduledEmails").collect();
    const emailEvents = await ctx.db.query("emailEvents").collect();

    const sent = emailEvents.filter((e) => e.eventType === "sent").length;
    const delivered = emailEvents.filter((e) => e.eventType === "delivered").length;
    const opened = emailEvents.filter((e) => e.eventType === "opened").length;
    const clicked = emailEvents.filter((e) => e.eventType === "clicked").length;
    const bounced = emailEvents.filter((e) => e.eventType === "bounced").length;

    return {
      totalEmailsSent: sent,
      deliveryRate: sent > 0 ? ((delivered / sent) * 100).toFixed(2) + "%" : "N/A",
      openRate: delivered > 0 ? ((opened / delivered) * 100).toFixed(2) + "%" : "N/A",
      clickRate: opened > 0 ? ((clicked / opened) * 100).toFixed(2) + "%" : "N/A",
      bounceRate: sent > 0 ? ((bounced / sent) * 100).toFixed(2) + "%" : "N/A",
      totalBounces: bounced,
      note: "Track email → upgrade conversions separately",
    };
  },
});

// Dashboard summary
export const getMonetizationDashboard = internalQuery({
  args: {},
  handler: async (ctx) => {
    const [revenue, referrals, ltv, cac, funnel, email] = await Promise.all([
      ctx.runQuery(async (cx) => {
        const subs = await cx.db.query("subscriptions").collect();
        const paidSubs = subs.filter((s) => s.tier !== "free");
        const monthlyRevenue = paidSubs.reduce((sum, s) => {
          if (s.tier === "bundle") return sum + 349;
          if (s.tier === "annual") return sum + 208;
          if (s.tier === "parent_kid") return sum + 250;
          return sum + 149;
        }, 0);
        return {
          totalUsers: subs.length,
          paidUsers: paidSubs.length,
          conversionRate: ((paidSubs.length / subs.length) * 100).toFixed(1),
          monthlyRevenue,
        };
      }),
      ctx.runQuery(async (cx) => {
        const refs = await cx.db.query("referrals").collect();
        const paid = refs.filter((r) => r.paidAt);
        return { total: refs.length, paid: paid.length, rate: ((paid.length / refs.length) * 100).toFixed(1) };
      }),
      ctx.runQuery(async (cx) => {
        const subs = await cx.db.query("subscriptions").collect();
        const paid = subs.filter((s) => s.tier !== "free");
        const monthlyValue = paid.reduce((sum, s) => (s.tier === "bundle" ? sum + 349 : sum + 200), 0);
        return (monthlyValue / Math.max(paid.length, 1)) * 24;
      }),
      ctx.runQuery(async (cx) => {
        return { referralCAC: 349, blendedCAC: 425 };
      }),
      ctx.runQuery(async (cx) => {
        const subs = await cx.db.query("subscriptions").collect();
        const users = await cx.db.query("users").collect();
        return {
          signups: users.length,
          paid: subs.filter((s) => s.tier !== "free").length,
          conversion: (((subs.filter((s) => s.tier !== "free").length) / subs.length) * 100).toFixed(1),
        };
      }),
      ctx.runQuery(async (cx) => {
        const events = await cx.db.query("emailEvents").collect();
        const sent = events.filter((e) => e.eventType === "sent").length;
        const opened = events.filter((e) => e.eventType === "opened").length;
        return { sent, openRate: sent > 0 ? ((opened / sent) * 100).toFixed(1) : 0 };
      }),
    ]);

    return {
      summary: {
        totalUsers: revenue.totalUsers,
        paidUsers: revenue.paidUsers,
        conversionRate: revenue.conversionRate + "%",
        monthlyRecurringRevenue: "₹" + revenue.monthlyRevenue.toLocaleString("en-IN"),
        estimatedAnnualRevenue: "₹" + (revenue.monthlyRevenue * 12).toLocaleString("en-IN"),
      },
      metrics: {
        arpu: "₹" + Math.round(revenue.monthlyRevenue / Math.max(revenue.totalUsers, 1)),
        ltv: "₹" + Math.round(ltv as number),
        cac: "₹" + cac.blendedCAC,
        ltv_cac_ratio: (ltv as number / cac.blendedCAC).toFixed(1) + "x",
      },
      channels: {
        referralConversionRate: referrals.rate + "%",
        emailOpenRate: (email.openRate as any) + "%",
        signupToPaymentConversion: funnel.conversion + "%",
      },
    };
  },
});
