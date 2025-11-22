"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Copy, Check, Share2, Mail, MessageCircle, Twitter, Linkedin, Gift, Users, DollarSign, TrendingUp } from "lucide-react";

type ReferralStats = {
  code: string;
  totalReferred: number;
  totalEarned: number;
};

type LeaderboardEntry = {
  userId: string;
  userName: string;
  avatar: string;
  referralCount: number;
  totalEarned: number;
};

type Leaderboard = {
  entries: LeaderboardEntry[];
  userRank: number | null;
  prizes: { rank: number; description: string; reward: number }[];
};

type RecentReferral = {
  name: string;
  avatar: string;
  joinedAt: string;
};

export default function ReferralDetailsPage() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
  const [recentReferrals, setRecentReferrals] = useState<RecentReferral[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, leaderboardRes, recentRes] = await Promise.all([
          fetch("/api/referrals/stats"),
          fetch("/api/referrals/leaderboard?period=monthly"),
          fetch("/api/referrals/recent"),
        ]);

        if (statsRes.ok) {
          setStats(await statsRes.json());
        }
        if (leaderboardRes.ok) {
          setLeaderboard(await leaderboardRes.json());
        }
        if (recentRes.ok) {
          setRecentReferrals(await recentRes.json());
        }
      } catch (error) {
        console.error("Error loading referral data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const referralLink = typeof window !== "undefined" && stats?.code
    ? `${window.location.origin}/r/${stats.code}`
    : "";

  const shareMessage = `I'm building better habits with real accountability on Habitio. Join me and we both get $5!\n\n${referralLink}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const shareVia = (platform: "whatsapp" | "email" | "sms" | "twitter" | "linkedin") => {
    const encodedMessage = encodeURIComponent(shareMessage);
    const encodedLink = encodeURIComponent(referralLink);

    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
        break;
      case "email":
        window.location.href = `mailto:?subject=${encodeURIComponent("Join me on Habitio!")}&body=${encodedMessage}`;
        break;
      case "sms":
        window.location.href = `sms:?body=${encodedMessage}`;
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodedMessage}`, "_blank");
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`, "_blank");
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 p-6 text-white shadow-sm shadow-slate-900/10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <Gift className="h-3.5 w-3.5" />
              <span>Invite Friends</span>
            </span>
            <div>
              <h1 className="text-2xl font-semibold md:text-3xl">Referral Program</h1>
              <p className="mt-1 text-sm md:text-base opacity-95">
                Share Habitio with friends and earn rewards together
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">${stats?.totalEarned ?? 0}</div>
            <div className="text-sm opacity-90">Total earned</div>
          </div>
        </div>
      </section>

      {/* Share Your Link - Main CTA */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
        <div className="mb-4 flex items-center gap-2">
          <Share2 className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-900">Share Your Referral Link</h2>
        </div>

        <p className="mb-4 text-sm text-slate-600">
          When friends sign up using your link, you both get <span className="font-semibold text-emerald-600">$5 credit</span>!
        </p>

        {/* Referral Link Box */}
        <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 text-xs font-medium text-slate-500 uppercase tracking-wide">Your unique link</div>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-3 font-mono text-sm text-slate-900 overflow-x-auto">
              {stats?.code ? `${typeof window !== "undefined" ? window.location.origin : "habitio.app"}/r/${stats.code}` : "Loading..."}
            </div>
            <button
              onClick={copyToClipboard}
              disabled={!stats?.code}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="space-y-3">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Share via</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            <button
              onClick={() => shareVia("whatsapp")}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-green-300 hover:bg-green-50 hover:text-green-700"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </button>
            <button
              onClick={() => shareVia("email")}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              <Mail className="h-4 w-4" />
              Email
            </button>
            <button
              onClick={() => shareVia("sms")}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
            >
              <MessageCircle className="h-4 w-4" />
              SMS
            </button>
            <button
              onClick={() => shareVia("twitter")}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </button>
            <button
              onClick={() => shareVia("linkedin")}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-800"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </button>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Your Referral Stats</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-white p-4">
            <div className="mb-2 flex items-center gap-2 text-indigo-600">
              <Users className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-wide">Friends Joined</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats?.totalReferred ?? 0}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-4">
            <div className="mb-2 flex items-center gap-2 text-emerald-600">
              <DollarSign className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-wide">Total Earned</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">${stats?.totalEarned ?? 0}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-amber-50 to-white p-4">
            <div className="mb-2 flex items-center gap-2 text-amber-600">
              <TrendingUp className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-wide">Your Rank</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {leaderboard?.userRank ? `#${leaderboard.userRank}` : "—"}
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">How it works</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
              1
            </div>
            <div>
              <p className="font-medium text-slate-900">Share your link</p>
              <p className="text-sm text-slate-600">Send your unique link to friends via any channel</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
              2
            </div>
            <div>
              <p className="font-medium text-slate-900">Friends sign up</p>
              <p className="text-sm text-slate-600">They create an account and start a habit</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-600">
              3
            </div>
            <div>
              <p className="font-medium text-slate-900">You both earn $5</p>
              <p className="text-sm text-slate-600">Credits are added to both accounts instantly</p>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          <span className="font-semibold">Bonus:</span> Invite 3 friends and unlock an extra $10 bonus!
        </div>
      </section>

      {/* Recent Referrals */}
      {recentReferrals.length > 0 && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent Sign-ups</h2>
          <div className="space-y-3">
            {recentReferrals.map((referral, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <img
                  src={referral.avatar}
                  alt={referral.name}
                  className="h-10 w-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{referral.name}</p>
                  <p className="text-xs text-slate-500">Joined recently</p>
                </div>
                <div className="text-sm font-semibold text-emerald-600">+$5</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Leaderboard */}
      {leaderboard && leaderboard.entries.length > 0 && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Monthly Leaderboard</h2>
            {leaderboard.userRank && (
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                Your rank: #{leaderboard.userRank}
              </span>
            )}
          </div>
          <div className="space-y-2">
            {leaderboard.entries.slice(0, 5).map((entry, i) => (
              <div
                key={entry.userId}
                className={`flex items-center gap-3 rounded-xl p-3 ${
                  i < 3 ? "bg-gradient-to-r from-amber-50 to-yellow-50" : "bg-slate-50"
                }`}
              >
                <div className="flex h-8 w-8 items-center justify-center text-lg">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                </div>
                <img
                  src={entry.avatar}
                  alt={entry.userName}
                  className="h-10 w-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{entry.userName}</p>
                  <p className="text-xs text-slate-500">{entry.referralCount} referrals</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-600">${entry.totalEarned}</p>
                </div>
              </div>
            ))}
          </div>
          {leaderboard.prizes.length > 0 && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="mb-2 text-sm font-medium text-slate-700">Monthly Prizes</p>
              <div className="space-y-1 text-sm text-slate-600">
                {leaderboard.prizes.map((prize) => (
                  <div key={prize.rank} className="flex justify-between">
                    <span>#{prize.rank}: {prize.description}</span>
                    <span className="font-semibold text-emerald-600">${prize.reward}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
