"use client";

import type { ActivityPost } from "@/types/activity";
import { UserHeader, ReactionBar } from "./ActivityPost";

export function AchievementPost({ post }: { post: ActivityPost }) {
  return (
    <article className="rounded-2xl border-l-4 border-green-500 border-slate-200 bg-white p-4 shadow-sm">
      <UserHeader post={post} />
      <div className="space-y-1">
        <p className="text-base font-semibold text-slate-900">🎉 {post.content.message}</p>
        {post.content.amount !== undefined && (
          <p className="text-sm font-semibold text-green-700">
            Won ${post.content.amount} from the squad pool!
          </p>
        )}
      </div>
      <ReactionBar post={post} actions={["like", "comment", "share"]} />
    </article>
  );
}


