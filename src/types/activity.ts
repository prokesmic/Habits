export type ActivityPostType = "achievement" | "checkin" | "message" | "milestone" | "money";

export interface ActivityPost {
  id: string;
  type: ActivityPostType;
  user: {
    name: string;
    avatar: string; // URL
  };
  timestamp: Date;
  content: {
    habit?: string;
    message?: string;
    streak?: number;
    amount?: number;
    challenge?: string;
  };
  reactions: {
    like: number;
    fire: number;
    celebrate: number;
  };
  comments: number;
  squad?: string;
}


