"use client";

import { useEffect, useState } from "react";

export function EnhancedReferralWidget() {
  const [stats, setStats] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any>(null);
  const [recentReferrals, setRecentReferrals] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [s, l, r] = await Promise.all([
        fetch("/api/referrals/stats").then((r) => r.json()),
        fetch("/api/referrals/leaderboard?period=monthly").then((r) => r.json()),
        fetch("/api/referrals/recent").then((r) => r.json()),
      ]);
      setStats(s);
      setLeaderboard(l);
      setRecentReferrals(r);
    };
    void load();
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  };
  const shareLink = () => `${window.location.origin}/r/${stats?.code}`;

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 p-6 text-white">
        <h2 className="mb-2 text-2xl font-bold">Refer Friends, Earn Money 💰</h2>
        <p className="mb-4 text-violet-100">Give $5, Get $5. No limits on how much you can earn!</p>
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-white/10 p-4">
            <div className="text-3xl font-bold">{stats?.totalReferred ?? 0}</div>
            <div className="text-sm text-violet-100">Friends Joined</div>
          </div>
          <div className="rounded-lg bg-white/10 p-4">
            <div className="text-3xl font-bold">${stats?.totalEarned ?? 0}</div>
            <div className="text-sm text-violet-100">Total Earned</div>
          </div>
        </div>
        <div className="mb-4 rounded-lg border border-white/20 bg-white/20 p-3">
          <div className="mb-1 text-xs text-violet-100">Your referral link</div>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={stats ? `habittracker.app/r/${stats.code}` : ""}
              className="flex-1 rounded border border-white/20 bg-white/10 px-3 py-2 text-sm"
            />
            <button onClick={() => copyToClipboard(shareLink())} className="rounded bg-white px-4 py-2 font-semibold text-violet-600">
              Copy
            </button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { name: "Copy Link", icon: "🔗", action: () => copyToClipboard(shareLink()) },
            { name: "WhatsApp", icon: "💬", action: () => (window.location.href = `https://wa.me/?text=${encodeURIComponent(shareLink())}`) },
            { name: "Twitter", icon: "🐦", action: () => (window.location.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareLink())}`) },
            { name: "Email", icon: "📧", action: () => (window.location.href = `mailto:?subject=Join me on Habitee&body=${encodeURIComponent(shareLink())}`) },
          ].map((opt) => (
            <button key={opt.name} onClick={opt.action} className="rounded-lg bg-white/10 p-3 text-center transition-colors hover:bg-white/20">
              <div className="mb-1 text-2xl">{opt.icon}</div>
              <div className="text-xs">{opt.name}</div>
            </button>
          ))}
        </div>
      </div>
      {recentReferrals.length > 0 && (
        <div className="rounded-lg border bg-white p-4">
          <h3 className="mb-3 font-semibold">🔥 Recent Sign-ups</h3>
          <div className="space-y-2">
            {recentReferrals.map((r, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <img src={r.avatar} alt={r.name} className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <span className="font-medium">{r.name}</span> joined
                </div>
                <div className="font-semibold text-green-600">+$5</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {leaderboard && (
        <div className="rounded-lg border bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">🏆 Monthly Leaderboard</h3>
            {leaderboard.userRank && <div className="text-sm text-gray-600">Your rank: #{leaderboard.userRank}</div>}
          </div>
          <div className="mb-4 space-y-2">
            {leaderboard.entries.slice(0, 10).map((e: any, i: number) => (
              <div key={e.userId} className={`flex items-center gap-3 rounded p-2 ${i < 3 ? "bg-yellow-50" : ""}`}>
                <div className="w-8 text-center font-bold">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</div>
                <img src={e.avatar} alt={e.userName} className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <div className="font-medium">{e.userName}</div>
                  <div className="text-xs text-gray-600">{e.referralCount} referrals</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">${e.totalEarned}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="mb-2 text-sm font-medium">Monthly Prizes:</div>
            <div className="space-y-1 text-sm text-gray-600">
              {leaderboard.prizes.map((p: any) => (
                <div key={p.rank} className="flex justify-between">
                  <span>
                    #{p.rank}: {p.description}
                  </span>
                  <span className="font-semibold">${p.reward}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


