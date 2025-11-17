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
        if (error.message.includes("Invalid login credentials")) {
          setMessage("Invalid email or password. Please try again.");
        } else if (error.message.includes("Email not confirmed")) {
          setMessage("Please confirm your email address before signing in.");
        } else {
          setMessage(`Error: ${error.message}`);
        }
        if (process.env.NODE_ENV === "development") {
          console.error("Supabase signin error:", error);
        }
      } else if (data.session) {
        track(events.signin);

        // Redirect to dashboard
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
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
      {/* Brand Logo */}
      <div className="mb-6 flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-500 text-xl font-bold text-white">
          H
        </div>
      </div>

      <h1 className="text-center text-2xl font-bold text-slate-900">Welcome back</h1>
      <p className="mt-2 text-center text-sm text-slate-500">
        Sign in to continue your habit journey.
      </p>
      <form onSubmit={handleSignIn} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold text-slate-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-gray-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Your password"
            required
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-gray-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </label>
        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full rounded-full bg-gradient-to-r from-amber-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-amber-500/30 transition hover:shadow-lg hover:shadow-amber-500/40 active:scale-95 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <div className="mt-6 space-y-2 text-center text-sm text-slate-500">
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/auth/sign-up" className="font-semibold text-amber-600 hover:text-amber-700">
            Sign up
          </Link>
        </p>
        <p>
          <Link href="/auth/forgot-password" className="font-semibold text-slate-600 hover:text-slate-800">
            Forgot your password?
          </Link>
        </p>
      </div>
      {message ? (
        <p className={`mt-4 text-center text-sm ${message.includes("Error") || message.includes("Invalid") || message.includes("failed") ? "text-red-600" : "text-amber-600"}`}>
          {message}
        </p>
      ) : null}
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
