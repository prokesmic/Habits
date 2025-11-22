import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { AcceptInvitationButton } from "@/components/squads/AcceptInvitationButton";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

export default async function JoinByTokenPage({ params }: Props) {
  const { token } = await params;
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch invitation by token
  const { data: invitation, error: invitationError } = await supabase
    .from("squad_invitations")
    .select(`
      id,
      squad_id,
      invitee_email,
      status,
      personal_message,
      expires_at,
      inviter:profiles!squad_invitations_inviter_id_fkey(username),
      squad:squads(id, name, description, member_count)
    `)
    .eq("token", token)
    .single();

  // Handle invalid token
  if (invitationError || !invitation) {
    return (
      <div className="mx-auto max-w-md py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="mt-4 text-xl font-semibold text-slate-900">Invalid Invitation</h1>
          <p className="mt-2 text-sm text-slate-600">
            This invitation link is invalid or doesn't exist.
          </p>
          <Link
            href="/squads"
            className="mt-6 inline-block rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Browse Squads
          </Link>
        </div>
      </div>
    );
  }

  const squad = invitation.squad as any;
  const inviter = invitation.inviter as any;

  // Check if expired
  if (invitation.status === "expired" || new Date(invitation.expires_at) < new Date()) {
    return (
      <div className="mx-auto max-w-md py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <Clock className="h-8 w-8 text-amber-600" />
          </div>
          <h1 className="mt-4 text-xl font-semibold text-slate-900">Invitation Expired</h1>
          <p className="mt-2 text-sm text-slate-600">
            This invitation has expired. Ask {inviter?.username || "the squad owner"} to send you a
            new one.
          </p>
          <Link
            href="/squads"
            className="mt-6 inline-block rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Browse Squads
          </Link>
        </div>
      </div>
    );
  }

  // Check if already accepted
  if (invitation.status === "accepted") {
    return (
      <div className="mx-auto max-w-md py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="mt-4 text-xl font-semibold text-slate-900">Already Accepted</h1>
          <p className="mt-2 text-sm text-slate-600">
            This invitation has already been used. You may already be a member of this squad.
          </p>
          <Link
            href={`/squads/${invitation.squad_id}`}
            className="mt-6 inline-block rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Go to Squad
          </Link>
        </div>
      </div>
    );
  }

  // If user is not logged in, show login prompt
  if (!user) {
    return (
      <div className="mx-auto max-w-md py-12">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="mt-4 text-xl font-semibold text-slate-900">
              You're invited to join {squad?.name}!
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              {inviter?.username || "Someone"} invited you to join their squad on Habitio.
            </p>
          </div>

          {/* Squad info */}
          {squad?.description && (
            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-600">{squad.description}</p>
            </div>
          )}

          {invitation.personal_message && (
            <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                Personal message
              </p>
              <p className="mt-1 text-sm italic text-orange-800">
                "{invitation.personal_message}"
              </p>
            </div>
          )}

          {/* Login prompt */}
          <div className="mt-6 space-y-3">
            <Link
              href={`/sign-in?redirect=/squads/join/${token}`}
              className="block w-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-md shadow-orange-500/30 transition hover:shadow-lg hover:shadow-orange-500/40"
            >
              Sign in to Accept
            </Link>
            <p className="text-center text-xs text-slate-500">
              Don't have an account?{" "}
              <Link href={`/sign-in?redirect=/squads/join/${token}`} className="text-orange-600 hover:underline">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is already a member
  const { data: existingMembership } = await supabase
    .from("squad_members")
    .select("id")
    .eq("squad_id", invitation.squad_id)
    .eq("user_id", user.id)
    .single();

  if (existingMembership) {
    redirect(`/squads/${invitation.squad_id}`);
  }

  // Show acceptance page
  return (
    <div className="mx-auto max-w-md py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-4 text-xl font-semibold text-slate-900">
            Join {squad?.name}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {inviter?.username || "Someone"} invited you to join their squad.
          </p>
        </div>

        {/* Squad info */}
        {squad?.description && (
          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-600">{squad.description}</p>
          </div>
        )}

        {invitation.personal_message && (
          <div className="mt-4 rounded-xl border border-orange-200 bg-orange-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
              Personal message
            </p>
            <p className="mt-1 text-sm italic text-orange-800">
              "{invitation.personal_message}"
            </p>
          </div>
        )}

        {/* Accept button */}
        <div className="mt-6">
          <AcceptInvitationButton
            token={token}
            squadId={invitation.squad_id}
            squadName={squad?.name || "the squad"}
          />
        </div>
      </div>
    </div>
  );
}
