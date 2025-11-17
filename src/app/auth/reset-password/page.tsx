"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sessionValid, setSessionValid] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user has a valid session (from recovery link)
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setSessionValid(!!session);
    };
    checkSession();
  }, []);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();

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

      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setSuccess(true);
        setMessage("Password updated successfully!");
        // Redirect to sign-in after 2 seconds
        setTimeout(() => {
          router.push("/auth/sign-in");
        }, 2000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setMessage(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }

  if (sessionValid === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (!sessionValid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg text-center">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-2xl font-semibold text-slate-900">Invalid or Expired Link</h1>
          <p className="mt-4 text-sm text-slate-600">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link
            href="/auth/forgot-password"
            className="mt-6 inline-block rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-semibold text-slate-900">Password Updated!</h1>
          <p className="mt-4 text-sm text-slate-600">
            Your password has been successfully reset. Redirecting you to sign in...
          </p>
          <Link
            href="/auth/sign-in"
            className="mt-6 inline-block rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-900">Set New Password</h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter your new password below.
        </p>
        <form onSubmit={handleReset} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            New Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <label className="block text-sm font-semibold text-slate-700">
            Confirm New Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              minLength={6}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </label>
          <button
            type="submit"
            disabled={loading || !password || !confirmPassword}
            className="w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-center text-sm ${message.includes("Error") || message.includes("do not match") ? "text-red-600" : "text-blue-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
