"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { track, events } from "@/lib/analytics";
import { useSearchParams } from "next/navigation";

function SignInForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "auth_failed") {
      setMessage("Authentication failed. Please try again.");
    }
  }, [searchParams]);

  const redirectTo = `${typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3002"}/auth/callback?next=/dashboard`;

  async function handleMagicLink() {
    if (!email) return;
    setLoading(true);
    setMessage(null);

    try {
      // Create client inside the handler to catch initialization errors
      const supabase = createClient();
      
      const { error, data } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.error("Supabase auth error:", error);
          // eslint-disable-next-line no-console
          console.error("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
          // eslint-disable-next-line no-console
          console.error("Redirect URL:", redirectTo);
        }
      } else {
        setMessage("Check your inbox for a magic link!");
        track(events.signup);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      
      if (errorMessage.includes("Missing Supabase environment variables")) {
        setMessage("Configuration error: Missing Supabase credentials. Please check your .env.local file.");
      } else if (errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError")) {
        setMessage(
          "Network error: Unable to reach Supabase. " +
          "Please ensure: 1) Email auth is enabled in Supabase, 2) Redirect URL is configured, " +
          "3) Your Supabase project is active. Check the browser console for details."
        );
      } else {
        setMessage(`Error: ${errorMessage}`);
      }
      
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.error("Sign-in error:", err);
        // eslint-disable-next-line no-console
        console.error("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
        // eslint-disable-next-line no-console
        console.error("Anon key present:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      }
    } finally {
      setLoading(false);
    }
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
  const redirectTo = `${typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3002"}/auth/callback?next=/dashboard`;

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          const supabase = createClient();
          await supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo },
          });
          track(events.signin, { provider });
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            // eslint-disable-next-line no-console
            console.error("Supabase OAuth error", error);
          }
        }
      }}
      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
    >
      {provider === "google" ? "Google" : "GitHub"}
    </button>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
