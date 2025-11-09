"use client";

import { useState } from "react";
import { addReaction } from "@/server/actions/social";
import { track, events } from "@/lib/analytics";

const reactions = {
  fire: "🔥",
  clap: "👏",
  muscle: "💪",
  heart: "❤️",
  rocket: "🚀",
} as const;

type ReactionButtonProps = {
  logId: string;
};

export function ReactionButton({ logId }: ReactionButtonProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const handleReaction = async (type: keyof typeof reactions) => {
    try {
      setPending(true);
      await addReaction(logId, type);
      track(events.reactionGiven, { reaction_type: type });
    } finally {
      setPending(false);
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
        onClick={() => setOpen((prev) => !prev)}
        disabled={pending}
      >
        😊 React
      </button>
      {open ? (
        <div className="absolute bottom-full mb-2 flex gap-2 rounded-xl bg-white p-2 shadow-lg">
          {Object.entries(reactions).map(([type, emoji]) => (
            <button
              key={type}
              type="button"
              className="text-2xl transition hover:scale-110"
              onClick={() => handleReaction(type as keyof typeof reactions)}
              disabled={pending}
            >
              {emoji}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

