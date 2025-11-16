import Link from "next/link";
import { getQuickJoinSquads } from "@/data/mockSquadsFull";
import { TrendingUp } from "lucide-react";

export function InstantValueBanner() {
  const quickJoinSquads = getQuickJoinSquads();

  return (
    <div className="rounded-3xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-2">
        <span className="text-2xl">🌟</span>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Join Your First Squad</h2>
      </div>
      
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700 sm:text-base">
        <TrendingUp className="h-5 w-5 text-green-600" />
        <span>Squads boost success by <span className="text-green-600">4.2x</span></span>
      </div>
      
      <p className="mb-6 text-sm text-slate-600 sm:text-base">
        Pick one to get started:
      </p>
      
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {quickJoinSquads.map((squad) => (
          <Link
            key={squad.id}
            href={`/squads/${squad.id}`}
            className="group rounded-xl border-2 border-blue-200 bg-white p-3 text-center transition-all hover:border-blue-400 hover:shadow-md"
          >
            <div className="mb-2 text-2xl">{squad.emoji}</div>
            <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 sm:text-sm">
              {squad.name}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              ${squad.entryStake}
            </div>
          </Link>
        ))}
      </div>
      
      <div className="flex items-center justify-between border-t border-blue-200 pt-4">
        <p className="text-sm text-slate-600">or</p>
        <Link
          href="/squads/new"
          className="rounded-full border-2 border-blue-600 bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Create your own →
        </Link>
      </div>
    </div>
  );
}

