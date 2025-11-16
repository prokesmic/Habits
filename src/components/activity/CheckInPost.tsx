"use client";

import type { ActivityPost } from "@/types/activity";
import { UserHeader, ReactionBar } from "./ActivityPost";

export function CheckInPost({ post }: { post: ActivityPost }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <UserHeader post={post} />
      <div className="space-y-1">
        <p className="text-base font-semibold text-slate-900">✅ Checked into {post.content.habit}</p>
        {post.content.streak ? (
          <p className="text-sm text-slate-700">Day {post.content.streak} of streak! 🔥</p>
        ) : null}
        {post.content.message && <p className="mt-2 text-sm text-slate-700">"{post.content.message}"</p>}
      </div>
      <ReactionBar post={post} actions={["like", "comment"]} />
    </article>
  );
}


