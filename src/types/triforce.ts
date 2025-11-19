/**
 * Triforce Domain Model
 *
 * The "triforce" represents the three core concepts in Habitio:
 * - Squad (social group)
 * - Challenge (time-bound commitment)
 * - Stake (optional money attached to a challenge)
 *
 * These are separate concepts with clear relationships:
 * - A Squad is a social group of users around shared habits
 * - A Challenge is a time-bound goal, optionally tied to a Squad
 * - A Stake is financial commitment attached to a specific Challenge
 */

// =============================================================================
// SQUAD - Social group of users
// =============================================================================

export interface Squad {
  id: string;
  name: string;
  emoji: string;
  description?: string;
  coverColor?: string;
  avatarUrl?: string;
  ownerId: string;
  inviteCode: string;
  isPublic: boolean;
  memberCount: number;
  topHabits: string[];
  category?: SquadCategory;
  checkInRate: number; // percentage of daily check-ins
  createdAt: Date;
}

export type SquadCategory =
  | "fitness"
  | "mindfulness"
  | "productivity"
  | "learning"
  | "health"
  | "creative"
  | "social"
  | "other";

export interface SquadMember {
  squadId: string;
  oderId: string;
  role: "owner" | "admin" | "member";
  joinedAt: Date;
  user?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

// =============================================================================
// CHALLENGE - Time-bound commitment
// =============================================================================

export interface Challenge {
  id: string;
  name: string;
  description?: string;
  emoji?: string;

  // Creator and association
  creatorId: string;
  squadId?: string; // Optional - challenge may be tied to a squad
  habitType?: string; // The type of habit this challenge is for

  // Time bounds
  durationDays: number;
  startDate: Date;
  endDate: Date;

  // Goals
  targetCompletions: number; // e.g., 80% of days
  completionThreshold: number; // percentage needed to "win" (0-100)

  // Participation
  format: ChallengeFormat;
  visibility: ChallengeVisibility;
  participantCount: number;
  maxParticipants?: number;

  // Status
  status: ChallengeStatus;
  featured: boolean;

  // Stake reference (if money is involved)
  stake?: Stake;

  createdAt: Date;
  updatedAt: Date;
}

export type ChallengeFormat = "solo" | "1v1" | "group" | "public";
export type ChallengeVisibility = "private" | "link" | "public";
export type ChallengeStatus = "draft" | "active" | "completed" | "cancelled";

export interface ChallengeParticipant {
  id: string;
  challengeId: string;
  userId: string;
  joinedAt: Date;
  completedDays: number;
  totalDays: number;
  score: number;
  rank?: number;
  hasStaked: boolean; // Whether this participant has put in their stake
  user?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

// =============================================================================
// STAKE - Financial commitment attached to a challenge
// =============================================================================

export interface Stake {
  id: string;
  challengeId: string;

  // Money
  amountCents: number;
  currency: string;
  totalPoolCents: number; // Sum of all participant stakes

  // Payout rules
  stakeType: StakeType;
  platformFeePercent: number;

  createdAt: Date;
}

export type StakeType = "winner_takes_all" | "split_winners" | "charity";

export interface StakeEscrow {
  id: string;
  stakeId: string;
  userId: string;
  amountCents: number;
  currency: string;
  stripePaymentIntentId?: string;
  status: EscrowStatus;
  payoutAmountCents?: number;
  createdAt: Date;
  releasedAt?: Date;
}

export type EscrowStatus = "pending" | "held" | "released" | "refunded" | "failed";

// =============================================================================
// TRIFORCE HELPERS - For UI components
// =============================================================================

/**
 * Props for the TriforceBadges component
 * Represents the combination of squad/challenge/stake for display
 */
export interface TriforceInfo {
  // Squad info
  hasSquad: boolean;
  squadName?: string;
  memberCount?: number;

  // Challenge info
  hasChallenge: boolean;
  challengeDays?: number;
  participantCount?: number;

  // Stake info
  hasStake: boolean;
  stakeAmount?: number; // in dollars
  totalPool?: number; // in dollars
  currency?: string;
}

/**
 * Helper to create TriforceInfo from domain objects
 */
export function createTriforceInfo(params: {
  squad?: Squad | null;
  challenge?: Challenge | null;
  stake?: Stake | null;
}): TriforceInfo {
  const { squad, challenge, stake } = params;

  return {
    // Squad
    hasSquad: !!squad,
    squadName: squad?.name,
    memberCount: squad?.memberCount,

    // Challenge
    hasChallenge: !!challenge,
    challengeDays: challenge?.durationDays,
    participantCount: challenge?.participantCount,

    // Stake
    hasStake: !!stake,
    stakeAmount: stake ? stake.amountCents / 100 : undefined,
    totalPool: stake ? stake.totalPoolCents / 100 : undefined,
    currency: stake?.currency || "USD",
  };
}

/**
 * Helper to format stake amount for display
 */
export function formatStakeAmount(amountCents: number, currency: string = "USD"): string {
  const amount = amountCents / 100;
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
}

/**
 * Helper to get triforce summary text
 */
export function getTriforceLabel(info: TriforceInfo): string {
  const parts: string[] = [];

  if (info.hasSquad) {
    parts.push(`Squad${info.memberCount ? ` (${info.memberCount})` : ""}`);
  }

  if (info.hasChallenge && info.challengeDays) {
    parts.push(`${info.challengeDays} days`);
  }

  if (info.hasStake && info.stakeAmount) {
    parts.push(`$${info.stakeAmount} stake`);
  }

  if (parts.length === 0) {
    return "No commitment";
  }

  return parts.join(" · ");
}
