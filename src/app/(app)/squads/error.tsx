"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function SquadsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Squads page error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <span className="text-3xl">⚠️</span>
        </div>
        <h2 className="text-xl font-bold text-red-900">Something went wrong</h2>
        <p className="mt-2 text-sm text-red-700">
          We encountered an error while loading the squads page.
        </p>
        {error.message && (
          <p className="mt-2 text-xs text-red-600 font-mono bg-red-100 p-2 rounded">
            {error.message}
          </p>
        )}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="rounded-full bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 active:scale-95"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="rounded-full border-2 border-red-300 bg-white px-6 py-3 text-sm font-semibold text-red-700 transition hover:border-red-400 hover:bg-red-50"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>

      <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
        <p className="font-semibold">Need help?</p>
        <p className="mt-1 text-blue-700">
          If this problem persists, please{" "}
          <Link href="/support/contact" className="font-semibold underline">
            contact support
          </Link>{" "}
          and include the error message above.
        </p>
      </div>
    </div>
  );
}
