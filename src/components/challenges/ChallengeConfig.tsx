"use client";

import { useState } from "react";
import type { User, Challenge } from "@/types/challenge";
import { nanoid } from "nanoid";

type Props = {
  habitId: string;
  friend: User;
  onCancel: () => void;
  onSent: (challengeId: string) => void;
};

export function ChallengeConfig({ habitId, friend, onCancel, onSent }: Props) {
  const [duration, setDuration] = useState(7);
  const [stake, setStake] = useState(10);
  const [message, setMessage] = useState("Think you can beat me? 😏");
  const [sending, setSending] = useState(false);

  async function handleSend() {
    setSending(true);
    try {
      // Mock challenge creation
      const challengeId = nanoid(12);
      // In a real app, call server action/API to create and notify
      console.log("Challenge created", {
        challengeId,
        habitId,
        opponentId: friend.id,
        duration,
        stake,
        message,
      });
      onSent(challengeId);
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900">Challenge {friend.name} to:</h2>
      <p className="mt-1 text-sm text-slate-600">Select duration, stakes, and add a message.</p>

      <div className="mt-4 grid gap-3">
        <label className="text-sm font-semibold text-slate-700">
          Duration
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
          </select>
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Stakes
          <select
            value={stake}
            onChange={(e) => setStake(Number(e.target.value))}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            {[5, 10, 25, 50, 100].map((v) => (
              <option key={v} value={v}>
                ${v}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold text-slate-700">
          Add message (optional)
          <input
            value={message}
            maxLength={200}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Think you can beat me? 😏"
          />
        </label>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSend}
          disabled={sending}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {sending ? "Sending..." : "Send challenge"}
        </button>
      </div>
    </div>
  );
}


