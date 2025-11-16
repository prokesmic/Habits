export type ActivityFeedItem = {
  id: string;
  type: "completion" | "check_in" | "milestone" | "squad_activity";
  user: {
    name: string;
    username: string;
    avatar?: string;
  };
  content: string;
  squad?: {
    name: string;
    emoji?: string;
  };
  metadata?: {
    amount?: number;
    streak?: number;
    habit?: string;
  };
  timestamp: Date;
  reactions: number;
  comments?: number;
};

export function getRandomTimeAgo(hoursAgo: number): Date {
  const now = new Date();
  return new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
}

export const mockActivityFeed: ActivityFeedItem[] = [
  // Completions/wins (40% - 4 items)
  {
    id: "1",
    type: "completion",
    user: {
      name: "Sarah",
      username: "sarah_m",
      avatar: undefined,
    },
    content: "completed 30-day meditation challenge",
    metadata: {
      amount: 125,
      habit: "meditation",
    },
    timestamp: getRandomTimeAgo(2),
    reactions: 15,
    comments: 3,
  },
  {
    id: "2",
    type: "completion",
    user: {
      name: "Mike",
      username: "mike_fit",
      avatar: undefined,
    },
    content: "finished 60-day fitness challenge",
    metadata: {
      amount: 200,
      habit: "gym",
    },
    timestamp: getRandomTimeAgo(6),
    reactions: 23,
    comments: 5,
  },
  {
    id: "3",
    type: "completion",
    user: {
      name: "Alex",
      username: "alex_reader",
      avatar: undefined,
    },
    content: "earned $150 from daily reading habit",
    metadata: {
      amount: 150,
      habit: "reading",
    },
    timestamp: getRandomTimeAgo(12),
    reactions: 18,
    comments: 2,
  },
  {
    id: "4",
    type: "completion",
    user: {
      name: "Lisa",
      username: "lisa_runs",
      avatar: undefined,
    },
    content: "won $85 from 45-day running streak",
    metadata: {
      amount: 85,
      habit: "running",
    },
    timestamp: getRandomTimeAgo(18),
    reactions: 12,
    comments: 1,
  },
  // Check-ins with comments (30% - 3 items)
  {
    id: "5",
    type: "check_in",
    user: {
      name: "John",
      username: "john_d",
      avatar: undefined,
    },
    content: "Who's hitting gym today?",
    squad: {
      name: "Running Squad",
      emoji: "🏃‍♂️",
    },
    timestamp: getRandomTimeAgo(5),
    reactions: 8,
    comments: 3,
  },
  {
    id: "6",
    type: "check_in",
    user: {
      name: "Maria",
      username: "maria_yoga",
      avatar: undefined,
    },
    content: "Just finished my morning meditation. Feeling great! 🧘",
    squad: {
      name: "Meditation Masters",
      emoji: "🧘",
    },
    timestamp: getRandomTimeAgo(8),
    reactions: 11,
    comments: 4,
  },
  {
    id: "7",
    type: "check_in",
    user: {
      name: "David",
      username: "david_codes",
      avatar: undefined,
    },
    content: "Day 23 of coding daily. Building something awesome!",
    squad: {
      name: "Coding Everyday",
      emoji: "💻",
    },
    timestamp: getRandomTimeAgo(10),
    reactions: 9,
    comments: 2,
  },
  // Milestones (20% - 2 items)
  {
    id: "8",
    type: "milestone",
    user: {
      name: "Emma",
      username: "emma_h",
      avatar: undefined,
    },
    content: "hit her 100-day streak!",
    metadata: {
      streak: 100,
      habit: "hydration",
    },
    timestamp: getRandomTimeAgo(24),
    reactions: 47,
    comments: 12,
  },
  {
    id: "9",
    type: "milestone",
    user: {
      name: "Tom",
      username: "tom_b",
      avatar: undefined,
    },
    content: "reached 50-day reading streak",
    metadata: {
      streak: 50,
      habit: "reading",
    },
    timestamp: getRandomTimeAgo(36),
    reactions: 28,
    comments: 7,
  },
  // Squad activity (10% - 1 item)
  {
    id: "10",
    type: "squad_activity",
    user: {
      name: "5AM Club",
      username: "5am_club",
      avatar: undefined,
    },
    content: "92% of members checked in today! Keep it up 💪",
    squad: {
      name: "5AM Club",
      emoji: "💪",
    },
    timestamp: getRandomTimeAgo(1),
    reactions: 56,
    comments: 8,
  },
];

