export type ChallengeType = "1v1" | "squad" | "public";

export interface Challenge {
  id: string;
  type: ChallengeType;
  title: string;
  habit: string;
  duration: number; // days
  stake: number;
  currentParticipants: number;
  maxParticipants: number;
  totalPool: number;
  startsAt: Date;
  payoutStructure: string;
  featured: boolean;
  emoji?: string;
  description?: string;
}

function getFutureDate(hoursFromNow: number): Date {
  const now = new Date();
  return new Date(now.getTime() + hoursFromNow * 60 * 60 * 1000);
}

function getPastDate(hoursAgo: number): Date {
  const now = new Date();
  return new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
}

export const activeChallenges: Challenge[] = [
  // Ending Soon
  {
    id: "1",
    type: "public",
    title: "30-Day Meditation",
    habit: "Meditation",
    duration: 30,
    stake: 25,
    currentParticipants: 47,
    maxParticipants: 50,
    totalPool: 1175,
    startsAt: getFutureDate(4.4), // 4h 23m from now
    payoutStructure: "Top 10 split the pot",
    featured: true,
    emoji: "🧘",
    description: "Daily meditation challenge for inner peace and focus",
  },
  {
    id: "2",
    type: "squad",
    title: "7-Day Gym Streak",
    habit: "Gym",
    duration: 7,
    stake: 15,
    currentParticipants: 12,
    maxParticipants: 20,
    totalPool: 180,
    startsAt: getFutureDate(2.5),
    payoutStructure: "Top 3 split 70/20/10",
    featured: false,
    emoji: "💪",
    description: "Hit the gym every day for a week",
  },
  {
    id: "3",
    type: "1v1",
    title: "100 Push-ups Daily",
    habit: "Push-ups",
    duration: 21,
    stake: 50,
    currentParticipants: 1,
    maxParticipants: 2,
    totalPool: 50,
    startsAt: getFutureDate(6),
    payoutStructure: "Winner takes all",
    featured: false,
    emoji: "🏋️",
    description: "One-on-one push-up challenge",
  },
  // Starting Soon
  {
    id: "4",
    type: "public",
    title: "Read 1 Book/Week",
    habit: "Reading",
    duration: 30,
    stake: 20,
    currentParticipants: 28,
    maxParticipants: 100,
    totalPool: 560,
    startsAt: getFutureDate(12),
    payoutStructure: "Top 5 share equally",
    featured: true,
    emoji: "📚",
    description: "Read one book per week for a month",
  },
  {
    id: "5",
    type: "squad",
    title: "5AM Wake-ups x14",
    habit: "Morning routine",
    duration: 14,
    stake: 30,
    currentParticipants: 8,
    maxParticipants: 15,
    totalPool: 240,
    startsAt: getFutureDate(18),
    payoutStructure: "Top 40% split evenly",
    featured: false,
    emoji: "🌅",
    description: "Early bird challenge",
  },
  {
    id: "6",
    type: "public",
    title: "30-Day No Alcohol",
    habit: "No alcohol",
    duration: 30,
    stake: 50,
    currentParticipants: 62,
    maxParticipants: 100,
    totalPool: 3100,
    startsAt: getFutureDate(24),
    payoutStructure: "All finishers split 80%, top 10% get bonus",
    featured: true,
    emoji: "🚫",
    description: "Sober October challenge",
  },
  // More challenges
  {
    id: "7",
    type: "1v1",
    title: "Run 5K Daily",
    habit: "Running",
    duration: 7,
    stake: 25,
    currentParticipants: 1,
    maxParticipants: 2,
    totalPool: 25,
    startsAt: getFutureDate(36),
    payoutStructure: "Winner takes all",
    featured: false,
    emoji: "🏃",
    description: "Daily 5K running challenge",
  },
  {
    id: "8",
    type: "squad",
    title: "10K Steps Daily",
    habit: "Walking",
    duration: 30,
    stake: 10,
    currentParticipants: 18,
    maxParticipants: 25,
    totalPool: 180,
    startsAt: getFutureDate(48),
    payoutStructure: "Top 5 share the pool",
    featured: false,
    emoji: "🚶",
    description: "Hit 10,000 steps every day",
  },
  {
    id: "9",
    type: "public",
    title: "Coding Daily",
    habit: "Coding",
    duration: 21,
    stake: 15,
    currentParticipants: 89,
    maxParticipants: 150,
    totalPool: 1335,
    startsAt: getFutureDate(60),
    payoutStructure: "Top 20 split 70%, rest share 30%",
    featured: true,
    emoji: "💻",
    description: "Code every day for 21 days",
  },
  {
    id: "10",
    type: "squad",
    title: "Meal Prep Weekly",
    habit: "Meal prep",
    duration: 14,
    stake: 20,
    currentParticipants: 6,
    maxParticipants: 12,
    totalPool: 120,
    startsAt: getFutureDate(72),
    payoutStructure: "All finishers split equally",
    featured: false,
    emoji: "🍱",
    description: "Weekly meal prep challenge",
  },
  {
    id: "11",
    type: "public",
    title: "100-Day Hydration",
    habit: "Hydration",
    duration: 100,
    stake: 40,
    currentParticipants: 34,
    maxParticipants: 200,
    totalPool: 1360,
    startsAt: getFutureDate(96),
    payoutStructure: "Top 50 split the pool",
    featured: false,
    emoji: "💧",
    description: "Drink 8 glasses of water daily for 100 days",
  },
  {
    id: "12",
    type: "1v1",
    title: "No Social Media",
    habit: "No social media",
    duration: 14,
    stake: 75,
    currentParticipants: 1,
    maxParticipants: 2,
    totalPool: 75,
    startsAt: getFutureDate(120),
    payoutStructure: "Winner takes all",
    featured: false,
    emoji: "📵",
    description: "Two-week social media detox",
  },
  {
    id: "13",
    type: "public",
    title: "Journal Daily",
    habit: "Journaling",
    duration: 30,
    stake: 10,
    currentParticipants: 156,
    maxParticipants: 300,
    totalPool: 1560,
    startsAt: getFutureDate(144),
    payoutStructure: "Top 30% share equally",
    featured: true,
    emoji: "📔",
    description: "Write in your journal every day",
  },
  {
    id: "14",
    type: "squad",
    title: "Yoga Every Day",
    habit: "Yoga",
    duration: 21,
    stake: 25,
    currentParticipants: 9,
    maxParticipants: 15,
    totalPool: 225,
    startsAt: getFutureDate(168),
    payoutStructure: "Top 3 get 50/30/20 split",
    featured: false,
    emoji: "🧘‍♀️",
    description: "Daily yoga practice challenge",
  },
  {
    id: "15",
    type: "public",
    title: "Learn a Language",
    habit: "Language learning",
    duration: 60,
    stake: 30,
    currentParticipants: 72,
    maxParticipants: 200,
    totalPool: 2160,
    startsAt: getFutureDate(192),
    payoutStructure: "Top 25% split 60%, rest share 40%",
    featured: true,
    emoji: "🌍",
    description: "Practice a new language daily for 60 days",
  },
];

