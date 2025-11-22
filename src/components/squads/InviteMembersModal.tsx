"use client";

import { useState } from "react";
import { X, Mail, Send, Loader2, Plus, Trash2, CheckCircle, AlertCircle } from "lucide-react";

interface InviteMembersModalProps {
  squadId: string;
  squadName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function InviteMembersModal({ squadId, squadName, isOpen, onClose }: InviteMembersModalProps) {
  const [emails, setEmails] = useState<string[]>([""]);
  const [personalMessage, setPersonalMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [results, setResults] = useState<{ email: string; success: boolean; error?: string }[]>([]);

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const addEmailField = () => {
    if (emails.length < 10) {
      setEmails([...emails, ""]);
    }
  };

  const removeEmailField = (index: number) => {
    if (emails.length > 1) {
      setEmails(emails.filter((_, i) => i !== index));
    }
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setResults([]);

    // Filter and validate emails
    const validEmails = emails.filter((email) => email.trim()).map((email) => email.trim().toLowerCase());

    if (validEmails.length === 0) {
      setError("Please enter at least one email address");
      return;
    }

    const invalidEmails = validEmails.filter((email) => !validateEmail(email));
    if (invalidEmails.length > 0) {
      setError(`Invalid email format: ${invalidEmails.join(", ")}`);
      return;
    }

    setIsSending(true);

    try {
      const res = await fetch(`/api/squads/${squadId}/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emails: validEmails,
          personalMessage: personalMessage.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send invitations");
      }

      setResults(data.results || []);
      setSuccess(true);
      setEmails([""]);
      setPersonalMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send invitations");
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setEmails([""]);
    setPersonalMessage("");
    setError(null);
    setSuccess(false);
    setResults([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Invite Members</h2>
            <p className="text-sm text-slate-500">Send email invitations to join "{squadName}"</p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          /* Success State */
          <div className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Invitations Sent!</h3>
              <p className="mt-2 text-sm text-slate-500">
                Your squad invitations have been sent. They'll expire in 7 days.
              </p>

              {/* Results */}
              <div className="mt-4 w-full space-y-2">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                      result.success
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    )}
                    <span className="truncate">{result.email}</span>
                    {!result.success && result.error && (
                      <span className="ml-auto text-xs">{result.error}</span>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleClose}
                className="mt-6 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} className="p-6">
            {/* Email fields */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">Email addresses</label>
              {emails.map((email, index) => (
                <div key={index} className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => updateEmail(index, e.target.value)}
                      placeholder="friend@example.com"
                      className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                  {emails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEmailField(index)}
                      className="rounded-lg border border-slate-300 p-2.5 text-slate-400 transition hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}

              {emails.length < 10 && (
                <button
                  type="button"
                  onClick={addEmailField}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-2.5 text-sm font-medium text-slate-500 transition hover:border-slate-400 hover:text-slate-600"
                >
                  <Plus className="h-4 w-4" />
                  Add another email
                </button>
              )}
            </div>

            {/* Personal message */}
            <div className="mt-6">
              <label className="text-sm font-medium text-slate-700">
                Personal message <span className="text-slate-400">(optional)</span>
              </label>
              <textarea
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                placeholder="Hey! Let's build some great habits together..."
                rows={3}
                maxLength={500}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              <p className="mt-1 text-xs text-slate-400">{personalMessage.length}/500 characters</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSending}
                className="flex-1 rounded-full border-2 border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSending || emails.every((e) => !e.trim())}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-500/30 transition hover:shadow-lg hover:shadow-orange-500/40 disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Invitations
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
