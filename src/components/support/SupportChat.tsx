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
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-violet-600 text-2xl text-white shadow-lg"
        aria-label="Support chat"
      >
        {isOpen ? "✕" : "💬"}
      </button>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[500px] w-96 flex-col rounded-xl bg-white shadow-2xl">
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


