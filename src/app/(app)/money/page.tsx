"use client";

import Link from "next/link";
import { Wallet, ArrowUpRight, ArrowDownLeft, Clock, CreditCard } from "lucide-react";

export default function MoneyPage() {
  // Mock data - in real app this would come from API/database
  const balance = {
    available: 125.50,
    pending: 45.00,
    total: 170.50,
  };

  const recentActivity = [
    { id: "1", type: "win", amount: 25, description: "7-Day Challenge win", date: "2 hours ago" },
    { id: "2", type: "stake", amount: -10, description: "Morning Routine stake", date: "1 day ago" },
    { id: "3", type: "win", amount: 50, description: "Squad Challenge win", date: "3 days ago" },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Hero Header */}
      <section className="rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-6 text-white shadow-sm shadow-slate-900/10">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <span>💰</span>
              <span>Money</span>
            </span>
            <div>
              <h1 className="text-2xl font-semibold md:text-3xl">Your Wallet</h1>
              <p className="mt-1 text-sm opacity-95">
                Manage stakes, winnings, and payouts
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">Available Balance</p>
            <p className="text-3xl font-bold">${balance.available.toFixed(2)}</p>
          </div>
        </div>
      </section>

      {/* Balance Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <Wallet className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Available</p>
              <p className="text-xl font-bold text-slate-900">${balance.available.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Pending</p>
              <p className="text-xl font-bold text-slate-900">${balance.pending.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100">
              <CreditCard className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total</p>
              <p className="text-xl font-bold text-slate-900">${balance.total.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/money/payouts"
          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
          data-testid="money-payouts-link"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <ArrowUpRight className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Request Payout</p>
              <p className="text-sm text-slate-500">Withdraw your winnings</p>
            </div>
          </div>
        </Link>
        <Link
          href="/money/transactions"
          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
          data-testid="money-transactions-link"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <ArrowDownLeft className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Transaction History</p>
              <p className="text-sm text-slate-500">View all activity</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
          <Link href="/money/transactions" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {recentActivity.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${item.amount > 0 ? "bg-emerald-100" : "bg-red-100"}`}>
                  {item.amount > 0 ? (
                    <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{item.description}</p>
                  <p className="text-xs text-slate-500">{item.date}</p>
                </div>
              </div>
              <p className={`font-semibold ${item.amount > 0 ? "text-emerald-600" : "text-red-600"}`}>
                {item.amount > 0 ? "+" : ""}${Math.abs(item.amount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
        <p className="font-semibold">How stakes work</p>
        <p className="mt-1 text-emerald-700">
          Put money on your habits to stay accountable. Complete your goals and keep your stake—or lose it to others who did!
        </p>
      </div>
    </div>
  );
}
