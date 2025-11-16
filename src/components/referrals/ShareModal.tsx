"use client";

import { useState, useEffect } from "react";

export function ShareModal({ code, onClose }: { code: string; onClose: () => void }) {
  const [link, setLink] = useState(`https://yourapp.vercel.app/r/${code}`);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState(
    `I'm building habits with real accountability. Join me and we both get $5!\n\n${link}`,
  );

  useEffect(() => {
    const newLink = `${window.location.origin}/r/${code}`;
    setLink(newLink);
    setMessage(
      `I'm building habits with real accountability. Join me and we both get $5!\n\n${newLink}`,
    );
  }, [code]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  }

  function share(method: "whatsapp" | "email" | "sms" | "twitter" | "linkedin") {
    switch (method) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
        break;
      case "email":
        window.location.href = `mailto:?subject=Join me on Habit Tracker&body=${encodeURIComponent(message)}`;
        break;
      case "sms":
        window.location.href = `sms:?body=${encodeURIComponent(message)}`;
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, "_blank");
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`, "_blank");
        break;
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Share with friends</h2>
          <button
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
          >
            Close
          </button>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
          <p className="font-mono text-slate-900">{link.replace(/^https?:\/\//, "")}</p>
          <button
            onClick={copy}
            className="mt-3 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
          >
            {copied ? "✓ Copied!" : "Copy link"}
          </button>
        </div>
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Share via</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              ["📱 WhatsApp", "whatsapp"],
              ["📧 Email", "email"],
              ["💬 SMS", "sms"],
              ["🐦 Twitter", "twitter"],
              ["👔 LinkedIn", "linkedin"],
            ].map(([label, id]) => (
              <button
                key={id}
                onClick={() => share(id as any)}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Shareable message</p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-2 h-28 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => share("twitter")}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}


