"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { track, events } from "@/lib/analytics";
import { useSearchParams } from "next/navigation";

function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "auth_failed") {
      setMessage("Authentication failed. Please try again.");
    }
  }, [searchParams]);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
        if (process.env.NODE_ENV === "development") {
          console.error("Supabase auth error:", error);
        }
      } else {
        track(events.signin);
        // Redirect to dashboard after successful login
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      
      if (errorMessage.includes("Missing Supabase environment variables")) {
        setMessage("Configuration error: Missing Supabase credentials. Please check your .env.local file.");
      } else if (errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError")) {
        setMessage("Network error: Unable to reach Supabase. Please check your internet connection.");
      } else {
        setMessage(`Error: ${errorMessage}`);
      }
      
      if (process.env.NODE_ENV === "development") {
        console.error("Sign-in error:", err);
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
      <form onSubmit={handleSignIn} className="mt-6 space-y-4" data-testid="sign-in-form">
        <label className="block text-sm font-semibold text-slate-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            data-testid="email-input"
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
            required
            minLength={6}
            autoComplete="current-password"
            data-testid="password-input"
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <button
          type="submit"
          disabled={loading || !email || !password}
          data-testid="sign-in-button"
          className="w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <div className="mt-6 space-y-2 text-center text-sm text-slate-500">
        <p>
          <Link href="/auth/forgot-password" className="text-slate-600 hover:text-slate-800" data-testid="forgot-password-link">
            Forgot your password?
          </Link>
        </p>
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/auth/sign-up" className="font-semibold text-blue-600 hover:text-blue-700" data-testid="sign-up-link">
            Sign up
          </Link>
        </p>
      </div>
      {message ? <p className="mt-4 text-center text-sm text-red-600">{message}</p> : null}
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
