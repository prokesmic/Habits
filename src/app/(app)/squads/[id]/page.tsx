import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Users, TrendingUp, MessageCircle, Settings } from "lucide-react";
import { allSquads } from "@/data/mockSquadsFull";
import { CopyInviteCode } from "@/components/squads/CopyInviteCode";
import { DeleteSquadButton } from "@/components/squads/DeleteSquadButton";
import { InviteMembersButton } from "@/components/squads/InviteMembersButton";

export const dynamic = "force-dynamic";

type SquadPageProps = {
  params: Promise<{ id: string }> | { id: string };
};

export default async function SquadDetailPage({ params }: SquadPageProps) {
  const { id } = await Promise.resolve(params);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  // First check if this is a mock squad
  const mockSquad = allSquads.find((s) => s.id === id);

  let squad: any;
  let isMockSquad = false;

  if (mockSquad) {
    // Use mock data
    isMockSquad = true;
    squad = {
      id: mockSquad.id,
      name: mockSquad.name,
      description: mockSquad.description,
      member_count: mockSquad.memberCount,
      is_public: true,
      created_at: new Date().toISOString(),
      invite_code: null,
      emoji: mockSquad.emoji,
      entry_stake: mockSquad.entryStake,
      total_pool: mockSquad.totalPool,
      top_habits: mockSquad.topHabits,
      check_in_rate: mockSquad.checkInRate,
      member_avatars: mockSquad.memberAvatars,
    };
  } else {
    // Fetch squad details from database
    const { data: dbSquad, error: squadError } = await supabase
      .from("squads")
      .select("*")
      .eq("id", id)
      .single();

    if (squadError || !dbSquad) {
      console.error("Squad fetch error:", squadError);
      notFound();
    }
    squad = dbSquad;
  }

  let membersList: { userId: string; role: string; username: string; avatarUrl: string | null; joinedAt: string }[] = [];
  let isMember = false;
  let isAdmin = false;
  let isOwner = false;

  if (isMockSquad) {
    // Generate mock members from avatars
    const mockAvatars = squad.member_avatars || [];
    membersList = mockAvatars.map((initials: string, index: number) => ({
      userId: `mock-${index}`,
      role: index === 0 ? "admin" : "member",
      username: initials,
      avatarUrl: null,
      joinedAt: new Date(Date.now() - index * 86400000).toISOString(),
    }));
    // User is not a member of mock squads by default
    isMember = false;
    isAdmin = false;
  } else {
    // Check if user is a member
    const { data: membership } = await supabase
      .from("squad_members")
      .select("role, joined_at")
      .eq("squad_id", id)
      .eq("user_id", user.id)
      .single();

    // Fetch squad members
    const { data: members } = await supabase
      .from("squad_members")
      .select("user_id, role, joined_at, profile:profiles(username, avatar_url)")
      .eq("squad_id", id)
      .order("joined_at", { ascending: true })
      .limit(20);

    membersList =
      (members ?? []).map((m) => ({
        userId: m.user_id,
        role: m.role ?? "member",
        username: (m as any).profile?.username ?? "Anonymous",
        avatarUrl: (m as any).profile?.avatar_url ?? null,
        joinedAt: m.joined_at,
      })) ?? [];

    isMember = !!membership;
    isAdmin = membership?.role === "admin";
    isOwner = membership?.role === "owner" || squad.owner_id === user.id;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wide text-slate-600">Squad</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              {squad.name}
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              {squad.description ?? "Rally buddies, share wins, and keep momentum together."}
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs uppercase tracking-wide text-slate-600">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {membersList.length} {membersList.length === 1 ? "member" : "members"}
              </span>
              <span>Created {new Date(squad.created_at).toLocaleDateString()}</span>
              {squad.is_public ? (
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700">
                  Public
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-700">
                  Private
                </span>
              )}
            </div>
          </div>
          {isAdmin && (
            <Link
              href={`/squads/${id}/settings`}
              className="rounded-full border-2 border-slate-300 bg-white p-2 transition hover:border-slate-400 hover:bg-slate-50"
            >
              <Settings className="h-5 w-5 text-slate-700" />
            </Link>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex gap-3">
          {isMember ? (
            <>
              <Link
                href={`/squads/${id}/chat`}
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <MessageCircle className="h-4 w-4" />
                Open Chat
              </Link>
              <Link
                href="/feed"
                className="inline-flex items-center gap-2 rounded-full border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                <TrendingUp className="h-4 w-4" />
                View Activity
              </Link>
            </>
          ) : (
            <Link
              href={`/squads/${id}/join`}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Users className="h-4 w-4" />
              Join Squad
            </Link>
          )}
        </div>
      </header>

      {/* Members Section */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Members</h2>
            <p className="mt-1 text-sm text-slate-600">
              {membersList.length} {membersList.length === 1 ? "member" : "members"} in this squad
            </p>
          </div>
          {isMember && !isMockSquad && (
            <InviteMembersButton squadId={squad.id} squadName={squad.name} />
          )}
        </div>

        {membersList.length > 0 ? (
          <div className="mt-4 space-y-3">
            {membersList.map((member) => (
              <div
                key={member.userId}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-indigo-500 text-sm font-semibold text-white">
                    {member.username[0]?.toUpperCase() ?? "A"}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{member.username}</p>
                    <p className="text-xs text-slate-600">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
            No members yet. Be the first to join!
          </div>
        )}
      </section>

      {/* Invite Section - Only show to members */}
      {isMember && squad.invite_code && (
        <section className="rounded-3xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-blue-900">Invite Friends</h2>
          <p className="mt-1 text-sm text-blue-700">
            Share this invite code with friends to grow your squad
          </p>
          <div className="mt-4 flex items-center gap-3">
            <code className="flex-1 rounded-xl border border-blue-300 bg-white px-4 py-3 font-mono text-sm font-semibold text-blue-900">
              {squad.invite_code}
            </code>
            <CopyInviteCode code={squad.invite_code} />
          </div>
        </section>
      )}

      {/* Danger Zone - Only show to owner */}
      {isOwner && !isMockSquad && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Danger Zone</h2>
          <p className="mt-1 text-sm text-slate-600">
            Permanently delete this squad and all its data
          </p>
          <div className="mt-4">
            <DeleteSquadButton squadId={squad.id} squadName={squad.name} />
          </div>
        </section>
      )}
    </div>
  );
}
