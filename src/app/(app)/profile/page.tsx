import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/auth/sign-in");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username, full_name, bio, premium_tier, premium_expires_at, onboarding_completed")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Profile fetch error:", profileError);
    // Profile might not exist yet, continue with null profile
  }

  return (
    <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
              <p className="text-sm text-slate-500">Manage your identity, squads, and social settings.</p>
            </div>
            <Link
              href="/settings"
              className="min-h-[44px] min-w-[44px] rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 md:px-3 md:py-2"
            >
              <span className="md:hidden">⚙️ Settings</span>
              <span className="hidden md:inline">⚙️</span>
            </Link>
          </div>
          <dl className="mt-6 space-y-3 text-sm text-slate-600">
            <div>
              <dt className="font-semibold text-slate-700">Username</dt>
              <dd>{profile?.username ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-700">Full name</dt>
              <dd>{profile?.full_name ?? "—"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-700">Bio</dt>
              <dd>{profile?.bio ?? "Share something with your squad."}</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Premium</h2>
          <p className="mt-2 text-sm text-slate-600">
            Unlock unlimited habits, advanced stats, and squad streak history for €4.99/mo.
          </p>
          <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            Current tier: {profile?.premium_tier ?? "free"}
          </div>
          <button className="mt-4 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
            Upgrade to premium
          </button>
        </div>
      </section>
      <aside className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Social reach</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>Squads joined: 0</li>
            <li>Buddies: 0</li>
            <li>Referrals sent: 0</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Referral rewards</h2>
          <p className="mt-2 text-sm text-slate-600">
            Invite 3 friends who complete onboarding to unlock a free month of premium.
          </p>
          <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            Referral link coming soon.
          </div>
        </div>
      </aside>
    </div>
  );
}
