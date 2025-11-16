"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "@/types/challenge";
import { ChallengeFriendSelect } from "./ChallengeFriendSelect";
import { ChallengeConfig } from "./ChallengeConfig";
import { ChallengeSent } from "./ChallengeSent";

type Props = {
  habitId: string;
  onClose: () => void;
};

export function ChallengeModal({ habitId, onClose }: Props) {
  const [step, setStep] = useState<"select" | "config" | "sent">("select");
  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        {step === "select" && (
          <ChallengeFriendSelect
            habitId={habitId}
            onCancel={onClose}
            onSelect={(friend) => {
              setSelectedFriend(friend);
              setStep("config");
            }}
          />
        )}
        {step === "config" && selectedFriend && (
          <ChallengeConfig
            habitId={habitId}
            friend={selectedFriend}
            onCancel={onClose}
            onSent={(id) => {
              setChallengeId(id);
              setStep("sent");
            }}
          />
        )}
        {step === "sent" && selectedFriend && challengeId && (
          <ChallengeSent challengeId={challengeId} friend={selectedFriend} onClose={onClose} />
        )}
      </div>
    </div>
  );
}


