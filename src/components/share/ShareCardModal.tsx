"use client";

import { useEffect, useState } from "react";
import type { ShareCard } from "@/lib/share/generateCard";
import { GRADIENTS, generateShareCard } from "@/lib/share/generateCard";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  achievement: {
    type: ShareCard["type"];
    user: { name: string; avatar: string };
    data: ShareCard["data"];
  };
};

const defaultMessage = (type: ShareCard["type"]) => {
  switch (type) {
    case "streak":
      return "Never missed a single day!";
    case "money":
      return "Bet against myself and won!";
    case "challenge":
      return "30 days, no misses. Who's next?";
    case "milestone":
      return "Hard work pays off!";
    default:
      return "Check out my progress!";
  }
};

export function ShareCardModal({ isOpen, onClose, achievement }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState(defaultMessage(achievement.type));
  const [size, setSize] = useState<ShareCard["size"]>("1080x1080");

  useEffect(() => {
    if (!isOpen) return;
    void generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, message, size]);

  async function generate() {
    setIsGenerating(true);
    const card: ShareCard = {
      type: achievement.type,
      user: achievement.user,
      data: { ...achievement.data, message },
      gradient: GRADIENTS[achievement.type],
      size,
    };
    const blob = await generateShareCard(card);
    const url = URL.createObjectURL(blob);
    setImageUrl(url);
    setIsGenerating(false);
  }

  function download() {
    if (!imageUrl) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `share-${achievement.type}-${Date.now()}.png`;
    a.click();
  }

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Share Your Achievement 🎉</h2>
          <button
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
          >
            Close
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr,300px]">
          <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-4">
            {isGenerating ? (
              <div className="text-sm text-slate-600">Generating your share card...</div>
            ) : (
              imageUrl && <img src={imageUrl} alt="Share card" className="max-h-[460px] w-auto rounded-lg shadow" />
            )}
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              Size
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as ShareCard["size"])}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="1080x1080">1080 x 1080 (Instagram)</option>
                <option value="1200x630">1200 x 630 (Twitter/Facebook)</option>
              </select>
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Message
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 h-28 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <div className="flex gap-2">
              <button
                onClick={download}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
              >
                Download
              </button>
              <button
                onClick={() => window.open("https://twitter.com/intent/tweet", "_blank")}
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Share to Twitter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


