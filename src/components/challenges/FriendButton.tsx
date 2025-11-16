"use client";

import type { User } from "@/types/challenge";

export function FriendButton({ friend, onClick }: { friend: User; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-blue-300 hover:shadow-sm"
    >
      <img
        src={friend.avatar}
        alt={friend.name}
        className="h-12 w-12 rounded-full border border-slate-200 object-cover"
      />
      <div className="text-sm">
        <p className="font-semibold text-slate-900">{friend.name}</p>
        <p className="text-xs text-slate-500">Active {Math.ceil((Date.now() - friend.lastActive.getTime()) / 60000)}m ago</p>
      </div>
    </button>
  );
}


