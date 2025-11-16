"use client";

import { useState } from "react";
import { checkIn } from "@/server/actions/habits";
import { ChallengeModal } from "@/components/challenges/ChallengeModal";

type CheckInButtonProps = {
  habitId: string;
  checkedIn?: boolean;
};

export function CheckInButton({ habitId, checkedIn: initialCheckedIn = false }: CheckInButtonProps) {
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(initialCheckedIn);
  const [showChallenge, setShowChallenge] = useState(false);

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      await checkIn(habitId, today);
      setChecked(true);
      // 20% chance to prompt a friend challenge
      if (Math.random() < 0.2) {
        setShowChallenge(true);
      } else {
        // Refresh the page to show the updated state
        window.location.reload();
      }
    } catch (error) {
      console.error("Check-in error:", error);
      alert(error instanceof Error ? error.message : "Failed to check in");
    } finally {
      setLoading(false);
    }
  };

  if (checked) {
    return (
      <button
        disabled
        className="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white opacity-60"
      >
        ✓ Checked in
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleCheckIn}
        disabled={loading}
        className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Checking in..." : "Check in"}
      </button>
      {showChallenge && (
        <ChallengeModal
          habitId={habitId}
          onClose={() => {
            setShowChallenge(false);
            window.location.reload();
          }}
        />
      )}
    </>
  );
}

