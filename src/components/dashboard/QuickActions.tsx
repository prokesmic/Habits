"use client";

import Link from "next/link";
import {
  Users,
  Trophy,
  UserPlus,
  Zap,
  TrendingUp,
  Gift
} from "lucide-react";

type QuickActionsProps = {
  hasSquads?: boolean;
  hasChallenges?: boolean;
  className?: string;
};

export function QuickActions({
  hasSquads = false,
  hasChallenges = false,
  className = ""
}: QuickActionsProps) {
  // Determine which actions to prioritize based on user state
  const actions = [
    {
      label: hasSquads ? "Your squads" : "Join a squad",
      href: "/squads",
      icon: Users,
      description: hasSquads ? "Check on your crew" : "4.2x better success",
      color: "bg-indigo-100 text-indigo-600",
      priority: hasSquads ? 2 : 1,
    },
    {
      label: hasChallenges ? "Active challenges" : "Start a challenge",
      href: "/challenges",
      icon: Trophy,
      description: hasChallenges ? "View your challenges" : "Add some stakes",
      color: "bg-purple-100 text-purple-600",
      priority: hasChallenges ? 2 : 1,
    },
    {
      label: "Invite a friend",
      href: "/referrals",
      icon: UserPlus,
      description: "Earn rewards together",
      color: "bg-emerald-100 text-emerald-600",
      priority: 3,
    },
    {
      label: "Analytics",
      href: "/analytics",
      icon: TrendingUp,
      description: "See your progress",
      color: "bg-blue-100 text-blue-600",
      priority: 4,
    },
  ];

  // Sort by priority
  const sortedActions = actions.sort((a, b) => a.priority - b.priority);

  return (
    <div className={className}>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {sortedActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-sm font-semibold text-gray-900 group-hover:text-gray-700">
                {action.label}
              </div>
              <div className="text-xs text-gray-500">
                {action.description}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// Compact version for sidebars
export function QuickActionsCompact({ className = "" }: { className?: string }) {
  const actions = [
    { label: "Join squad", href: "/squads", icon: Users },
    { label: "Challenge", href: "/challenges", icon: Trophy },
    { label: "Invite", href: "/referrals", icon: Gift },
    { label: "Analytics", href: "/analytics", icon: Zap },
  ];

  return (
    <div className={`space-y-1 ${className}`}>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <Icon className="w-4 h-4" />
            {action.label}
          </Link>
        );
      })}
    </div>
  );
}

// Hero quick actions for dashboard
export function DashboardQuickActionsHero({ className = "" }: { className?: string }) {
  return (
    <div className={`grid grid-cols-3 gap-3 ${className}`}>
      <Link
        href="/squads"
        className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-150 transition-colors group"
      >
        <div className="w-12 h-12 rounded-xl bg-indigo-500 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
          <Users className="w-6 h-6" />
        </div>
        <span className="text-sm font-semibold text-indigo-900">Join Squad</span>
      </Link>

      <Link
        href="/challenges/new"
        className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-150 transition-colors group"
      >
        <div className="w-12 h-12 rounded-xl bg-purple-500 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
          <Trophy className="w-6 h-6" />
        </div>
        <span className="text-sm font-semibold text-purple-900">Challenge</span>
      </Link>

      <Link
        href="/referrals"
        className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-150 transition-colors group"
      >
        <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
          <UserPlus className="w-6 h-6" />
        </div>
        <span className="text-sm font-semibold text-emerald-900">Invite</span>
      </Link>
    </div>
  );
}
