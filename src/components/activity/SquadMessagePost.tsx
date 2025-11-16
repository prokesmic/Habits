"use client";

import type { ActivityPost } from "@/types/activity";
import { UserHeader, ReactionBar } from "./ActivityPost";

export function SquadMessagePost({ post }: { post: ActivityPost }) {
  return (
    <article className="rounded-2xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
      <UserHeader post={post} />
      {post.squad && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
          in {post.squad}
        </p>
      )}
      {post.content.message && (
        <p className="text-sm text-slate-800">{post.content.message}</p>
      )}
      <ReactionBar post={post} actions={["reply", "react"]} />
    </article>
  );
}


