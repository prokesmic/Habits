"use client";

import Link from "next/link";
import { featuredSquads } from "@/data/mockSquads";
import { Users, TrendingUp, DollarSign } from "lucide-react";

export function FeaturedSquads() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">Featured Public Squads</h3>
        <Link
          href="/squads"
          className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
        >
          Browse all →
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featuredSquads.map((squad) => (
          <Link
            key={squad.id}
            href={`/squads/${squad.id}`}
            className="group rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
          >
            {/* Cover image placeholder */}
            <div className="mb-4 h-32 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-5xl">
              {squad.emoji}
            </div>
            
            {/* Squad info */}
            <div className="space-y-3">
              <div>
                <h4 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600">
                  {squad.emoji} {squad.name}
                </h4>
                {squad.description && (
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2">{squad.description}</p>
                )}
              </div>
              
              {/* Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Users className="h-3.5 w-3.5" />
                    <span>{squad.memberCount} members</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-green-600">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>{squad.successRate}% success</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span>${squad.entryStake} stake</span>
                  </div>
                  <div className="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition group-hover:bg-blue-700">
                    Join now
                  </div>
                </div>
              </div>
              
              {/* Top habits */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-medium text-slate-500 mb-1.5">Top habits:</p>
                <div className="flex flex-wrap gap-1.5">
                  {squad.topHabits.map((habit, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700"
                    >
                      {habit}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

