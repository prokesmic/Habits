"use client";

import { useMemo, useState, useEffect } from "react";

type Props = {
  userName?: string;
  referralCode?: string;
  invited?: number;
  signedUp?: number;
  active?: number;
  credits?: number;
};

export function ReferralWidget({
  userName = "You",
  referralCode = "MICHAL123",
  invited = 2,
  signedUp = 2,
  active = 1,
  credits = 0,
}: Props) {
  const [baseUrl, setBaseUrl] = useState("https://yourapp.vercel.app");

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const link = `${baseUrl}/r/${referralCode}`;
  const progress = Math.min(3, active);
  const dots = useMemo(() => Array.from({ length: 3 }).map((_, i) => i < progress), [progress]);
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">🎁 Invite Friends, Earn Credits</h3>
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
        <p className="font-mono text-slate-900">{link.replace(/^https?:\/\//, "")}</p>
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={copyLink}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
          >
            {copied ? "✓ Copied!" : "Copy link"}
          </button>
          <button
            type="button"
            onClick={() => {
              const message = `I'm building habits with real accountability. Join me and we both get $5! ${link}`;
              if (navigator.share) {
                navigator.share({ title: "Join me on Habit Tracker", text: message, url: link }).catch(() => {});
              } else {
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, "_blank");
              }
            }}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
          >
            Share
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-3 text-sm">
          <p className="font-semibold text-slate-700">Progress</p>
          <p className="text-slate-600">
            {active}/3 friends joined
          </p>
          <div className="mt-2 flex items-center gap-1">
            {dots.map((d, i) => (
              <span
                key={i}
                className={`inline-block h-3 w-3 rounded-full ${d ? "bg-blue-600" : "bg-slate-300"}`}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">Unlock $10 at 3 friends!</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-3 text-sm">
          <p className="font-semibold text-slate-700">Earnings</p>
          <p className="text-slate-600">${credits} (pending)</p>
          <div className="mt-2 text-xs text-slate-500">
            Invited: {invited} • Signed up: {signedUp} • Active: {active}
          </div>
        </div>
      </div>
    </section>
  );
}


