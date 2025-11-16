"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, TrendingUp } from "lucide-react";

type TimeRemaining = {
  hours: number;
  minutes: number;
  seconds: number;
};

export function UrgencyBanner() {
  // Featured challenge closes in 2h 37m from now
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() => {
    // Start with 2 hours 37 minutes
    return { hours: 2, minutes: 37, seconds: 0 };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        let { hours, minutes, seconds } = prev;
        
        // Decrement seconds
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            if (hours > 0) {
              hours--;
              minutes = 59;
            } else {
              // Reset to 2h 37m when it reaches 0
              return { hours: 2, minutes: 37, seconds: 0 };
            }
          }
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (value: number) => value.toString().padStart(2, "0");

  return (
    <Link
      href="/challenges"
      className="group block rounded-2xl border border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 p-4 transition-all hover:border-orange-300 hover:shadow-md"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-orange-100 p-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
              This week&apos;s featured challenge
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              30-day meditation ($50 pool, closes in{" "}
              <span className="inline-flex items-center gap-1 font-mono text-orange-600">
                <Clock className="h-3 w-3" />
                {formatTime(timeRemaining.hours)}h {formatTime(timeRemaining.minutes)}m{" "}
                {formatTime(timeRemaining.seconds)}s
              </span>
            </p>
          </div>
        </div>
        <div className="rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-orange-700 sm:shrink-0">
          Join now →
        </div>
      </div>
    </Link>
  );
}

