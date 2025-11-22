import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

type RouteContext = { params: Promise<{ token: string }> };

// POST /api/squads/invitations/[token]/accept - Accept an invitation
export async function POST(request: NextRequest, context: RouteContext) {
  const { token } = await context.params;
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch invitation
  const { data: invitation, error: invitationError } = await supabase
    .from("squad_invitations")
    .select("id, squad_id, status, expires_at")
    .eq("token", token)
    .single();

  if (invitationError || !invitation) {
    return NextResponse.json({ error: "Invalid invitation" }, { status: 404 });
  }

  // Check if expired
  if (new Date(invitation.expires_at) < new Date()) {
    // Update status to expired
    await supabase
      .from("squad_invitations")
      .update({ status: "expired" })
      .eq("id", invitation.id);

    return NextResponse.json({ error: "Invitation has expired" }, { status: 410 });
  }

  // Check if already accepted
  if (invitation.status === "accepted") {
    return NextResponse.json({ error: "Invitation already accepted" }, { status: 400 });
  }

  // Check if already a member
  const { data: existingMembership } = await supabase
    .from("squad_members")
    .select("id")
    .eq("squad_id", invitation.squad_id)
    .eq("user_id", user.id)
    .single();

  if (existingMembership) {
    // Update invitation status anyway
    await supabase
      .from("squad_invitations")
      .update({ status: "accepted", accepted_at: new Date().toISOString() })
      .eq("id", invitation.id);

    return NextResponse.json({
      success: true,
      message: "Already a member of this squad",
      squad_id: invitation.squad_id,
    });
  }

  // Add user to squad
  const { error: memberError } = await supabase.from("squad_members").insert({
    squad_id: invitation.squad_id,
    user_id: user.id,
    role: "member",
  });

  if (memberError) {
    console.error("Error adding member:", memberError);
    return NextResponse.json({ error: "Failed to join squad" }, { status: 500 });
  }

  // Update invitation status
  const { error: updateError } = await supabase
    .from("squad_invitations")
    .update({ status: "accepted", accepted_at: new Date().toISOString() })
    .eq("id", invitation.id);

  if (updateError) {
    console.error("Error updating invitation:", updateError);
    // Don't fail - user is already added to squad
  }

  // Update squad member count (optional - depends on your schema)
  try {
    await supabase.rpc("increment_squad_member_count", { squad_id: invitation.squad_id });
  } catch {
    // Ignore if function doesn't exist
  }

  revalidatePath(`/squads/${invitation.squad_id}`);
  revalidatePath("/squads");

  return NextResponse.json({
    success: true,
    message: "Successfully joined squad",
    squad_id: invitation.squad_id,
  });
}