export const challengeTemplates = [
  { title: "7-Day Gym Streak", stake: 10, habit: "Gym", duration: 7, emoji: "💪" },
  { title: "30-Day No Alcohol", stake: 50, habit: "No alcohol", duration: 30, emoji: "🚫" },
  { title: "Read 1 Book/Week", stake: 25, habit: "Reading", duration: 30, emoji: "📚" },
  { title: "5AM Wake-ups x14", stake: 20, habit: "Morning routine", duration: 14, emoji: "🌅" },
  { title: "100 Push-ups Daily", stake: 15, habit: "Push-ups", duration: 21, emoji: "🏋️" },
];

// Helper functions
export function getChallengesByType(type: ChallengeType | "all"): Challenge[] {
  if (type === "all") return activeChallenges;
  return activeChallenges.filter((c) => c.type === type);
}

export function getFeaturedChallenges(): Challenge[] {
  return activeChallenges.filter((c) => c.featured);
}

export function getEndingSoonChallenges(): Challenge[] {
  const now = new Date();
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return activeChallenges.filter(
    (c) => c.startsAt <= in24Hours && c.startsAt > now
  );
}

export function getHighStakesChallenges(): Challenge[] {
  return activeChallenges.filter((c) => c.stake >= 50).sort((a, b) => b.stake - a.stake);
}

