'use server';

import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export async function createStakeEscrow(
  stakeId: string,
  challengeId: string,
  amountCents: number,
) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const stripe = getStripe();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountCents,
    currency: "eur",
    metadata: {
      challenge_id: challengeId,
      user_id: user.id,
      type: "stake_escrow",
    },
    capture_method: "manual",
  });

  const { data: escrow, error } = await supabase
    .from("stake_escrows")
    .insert({
      stake_id: stakeId,
      user_id: user.id,
      amount_cents: amountCents,
      stripe_payment_intent_id: paymentIntent.id,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return { clientSecret: paymentIntent.client_secret, escrowId: escrow.id };
}

type Escrow = {
  id: string;
  user_id: string;
  amount_cents: number;
  stripe_payment_intent_id: string;
};

type Participant = {
  user_id: string;
  completed_days: number;
  stripe_account_id?: string;
};

export async function distributeStakePayout(challengeId: string) {
  const supabase = await createClient();
  const stripe = getStripe();

  const { data: challenge, error } = await supabase
    .from("challenges")
    .select("*, participants:challenge_participants(*), stake:stakes(*)")
    .eq("id", challengeId)
    .single();

  if (error || !challenge) {
    throw error ?? new Error("Challenge not found");
  }

  if (!challenge.stake) {
    throw new Error("No stake configured for this challenge.");
  }

  const winners =
    (challenge.participants as Participant[]).filter(
      (participant) => participant.completed_days >= challenge.target_completions,
    ) ?? [];

  if (winners.length === 0) {
    return handleAllLosersScenario(challengeId);
  }

  const { data: escrows, error: escrowError } = await supabase
    .from("stake_escrows")
    .select("*")
    .eq("stake_id", challenge.stake.id)
    .eq("status", "held");

  if (escrowError || !escrows) {
    throw escrowError ?? new Error("No escrows found");
  }

  const escrowsTyped = escrows as Escrow[];

  const totalPot = escrowsTyped.reduce((sum, escrow) => sum + escrow.amount_cents, 0);
  const platformFee = Math.floor(
    totalPot * ((challenge.stake.platform_fee_percent ?? 7.5) / 100),
  );
  const payoutPool = totalPot - platformFee;
  const perWinnerPayout = Math.floor(payoutPool / winners.length);

  for (const winner of winners) {
    const escrow = escrowsTyped.find((entry) => entry.user_id === winner.user_id);

    if (!escrow) continue;

    await stripe.paymentIntents.capture(escrow.stripe_payment_intent_id);

    if (winner.stripe_account_id) {
      await stripe.transfers.create({
        amount: perWinnerPayout,
        currency: "eur",
        destination: winner.stripe_account_id,
        metadata: { challenge_id: challengeId, winner_id: winner.user_id },
      });
    }

    await supabase
      .from("stake_escrows")
      .update({
        status: "released",
        payout_amount_cents: perWinnerPayout,
        released_at: new Date().toISOString(),
      })
      .eq("id", escrow.id);
  }

  await supabase.from("platform_revenue").insert({
    challenge_id: challengeId,
    amount_cents: platformFee,
    type: "stake_fee",
  });

  return {
    success: true,
    winners: winners.length,
    totalPayout: payoutPool,
  };
}

async function handleAllLosersScenario(challengeId: string) {
  // TODO: Implement refunds minus platform fees.
  return { success: true, winners: 0, totalPayout: 0, challengeId };
}

