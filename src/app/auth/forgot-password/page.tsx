"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setSent(true);
        setMessage("Check your email for a password reset link!");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setMessage(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg text-center" data-testid="email-sent-confirmation">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-2xl font-semibold text-slate-900">Check your email</h1>
          <p className="mt-4 text-sm text-slate-600">
            We&apos;ve sent a password reset link to <strong>{email}</strong>.
            Click the link in the email to reset your password.
          </p>
          <Link
            href="/auth/sign-in"
            className="mt-6 inline-block rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            data-testid="back-to-signin-link"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-900">Reset password</h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
        <form onSubmit={handleReset} className="mt-6 space-y-4" data-testid="forgot-password-form">
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
          <button
            type="submit"
            disabled={loading || !email}
            data-testid="reset-button"
            className="w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/auth/sign-in" className="text-sm font-semibold text-blue-600 hover:text-blue-700" data-testid="signin-link">
            Back to Sign In
          </Link>
        </div>
        {message ? (
          <p className={`mt-4 text-center text-sm ${message.includes("Error") ? "text-red-600" : "text-blue-600"}`}>
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
