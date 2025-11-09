'use server';

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { challengeSchema } from "@/lib/validators";

export async function createChallenge(payload: unknown) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const validated = challengeSchema.parse(payload);
  const endDate = new Date(validated.start_date);
  endDate.setDate(endDate.getDate() + validated.duration_days);

  const { data: challenge, error } = await supabase
    .from("challenges")
    .insert({
      ...validated,
      creator_id: user.id,
      end_date: endDate.toISOString().split("T")[0],
      status: "active",
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  await supabase.from("challenge_participants").insert({
    challenge_id: challenge.id,
    user_id: user.id,
  });

  if (validated.challenge_format === "1v1" && validated.opponent_id) {
    await sendChallengeInvite(challenge.id, validated.opponent_id);
  }

  revalidatePath(`/challenges/${challenge.id}`);

  return challenge;
}

export async function joinChallenge(challengeId: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("challenge_participants")
    .insert({ challenge_id: challengeId, user_id: user.id });

  if (error) {
    throw error;
  }

  await supabase.from("feed_events").insert({
    user_id: user.id,
    event_type: "challenge_join",
    challenge_id: challengeId,
  });

  revalidatePath(`/challenges/${challengeId}`);
}

async function sendChallengeInvite(challengeId: string, opponentId: string) {
  const supabase = await createClient();

  await supabase.from("feed_events").insert({
    user_id: opponentId,
    event_type: "challenge_invite",
    challenge_id: challengeId,
  });
}
