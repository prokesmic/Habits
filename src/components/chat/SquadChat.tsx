"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import { Send, MessageCircle, AlertCircle, Loader2 } from "lucide-react";

type ChatMessage = {
  id: string;
  user: { id: string; name: string; avatar: string | null };
  type: "text" | "checkin" | "achievement" | "system";
  content: string;
  timestamp: string;
};

export function SquadChat({ squadId }: { squadId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const lastTimestampRef = useRef<string | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch messages from API
  const fetchMessages = useCallback(async (after?: string) => {
    try {
      const url = after
        ? `/api/squads/${squadId}/messages?after=${encodeURIComponent(after)}`
        : `/api/squads/${squadId}/messages`;

      const res = await fetch(url);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to fetch messages");
      }

      const data = await res.json();
      return data.messages || [];
    } catch (err) {
      console.error("Error fetching messages:", err);
      throw err;
    }
  }, [squadId]);

  // Initial load
  useEffect(() => {
    let mounted = true;

    const loadInitialMessages = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const msgs = await fetchMessages();
        if (mounted) {
          setMessages(msgs);
          if (msgs.length > 0) {
            lastTimestampRef.current = msgs[msgs.length - 1].timestamp;
          }
          setIsLoading(false);
          // Scroll to bottom after loading
          setTimeout(() => endRef.current?.scrollIntoView({ behavior: "auto" }), 100);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load messages");
          setIsLoading(false);
        }
      }
    };

    loadInitialMessages();

    // Set up polling for new messages (every 3 seconds)
    pollIntervalRef.current = setInterval(async () => {
      if (!mounted || !lastTimestampRef.current) return;

      try {
        const newMsgs = await fetchMessages(lastTimestampRef.current);
        if (mounted && newMsgs.length > 0) {
          setMessages((prev) => [...prev, ...newMsgs]);
          lastTimestampRef.current = newMsgs[newMsgs.length - 1].timestamp;
          endRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      } catch {
        // Silent fail for polling
      }
    }, 3000);

    return () => {
      mounted = false;
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [fetchMessages]);

  // Send message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    const content = newMessage.trim();
    setNewMessage("");
    setIsSending(true);
    setError(null);

    try {
      const res = await fetch(`/api/squads/${squadId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send message");
      }

      const data = await res.json();
      setMessages((prev) => [...prev, data.message]);
      lastTimestampRef.current = data.message.timestamp;
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      setNewMessage(content); // Restore message on error
    } finally {
      setIsSending(false);
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-indigo-600" />
          <h2 className="font-semibold text-slate-900">Squad Chat</h2>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto bg-white p-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <p className="text-sm">Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                <MessageCircle className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900">No messages yet</p>
                <p className="mt-1 text-sm text-slate-500">
                  Be the first to say hello to your squad!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => (
              <div key={m.id} className="flex gap-3">
                {/* Avatar */}
                {m.user.avatar ? (
                  <img
                    src={m.user.avatar}
                    alt={m.user.name}
                    className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white">
                    {getInitials(m.user.name)}
                  </div>
                )}

                {/* Message content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-slate-900">{m.user.name}</span>
                    <span className="text-xs text-slate-500">
                      {formatDistanceToNow(new Date(m.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="mt-1">
                    {m.type === "text" && (
                      <p className="text-slate-800 break-words">{m.content}</p>
                    )}
                    {m.type === "checkin" && (
                      <div className="inline-block rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-green-800">
                        <span className="mr-1">✅</span> {m.content}
                      </div>
                    )}
                    {m.type === "achievement" && (
                      <div className="inline-block rounded-lg border border-purple-200 bg-purple-50 px-3 py-2 text-purple-800">
                        <span className="mr-1">🎉</span> {m.content}
                      </div>
                    )}
                    {m.type === "system" && (
                      <div className="inline-block rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-600 text-sm italic">
                        {m.content}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="border-t border-red-200 bg-red-50 px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Message input */}
      <form onSubmit={handleSend} className="border-t border-slate-200 bg-slate-50 p-4">
        <div className="flex gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            maxLength={1000}
            disabled={isSending}
            className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </form>
    </div>
  );
}
