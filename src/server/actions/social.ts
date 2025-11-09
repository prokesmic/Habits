'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { commentSchema, reactionSchema } from "@/lib/validators";
import { getResendClient } from "@/lib/email/resend";

export async function addReaction(logId: string, reactionType: string) {
  reactionSchema.parse({ log_id: logId, reaction_type: reactionType });

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("reactions")
    .insert({ user_id: user.id, log_id: logId, reaction_type: reactionType });

  if (error) {
    throw error;
  }

  revalidatePath("/dashboard");
}

export async function postComment(payload: unknown) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const validated = commentSchema.parse(payload);

  const { error } = await supabase
    .from("comments")
    .insert({ ...validated, user_id: user.id });

  if (error) {
    throw error;
  }

  revalidatePath("/dashboard");
}

export async function inviteBuddy(email: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("referrals")
    .insert({
      referrer_id: user.id,
      referred_email: email,
      referral_code: generateReferralCode(),
    });

  if (error) {
    throw error;
  }

  const resend = getResendClient();
  const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${user.id}`;

  await resend.emails.send({
    from: "Habit Tracker <hello@habitapp.com>",
    to: email,
    subject: `${user.email} invited you to build habits together`,
    html: `<p>Join your friend on Habit Tracker and stay accountable.</p><p><a href="${inviteLink}">Accept invite</a></p>`,
  });

  return { success: true };
}

export async function createSquad(name: string, description: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const inviteCode = generateInviteCode();

  const { data: squad, error } = await supabase
    .from("squads")
    .insert({
      name,
      description,
      owner_id: user.id,
      invite_code: inviteCode,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  await supabase.from("squad_members").insert({
    squad_id: squad.id,
    user_id: user.id,
    role: "owner",
  });

  return squad;
}

function generateReferralCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function generateInviteCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

