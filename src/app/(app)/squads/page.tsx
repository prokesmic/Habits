import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function SquadsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">
          Join the community by{" "}
          <Link href="/sign-in" className="font-semibold text-blue-600">
            signing in
          </Link>
          .
        </p>
      </div>
    );
  }

  const { data: memberships } = await supabase
    .from("squad_members")
    .select("role, joined_at, squad:squads(id, name, description, member_count, invite_code)")
    .eq("user_id", user.id);

  const { data: featured } = await supabase
    .from("squads")
    .select("id, name, description, member_count, invite_code")
    .eq("is_public", true)
    .order("member_count", { ascending: false })
    .limit(6);

  const membershipRows = (memberships ?? []).map((entry) => ({
    id: (entry as any).squad?.id ? String((entry as any).squad.id) : undefined,
    name: (entry as any).squad?.name ?? "Squad",
    description: (entry as any).squad?.description ?? "Accountability crew",
    member_count: Number((entry as any).squad?.member_count ?? 0),
    invite_code: (entry as any).squad?.invite_code ?? "",
    role: (entry as any).role ?? "member",
  }));

  const featuredRows = (featured ?? []).map((squad) => ({
    id: String(squad.id),
    name: (squad as any).name ?? "Squad",
    description: (squad as any).description ?? "Accountability crew",
    member_count: Number((squad as any).member_count ?? 0),
    invite_code: (squad as any).invite_code ?? "",
  }));

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Squads</h1>
          <p className="text-sm text-slate-500">Rally buddies, share wins, and keep momentum.</p>
        </div>
        <Link
          href="/squads/new"
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Create squad
        </Link>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Your squads</h2>
          <Link href="/squads/join" className="text-sm font-semibold text-blue-600">
            Join with invite code
          </Link>
        </div>
        {membershipRows.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {membershipRows.map((membership) => (
              <article
                key={membership.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold text-slate-900">
                    {membership.name}
                  </p>
                  <span className="rounded-full border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-500">
                    {membership.role}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {membership.description}
                </p>
                <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">
                  {membership.member_count} members
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
            No squads yet. Join a featured squad to get momentum from day one.
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Featured public squads</h2>
        {featuredRows.length ? (
          <div className="grid gap-4 md:grid-cols-3">
            {featuredRows.map((squad) => (
              <article
                key={squad.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm"
              >
                <p className="text-lg font-semibold text-slate-900">{squad.name}</p>
                <p className="mt-2">{squad.description}</p>
                <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">
                  {squad.member_count} members • Code {squad.invite_code}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
            Public squads will appear here once seeded.
          </div>
        )}
      </section>
    </div>
  );
}

