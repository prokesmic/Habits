"use client";

import type { ActivityPost } from "@/types/activity";
import { UserHeader, ReactionBar } from "./ActivityPost";

export function MilestonePost({ post }: { post: ActivityPost }) {
  return (
    <article className="rounded-2xl border-l-4 border-yellow-500 border-slate-200 bg-white p-4 shadow-sm">
      <UserHeader post={post} />
      <div className="space-y-1">
        <p className="text-base font-semibold text-slate-900">🏆 Hit {post.content.streak}-day streak!</p>
        {post.content.habit && <p className="text-sm text-slate-700">{post.content.habit}</p>}
        {post.content.message && <p className="mt-1 text-sm text-slate-700">"{post.content.message}"</p>}
      </div>
      <ReactionBar post={post} actions={["like", "comment", "share"]} />
    </article>
  );
}


