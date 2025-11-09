import { z } from "zod";

export const habitSchema = z.object({
  title: z.string().min(1, "Habit name required").max(100),
  emoji: z.string().optional(),
  description: z.string().max(500).optional(),
  frequency: z.enum(["daily", "weekdays", "custom"]),
  target_days_per_week: z.number().min(1).max(7),
  reminder_time: z.string().optional(),
  buddy_user_id: z.string().uuid().optional(),
  squad_id: z.string().uuid().optional(),
  is_public: z.boolean().default(true),
});

export const logSchema = z.object({
  habit_id: z.string().uuid(),
  log_date: z.string(),
  status: z.enum(["done", "missed", "skipped"]),
  note: z.string().max(500).optional(),
  photo_url: z.string().url().optional(),
});

export const challengeSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  challenge_format: z.enum(["solo", "1v1", "group", "public"]),
  opponent_id: z.string().uuid().optional(),
  duration_days: z.number().min(1).max(365),
  target_completions: z.number().min(1),
  habit_type: z.string().optional(),
  start_date: z.string(),
  visibility: z.enum(["private", "link", "public"]),
});

export const stakeSchema = z.object({
  challenge_id: z.string().uuid(),
  amount_cents: z.number().min(100).max(10000),
  currency: z.string().default("EUR"),
  stake_type: z.enum(["winner_takes_all", "split_winners", "charity"]),
});

export const reactionSchema = z.object({
  log_id: z.string().uuid(),
  reaction_type: z.enum(["fire", "clap", "muscle", "heart", "rocket"]),
});

export const commentSchema = z.object({
  log_id: z.string().uuid(),
  text: z.string().min(1).max(500),
});

