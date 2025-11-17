'use client';

import { useRouter } from 'next/navigation';

interface SquadSidebarProps {
  squadStats: {
    activeMembers: number;
    totalCheckInsToday: number;
    topPerformer?: {
      name: string;
      avatar?: string;
      checkIns: number;
    };
  };
  topStreaks: {
    id: string;
    name: string;
    emoji: string;
    currentStreak: number;
  }[];
  hasActiveStakes?: boolean;
  activeStakesAmount?: number;
}

export const SquadSidebar = ({
  squadStats,
  topStreaks,
  hasActiveStakes,
  activeStakesAmount
}: SquadSidebarProps) => {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Squad Today</h3>
          <button className="text-sm text-orange-600 font-medium hover:underline">
            View All
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Active now</div>
            <div className="flex -space-x-2">
              {squadStats.activeMembers > 0 ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-green-500 ring-2 ring-white" />
                  <div className="w-8 h-8 rounded-full bg-blue-500 ring-2 ring-white" />
                  <div className="w-8 h-8 rounded-full bg-purple-500 ring-2 ring-white" />
                  {squadStats.activeMembers > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 ring-2 ring-white flex items-center justify-center text-xs font-semibold">
                      +{squadStats.activeMembers - 3}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-gray-500">No one yet</div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Check-ins today</div>
            <div className="text-2xl font-bold text-green-600">
              {squadStats.totalCheckInsToday}
            </div>
          </div>

          {squadStats.topPerformer && (
            <div className="pt-4 border-t">
              <div className="text-xs text-gray-500 mb-2">Today's MVP 🏆</div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center text-white font-bold">
                  {squadStats.topPerformer.name[0]}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{squadStats.topPerformer.name}</div>
                  <div className="text-sm text-gray-600">
                    {squadStats.topPerformer.checkIns} check-ins
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-bold mb-4">Your Streaks 🔥</h3>
        <div className="space-y-3">
          {topStreaks.length > 0 ? (
            topStreaks.map((habit) => (
              <div key={habit.id} className="flex items-center gap-3">
                <div className="text-2xl">{habit.emoji}</div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{habit.name}</div>
                  <div className="text-xs text-gray-600">
                    {habit.currentStreak} days
                  </div>
                </div>
                <div className="text-orange-500 font-bold">
                  🔥
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 text-center py-2">
              No streaks yet. Start checking in!
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-bold mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <button
            onClick={() => router.push('/squads')}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-left hover:border-orange-500 hover:bg-orange-50 transition-colors"
          >
            <div className="font-medium text-sm">Invite Friends</div>
            <div className="text-xs text-gray-600">Add accountability partners</div>
          </button>

          <button
            onClick={() => router.push('/challenges')}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-left hover:border-orange-500 hover:bg-orange-50 transition-colors"
          >
            <div className="font-medium text-sm">Join Challenge</div>
            <div className="text-xs text-gray-600">Compete with others</div>
          </button>
        </div>
      </div>

      {hasActiveStakes && (
        <div className="bg-gray-100 rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-gray-600 uppercase">
              Active Stakes
            </div>
            <button className="text-xs text-gray-600 hover:text-gray-900">
              View →
            </button>
          </div>
          <div className="text-2xl font-bold">${activeStakesAmount}</div>
          <div className="text-xs text-gray-600">at stake</div>
        </div>
      )}
    </div>
  );
};
