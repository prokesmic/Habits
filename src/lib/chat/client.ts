"use client";

// TODO: Install socket.io-client package when real-time chat is needed
// import { io, Socket } from "socket.io-client";

// Placeholder types for socket.io
interface Socket {
  on(event: string, callback: (...args: unknown[]) => void): void;
  emit(event: string, data?: unknown): void;
  disconnect(): void;
}

export class SquadChatClient {
  private socket: Socket | null = null;
  private squadId: string;

  constructor(squadId: string) {
    this.squadId = squadId;
  }

  connect() {
    const url = process.env.NEXT_PUBLIC_WS_URL;
    if (!url) {
      console.warn("WS URL not configured; chat disabled.");
      return;
    }
    // Placeholder: Would use socket.io-client here
    console.warn("[Chat] Socket.io-client not installed. Chat disabled.");
  }

  joinSquad() {
    this.socket?.emit("join_squad", { squadId: this.squadId });
  }

  sendMessage(content: string) {
    this.socket?.emit("send_message", { squadId: this.squadId, content, timestamp: new Date() });
  }

  sendTyping() {
    this.socket?.emit("typing", { squadId: this.squadId });
  }

  addReaction(messageId: string, emoji: string) {
    this.socket?.emit("add_reaction", { messageId, emoji });
  }

  onMessage(callback: (message: unknown) => void) {
    this.socket?.on("new_message", callback);
  }

  onTyping(callback: (indicator: unknown) => void) {
    this.socket?.on("user_typing", callback);
  }

  disconnect() {
    this.socket?.disconnect();
  }
}


