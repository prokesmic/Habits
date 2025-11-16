"use client";

import { useEffect, useRef, useState } from "react";
import { SquadChatClient } from "@/lib/chat/client";
import { formatDistanceToNow } from "date-fns";

type ChatMessage = {
  id: string;
  user: { name: string; avatar: string };
  type: "text" | "checkin" | "achievement" | "system";
  content: string;
  timestamp: Date;
  reactions: { emoji: string; users: string[] }[];
};

export function SquadChat({ squadId }: { squadId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const clientRef = useRef<SquadChatClient | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoading(true);
    // Load initial messages (mock)
    setMessages([]);
    setIsLoading(false);

    clientRef.current = new SquadChatClient(squadId);
    clientRef.current.connect();
    clientRef.current.onMessage((m: any) => {
      setMessages((prev) => [...prev, { ...m, timestamp: new Date(m.timestamp) }]);
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    });
    clientRef.current.onTyping((ind: any) => {
      setTyping((prev) => {
        const set = new Set(prev);
        set.add(ind.userName);
        setTimeout(() => {
          setTyping((prev2) => prev2.filter((n) => n !== ind.userName));
        }, 3000);
        return Array.from(set);
      });
    });
    return () => clientRef.current?.disconnect();
  }, [squadId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    clientRef.current?.sendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <h2 className="font-bold">Squad Chat</h2>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {isLoading ? (
          <div>Loading messages...</div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="flex gap-3">
              <img src={m.user.avatar} alt={m.user.name} className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold">{m.user.name}</span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(m.timestamp, { addSuffix: true })}
                  </span>
                </div>
                <div className="mt-1">
                  {m.type === "text" && <p className="text-gray-800">{m.content}</p>}
                  {m.type === "checkin" && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-3">✅ {m.content}</div>
                  )}
                  {m.type === "achievement" && (
                    <div className="rounded-lg border border-purple-200 bg-purple-50 p-3">🎉 {m.content}</div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {typing.length > 0 && (
          <div className="text-sm text-gray-500">{typing.join(", ")} {typing.length === 1 ? "is" : "are"} typing...</div>
        )}
        <div ref={endRef} />
      </div>
      <form onSubmit={handleSend} className="border-t p-4">
        <div className="flex gap-2">
          <input
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              clientRef.current?.sendTyping();
            }}
            placeholder="Type message..."
            className="flex-1 rounded-lg border px-4 py-2"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}


