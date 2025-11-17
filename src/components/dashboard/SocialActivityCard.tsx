'use client';

import { useState } from 'react';
import { MessageCircle, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'checkin' | 'streak_milestone' | 'challenge_joined';
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
    note?: string;
  };
  metadata?: {
    days?: number;
  };
  reactions: {
    type: string;
    count: number;
    userReacted: boolean;
  }[];
  commentCount: number;
  timestamp: string;
}

interface SocialActivityCardProps {
  activity: Activity;
  onReact: (activityId: string, emoji: string) => Promise<void>;
  onComment?: (activityId: string, text: string) => Promise<void>;
}

export const SocialActivityCard = ({ activity, onReact }: SocialActivityCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [localReactions, setLocalReactions] = useState(activity.reactions);

  const handleReact = async (emoji: string) => {
    const existing = localReactions.find(r => r.type === emoji);
    if (existing) {
      setLocalReactions(localReactions.map(r =>
        r.type === emoji
          ? {
              ...r,
              count: r.userReacted ? r.count - 1 : r.count + 1,
              userReacted: !r.userReacted
            }
          : r
      ));
    } else {
      setLocalReactions([...localReactions, { type: emoji, count: 1, userReacted: true }]);
    }
    await onReact(activity.id, emoji);
  };

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
          {activity.user.name[0]}
        </div>
        <div className="flex-1">
          <div className="font-semibold">{activity.user.name}</div>
          <div className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
          </div>
        </div>
      </div>

      {activity.proof?.photoUrl && (
        <img
          src={activity.proof.photoUrl}
          alt="Check-in proof"
          className="w-full max-h-96 object-cover cursor-pointer hover:opacity-95"
        />
      )}

      <div className="p-4">
        {activity.type === 'checkin' && (
          <div className="mb-3">
            <span className="font-semibold">checked in to </span>
            <span className="text-lg">
              {activity.habit.emoji} {activity.habit.name}
            </span>
          </div>
        )}

        {activity.type === 'streak_milestone' && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4 mb-3">
            <div className="text-3xl mb-2">🔥</div>
            <div className="font-bold text-lg">
              {activity.metadata?.days}-Day Streak!
            </div>
            <div className="opacity-90">
              {activity.habit.emoji} {activity.habit.name}
            </div>
          </div>
        )}

        {activity.proof?.note && (
          <p className="text-gray-700 mb-3">"{activity.proof.note}"</p>
        )}

        <div className="flex items-center gap-4 py-2 border-t">
          <div className="flex items-center gap-1">
            {['💪', '🔥', '👏', '❤️'].map((emoji) => {
              const reaction = localReactions.find(r => r.type === emoji);
              const count = reaction?.count || 0;
              const userReacted = reaction?.userReacted || false;

              return (
                <button
                  key={emoji}
                  onClick={() => handleReact(emoji)}
                  className={`px-2 py-1 rounded-lg text-lg transition-all hover:scale-110 ${
                    userReacted ? 'bg-orange-100' : 'hover:bg-gray-100'
                  }`}
                >
                  {emoji}
                  {count > 0 && (
                    <span className="text-xs font-semibold text-gray-600 ml-1">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{activity.commentCount}</span>
          </button>

          <button className="ml-auto flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-gray-100 text-gray-600">
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {showComments && (
          <div className="pt-3 border-t">
            <div className="text-sm text-gray-500 text-center py-4">
              Comments coming soon...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
