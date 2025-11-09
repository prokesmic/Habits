import posthog from "posthog-js";

let analyticsEnabled = false;

function shouldInitAnalytics(key: string | undefined) {
  if (!key) {
    return false;
  }

  // Skip initialization when using obvious placeholder values such as "phc_xxx"
  return !key.toLowerCase().includes("xxx");
}

export function initAnalytics() {
  if (typeof window === "undefined") {
    return;
  }

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

  if (!shouldInitAnalytics(key)) {
    return;
  }

  try {
    posthog.init(key!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com",
      capture_pageview: false,
      loaded(client) {
        analyticsEnabled = true;

        if (process.env.NODE_ENV === "development") {
          client.debug();
        }
      },
    });
  } catch (error) {
    analyticsEnabled = false;

    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn("[analytics] Failed to initialize PostHog:", error);
    }
  }
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (typeof window !== "undefined" && analyticsEnabled) {
    posthog.capture(event, properties);
  }
}

export const events = {
  signup: "user_signed_up",
  signin: "user_signed_in",
  onboardingStarted: "onboarding_started",
  onboardingCompleted: "onboarding_completed",
  firstHabitCreated: "first_habit_created",
  firstInviteSent: "first_invite_sent",
  habitCreated: "habit_created",
  habitDeleted: "habit_deleted",
  checkIn: "check_in_completed",
  streakMilestone: "streak_milestone",
  reactionGiven: "reaction_given",
  commentPosted: "comment_posted",
  buddyInvited: "buddy_invited",
  buddyAccepted: "buddy_accepted",
  squadJoined: "squad_joined",
  squadCreated: "squad_created",
  challengeCreated: "challenge_created",
  challengeJoined: "challenge_joined",
  challengeCompleted: "challenge_completed",
  challengeInviteSent: "challenge_invite_sent",
  stakeCreated: "stake_created",
  stakePaymentCompleted: "stake_payment_completed",
  stakeWon: "stake_won",
  stakeLost: "stake_lost",
  platformFeeEarned: "platform_fee_earned",
  referralLinkShared: "referral_link_shared",
  referralSignup: "referral_signup",
  referralRewardGranted: "referral_reward_granted",
  premiumUpgradeStarted: "premium_upgrade_started",
  premiumSubscribed: "premium_subscribed",
  premiumCancelled: "premium_cancelled",
  progressShared: "progress_shared",
  challengeShared: "challenge_shared",
  appOpened: "app_opened",
  weeklyRecapViewed: "weekly_recap_viewed",
} as const;
