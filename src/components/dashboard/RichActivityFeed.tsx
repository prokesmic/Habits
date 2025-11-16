"use client";

import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Trophy, DollarSign, Flame, Users } from "lucide-react";
import { mockActivityFeed } from "@/data/mockActivityFeed";
import type { ActivityFeedItem } from "@/data/mockActivityFeed";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarBgColor(name: string): string {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-indigo-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

function ActivityCard({ item }: { item: ActivityFeedItem }) {
  const timeAgo = formatDistanceToNow(item.timestamp, { addSuffix: true });

  const renderContent = () => {
    switch (item.type) {
      case "completion":
        return (
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${getAvatarBgColor(item.user.name)}`}
              >
                {getInitials(item.user.name)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{item.user.name}</span>
                  <span className="text-sm text-slate-600">{item.content}</span>
                </div>
                {item.metadata?.amount && (
                  <div className="mt-1.5 flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700 w-fit">
                    <DollarSign className="h-4 w-4" />
                    Won ${item.metadata.amount} from the squad pool!
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 pl-14 text-xs text-slate-500">
              <span>{timeAgo}</span>
              <span>•</span>
              <span>{item.reactions} reactions</span>
              {item.comments !== undefined && (
                <>
                  <span>•</span>
                  <span>{item.comments} {item.comments === 1 ? "comment" : "comments"}</span>
                </>
              )}
            </div>
          </div>
        );

      case "check_in":
        return (
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${getAvatarBgColor(item.user.name)}`}
              >
                {getInitials(item.user.name)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-900">{item.user.name}:</span>
                  <span className="text-sm text-slate-600">"{item.content}"</span>
                </div>
                {item.squad && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <span>in</span>
                    {item.squad.emoji && <span>{item.squad.emoji}</span>}
                    <span className="font-semibold text-slate-700">{item.squad.name}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 pl-14 text-xs text-slate-500">
              <span>{timeAgo}</span>
              {item.comments !== undefined && (
                <>
                  <span>•</span>
                  <span>{item.comments} {item.comments === 1 ? "reply" : "replies"}</span>
                </>
              )}
              <span>•</span>
              <span>{item.reactions} reactions</span>
            </div>
          </div>
        );

      case "milestone":
        return (
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${getAvatarBgColor(item.user.name)}`}
              >
                {getInitials(item.user.name)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="font-semibold text-slate-900">{item.user.name}</span>
                  <span className="text-sm text-slate-600">{item.content}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 pl-14 text-xs text-slate-500">
              <span>{timeAgo}</span>
              <span>•</span>
              <span>{item.reactions} reactions</span>
              {item.comments !== undefined && (
                <>
                  <span>•</span>
                  <span>{item.comments} {item.comments === 1 ? "comment" : "comments"}</span>
                </>
              )}
            </div>
          </div>
        );

      case "squad_activity":
        return (
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                <Users className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {item.squad?.emoji && <span>{item.squad.emoji}</span>}
                  <span className="font-semibold text-slate-900">{item.user.name}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{item.content}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 pl-14 text-xs text-slate-500">
              <span>{timeAgo}</span>
              <span>•</span>
              <span>{item.reactions} reactions</span>
              {item.comments !== undefined && (
                <>
                  <span>•</span>
                  <span>{item.comments} {item.comments === 1 ? "comment" : "comments"}</span>
                </>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      {renderContent()}
      <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3">
        <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
          <Heart className="h-3.5 w-3.5" />
          Like
        </button>
        <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
          <MessageCircle className="h-3.5 w-3.5" />
          Comment
        </button>
        {item.type === "milestone" && (
          <button className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-blue-600 transition hover:text-blue-700">
            <Trophy className="h-3.5 w-3.5" />
            View achievement
          </button>
        )}
        {(item.type === "check_in" || item.type === "squad_activity") && (
          <button className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-blue-600 transition hover:text-blue-700">
            {item.type === "check_in" ? "Reply" : "View squad"}
          </button>
        )}
      </div>
    </div>
  );
}

export function RichActivityFeed() {
  return (
    <div className="space-y-4">
      {mockActivityFeed.map((item) => (
        <ActivityCard key={item.id} item={item} />
      ))}
    </div>
  );
}

