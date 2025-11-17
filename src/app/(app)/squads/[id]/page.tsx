import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Users, TrendingUp, MessageCircle, Settings } from "lucide-react";

export const dynamic = "force-dynamic";

type SquadPageProps = {
  params: { id: string };
};

export default async function SquadDetailPage({ params }: SquadPageProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  // Fetch squad details
  const { data: squad, error: squadError } = await supabase
    .from("squads")
    .select("*")
    .eq("id", params.id)
    .single();

  if (squadError || !squad) {
    console.error("Squad fetch error:", squadError);
    notFound();
  }

  // Check if user is a member
  const { data: membership } = await supabase
    .from("squad_members")
    .select("role, joined_at")
    .eq("squad_id", params.id)
    .eq("user_id", user.id)
    .single();

  // Fetch squad members
  const { data: members } = await supabase
    .from("squad_members")
    .select("user_id, role, joined_at, profile:profiles(username, avatar_url)")
    .eq("squad_id", params.id)
    .order("joined_at", { ascending: true })
    .limit(20);

  const membersList =
    (members ?? []).map((m) => ({
      userId: m.user_id,
      role: m.role ?? "member",
      username: (m as any).profile?.username ?? "Anonymous",
      avatarUrl: (m as any).profile?.avatar_url ?? null,
      joinedAt: m.joined_at,
    })) ?? [];

  const isMember = !!membership;
  const isAdmin = membership?.role === "admin";

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
                {squad.member_count ?? 0} members
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
              href={`/squads/${params.id}/settings`}
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
                href={`/squads/${params.id}/chat`}
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
              href={`/squads/${params.id}/join`}
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
        <h2 className="text-lg font-semibold text-slate-900">Members</h2>
        <p className="mt-1 text-sm text-slate-600">
          {membersList.length} active {membersList.length === 1 ? "member" : "members"}
        </p>

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
            <button
              onClick={() => {
                navigator.clipboard.writeText(squad.invite_code);
              }}
              className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Copy Code
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
