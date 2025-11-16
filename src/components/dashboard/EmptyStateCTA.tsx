import Link from "next/link";

export function EmptyStateCTA() {
  return (
    <div className="rounded-3xl border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
        🚀
      </div>
      <h3 className="mb-2 text-xl font-semibold text-slate-900">Your journey starts here!</h3>
      <p className="mb-6 text-sm text-slate-600">
        Join a squad to see your friends&apos; activity, compete in challenges, and win real stakes.
      </p>
      <Link
        href="/squads"
        className="inline-block rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Browse squads
      </Link>
    </div>
  );
}

