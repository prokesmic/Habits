"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Loader2 } from "lucide-react";
import { fixSquadMembership } from "@/server/actions/social";

interface FixMembershipButtonProps {
  squadId: string;
}

export function FixMembershipButton({ squadId }: FixMembershipButtonProps) {
  const router = useRouter();
  const [isFixing, setIsFixing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFix = async () => {
    setIsFixing(true);
    setMessage(null);

    try {
      const result = await fixSquadMembership(squadId);
      if (result.alreadyMember) {
        setMessage("You're already a member!");
      } else {
        setMessage("Successfully added you as a member!");
        router.refresh();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to fix membership");
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleFix}
        disabled={isFixing}
        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {isFixing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <UserPlus className="h-4 w-4" />
        )}
        {isFixing ? "Fixing..." : "Add Me as Member"}
      </button>
      {message && (
        <p className={`text-sm ${message.includes("Successfully") ? "text-green-600" : "text-amber-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
