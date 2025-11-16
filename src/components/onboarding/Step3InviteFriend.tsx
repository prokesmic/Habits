"use client";

import { FormEvent, useState } from "react";
import { inviteBuddy } from "@/server/actions/social";
import { track, events } from "@/lib/analytics";

type Step3InviteFriendProps = {
  onSkip: () => void;
  onComplete: () => void;
};

export function Step3InviteFriend({ onSkip, onComplete }: Step3InviteFriendProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await inviteBuddy(email);
      track(events.firstInviteSent, { method: "email" });
      onComplete();
    } catch (err) {
      console.error("Error inviting buddy:", err);
      // Still complete onboarding even if invite fails
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-slate-900">
        Invite a friend to keep you accountable
      </h1>
      <p className="mb-6 text-sm text-slate-600">
        You&apos;re 3× more likely to stick with it when someone&apos;s cheering you on.
      </p>
      <form onSubmit={handleInvite} className="space-y-4">
        <label className="block text-sm font-semibold text-slate-700">
          Friend&apos;s email
          <input
            type="email"
            required
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="friend@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {isSubmitting ? "Sending invite..." : "Send invite"}
        </button>
      </form>
      <button
        type="button"
        className="mt-4 w-full rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        onClick={onSkip}
      >
        Skip for now
      </button>
    </div>
  );
}

