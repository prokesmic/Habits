"use client";

import type { ActivityPost } from "@/types/activity";
import { seedActivityPosts } from "@/data/mockActivityData";
import { AchievementPost } from "./AchievementPost";
import { CheckInPost } from "./CheckInPost";
import { SquadMessagePost } from "./SquadMessagePost";
import { MilestonePost } from "./MilestonePost";
import { MoneyWonPost } from "./MoneyWonPost";

export function ActivityFeed() {
  const posts: ActivityPost[] = seedActivityPosts;

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        switch (post.type) {
          case "achievement":
            return <AchievementPost key={post.id} post={post} />;
          case "checkin":
            return <CheckInPost key={post.id} post={post} />;
          case "message":
            return <SquadMessagePost key={post.id} post={post} />;
          case "milestone":
            return <MilestonePost key={post.id} post={post} />;
          case "money":
            return <MoneyWonPost key={post.id} post={post} />;
          default:
            return null;
        }
      })}
    </div>
  );
}


