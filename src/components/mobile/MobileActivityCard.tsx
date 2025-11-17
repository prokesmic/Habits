'use client';

import { formatDistanceToNow } from 'date-fns';

interface MobileActivityCardProps {
  activity: {
    id: string;
    user: {
      name: string;
      avatar: string;
    };
    habit: {
      name: string;
      emoji: string;
    };
    proof?: {
      photoUrl?: string;
      note?: string;
    };
    reactions: number;
    timestamp: string;
  };
}

export const MobileActivityCard = ({ activity }: MobileActivityCardProps) => {
  return (
    <div className="bg-white border rounded-xl p-3">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
          {activity.user.name[0]}
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm mb-2">
            <span className="font-semibold">{activity.user.name}</span>
            {' '}checked in to{' '}
            <span className="font-medium">
              {activity.habit.emoji} {activity.habit.name}
            </span>
          </div>

          {activity.proof?.photoUrl && (
            <img
              src={activity.proof.photoUrl}
              alt="Proof"
              className="w-full h-32 object-cover rounded-lg mb-2"
            />
          )}

          {activity.proof?.note && (
            <p className="text-sm text-gray-600 italic mb-2">
              &quot;{activity.proof.note}&quot;
            </p>
          )}

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</span>

            {activity.reactions > 0 && (
              <span className="flex items-center gap-1">
                💪 {activity.reactions}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
