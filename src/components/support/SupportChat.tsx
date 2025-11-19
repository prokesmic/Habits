"use client";

import { useEffect, useState } from "react";

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const load = async () => {
      const res = await fetch("/api/support/chat/messages");
      setMessages(await res.json());
    };
    void load();
  }, [isOpen]);

  const send = async () => {
    if (!newMessage.trim()) return;
    await fetch("/api/support/chat/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: newMessage }) });
    setNewMessage("");
    const res = await fetch("/api/support/chat/messages");
    setMessages(await res.json());
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-[140px] right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-xl text-white shadow-lg md:bottom-6 md:h-16 md:w-16 md:text-2xl"
        aria-label="Support chat"
      >
        {isOpen ? "✕" : "💬"}
      </button>
      {isOpen && (
        <div className="fixed bottom-[200px] right-4 z-[55] flex h-[400px] w-[calc(100%-2rem)] max-w-sm flex-col rounded-xl bg-white shadow-2xl md:bottom-24 md:right-6 md:h-[500px] md:w-96">
          <div className="rounded-t-xl bg-violet-600 p-4 text-white">
            <h3 className="font-semibold">Support Chat</h3>
            <p className="text-violet-100">We typically reply in under 5 minutes</p>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-lg px-4 py-2 ${m.from === "user" ? "bg-violet-600 text-white" : "bg-gray-100"}`}>{m.content}</div>
              </div>
            ))}
          </div>
          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void send()}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border px-4 py-2"
              />
              <button onClick={() => void send()} className="rounded-lg bg-violet-600 px-4 py-2 text-white">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


