"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { track, events } from "@/lib/analytics";

function SignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : "http://localhost:3002"}/auth/callback?next=/dashboard`,
        },
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
        if (process.env.NODE_ENV === "development") {
          console.error("Supabase signup error:", error);
        }
      } else {
        track(events.signup);
        
        // If we have a session, ensure profile exists and redirect
        if (data.session && data.user) {
          // Create profile if it doesn't exist
          try {
            const defaultUsername = data.user.email?.split("@")[0] ?? `user_${data.user.id.slice(0, 8)}`;
            const { error: profileError } = await supabase.from("profiles").upsert({
              id: data.user.id,
              username: defaultUsername,
              onboarding_completed: false,
            }, {
              onConflict: "id",
            });
            
            if (profileError && profileError.code !== "23505") { // Ignore unique constraint errors
              console.error("Profile creation error:", profileError);
            }
          } catch (profileError) {
            console.error("Profile creation error:", profileError);
          }
          
          // Redirect to dashboard
          router.push("/dashboard");
          router.refresh();
        } else if (data.user && !data.session) {
          // Email confirmation required
          setMessage("Check your email to confirm your account!");
        } else {
          // Should not happen, but handle it
          setMessage("Account created! Redirecting...");
          setTimeout(() => {
            router.push("/auth/sign-in");
          }, 2000);
        }
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
        console.error("Sign-up error:", err);
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

      <h1 className="text-center text-2xl font-bold text-slate-900">Create account</h1>
      <p className="mt-2 text-center text-sm text-slate-500">
        Join 10,000+ people building better habits together.
      </p>
      <form onSubmit={handleSignUp} className="mt-6 space-y-4">
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
            placeholder="At least 6 characters"
            required
            minLength={6}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-gray-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm your password"
            required
            minLength={6}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-gray-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </label>
        <button
          type="submit"
          disabled={loading || !email || !password || !confirmPassword}
          className="w-full rounded-full bg-gradient-to-r from-amber-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-amber-500/30 transition hover:shadow-lg hover:shadow-amber-500/40 active:scale-95 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Start your habit journey"}
        </button>
      </form>
      <div className="mt-6 space-y-2 text-center text-sm text-slate-500">
        <p>
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="font-semibold text-amber-600 hover:text-amber-700">
            Sign in
          </Link>
        </p>
      </div>
      {message ? (
        <p className={`mt-4 text-center text-sm ${message.includes("Error") ? "text-red-600" : "text-amber-600"}`}>
          {message}
        </p>
      ) : null}
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">Loading...</div>}>
      <SignUpForm />
    </Suspense>
  );
}

