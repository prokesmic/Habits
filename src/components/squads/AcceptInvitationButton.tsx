"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Loader2 } from "lucide-react";

interface AcceptInvitationButtonProps {
  token: string;
  squadId: string;
  squadName: string;
}

export function AcceptInvitationButton({ token, squadId, squadName }: AcceptInvitationButtonProps) {
  const router = useRouter();
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAccept = async () => {
    setIsAccepting(true);
    setError(null);

    try {
      const res = await fetch(`/api/squads/invitations/${token}/accept`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to accept invitation");
      }

      // Redirect to squad page
      router.push(`/squads/${squadId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to accept invitation");
      setIsAccepting(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <button
        onClick={handleAccept}
        disabled={isAccepting}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-orange-500/30 transition hover:shadow-lg hover:shadow-orange-500/40 disabled:opacity-50"
      >
        {isAccepting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Joining {squadName}...
          </>
        ) : (
          <>
            <Users className="h-4 w-4" />
            Join {squadName}
          </>
        )}
      </button>
    </div>
  );
}
