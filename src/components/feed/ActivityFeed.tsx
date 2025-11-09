"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type FeedEvent = {
  id: string;
  event_type: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

type ActivityFeedProps = {
  userId?: string;
};

export function ActivityFeed({ userId }: ActivityFeedProps) {
  const [events, setEvents] = useState<FeedEvent[]>([]);

  useEffect(() => {
    const supabase = createClient();

    const subscription = supabase
      .channel("feed-events")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "feed_events" },
        (payload) => {
          setEvents((current) => [payload.new as FeedEvent, ...current].slice(0, 50));
        },
      )
      .subscribe();

    async function loadInitial() {
      const { data } = await supabase
        .from("feed_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (data) {
        setEvents(data as FeedEvent[]);
      }
    }

    void loadInitial();

    return () => {
      void supabase.removeChannel(subscription);
    };
  }, [userId]);

  if (!events.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
        Your feed is quiet... Invite your squad!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">
            {formatEventTitle(event.event_type)}
          </p>
          <p className="text-xs text-slate-500">{new Date(event.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

function formatEventTitle(type: string) {
  switch (type) {
    case "check_in":
      return "Logged a habit";
    case "streak_milestone":
      return "Hit a streak milestone";
    case "challenge_join":
      return "Joined a challenge";
    default:
      return "Activity update";
  }
}

