"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SupportContactPage() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const categories = ["Account Issues", "Payment & Billing", "Habit Tracking", "Stakes & Money", "Squads & Challenges", "Technical Issues", "Feature Request", "Other"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = new FormData();
    form.append("subject", subject);
    form.append("description", description);
    form.append("category", category);
    attachments.forEach((f) => form.append("attachments", f));
    const res = await fetch("/api/support/tickets", { method: "POST", body: form });
    if (res.ok) {
      const ticket = await res.json();
      router.push(`/support/tickets/${ticket.id}`);
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Contact Support</h1>
      <div>
        <label className="mb-2 block text-sm font-medium">Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full rounded-lg border px-4 py-2">
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Subject</label>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief description of your issue" required className="w-full rounded-lg border px-4 py-2" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Please provide as much detail as possible..." rows={8} required className="w-full rounded-lg border px-4 py-2" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Attachments (optional)</label>
        <input type="file" multiple onChange={(e) => setAttachments(Array.from(e.target.files || []))} className="w-full" accept="image/*,.pdf,.doc,.docx" />
        {attachments.length > 0 && <div className="mt-2 text-sm text-gray-600">{attachments.length} file(s) selected</div>}
      </div>
      <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white disabled:opacity-50">
        {isSubmitting ? "Submitting..." : "Submit Ticket"}
      </button>
    </form>
  );
}


