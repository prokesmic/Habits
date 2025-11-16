import type { ActivityPost } from "@/types/activity";

function hoursAgo(h: number): Date {
  const d = new Date();
  d.setHours(d.getHours() - h);
  return d;
}

function avatar(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
}

export const seedActivityPosts: ActivityPost[] = [
  // 6 achievements
  { id: "a1", type: "achievement", user: { name: "Sarah Johnson", avatar: avatar("Sarah Johnson") }, timestamp: hoursAgo(2), content: { habit: "Meditation", message: "Completed 30-Day Meditation" , amount: 125 }, reactions: { like: 15, fire: 8, celebrate: 12 }, comments: 3 },
  { id: "a2", type: "achievement", user: { name: "Mike Chen", avatar: avatar("Mike Chen") }, timestamp: hoursAgo(5), content: { habit: "Gym", message: "Completed 14-Day Strength Sprint", amount: 60 }, reactions: { like: 10, fire: 5, celebrate: 9 }, comments: 2 },
  { id: "a3", type: "achievement", user: { name: "Anna Lee", avatar: avatar("Anna Lee") }, timestamp: hoursAgo(9), content: { habit: "Reading", message: "Finished 1 book this week", amount: 20 }, reactions: { like: 8, fire: 3, celebrate: 6 }, comments: 1 },
  { id: "a4", type: "achievement", user: { name: "David Kim", avatar: avatar("David Kim") }, timestamp: hoursAgo(14), content: { habit: "Hydration", message: "30-Day Hydration complete", amount: 45 }, reactions: { like: 12, fire: 4, celebrate: 7 }, comments: 2 },
  { id: "a5", type: "achievement", user: { name: "Lisa Park", avatar: avatar("Lisa Park") }, timestamp: hoursAgo(22), content: { habit: "No Sugar", message: "21-Day No Sugar", amount: 80 }, reactions: { like: 18, fire: 9, celebrate: 10 }, comments: 4 },
  { id: "a6", type: "achievement", user: { name: "Tom Baker", avatar: avatar("Tom Baker") }, timestamp: hoursAgo(30), content: { habit: "Yoga", message: "10 sessions finished", amount: 15 }, reactions: { like: 6, fire: 2, celebrate: 3 }, comments: 1 },
  // 5 check-ins
  { id: "c1", type: "checkin", user: { name: "John Smith", avatar: avatar("John Smith") }, timestamp: hoursAgo(5), content: { habit: "Morning Gym", message: "Crushed leg day today 💪", streak: 14 }, reactions: { like: 8, fire: 5, celebrate: 0 }, comments: 2 },
  { id: "c2", type: "checkin", user: { name: "Emma Davis", avatar: avatar("Emma Davis") }, timestamp: hoursAgo(3), content: { habit: "Meditation", message: "Just sat for 20 mins", streak: 9 }, reactions: { like: 5, fire: 3, celebrate: 0 }, comments: 1 },
  { id: "c3", type: "checkin", user: { name: "Alex Brown", avatar: avatar("Alex Brown") }, timestamp: hoursAgo(11), content: { habit: "Reading", message: "50 pages done", streak: 7 }, reactions: { like: 4, fire: 2, celebrate: 0 }, comments: 0 },
  { id: "c4", type: "checkin", user: { name: "Nina Patel", avatar: avatar("Nina Patel") }, timestamp: hoursAgo(16), content: { habit: "Yoga", message: "Morning flow", streak: 12 }, reactions: { like: 6, fire: 2, celebrate: 0 }, comments: 1 },
  { id: "c5", type: "checkin", user: { name: "Carlos Ruiz", avatar: avatar("Carlos Ruiz") }, timestamp: hoursAgo(8), content: { habit: "Coding", message: "Shipped PR #432", streak: 21 }, reactions: { like: 9, fire: 6, celebrate: 0 }, comments: 3 },
  // 4 messages
  { id: "m1", type: "message", user: { name: "Emma Davis", avatar: avatar("Emma Davis") }, timestamp: hoursAgo(24), content: { message: "Who's hitting the gym today?" }, reactions: { like: 0, fire: 0, celebrate: 0 }, comments: 5, squad: "Running Squad" },
  { id: "m2", type: "message", user: { name: "John Smith", avatar: avatar("John Smith") }, timestamp: hoursAgo(26), content: { message: "Evening meditation stream?" }, reactions: { like: 2, fire: 0, celebrate: 1 }, comments: 2, squad: "Meditation Masters" },
  { id: "m3", type: "message", user: { name: "Sarah Johnson", avatar: avatar("Sarah Johnson") }, timestamp: hoursAgo(40), content: { message: "Anyone tried cold showers?" }, reactions: { like: 3, fire: 1, celebrate: 0 }, comments: 4, squad: "5AM Club" },
  { id: "m4", type: "message", user: { name: "Mike Chen", avatar: avatar("Mike Chen") }, timestamp: hoursAgo(60), content: { message: "Share your favorite productivity tip" }, reactions: { like: 1, fire: 0, celebrate: 0 }, comments: 1, squad: "Coders" },
  // 3 milestones
  { id: "ms1", type: "milestone", user: { name: "Mike Chen", avatar: avatar("Mike Chen") }, timestamp: hoursAgo(72), content: { habit: "Morning Meditation", message: "Hit 100-day streak!", streak: 100 }, reactions: { like: 47, fire: 23, celebrate: 0 }, comments: 12 },
  { id: "ms2", type: "milestone", user: { name: "Alex Brown", avatar: avatar("Alex Brown") }, timestamp: hoursAgo(84), content: { habit: "Reading", message: "50-day reading streak", streak: 50 }, reactions: { like: 22, fire: 10, celebrate: 0 }, comments: 6 },
  { id: "ms3", type: "milestone", user: { name: "Emma Davis", avatar: avatar("Emma Davis") }, timestamp: hoursAgo(90), content: { habit: "Hydration", message: "30 days consistent", streak: 30 }, reactions: { like: 18, fire: 9, celebrate: 0 }, comments: 5 },
  // 2 money won
  { id: "mo1", type: "money", user: { name: "Lisa Park", avatar: avatar("Lisa Park") }, timestamp: hoursAgo(168), content: { amount: 250, challenge: "30-Day No Sugar Challenge" }, reactions: { like: 34, fire: 0, celebrate: 18 }, comments: 7 },
  { id: "mo2", type: "money", user: { name: "Tom Baker", avatar: avatar("Tom Baker") }, timestamp: hoursAgo(200), content: { amount: 135, challenge: "Read Daily" }, reactions: { like: 12, fire: 0, celebrate: 6 }, comments: 2 },
];


