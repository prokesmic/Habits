"use client";

import { io, Socket } from "socket.io-client";

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
    this.socket = io(url, {
      auth: { token: "" , squadId: this.squadId },
    });
    this.socket.on("connect", () => {
      this.joinSquad();
    });
    this.socket.on("disconnect", () => {});
    this.socket.on("error", (error) => {
      console.error("Socket error:", error);
      setTimeout(() => this.connect(), 3000);
    });
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

  onMessage(callback: (message: any) => void) {
    this.socket?.on("new_message", callback);
  }

  onTyping(callback: (indicator: any) => void) {
    this.socket?.on("user_typing", callback);
  }

  disconnect() {
    this.socket?.disconnect();
  }
}


