export type SquadCategory = "fitness" | "productivity" | "health" | "learning" | "social";

export interface Squad {
  id: string;
  name: string;
  emoji: string;
  coverColor: string; // gradient colors as CSS classes
  memberCount: number;
  checkInRate: number; // percentage
  entryStake: number;
  totalPool: number;
  topHabits: string[];
  category: SquadCategory;
  featured: boolean;
  description?: string;
  memberAvatars?: string[]; // initials for avatars
}

export const allSquads: Squad[] = [
  // Fitness squads
  {
    id: "1",
    name: "5AM Club",
    emoji: "💪",
    coverColor: "from-orange-400 to-red-500",
    memberCount: 1247,
    checkInRate: 89,
    entryStake: 25,
    totalPool: 15000,
    topHabits: ["Morning routine", "Gym", "Meditation"],
    category: "fitness",
    featured: true,
    description: "Rise early, win big. Join the elite morning movers.",
    memberAvatars: ["SM", "JD", "AB", "CW", "KL"],
  },
  {
    id: "2",
    name: "Gym Rats",
    emoji: "🏋️",
    coverColor: "from-blue-400 to-purple-500",
    memberCount: 892,
    checkInRate: 85,
    entryStake: 30,
    totalPool: 22000,
    topHabits: ["Gym", "Cardio", "Stretching"],
    category: "fitness",
    featured: true,
    description: "Lift together, win together. Serious gains only.",
    memberAvatars: ["MR", "TS", "JP", "LM", "NK"],
  },
  {
    id: "3",
    name: "Morning Runners",
    emoji: "🏃‍♂️",
    coverColor: "from-green-400 to-teal-500",
    memberCount: 456,
    checkInRate: 82,
    entryStake: 15,
    totalPool: 8500,
    topHabits: ["Running", "Stretching", "Hydration"],
    category: "fitness",
    featured: false,
    description: "Start your day with miles and milestones.",
    memberAvatars: ["RH", "SA", "DG", "MF", "PC"],
  },
  // Productivity squads
  {
    id: "4",
    name: "Coders",
    emoji: "💻",
    coverColor: "from-indigo-400 to-blue-600",
    memberCount: 1876,
    checkInRate: 91,
    entryStake: 20,
    totalPool: 28000,
    topHabits: ["Coding", "Learning", "Code review"],
    category: "productivity",
    featured: true,
    description: "Commit code daily, commit to winning.",
    memberAvatars: ["DC", "AS", "RK", "MT", "JS"],
  },
  {
    id: "5",
    name: "Parents",
    emoji: "👨‍👩‍👧‍👦",
    coverColor: "from-pink-400 to-rose-500",
    memberCount: 634,
    checkInRate: 78,
    entryStake: 10,
    totalPool: 6500,
    topHabits: ["Exercise", "Reading", "Meal prep"],
    category: "productivity",
    featured: true,
    description: "Balancing life, habits, and winning.",
    memberAvatars: ["JW", "HD", "BR", "CK", "SL"],
  },
  {
    id: "6",
    name: "Students",
    emoji: "🎓",
    coverColor: "from-yellow-400 to-orange-500",
    memberCount: 2341,
    checkInRate: 88,
    entryStake: 5,
    totalPool: 12000,
    topHabits: ["Study", "Exercise", "Meditation"],
    category: "productivity",
    featured: true,
    description: "Study hard, win hard. Academic excellence.",
    memberAvatars: ["EM", "JT", "LC", "AW", "NH"],
  },
  // Health squads
  {
    id: "7",
    name: "Meditation Masters",
    emoji: "🧘",
    coverColor: "from-purple-400 to-indigo-600",
    memberCount: 523,
    checkInRate: 94,
    entryStake: 25,
    totalPool: 11000,
    topHabits: ["Meditation", "Breathing exercises", "Gratitude"],
    category: "health",
    featured: true,
    description: "Find your zen, find your winnings.",
    memberAvatars: ["YM", "ZP", "QH", "VI", "OK"],
  },
  {
    id: "8",
    name: "Healthy Eaters",
    emoji: "🍎",
    coverColor: "from-emerald-400 to-green-600",
    memberCount: 1654,
    checkInRate: 92,
    entryStake: 20,
    totalPool: 25000,
    topHabits: ["Meal prep", "Hydration", "Cooking"],
    category: "health",
    featured: true,
    description: "Eat better, feel better, win better.",
    memberAvatars: ["NM", "BH", "FT", "GL", "PM"],
  },
  {
    id: "9",
    name: "No Sugar Challenge",
    emoji: "🚫",
    coverColor: "from-red-400 to-pink-500",
    memberCount: 342,
    checkInRate: 76,
    entryStake: 50,
    totalPool: 18000,
    topHabits: ["No sugar", "Cooking", "Meal prep"],
    category: "health",
    featured: false,
    description: "Cut sugar, win rewards. High stakes, high rewards.",
    memberAvatars: ["RC", "LS", "TW", "JD", "KM"],
  },
  // Learning squads
  {
    id: "10",
    name: "Book Worms",
    emoji: "📚",
    coverColor: "from-amber-400 to-yellow-600",
    memberCount: 1087,
    checkInRate: 95,
    entryStake: 10,
    totalPool: 9500,
    topHabits: ["Reading", "Note-taking", "Review"],
    category: "learning",
    featured: true,
    description: "Read more, earn more. Track your pages and profits.",
    memberAvatars: ["LB", "MC", "RS", "DP", "FW"],
  },
  {
    id: "11",
    name: "Language Learners",
    emoji: "🌍",
    coverColor: "from-cyan-400 to-blue-500",
    memberCount: 743,
    checkInRate: 87,
    entryStake: 15,
    totalPool: 11000,
    topHabits: ["Practice", "Vocabulary", "Conversation"],
    category: "learning",
    featured: false,
    description: "Master languages, master yourself.",
    memberAvatars: ["XL", "YT", "UW", "VZ", "SK"],
  },
  // Social squads
  {
    id: "12",
    name: "Accountability Partners",
    emoji: "🤝",
    coverColor: "from-violet-400 to-purple-600",
    memberCount: 412,
    checkInRate: 83,
    entryStake: 40,
    totalPool: 16000,
    topHabits: ["Habit tracking", "Check-ins", "Reflection"],
    category: "social",
    featured: false,
    description: "Built for accountability. Built for winning.",
    memberAvatars: ["TA", "GB", "FH", "CI", "DN"],
  },
];

// Helper function to get quick join squads (first 6 featured ones)
export function getQuickJoinSquads(): Squad[] {
  return allSquads.filter((s) => s.featured).slice(0, 6);
}

// Helper function to get featured squads
export function getFeaturedSquads(): Squad[] {
  return allSquads.filter((s) => s.featured);
}

// Helper function to get squads by category
export function getSquadsByCategory(category: SquadCategory): Squad[] {
  return allSquads.filter((s) => s.category === category);
}

// Helper function to match squads to user habits
export function matchSquadsToHabits(userHabits: string[]): Squad[] {
  const habitLower = userHabits.map((h) => h.toLowerCase());
  return allSquads
    .map((squad) => {
      const matchCount = squad.topHabits.filter((habit) =>
        habitLower.some((uh) => uh.includes(habit.toLowerCase()) || habit.toLowerCase().includes(uh))
      ).length;
      return { squad, matchCount };
    })
    .filter(({ matchCount }) => matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, 6)
    .map(({ squad }) => squad);
}

