"use client";

import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { useEffect, useState } from "react";

export default function MonetizationDashboard() {
  const [loading, setLoading] = useState(true);

  // Fetch all metrics
  const revenueStats = useQuery(api.monetization.getRevenueStats, {});
  const referralStats = useQuery(api.monetization.getReferralStats, {});
  const ltvStats = useQuery(api.monetization.getLifetimeValueStats, {});
  const cacStats = useQuery(api.monetization.getCustomerAcquisitionStats, {});
  const funnelStats = useQuery(api.monetization.getMonetizationFunnel, {});
  const dashboard = useQuery(api.monetization.getMonetizationDashboard, {});

  useEffect(() => {
    if (dashboard) setLoading(false);
  }, [dashboard]);

  if (loading || !dashboard) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading monetization dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900">Monetization Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time revenue, growth, and engagement metrics</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <div className="text-sm text-gray-600 font-semibold mb-2">Total Users</div>
            <div className="text-4xl font-black text-gray-900">
              {dashboard.summary.totalUsers?.toLocaleString() || "—"}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-orange-200">
            <div className="text-sm text-orange-600 font-semibold mb-2">Paid Users</div>
            <div className="text-4xl font-black text-orange-600">
              {dashboard.summary.paidUsers?.toLocaleString() || "—"}
            </div>
            <div className="text-xs text-gray-600 mt-2">
              {dashboard.summary.conversionRate}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-green-200">
            <div className="text-sm text-green-600 font-semibold mb-2">Monthly Revenue</div>
            <div className="text-3xl font-black text-green-600">
              {dashboard.summary.monthlyRecurringRevenue || "—"}
            </div>
            <div className="text-xs text-gray-600 mt-2">
              {dashboard.summary.estimatedAnnualRevenue}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-blue-200">
            <div className="text-sm text-blue-600 font-semibold mb-2">LTV:CAC Ratio</div>
            <div className="text-4xl font-black text-blue-600">
              {dashboard.metrics.ltv_cac_ratio || "—"}
            </div>
            <div className="text-xs text-green-600 mt-2">✓ Healthy</div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <h3 className="font-black text-gray-900 mb-4">💰 ARPU</h3>
            <div className="text-3xl font-black text-orange-600 mb-2">
              {dashboard.metrics.arpu || "—"}
            </div>
            <p className="text-sm text-gray-600">Average Revenue Per User (Monthly)</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <h3 className="font-black text-gray-900 mb-4">📈 LTV</h3>
            <div className="text-3xl font-black text-green-600 mb-2">
              {dashboard.metrics.ltv || "—"}
            </div>
            <p className="text-sm text-gray-600">Lifetime Value (24-month lifecycle)</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
            <h3 className="font-black text-gray-900 mb-4">🎯 CAC</h3>
            <div className="text-3xl font-black text-blue-600 mb-2">
              {dashboard.metrics.cac || "—"}
            </div>
            <p className="text-sm text-gray-600">Customer Acquisition Cost (Blended)</p>
          </div>
        </div>

        {/* Conversion Channels */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 mb-12">
          <h2 className="text-2xl font-black text-gray-900 mb-6">📊 Conversion Channels</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-sm text-gray-600 font-semibold mb-2">Referral Conversion</div>
              <div className="text-4xl font-black text-orange-600">
                {dashboard.channels.referralConversionRate || "—"}
              </div>
              <p className="text-xs text-gray-600 mt-2">Of referrals that convert to paid</p>
            </div>
            <div>
              <div className="text-sm text-gray-600 font-semibold mb-2">Email Open Rate</div>
              <div className="text-4xl font-black text-blue-600">
                {dashboard.channels.emailOpenRate || "—"}
              </div>
              <p className="text-xs text-gray-600 mt-2">Retention email effectiveness</p>
            </div>
            <div>
              <div className="text-sm text-gray-600 font-semibold mb-2">Signup to Paid</div>
              <div className="text-4xl font-black text-green-600">
                {dashboard.channels.signupToPaymentConversion || "—"}
              </div>
              <p className="text-xs text-gray-600 mt-2">Overall conversion funnel</p>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        {revenueStats && (
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 mb-12">
            <h2 className="text-2xl font-black text-gray-900 mb-6">💸 Revenue Breakdown</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Subscription Mix</h3>
                <ul className="space-y-2 text-sm">
                  {Object.entries(revenueStats.subscriptionBreakdown || {}).map(([tier, count]) => (
                    <li key={tier} className="flex justify-between">
                      <span className="text-gray-700 capitalize">{tier.replace(/_/g, " ")}</span>
                      <span className="font-black text-orange-600">{count} users</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Key Stats</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-700">Free Users</span>
                    <span className="font-black">{revenueStats.freeUsers?.toLocaleString() || "—"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-700">Paid Users</span>
                    <span className="font-black text-orange-600">{revenueStats.paidUsers?.toLocaleString() || "—"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-700">Conversion Rate</span>
                    <span className="font-black">{revenueStats.conversionRate || "—"}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {referralStats && (
          <div className="bg-white rounded-2xl p-6 border-2 border-green-200">
            <h2 className="text-2xl font-black text-gray-900 mb-6">🎁 Referral Program</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-gray-600 font-semibold mb-2">Total Referrals</div>
                <div className="text-3xl font-black text-gray-900">
                  {referralStats.totalReferrals?.toLocaleString() || "—"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 font-semibold mb-2">Paid Referrals</div>
                <div className="text-3xl font-black text-green-600">
                  {referralStats.paidReferrals?.toLocaleString() || "—"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 font-semibold mb-2">Conversion Rate</div>
                <div className="text-3xl font-black text-orange-600">
                  {referralStats.conversionRate || "—"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 font-semibold mb-2">Free Months Earned</div>
                <div className="text-3xl font-black text-blue-600">
                  {referralStats.totalFreeMonthsEarned || "—"}
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-900 font-semibold">
                ✓ Time-based rewards only. No monetary payouts.
              </p>
              <p className="text-xs text-green-700 mt-2">
                Referrers earn free premium months (up to 5) when referred users pay.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
