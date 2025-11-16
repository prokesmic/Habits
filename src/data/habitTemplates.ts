import type { HabitTemplate } from "@/types/template";

export const habitTemplates: HabitTemplate[] = [
  // Health (10)
  { id: "t1", name: "Gym Workout", emoji: "💪", category: "health", defaultFrequency: "daily", defaultTarget: 5, suggestedStake: 15, description: "Build strength and fitness.", popularity: 95 },
  { id: "t2", name: "Morning Run", emoji: "🏃", category: "health", defaultFrequency: "daily", defaultTarget: 4, suggestedStake: 10, description: "Start the day with a run.", popularity: 88 },
  { id: "t3", name: "10k Steps", emoji: "🚶", category: "health", defaultFrequency: "daily", defaultTarget: 7, suggestedStake: 10, description: "Walk at least 10,000 steps.", popularity: 86 },
  { id: "t4", name: "Drink Water", emoji: "💧", category: "health", defaultFrequency: "daily", defaultTarget: 7, suggestedStake: 5, description: "Hydrate throughout the day.", popularity: 92 },
  { id: "t5", name: "Sleep 8hrs", emoji: "😴", category: "health", defaultFrequency: "daily", defaultTarget: 7, suggestedStake: 20, description: "Prioritize restful sleep.", popularity: 80 },
  { id: "t6", name: "Healthy Eating", emoji: "🍎", category: "health", defaultFrequency: "daily", defaultTarget: 6, suggestedStake: 15, description: "Nutritious meals.", popularity: 84 },
  { id: "t7", name: "Yoga", emoji: "🧘", category: "health", defaultFrequency: "daily", defaultTarget: 3, suggestedStake: 10, description: "Stretch, breathe, and balance.", popularity: 78 },
  { id: "t8", name: "Stretch", emoji: "🤸", category: "health", defaultFrequency: "daily", defaultTarget: 5, suggestedStake: 5, description: "Maintain flexibility.", popularity: 74 },
  { id: "t9", name: "Cycling", emoji: "🚴", category: "health", defaultFrequency: "daily", defaultTarget: 3, suggestedStake: 10, description: "Ride for endurance.", popularity: 68 },
  { id: "t10", name: "Strength Training", emoji: "🏋️", category: "health", defaultFrequency: "daily", defaultTarget: 3, suggestedStake: 15, description: "Lift to get stronger.", popularity: 82 },
  // Mind (8)
  { id: "t11", name: "Meditation", emoji: "🧘", category: "mind", defaultFrequency: "daily", defaultTarget: 7, suggestedStake: 15, description: "Daily mindfulness practice.", popularity: 96 },
  { id: "t12", name: "Reading", emoji: "📚", category: "mind", defaultFrequency: "daily", defaultTarget: 5, suggestedStake: 10, description: "Read and learn.", popularity: 93 },
  { id: "t13", name: "Journaling", emoji: "✍️", category: "mind", defaultFrequency: "daily", defaultTarget: 5, suggestedStake: 10, description: "Reflect and write.", popularity: 85 },
  { id: "t14", name: "Gratitude", emoji: "🙏", category: "mind", defaultFrequency: "daily", defaultTarget: 7, suggestedStake: 5, description: "List what you're grateful for.", popularity: 75 },
  { id: "t15", name: "Learning", emoji: "📖", category: "mind", defaultFrequency: "daily", defaultTarget: 4, suggestedStake: 10, description: "Daily learning time.", popularity: 77 },
  { id: "t16", name: "Mindfulness", emoji: "🧠", category: "mind", defaultFrequency: "daily", defaultTarget: 5, suggestedStake: 10, description: "Stay present.", popularity: 70 },
  { id: "t17", name: "Creative Time", emoji: "🎨", category: "mind", defaultFrequency: "daily", defaultTarget: 3, suggestedStake: 10, description: "Make something daily.", popularity: 66 },
  { id: "t18", name: "Writing", emoji: "📝", category: "mind", defaultFrequency: "daily", defaultTarget: 4, suggestedStake: 10, description: "Write consistently.", popularity: 72 },
  // Work (6)
  { id: "t19", name: "Code Daily", emoji: "💻", category: "work", defaultFrequency: "daily", defaultTarget: 5, suggestedStake: 15, description: "Push code or learn daily.", popularity: 90 },
  { id: "t20", name: "Writing", emoji: "✍️", category: "work", defaultFrequency: "daily", defaultTarget: 5, suggestedStake: 10, description: "Content, docs, or notes.", popularity: 71 },
  { id: "t21", name: "Deep Work", emoji: "🎯", category: "work", defaultFrequency: "daily", defaultTarget: 5, suggestedStake: 20, description: "Focus blocks.", popularity: 83 },
  { id: "t22", name: "Inbox Zero", emoji: "📧", category: "work", defaultFrequency: "daily", defaultTarget: 5, suggestedStake: 10, description: "Clear your inbox.", popularity: 64 },
  { id: "t23", name: "Planning", emoji: "🗓️", category: "work", defaultFrequency: "daily", defaultTarget: 5, suggestedStake: 5, description: "Daily plan review.", popularity: 69 },
  { id: "t24", name: "Learning", emoji: "📚", category: "work", defaultFrequency: "daily", defaultTarget: 4, suggestedStake: 15, description: "Upskill regularly.", popularity: 76 },
  // Social (3)
  { id: "t25", name: "Call Friend", emoji: "📞", category: "social", defaultFrequency: "weekly", defaultTarget: 2, suggestedStake: 10, description: "Reach out to someone.", popularity: 65 },
  { id: "t26", name: "Family Time", emoji: "👨‍👩‍👧", category: "social", defaultFrequency: "daily", defaultTarget: 5, suggestedStake: 15, description: "Be present with family.", popularity: 79 },
  { id: "t27", name: "Networking", emoji: "🤝", category: "social", defaultFrequency: "weekly", defaultTarget: 2, suggestedStake: 10, description: "Connect professionally.", popularity: 58 },
  // Habits (3)
  { id: "t28", name: "Morning Routine", emoji: "🌅", category: "habits", defaultFrequency: "daily", defaultTarget: 7, suggestedStake: 15, description: "Start well every day.", popularity: 91 },
  { id: "t29", name: "Evening Routine", emoji: "🌙", category: "habits", defaultFrequency: "daily", defaultTarget: 7, suggestedStake: 15, description: "Wind down properly.", popularity: 74 },
  { id: "t30", name: "Bed by 11pm", emoji: "🛏️", category: "habits", defaultFrequency: "daily", defaultTarget: 7, suggestedStake: 10, description: "Sleep on time.", popularity: 73 },
];


