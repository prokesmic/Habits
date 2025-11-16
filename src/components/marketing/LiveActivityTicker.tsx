"use client";

import { useState, useEffect } from "react";

const activityMessages = [
  { text: "Sarah just won $250 from her meditation streak", emoji: "🎉" },
  { text: "127 people checking in right now", emoji: "👥" },
  { text: "Mike completed 30-day fitness challenge", emoji: "💪" },
  { text: "Alex earned $150 from daily reading habit", emoji: "📚" },
  { text: "92 active challenges closing this week", emoji: "⚡" },
  { text: "Emma hit 100-day streak on hydration", emoji: "🔥" },
];

export function LiveActivityTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activityMessages.length);
        setIsVisible(true);
      }, 300); // Fade out, then change content
    }, 4000); // Change message every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
          <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">
            Live
          </span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div
            className={`flex items-center gap-2 text-sm font-medium text-slate-900 transition-opacity duration-300 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="text-base">{activityMessages[currentIndex].emoji}</span>
            <span>{activityMessages[currentIndex].text}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

