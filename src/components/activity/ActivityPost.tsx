"use client";

import type { ActivityPost } from "@/types/activity";
import { formatDistanceToNow } from "date-fns";

export function UserHeader({ post }: { post: ActivityPost }) {
  const timeAgo = formatDistanceToNow(post.timestamp, { addSuffix: true });
  return (
    <div className="mb-3 flex items-center gap-3">
      <img
        src={post.user.avatar}
        alt={post.user.name}
        className="h-12 w-12 rounded-full border border-slate-200 object-cover"
      />
      <div>
        <p className="text-sm font-semibold text-slate-900">{post.user.name}</p>
        <p className="text-xs text-slate-500">{timeAgo}</p>
      </div>
    </div>
  );
}

export function ReactionBar({
  post,
  actions = ["like", "comment"],
  onLike,
  onComment,
  onShare,
  onReply,
  onReact,
}: {
  post: ActivityPost;
  actions?: Array<"like" | "comment" | "share" | "react" | "reply">;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onReply?: () => void;
  onReact?: () => void;
}) {
  const handleClick = (action: string, handler?: () => void) => {
    if (handler) {
      handler();
    } else {
      alert(`${action} feature coming soon!`);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center gap-4 text-sm text-slate-600">
        {post.reactions.like > 0 && <span>❤️ {post.reactions.like}</span>}
        {post.reactions.celebrate > 0 && <span>🎉 {post.reactions.celebrate}</span>}
        {post.reactions.fire > 0 && <span>🔥 {post.reactions.fire}</span>}
        {post.comments > 0 && <span>💬 {post.comments}</span>}
      </div>
      <div className="mt-2 flex items-center gap-3 text-sm font-semibold text-slate-600">
        {actions.includes("like") && (
          <button onClick={() => handleClick("Like", onLike)} className="rounded-full px-2 py-1 transition hover:bg-slate-100">Like</button>
        )}
        {actions.includes("comment") && (
          <button onClick={() => handleClick("Comment", onComment)} className="rounded-full px-2 py-1 transition hover:bg-slate-100">Comment</button>
        )}
        {actions.includes("share") && (
          <button onClick={() => handleClick("Share", onShare)} className="rounded-full px-2 py-1 transition hover:bg-slate-100">Share</button>
        )}
        {actions.includes("reply") && (
          <button onClick={() => handleClick("Reply", onReply)} className="rounded-full px-2 py-1 transition hover:bg-slate-100">Reply</button>
        )}
        {actions.includes("react") && (
          <button onClick={() => handleClick("React", onReact)} className="rounded-full px-2 py-1 transition hover:bg-slate-100">React</button>
        )}
      </div>
    </div>
  );
}


