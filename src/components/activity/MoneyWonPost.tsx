"use client";

import type { ActivityPost } from "@/types/activity";
import { UserHeader, ReactionBar } from "./ActivityPost";

export function MoneyWonPost({ post }: { post: ActivityPost }) {
  return (
    <article className="rounded-2xl border border-green-200 bg-green-50 p-4 shadow-sm">
      <UserHeader post={post} />
      <div className="space-y-1">
        <p className="text-base font-semibold text-slate-900">💰 Won ${post.content.amount} from challenge!</p>
        {post.content.challenge && <p className="text-sm text-slate-700">{post.content.challenge}</p>}
        <p className="text-sm text-slate-600">Total winnings this month: ${(post.content.amount ?? 0) + 135}</p>
      </div>
      <ReactionBar post={post} actions={["like", "comment"]} />
    </article>
  );
}


