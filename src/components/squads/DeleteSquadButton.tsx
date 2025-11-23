"use client";

import { useState } from "react";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { deleteSquad } from "@/server/actions/social";

export function DeleteSquadButton({ squadId, squadName }: { squadId: string; squadName: string }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await deleteSquad(squadId);
      // Use window.location for hard navigation to avoid Server Component re-render issues
      window.location.href = "/squads";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete squad");
      setIsDeleting(false);
    }
  };

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="inline-flex items-center gap-2 rounded-full border-2 border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:border-red-400 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
        Delete Squad
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-red-900">Delete "{squadName}"?</h3>
          <p className="mt-1 text-sm text-red-700">
            This will permanently delete the squad, all members, and chat messages. This action cannot be undone.
          </p>
          {error && (
            <p className="mt-2 text-sm font-medium text-red-800">{error}</p>
          )}
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Yes, delete
                </>
              )}
            </button>
            <button
              onClick={() => {
                setShowConfirm(false);
                setError(null);
              }}
              disabled={isDeleting}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
