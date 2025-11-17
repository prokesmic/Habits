'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Share2, Flag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'checkin' | 'streak_milestone' | 'habit_created' | 'challenge_joined';
  userId: string;
  user: {
    name: string;
    avatar: string;
  };
  habit: {
    id: string;
    name: string;
    emoji: string;
  };
  proof?: {
    type: 'photo' | 'note';
    photoUrl?: string;
    note?: string;
  };
  metadata?: {
    days?: number;
    challengeName?: string;
    participantCount?: number;
  };
  reactions: {
    type: string;
    count: number;
    users: string[];
  }[];
  comments: {
    id: string;
    userId: string;
    user: { name: string; avatar: string };
    text: string;
    createdAt: Date;
  }[];
  createdAt: Date;
}

const getActivityContent = (activity: Activity) => {
  switch (activity.type) {
    case 'checkin':
      return (
        <div>
          <div className="font-semibold mb-2">
            checked in to {activity.habit.emoji} {activity.habit.name}
          </div>
          {activity.proof?.photoUrl && (
            <img
              src={activity.proof.photoUrl}
              alt="Check-in proof"
              className="w-full h-64 object-cover rounded-xl mb-3 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(activity.proof?.photoUrl, '_blank')}
            />
          )}
          {activity.proof?.note && (
            <div className="bg-gray-50 rounded-lg p-4 mb-3 italic text-gray-700">
              &quot;{activity.proof.note}&quot;
            </div>
          )}
        </div>
      );

    case 'streak_milestone':
      return (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-6">
          <div className="text-5xl mb-3">🔥</div>
          <div className="font-bold text-2xl mb-2">
            {activity.metadata?.days}-Day Streak!
          </div>
          <div className="text-lg opacity-90">
            {activity.habit.emoji} {activity.habit.name}
          </div>
        </div>
      );

    case 'habit_created':
      return (
        <div className="font-semibold">
          started tracking {activity.habit.emoji} {activity.habit.name}
        </div>
      );

    case 'challenge_joined':
      return (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-6">
          <div className="text-4xl mb-2">🏆</div>
          <div className="font-bold text-xl mb-1">
            Joined &quot;{activity.metadata?.challengeName}&quot;
          </div>
          <div className="opacity-90">
            {activity.metadata?.participantCount} participants
          </div>
        </div>
      );

    default:
      return null;
  }
};

const ActivityCard = ({
  activity,
  onReact,
  onComment
}: {
  activity: Activity;
  onReact: (id: string, emoji: string) => void;
  onComment: (id: string, text: string) => void;
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const quickReactions = ['💪', '🔥', '👏', '🎉', '❤️'];

  return (
    <div className="bg-white border rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={activity.user.avatar}
          alt={activity.user.name}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <div className="font-semibold">{activity.user.name}</div>
          <div className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
          </div>
        </div>

        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
          <Flag className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      {getActivityContent(activity)}

      {/* Reactions & Actions */}
      <div className="mt-4 pt-4 border-t flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Quick Reactions */}
          <div className="flex items-center gap-1">
            {quickReactions.map((emoji) => {
              const reaction = activity.reactions.find(r => r.type === emoji);
              return (
                <button
                  key={emoji}
                  onClick={() => onReact(activity.id, emoji)}
                  className={`px-2 py-1 rounded-lg transition-all hover:scale-110 ${
                    reaction && reaction.count > 0
                      ? 'bg-orange-100'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{emoji}</span>
                  {reaction && reaction.count > 0 && (
                    <span className="text-xs font-semibold text-gray-600 ml-1">
                      {reaction.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Comment Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{activity.comments.length}</span>
          </button>

          {/* Share Button */}
          <button className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-gray-100 text-gray-600">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t space-y-3">
          {activity.comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <img
                src={comment.user.avatar}
                alt={comment.user.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="font-semibold text-sm mb-1">{comment.user.name}</div>
                  <div className="text-sm">{comment.text}</div>
                </div>
                <div className="text-xs text-gray-500 mt-1 ml-3">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </div>
              </div>
            </div>
          ))}

          {/* Add Comment */}
          <div className="flex gap-3">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && commentText.trim()) {
                  onComment(activity.id, commentText);
                  setCommentText('');
                }
              }}
              placeholder="Add a comment..."
              className="flex-1 px-4 py-2 border rounded-lg focus:border-orange-500 focus:outline-none"
            />
            <button
              onClick={() => {
                if (commentText.trim()) {
                  onComment(activity.id, commentText);
                  setCommentText('');
                }
              }}
              disabled={!commentText.trim()}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium disabled:opacity-50 hover:bg-orange-600"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const ActivityFeed = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filter, setFilter] = useState<'all' | 'squad' | 'following'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, [filter]);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/activity?filter=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setActivities(data.activities || []);
      }
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (activityId: string, emoji: string) => {
    try {
      await fetch(`/api/activity/${activityId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji })
      });

      loadActivities();
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  const handleComment = async (activityId: string, text: string) => {
    try {
      await fetch(`/api/activity/${activityId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      loadActivities();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
        {[
          { value: 'all', label: 'All Activity' },
          { value: 'squad', label: 'My Squad' },
          { value: 'following', label: 'Following' }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as 'all' | 'squad' | 'following')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              filter === tab.value
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Activity Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-gray-500">Loading activities...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <div className="text-4xl mb-3">📭</div>
            <h3 className="font-semibold text-lg mb-1">No activity yet</h3>
            <p className="text-gray-600">
              {filter === 'squad'
                ? 'Your squad members haven\'t posted yet'
                : filter === 'following'
                ? 'People you follow haven\'t posted yet'
                : 'Be the first to check in!'}
            </p>
          </div>
        ) : (
          activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onReact={handleReaction}
              onComment={handleComment}
            />
          ))
        )}
      </div>
    </div>
  );
};
