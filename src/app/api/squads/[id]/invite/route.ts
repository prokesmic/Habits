import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import SquadInvitationEmail from "@/emails/squad-invitation";
import { randomBytes } from "crypto";

type RouteContext = { params: Promise<{ id: string }> };

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

// POST /api/squads/[id]/invite - Send email invitations
export async function POST(request: NextRequest, context: RouteContext) {
  const { id: squadId } = await context.params;
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is a member of the squad
  const { data: memberships } = await supabase
    .from("squad_members")
    .select("role")
    .eq("squad_id", squadId)
    .eq("user_id", user.id)
    .limit(1);

  if (!memberships || memberships.length === 0) {
    return NextResponse.json({ error: "Not a squad member" }, { status: 403 });
  }

  // Get squad details
  const { data: squad, error: squadError } = await supabase
    .from("squads")
    .select("name, description")
    .eq("id", squadId)
    .single();

  if (squadError || !squad) {
    return NextResponse.json({ error: "Squad not found" }, { status: 404 });
  }

  // Get inviter's profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  const inviterName = profile?.username || user.email?.split("@")[0] || "Someone";

  // Parse request body
  const body = await request.json();
  const { emails, personalMessage } = body;

  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return NextResponse.json({ error: "At least one email is required" }, { status: 400 });
  }

  if (emails.length > 10) {
    return NextResponse.json({ error: "Maximum 10 invitations at once" }, { status: 400 });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const invalidEmails = emails.filter((email: string) => !emailRegex.test(email));
  if (invalidEmails.length > 0) {
    return NextResponse.json(
      { error: `Invalid email format: ${invalidEmails.join(", ")}` },
      { status: 400 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const results: { email: string; success: boolean; error?: string }[] = [];

  // Process each email
  for (const email of emails) {
    const normalizedEmail = email.trim().toLowerCase();

    try {
      // Check if invitation already exists and is pending
      const { data: existingInvitation } = await supabase
        .from("squad_invitations")
        .select("id, status")
        .eq("squad_id", squadId)
        .eq("invitee_email", normalizedEmail)
        .eq("status", "pending")
        .single();

      if (existingInvitation) {
        results.push({
          email: normalizedEmail,
          success: false,
          error: "Already invited",
        });
        continue;
      }

      // Check if user is already a member (by checking profiles table for email)
      // This is a basic check - in production you'd want to check auth.users
      const { data: existingMember } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", normalizedEmail)
        .single();

      if (existingMember) {
        const { data: alreadyMember } = await supabase
          .from("squad_members")
          .select("id")
          .eq("squad_id", squadId)
          .eq("user_id", existingMember.id)
          .single();

        if (alreadyMember) {
          results.push({
            email: normalizedEmail,
            success: false,
            error: "Already a member",
          });
          continue;
        }
      }

      // Generate unique token
      const token = generateToken();
      const inviteLink = `${appUrl}/squads/join/${token}`;

      // Store invitation in database
      const { error: insertError } = await supabase.from("squad_invitations").insert({
        squad_id: squadId,
        inviter_id: user.id,
        invitee_email: normalizedEmail,
        token,
        personal_message: personalMessage || null,
        status: "pending",
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      });

      if (insertError) {
        console.error("Error creating invitation:", insertError);
        results.push({
          email: normalizedEmail,
          success: false,
          error: "Database error",
        });
        continue;
      }

      // Send email
      if (resend) {
        try {
          // Use RESEND_FROM_EMAIL env var, or fall back to onboarding@resend.dev for testing
          const fromEmail = process.env.RESEND_FROM_EMAIL || "Habitio <onboarding@resend.dev>";

          const emailResult = await resend.emails.send({
            from: fromEmail,
            to: normalizedEmail,
            subject: `${inviterName} invited you to join "${squad.name}" on Habitio`,
            react: SquadInvitationEmail({
              inviterName,
              squadName: squad.name,
              squadDescription: squad.description || undefined,
              inviteLink,
              personalMessage: personalMessage || undefined,
            }),
          });

          console.log("Email sent successfully:", emailResult);
          results.push({ email: normalizedEmail, success: true });
        } catch (emailError: any) {
          console.error("Error sending email:", emailError?.message || emailError);
          console.error("Full error:", JSON.stringify(emailError, null, 2));
          results.push({
            email: normalizedEmail,
            success: false,
            error: emailError?.message || "Failed to send email",
          });
        }
      } else {
        // No email service configured - mark as success anyway (invitation is in DB)
        console.warn("RESEND_API_KEY not configured. Invitation saved but email not sent.");
        results.push({ email: normalizedEmail, success: true });
      }
    } catch (err) {
      console.error("Error processing invitation:", err);
      results.push({
        email: normalizedEmail,
        success: false,
        error: "Processing error",
      });
    }
  }

  const successCount = results.filter((r) => r.success).length;

  return NextResponse.json({
    success: successCount > 0,
    results,
    message: `${successCount} of ${emails.length} invitation(s) sent`,
  });
}

// GET /api/squads/[id]/invite - Get pending invitations for a squad
export async function GET(request: NextRequest, context: RouteContext) {
  const { id: squadId } = await context.params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is a member of the squad
  const { data: memberships } = await supabase
    .from("squad_members")
    .select("role")
    .eq("squad_id", squadId)
    .eq("user_id", user.id)
    .limit(1);

  if (!memberships || memberships.length === 0) {
    return NextResponse.json({ error: "Not a squad member" }, { status: 403 });
  }

  // Get invitations
  const { data: invitations, error } = await supabase
    .from("squad_invitations")
    .select("id, invitee_email, status, created_at, expires_at")
    .eq("squad_id", squadId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch invitations" }, { status: 500 });
  }

  return NextResponse.json({ invitations });
}
