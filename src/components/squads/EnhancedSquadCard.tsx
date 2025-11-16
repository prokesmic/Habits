import Link from "next/link";
import type { Squad } from "@/data/mockSquadsFull";
import { Users, TrendingUp, DollarSign, Eye } from "lucide-react";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(index: number): string {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-indigo-500",
  ];
  return colors[index % colors.length];
}

type EnhancedSquadCardProps = {
  squad: Squad;
  showPreview?: boolean;
};

export function EnhancedSquadCard({ squad, showPreview = true }: EnhancedSquadCardProps) {
  const remainingMembers = Math.max(0, squad.memberCount - (squad.memberAvatars?.length || 0));

  return (
    <article className="group overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-sm transition-all hover:border-blue-300 hover:shadow-lg">
      {/* Cover image with gradient */}
      <div className={`h-32 bg-gradient-to-br ${squad.coverColor} flex items-center justify-center text-5xl transition-transform group-hover:scale-105`}>
        {squad.emoji}
      </div>
      
      <div className="p-5">
        {/* Squad name and description */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {squad.emoji} {squad.name}
          </h3>
          {squad.description && (
            <p className="mt-1 text-sm text-slate-600 line-clamp-2">{squad.description}</p>
          )}
        </div>
        
        {/* Stats row */}
        <div className="mb-4 grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Users className="h-4 w-4 text-slate-500" />
            <div>
              <div className="font-semibold text-slate-900">{squad.memberCount.toLocaleString()} members</div>
              <div className="text-slate-500">{squad.checkInRate}% daily check-ins</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <div>
              <div className="font-semibold text-slate-900">{squad.checkInRate}% success</div>
              <div className="text-slate-500">Active</div>
            </div>
          </div>
        </div>
        
        {/* Stakes */}
        <div className="mb-4 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-3 py-2">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700">
              ${squad.entryStake} entry stake
            </span>
          </div>
          <span className="text-xs font-semibold text-green-700">
            ${(squad.totalPool / 1000).toFixed(0)}K pool
          </span>
        </div>
        
        {/* Top habits */}
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Top habits:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {squad.topHabits.map((habit, idx) => (
              <span
                key={idx}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
              >
                {habit}
              </span>
            ))}
          </div>
        </div>
        
        {/* Member avatars */}
        {squad.memberAvatars && squad.memberAvatars.length > 0 && (
          <div className="mb-4 flex items-center gap-2 border-t border-slate-100 pt-4">
            <div className="flex -space-x-2">
              {squad.memberAvatars.slice(0, 5).map((avatar, idx) => (
                <div
                  key={idx}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-semibold text-white ${getAvatarColor(idx)}`}
                >
                  {avatar}
                </div>
              ))}
            </div>
            {remainingMembers > 0 && (
              <span className="text-xs font-medium text-slate-600">
                +{remainingMembers.toLocaleString()} more
              </span>
            )}
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex gap-2">
          <Link
            href={`/squads/${squad.id}/join`}
            className="flex-1 rounded-full bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Join for ${squad.entryStake}
          </Link>
          {showPreview && (
            <Link
              href={`/squads/${squad.id}`}
              className="flex items-center justify-center rounded-full border-2 border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              <Eye className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

