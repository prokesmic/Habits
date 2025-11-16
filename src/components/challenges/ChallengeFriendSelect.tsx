"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "@/types/challenge";
import { FriendSearchInput } from "./FriendSearchInput";
import { FriendButton } from "./FriendButton";

type Props = {
  habitId: string;
  onSelect: (friend: User) => void;
  onCancel: () => void;
};

const MOCK_FRIENDS: User[] = [
  { id: "u1", name: "Emma", avatar: "https://ui-avatars.com/api/?name=Emma&background=random", lastActive: new Date(Date.now() - 1000 * 60 * 30) },
  { id: "u2", name: "John", avatar: "https://ui-avatars.com/api/?name=John&background=random", lastActive: new Date(Date.now() - 1000 * 60 * 60) },
  { id: "u3", name: "Sarah", avatar: "https://ui-avatars.com/api/?name=Sarah&background=random", lastActive: new Date(Date.now() - 1000 * 60 * 10) },
  { id: "u4", name: "Mike", avatar: "https://ui-avatars.com/api/?name=Mike&background=random", lastActive: new Date(Date.now() - 1000 * 60 * 90) },
  { id: "u5", name: "Alex", avatar: "https://ui-avatars.com/api/?name=Alex&background=random", lastActive: new Date(Date.now() - 1000 * 60 * 5) },
];

export function ChallengeFriendSelect({ onSelect, onCancel }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [friends, setFriends] = useState<User[]>(MOCK_FRIENDS);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFriends(MOCK_FRIENDS);
    } else {
      const q = searchQuery.toLowerCase();
      setFriends(MOCK_FRIENDS.filter((f) => f.name.toLowerCase().includes(q)));
    }
  }, [searchQuery]);

  const mostActive = useMemo(() => {
    return [...MOCK_FRIENDS].sort((a, b) => a.lastActive.getTime() - b.lastActive.getTime()).slice(0, 4);
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900">Great job! 🎉</h2>
      <p className="mt-1 text-sm text-slate-600">Challenge a friend to beat you?</p>

      <div className="mt-4">
        <FriendSearchInput value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Quick challenge</p>
        <div className="grid grid-cols-2 gap-3">
          {mostActive.map((f) => (
            <FriendButton key={f.id} friend={f} onClick={() => onSelect(f)} />
          ))}
        </div>
      </div>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => {
            const link = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/challenge/new`;
            navigator.clipboard.writeText(link).catch(() => {});
            alert("Challenge link copied to clipboard!");
          }}
          className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
        >
          Share challenge link
        </button>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}


