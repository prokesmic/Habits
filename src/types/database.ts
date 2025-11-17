// Database types for Supabase schema

export type ProofType = "simple" | "photo" | "note" | "integration";
export type VerificationStatus = "pending" | "approved" | "disputed";

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  log_date: string;
  status: "done" | "missed" | "skipped";
  note?: string;
  photo_url?: string;
  streak_count: number;
  proof_type: ProofType;
  proof_metadata?: Record<string, unknown>;
  requires_verification: boolean;
  verified_by: string[];
  disputed_by: string[];
  verification_status?: VerificationStatus;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  emoji: string;
  description?: string;
  frequency: "daily" | "weekdays" | "custom";
  target_days_per_week: number;
  reminder_time?: string;
  buddy_user_id?: string;
  squad_id?: string;
  is_public: boolean;
  archived: boolean;
  requires_proof: boolean;
  allowed_proof_types: ProofType[];
  has_stake: boolean;
  stake_amount?: number;
  stake_participants: string[];
  current_streak: number;
  longest_streak: number;
  created_at: string;
  updated_at: string;
}

export interface CheckInProof {
  type: ProofType;
  photoUrl?: string;
  note?: string;
  integrationData?: unknown;
  metadata?: {
    timestamp?: string;
    location?: {
      latitude: number;
      longitude: number;
    };
    deviceInfo?: string;
  };
}

export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  premium_tier: "free" | "premium" | "lifetime";
  premium_expires_at?: string;
  stripe_customer_id?: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Squad {
  id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  owner_id: string;
  invite_code: string;
  is_public: boolean;
  member_count: number;
  created_at: string;
}

export interface SquadMember {
  squad_id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  joined_at: string;
}
