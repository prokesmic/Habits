"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Hash } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function JoinSquadWithCodePage() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inviteCode.trim()) {
      setError("Please enter an invite code");
      return;
    }

    setJoining(true);
    setError(null);

    try {
      const supabase = createClient();

      // Find squad by invite code
      const { data: squad, error: squadError } = await supabase
        .from("squads")
        .select("id, name, description, member_count")
        .eq("invite_code", inviteCode.trim().toUpperCase())
        .single();

      if (squadError || !squad) {
        throw new Error("Invalid invite code. Please check and try again.");
      }

      // Check if already a member
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be signed in to join a squad");
      }

      const { data: existingMember } = await supabase
        .from("squad_members")
        .select("id")
        .eq("squad_id", squad.id)
        .eq("user_id", user.id)
        .single();

      if (existingMember) {
        // Already a member, just redirect
        router.push(`/squads/${squad.id}`);
        return;
      }

      // Join the squad
      const { error: joinError } = await supabase
        .from("squad_members")
        .insert({
          squad_id: squad.id,
          user_id: user.id,
          role: "member",
        });

      if (joinError) {
        throw new Error("Failed to join squad. Please try again.");
      }

      // Success! Redirect to squad page
      router.push(`/squads/${squad.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setJoining(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 p-6 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
              <span>👥</span>
              <span>Join Squad</span>
            </div>
            <h1 className="text-2xl font-bold">Join with Invite Code</h1>
            <p className="mt-1 text-sm opacity-90">
              Enter your friend's squad invite code to join their crew
            </p>
          </div>
          <Link
            href="/squads"
            className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/30 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
        </div>
      </section>

      {/* Join Form */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Enter Invite Code</h2>
        <p className="mt-2 text-sm text-slate-600">
          Ask your friend for their squad invite code to join their accountability crew.
        </p>

        <form onSubmit={handleJoin} className="mt-6 space-y-4">
          <div>
            <label htmlFor="inviteCode" className="block text-sm font-medium text-slate-700">
              Invite Code
            </label>
            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Hash className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                id="inviteCode"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                className="block w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                disabled={joining}
                maxLength={10}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Invite codes are usually 6-8 characters long and case-insensitive
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-900">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={joining || !inviteCode.trim()}
              className="flex-1 rounded-full bg-gradient-to-r from-amber-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {joining ? "Joining..." : "Join Squad"}
            </button>
            <Link
              href="/squads"
              className="rounded-full border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>

      {/* Help Section */}
      <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
        <p className="font-semibold">Don't have an invite code?</p>
        <p className="mt-1 text-blue-700">
          Browse public squads on the{" "}
          <Link href="/squads" className="font-semibold underline">
            Squads page
          </Link>{" "}
          or create your own private squad to invite friends.
        </p>
      </div>

      {/* Example */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          How it works
        </p>
        <div className="mt-3 space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600">
              1
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">Get the code</p>
              <p className="text-xs text-slate-600">
                Ask your friend for their squad's invite code
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600">
              2
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">Enter above</p>
              <p className="text-xs text-slate-600">
                Type or paste the code in the form above
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600">
              3
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">Join instantly</p>
              <p className="text-xs text-slate-600">
                Start sharing your progress with the squad
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
