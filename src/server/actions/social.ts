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

  // Try to insert referral, but don't fail if table doesn't exist yet
  const { error: referralError } = await supabase
    .from("referrals")
    .insert({
      referrer_id: user.id,
      referred_email: email,
      referral_code: generateReferralCode(),
    });

  // Only log referral error, don't throw - allows onboarding to continue
  if (referralError && referralError.code !== "42P01") { // 42P01 = table doesn't exist
    console.error("Referral insert error:", referralError);
  }

  // Try to send email, but don't fail if Resend is not configured
  try {
    if (process.env.RESEND_API_KEY) {
      const resend = getResendClient();
      const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/invite/${user.id}`;
      await resend.emails.send({
        from: "Habitio <hello@habitapp.com>",
        to: email,
        subject: `${user.email} invited you to build habits together`,
        html: `<p>Join your friend on Habitio and stay accountable.</p><p><a href="${inviteLink}">Accept invite</a></p>`,
      });
    }
  } catch (emailError) {
    console.error("Email send error:", emailError);
    // Don't throw - allow onboarding to complete even if email fails
  }

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

  // Insert squad - don't use .select() here as it might fail due to RLS before member is added
  const { data: insertResult, error: squadError } = await supabase
    .from("squads")
    .insert({
      name,
      description,
      owner_id: user.id,
      invite_code: inviteCode,
    })
    .select("id")
    .single();

  if (squadError || !insertResult) {
    console.error("Squad creation error:", squadError);
    throw new Error(`Failed to create squad: ${squadError?.message || "No data returned"}`);
  }

  const squadId = insertResult.id;

  // Add owner as squad member first
  const { error: memberError } = await supabase
    .from("squad_members")
    .insert({
      squad_id: squadId,
      user_id: user.id,
      role: "owner",
    });

  if (memberError) {
    console.error("Squad member creation error:", memberError);
    // Even if member insert fails, we should still be able to fetch the squad as owner
  }

  // Now fetch the full squad data - should work now that member is added or as owner
  const { data: squad, error: fetchError } = await supabase
    .from("squads")
    .select("*")
    .eq("id", squadId)
    .single();

  if (fetchError || !squad) {
    console.error("Squad fetch error after creation:", fetchError);
    // Return minimal data if we can't fetch full squad
    return {
      id: squadId,
      name,
      description,
      owner_id: user.id,
      invite_code: inviteCode,
      is_public: false,
      member_count: 1,
      created_at: new Date().toISOString(),
    };
  }

  return squad;
}

function generateReferralCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function generateInviteCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

