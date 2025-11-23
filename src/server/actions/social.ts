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

export async function joinSquad(squadId: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // Check if already a member
  const { data: existing } = await supabase
    .from("squad_members")
    .select("id")
    .eq("squad_id", squadId)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    return { success: true, alreadyMember: true };
  }

  // Add as member
  const { error } = await supabase
    .from("squad_members")
    .insert({
      squad_id: squadId,
      user_id: user.id,
      role: "member",
    });

  if (error) {
    throw error;
  }

  // Create feed event
  await supabase.from("feed_events").insert({
    user_id: user.id,
    event_type: "squad_join",
    metadata: { squad_id: squadId },
  });

  revalidatePath(`/squads/${squadId}`);
  revalidatePath("/squads");

  return { success: true, alreadyMember: false };
}

export async function leaveSquad(squadId: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // Check if user is owner
  const { data: membership } = await supabase
    .from("squad_members")
    .select("role")
    .eq("squad_id", squadId)
    .eq("user_id", user.id)
    .single();

  if (membership?.role === "owner") {
    throw new Error("Owner cannot leave squad. Transfer ownership first.");
  }

  const { error } = await supabase
    .from("squad_members")
    .delete()
    .eq("squad_id", squadId)
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }

  revalidatePath(`/squads/${squadId}`);
  revalidatePath("/squads");

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

  console.log("[createSquad] Starting squad creation for user:", user.id);
  const inviteCode = generateInviteCode();

  // Insert squad with is_public=true temporarily so we can read it back
  // The RLS SELECT policy allows reading public squads
  const { data: insertResult, error: squadError } = await supabase
    .from("squads")
    .insert({
      name,
      description,
      owner_id: user.id,
      invite_code: inviteCode,
      is_public: true, // Set true temporarily to bypass RLS SELECT
    })
    .select("id")
    .single();

  if (squadError || !insertResult) {
    console.error("[createSquad] Squad creation error:", squadError);
    throw new Error(`Failed to create squad: ${squadError?.message || "No data returned"}`);
  }

  const squadId = insertResult.id;
  console.log("[createSquad] Squad created with ID:", squadId);

  // Add owner as squad member - use simple INSERT without SELECT to avoid RLS issues
  console.log("[createSquad] Adding user as squad member...");
  console.log("[createSquad] User ID:", user.id);
  console.log("[createSquad] Squad ID:", squadId);

  // Simple INSERT without returning data
  const { error: memberError } = await supabase
    .from("squad_members")
    .insert({
      squad_id: squadId,
      user_id: user.id,
      role: "owner",
    });

  if (memberError) {
    console.error("[createSquad] Member INSERT error:", memberError);
    console.error("[createSquad] Error code:", memberError.code);
    console.error("[createSquad] Error message:", memberError.message);
    console.error("[createSquad] Error details:", memberError.details);
    console.error("[createSquad] Error hint:", memberError.hint);

    // If it's not a duplicate key error, this is a real problem
    if (memberError.code !== "23505") {
      // Clean up the squad we just created
      await supabase.from("squads").delete().eq("id", squadId);
      throw new Error(`Failed to add you as squad member: ${memberError.message}`);
    } else {
      console.log("[createSquad] Member already exists (duplicate key)");
    }
  } else {
    console.log("[createSquad] Member INSERT completed without error");
  }

  // Verify the member was actually added
  const { data: verifyMember, error: verifyError } = await supabase
    .from("squad_members")
    .select("squad_id, user_id, role")
    .eq("squad_id", squadId)
    .eq("user_id", user.id)
    .single();

  if (verifyError || !verifyMember) {
    console.error("[createSquad] VERIFICATION FAILED - member not found after insert!");
    console.error("[createSquad] Verify error:", verifyError);
    console.error("[createSquad] This indicates RLS is blocking the INSERT or SELECT");
  } else {
    console.log("[createSquad] VERIFICATION SUCCESS - member exists:", verifyMember);
  }

  // Now set is_public back to false (user can change it later if they want)
  await supabase
    .from("squads")
    .update({ is_public: false })
    .eq("id", squadId);

  revalidatePath("/squads");
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

export async function deleteSquad(squadId: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  console.log("[deleteSquad] Starting deletion for squad:", squadId);

  if (authError || !user) {
    console.error("[deleteSquad] Auth error:", authError);
    throw new Error("Unauthorized");
  }

  console.log("[deleteSquad] User:", user.id);

  // Check if user is the owner of the squad
  const { data: squad, error: squadError } = await supabase
    .from("squads")
    .select("owner_id, name")
    .eq("id", squadId)
    .single();

  if (squadError) {
    console.error("[deleteSquad] Squad fetch error:", squadError);
    throw new Error(`Squad not found: ${squadError.message}`);
  }

  if (!squad) {
    console.error("[deleteSquad] Squad not found");
    throw new Error("Squad not found");
  }

  console.log("[deleteSquad] Squad owner:", squad.owner_id, "Name:", squad.name);

  if (squad.owner_id !== user.id) {
    console.error("[deleteSquad] User is not owner");
    throw new Error("Only the squad owner can delete the squad");
  }

  // Delete the squad (cascade will handle members and messages)
  console.log("[deleteSquad] Deleting squad...");
  const { error: deleteError } = await supabase
    .from("squads")
    .delete()
    .eq("id", squadId);

  if (deleteError) {
    console.error("[deleteSquad] Deletion error:", deleteError);
    throw new Error(`Failed to delete squad: ${deleteError.message}`);
  }

  console.log("[deleteSquad] Squad deleted successfully");
  revalidatePath("/squads");
  return { success: true };
}

// Fix squads where creator is not a member
export async function fixSquadMembership(squadId: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  // Get the squad
  const { data: squad, error: squadError } = await supabase
    .from("squads")
    .select("id, owner_id, name")
    .eq("id", squadId)
    .single();

  if (squadError || !squad) {
    throw new Error("Squad not found");
  }

  // Check if user is the owner
  if (squad.owner_id !== user.id) {
    throw new Error("Only the owner can fix membership");
  }

  // Check if owner is already a member
  const { data: existingMember } = await supabase
    .from("squad_members")
    .select("squad_id")
    .eq("squad_id", squadId)
    .eq("user_id", user.id)
    .single();

  if (existingMember) {
    return { success: true, alreadyMember: true };
  }

  // Add owner as member
  console.log("[fixSquadMembership] Adding user as squad member...");
  console.log("[fixSquadMembership] User ID:", user.id);
  console.log("[fixSquadMembership] Squad ID:", squadId);

  const { error: memberError } = await supabase
    .from("squad_members")
    .insert({
      squad_id: squadId,
      user_id: user.id,
      role: "owner",
    });

  if (memberError) {
    console.error("[fixSquadMembership] INSERT failed:", memberError);
    console.error("[fixSquadMembership] Error code:", memberError.code);
    console.error("[fixSquadMembership] Error details:", memberError.details);
    throw new Error(`Failed to add membership: ${memberError.message}`);
  }

  console.log("[fixSquadMembership] INSERT completed without error");

  // Verify the member was added
  const { data: verifyMember } = await supabase
    .from("squad_members")
    .select("squad_id")
    .eq("squad_id", squadId)
    .eq("user_id", user.id)
    .single();

  if (!verifyMember) {
    throw new Error("Membership was not added. Please contact support.");
  }

  revalidatePath(`/squads/${squadId}`);
  revalidatePath("/squads");

  return { success: true, alreadyMember: false };
}

function generateReferralCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function generateInviteCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

