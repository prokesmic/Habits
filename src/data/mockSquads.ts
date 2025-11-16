export type FeaturedSquad = {
  id: string;
  name: string;
  emoji: string;
  memberCount: number;
  successRate: number;
  entryStake: number;
  topHabits: string[];
  description?: string;
};

export const featuredSquads: FeaturedSquad[] = [
  {
    id: "1",
    name: "5AM Club",
    emoji: "💪",
    memberCount: 147,
    successRate: 92,
    entryStake: 20,
    topHabits: ["Morning routine", "Gym"],
    description: "Rise early, win big. Join the elite morning movers.",
  },
  {
    id: "2",
    name: "Morning Runners",
    emoji: "🏃‍♂️",
    memberCount: 89,
    successRate: 88,
    entryStake: 15,
    topHabits: ["Running", "Stretching"],
    description: "Start your day with miles and milestones.",
  },
  {
    id: "3",
    name: "Book Worms",
    emoji: "📚",
    memberCount: 234,
    successRate: 95,
    entryStake: 10,
    topHabits: ["Reading", "Note-taking"],
    description: "Read more, earn more. Track your pages and profits.",
  },
  {
    id: "4",
    name: "Meditation Masters",
    emoji: "🧘",
    memberCount: 176,
    successRate: 91,
    entryStake: 25,
    topHabits: ["Meditation", "Breathing exercises"],
    description: "Find your zen, find your winnings.",
  },
  {
    id: "5",
    name: "Coding Everyday",
    emoji: "💻",
    memberCount: 98,
    successRate: 87,
    entryStake: 15,
    topHabits: ["Coding", "Learning"],
    description: "Commit code daily, commit to winning.",
  },
  {
    id: "6",
    name: "Healthy Eaters",
    emoji: "🍎",
    memberCount: 312,
    successRate: 94,
    entryStake: 20,
    topHabits: ["Meal prep", "Hydration"],
    description: "Eat better, feel better, win better.",
  },
];

