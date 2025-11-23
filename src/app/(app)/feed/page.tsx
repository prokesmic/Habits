"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Trophy, Flame, Users, CheckCircle2 } from "lucide-react";

type FeedItem = {
  id: string;
  type: "checkin" | "streak" | "challenge_win" | "squad_join" | "milestone";
  user: { name: string; avatar?: string };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  liked: boolean;
};

export default function FeedPage() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([
    {
      id: "1",
      type: "checkin",
      user: { name: "Sarah M." },
      content: "Just completed my morning meditation! Day 15 🧘‍♀️",
      timestamp: "2 minutes ago",
      likes: 12,
      comments: 3,
      liked: false,
    },
    {
      id: "2",
      type: "streak",
      user: { name: "Mike R." },
      content: "🔥 30-day streak on 'Read 20 pages'! Consistency pays off.",
      timestamp: "15 minutes ago",
      likes: 45,
      comments: 8,
      liked: true,
    },
    {
      id: "3",
      type: "challenge_win",
      user: { name: "Emily K." },
      content: "Won the 'Early Bird' challenge! Thanks to everyone who participated 🏆",
      timestamp: "1 hour ago",
      likes: 67,
      comments: 12,
      liked: false,
    },
    {
      id: "4",
      type: "squad_join",
      user: { name: "Alex T." },
      content: "Just joined 'Morning Warriors' squad. Let's crush it together! 💪",
      timestamp: "2 hours ago",
      likes: 23,
      comments: 5,
      liked: false,
    },
    {
      id: "5",
      type: "milestone",
      user: { name: "Jordan L." },
      content: "100 total check-ins! Small steps lead to big changes ✨",
      timestamp: "3 hours ago",
      likes: 89,
      comments: 15,
      liked: true,
    },
  ]);

  const handleLike = (id: string) => {
    setFeedItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, liked: !item.liked, likes: item.liked ? item.likes - 1 : item.likes + 1 }
          : item
      )
    );
  };

  const getIcon = (type: FeedItem["type"]) => {
    switch (type) {
      case "checkin":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case "streak":
        return <Flame className="h-5 w-5 text-orange-500" />;
      case "challenge_win":
        return <Trophy className="h-5 w-5 text-amber-500" />;
      case "squad_join":
        return <Users className="h-5 w-5 text-violet-500" />;
      case "milestone":
        return <Trophy className="h-5 w-5 text-indigo-500" />;
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Hero Header */}
      <section className="rounded-3xl bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 p-6 text-white shadow-sm shadow-slate-900/10">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            <span>📣</span>
            <span>Feed</span>
          </span>
          <div>
            <h1 className="text-2xl font-semibold md:text-3xl">Activity Feed</h1>
            <p className="mt-1 text-sm opacity-95">
              See what your friends and squad members are up to
            </p>
          </div>
        </div>
      </section>

      {/* Feed Items */}
      <div className="space-y-4">
        {feedItems.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex gap-4">
              {/* Avatar */}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 text-lg font-semibold text-white">
                {item.user.name.charAt(0)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{item.user.name}</span>
                  {getIcon(item.type)}
                  <span className="text-sm text-slate-500">{item.timestamp}</span>
                </div>
                <p className="mt-2 text-slate-700">{item.content}</p>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-6">
                  <button
                    onClick={() => handleLike(item.id)}
                    className={`flex items-center gap-2 text-sm transition ${
                      item.liked ? "text-rose-500" : "text-slate-500 hover:text-rose-500"
                    }`}
                    data-testid={`feed-like-${item.id}`}
                  >
                    <Heart className={`h-5 w-5 ${item.liked ? "fill-current" : ""}`} />
                    <span>{item.likes}</span>
                  </button>
                  <button
                    className="flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-700"
                    data-testid={`feed-comment-${item.id}`}
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>{item.comments}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <button
          className="rounded-full border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          data-testid="feed-load-more"
        >
          Load More
        </button>
      </div>

      {/* Info */}
      <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-900">
        <p className="font-semibold">Stay connected</p>
        <p className="mt-1 text-rose-700">
          Celebrate wins with your squad, share your progress, and stay motivated together!
        </p>
      </div>
    </div>
  );
}
