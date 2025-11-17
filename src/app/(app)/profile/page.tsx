import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

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
    <div className="space-y-6">
      {/* Profile Header */}
      <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 p-6 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-3xl">
              👤
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile?.full_name ?? "Your Profile"}</h1>
              <p className="text-sm opacity-90">@{profile?.username ?? "username"}</p>
            </div>
          </div>
          <Link
            href="/settings"
            className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/30"
          >
            ⚙️ Settings
          </Link>
        </div>
        <p className="mt-4 text-sm opacity-90">
          {profile?.bio ?? "Share something with your squad."}
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <section className="space-y-6">
          {/* Stats Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Your Stats</h2>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="rounded-2xl bg-amber-50 p-4 text-center">
                <div className="text-2xl font-bold text-amber-600">0</div>
                <div className="text-xs text-slate-600">Habits Active</div>
              </div>
              <div className="rounded-2xl bg-indigo-50 p-4 text-center">
                <div className="text-2xl font-bold text-indigo-600">0</div>
                <div className="text-xs text-slate-600">Total Check-ins</div>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">0</div>
                <div className="text-xs text-slate-600">Best Streak</div>
              </div>
            </div>
          </div>

          {/* Premium Card */}
          <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500">
                <span className="text-lg text-white">👑</span>
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Upgrade to Premium</h2>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Unlock unlimited habits, advanced stats, streak freezes, and squad streak history for €4.99/mo.
            </p>
            <div className="mt-4 rounded-2xl bg-white/70 px-4 py-3 text-sm">
              <span className="text-slate-600">Current tier: </span>
              <span className="font-semibold text-amber-700">{profile?.premium_tier ?? "Free"}</span>
            </div>
            <button className="mt-4 w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-amber-500/30 transition hover:shadow-lg hover:shadow-amber-500/40 active:scale-95">
              Upgrade to Premium
            </button>
          </div>
        </section>

        <aside className="space-y-6">
          {/* Social Reach */}
          <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">👥</span>
              <h2 className="text-lg font-semibold text-slate-900">Social Reach</h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center justify-between rounded-lg bg-white p-3">
                <span className="text-slate-600">Squads joined</span>
                <span className="font-semibold text-indigo-600">0</span>
              </li>
              <li className="flex items-center justify-between rounded-lg bg-white p-3">
                <span className="text-slate-600">Buddies</span>
                <span className="font-semibold text-indigo-600">0</span>
              </li>
              <li className="flex items-center justify-between rounded-lg bg-white p-3">
                <span className="text-slate-600">Referrals sent</span>
                <span className="font-semibold text-indigo-600">0</span>
              </li>
            </ul>
          </div>

          {/* Referral Rewards */}
          <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎁</span>
              <h2 className="text-lg font-semibold text-slate-900">Referral Rewards</h2>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Invite 3 friends who complete onboarding to unlock a free month of premium.
            </p>
            <div className="mt-3 rounded-xl border-2 border-dashed border-emerald-300 bg-white p-3 text-center">
              <p className="text-xs font-semibold text-emerald-700">0/3 friends invited</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-2 w-0 rounded-full bg-emerald-500" />
              </div>
            </div>
            <button className="mt-4 w-full rounded-full border-2 border-emerald-400 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50">
              Share invite link
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
