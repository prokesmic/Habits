'use client';

import { formatDistanceToNow } from 'date-fns';

interface CompactActivityCardProps {
  activity: {
    id: string;
    user: {
      name: string;
      avatar?: string;
    };
    habit: {
      name: string;
      emoji: string;
    };
    proof?: {
      photoUrl?: string;
    };
    timestamp: string;
    reactions: number;
  };
}

export const CompactActivityCard = ({ activity }: CompactActivityCardProps) => {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
        {activity.user.name[0]}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm">
          <span className="font-semibold">{activity.user.name}</span>
          {' '}checked in
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-600">
          <span>{activity.habit.emoji}</span>
          <span className="truncate">{activity.habit.name}</span>
        </div>

        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          <span>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>
          {activity.reactions > 0 && (
            <span>💪 {activity.reactions}</span>
          )}
        </div>
      </div>

      {activity.proof?.photoUrl && (
        <img
          src={activity.proof.photoUrl}
          alt="Proof"
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
        />
      )}
    </div>
  );
};
