"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { track, events } from "@/lib/analytics";

export default function SignInPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleMagicLink() {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard` } });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your inbox for a magic link!");
      track(events.signup);
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
      <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-500">
        Sign in to keep your streak alive and cheer on your squad.
      </p>
      <div className="mt-6 space-y-4">
        <label className="block text-sm font-semibold text-slate-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <button
          type="button"
          onClick={handleMagicLink}
          disabled={loading || !email}
          className="w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send magic link"}
        </button>
      </div>
      <div className="mt-6 space-y-2 text-center text-sm text-slate-500">
        <p>Or continue with</p>
        <div className="flex justify-center gap-3">
          <OAuthButton provider="google" />
          <OAuthButton provider="github" />
        </div>
      </div>
      {message ? <p className="mt-4 text-center text-sm text-blue-600">{message}</p> : null}
    </div>
  );
}

function OAuthButton({ provider }: { provider: "google" | "github" }) {
  const supabase = createClient();

  return (
    <button
      type="button"
      onClick={async () => {
        await supabase.auth.signInWithOAuth({
          provider,
          options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard` },
        });
        track(events.signin, { provider });
      }}
      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
    >
      {provider === "google" ? "Google" : "GitHub"}
    </button>
  );
}

