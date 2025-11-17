"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Download, Twitter, Instagram, Copy, Check } from "lucide-react";

interface ShareableAchievementCardProps {
  achievement: {
    id: string;
    name: string;
    emoji: string;
    description: string;
    unlockedAt: string;
    rarity?: "common" | "rare" | "epic" | "legendary";
  };
  userName: string;
  totalStreakDays?: number;
}

export function ShareableAchievementCard({
  achievement,
  userName,
  totalStreakDays = 0,
}: ShareableAchievementCardProps) {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  const rarityColors = {
    common: "from-slate-400 to-slate-500",
    rare: "from-sky-400 to-blue-500",
    epic: "from-purple-400 to-indigo-500",
    legendary: "from-amber-400 to-orange-500",
  };

  const rarityBg = {
    common: "bg-slate-50",
    rare: "bg-sky-50",
    epic: "bg-purple-50",
    legendary: "bg-amber-50",
  };

  const rarityBorder = {
    common: "border-slate-200",
    rare: "border-sky-200",
    epic: "border-purple-200",
    legendary: "border-amber-200",
  };

  const rarity = achievement.rarity || "common";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `https://habitee.app/achievement/${achievement.id}?user=${userName}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const shareText = `🏆 Just unlocked "${achievement.name}" on Habitee! ${achievement.emoji}\n\n${
      totalStreakDays > 0 ? `Currently on a ${totalStreakDays}-day streak! 🔥\n\n` : ""
    }Join me in building better habits: https://habitee.app`;

    if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
        "_blank"
      );
    } else if (platform === "copy") {
      handleCopyLink();
    }
    setShowShareOptions(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden rounded-3xl border-2 ${rarityBorder[rarity]} ${rarityBg[rarity]} p-6 shadow-lg`}
    >
      {/* Gradient shine effect */}
      <div className="absolute -left-1/2 -top-1/2 h-[200%] w-[200%] rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      {/* Rarity badge */}
      <div className="absolute right-4 top-4">
        <span
          className={`rounded-full bg-gradient-to-r ${rarityColors[rarity]} px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white`}
        >
          {rarity}
        </span>
      </div>

      {/* Achievement content */}
      <div className="relative text-center">
        <motion.div
          className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-md"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <span className="text-4xl">{achievement.emoji}</span>
        </motion.div>

        <h3 className="mb-2 text-xl font-bold text-slate-900">
          {achievement.name}
        </h3>
        <p className="mb-3 text-sm text-slate-600">{achievement.description}</p>

        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs text-slate-500 shadow-sm">
          <span>Unlocked by</span>
          <span className="font-semibold text-slate-900">{userName}</span>
          <span>•</span>
          <span>
            {new Date(achievement.unlockedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {totalStreakDays > 0 && (
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-800">
              🔥 {totalStreakDays}-day streak
            </div>
          </div>
        )}

        {/* Share button */}
        <div className="relative">
          <button
            onClick={() => setShowShareOptions(!showShareOptions)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-amber-500/30 transition hover:shadow-lg hover:shadow-amber-500/40 active:scale-95"
          >
            <Share2 className="h-4 w-4" />
            Share Achievement
          </button>

          {/* Share options dropdown */}
          {showShareOptions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-1/2 top-full z-10 mt-2 w-48 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
            >
              <button
                onClick={() => handleShare("twitter")}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
              >
                <Twitter className="h-4 w-4 text-sky-500" />
                Share on Twitter
              </button>
              <button
                onClick={() => handleShare("instagram")}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
              >
                <Instagram className="h-4 w-4 text-pink-500" />
                Share to Stories
              </button>
              <button
                onClick={handleCopyLink}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4 text-slate-400" />
                )}
                {copied ? "Copied!" : "Copy Link"}
              </button>
              <button
                onClick={() => setShowShareOptions(false)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
              >
                <Download className="h-4 w-4 text-slate-400" />
                Download Image
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Habitee branding */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
        <div className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-tr from-amber-500 to-indigo-500 text-[10px] font-bold text-white">
          H
        </div>
        <span>Habitee</span>
      </div>
    </motion.div>
  );
}
