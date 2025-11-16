export interface User {
  id: string;
  name: string;
  avatar: string;
  lastActive: Date;
}

export interface Challenge {
  id: string;
  type: "1v1" | "squad" | "public";
  habit: string;
  habitId: string;
  initiator: {
    id: string;
    name: string;
    avatar: string;
  };
  opponent: {
    id: string;
    name: string;
    avatar: string;
  };
  duration: number; // days
  stake: number; // dollars
  message?: string;
  status: "pending" | "accepted" | "declined" | "active" | "completed" | "expired";
  sentAt: Date;
  expiresAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  winner?: string; // user id
}


