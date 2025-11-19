import Link from "next/link";
import { Settings, Bell, Link2, Shield, Palette } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 p-6 text-white shadow-sm shadow-slate-900/10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <Settings className="h-3 w-3" />
              <span>Customize</span>
            </span>
            <div>
              <h1 className="text-2xl font-semibold md:text-3xl">Settings</h1>
              <p className="mt-1 text-sm md:text-base opacity-95">
                Configure notifications, connected accounts, and privacy preferences.
              </p>
            </div>
          </div>
          <Link
            href="/profile"
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-amber-600 shadow-sm shadow-slate-900/10 transition hover:bg-amber-50"
          >
            View Profile
          </Link>
        </div>
      </section>

      {/* Settings Grid */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* Notifications */}
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Daily reminders, streak alerts, and squad summaries via email.
          </p>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <label className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-slate-100">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span>Daily habit reminders</span>
            </label>
            <label className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-slate-100">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span>Squad check-in digest</span>
            </label>
            <label className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-slate-100">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span>Weekly recap email</span>
            </label>
          </div>
        </article>

        {/* Connected Accounts */}
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100">
              <Link2 className="h-5 w-5 text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Connected Accounts</h2>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Link Google or Apple to streamline sign-in and payouts.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <button className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white">
              <span className="text-lg">🔗</span>
              Connect Google
            </button>
            <button className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white">
              <span className="text-lg">💳</span>
              Connect Stripe (payouts)
            </button>
          </div>
        </article>

        {/* Privacy */}
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100">
              <Shield className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Privacy</h2>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Control who can see your activity and profile.
          </p>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <label className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-slate-100">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
              <span>Show profile to squad members</span>
            </label>
            <label className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-slate-100">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
              <span>Show streaks on leaderboard</span>
            </label>
            <label className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-slate-100">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
              <span>Allow friend requests</span>
            </label>
          </div>
        </article>

        {/* Appearance */}
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100">
              <Palette className="h-5 w-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Appearance</h2>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Customize how the app looks and feels.
          </p>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-sm font-medium text-slate-700">Theme</p>
              <div className="mt-2 flex gap-2">
                <button className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-900 shadow-sm ring-2 ring-amber-500">
                  Light
                </button>
                <button className="rounded-lg bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-600">
                  Dark
                </button>
                <button className="rounded-lg bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-600">
                  System
                </button>
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* Danger Zone */}
      <section className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
        <p className="mt-2 text-sm text-red-700">
          These actions are permanent and cannot be undone.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="rounded-full border-2 border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50">
            Export my data
          </button>
          <button className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700">
            Delete account
          </button>
        </div>
      </section>
    </div>
  );
}
