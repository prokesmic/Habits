"use client";

import { useEffect, useState } from "react";
import { requestNotificationPermission } from "@/lib/notifications/push";

export function NotificationPermissionPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900">Enable notifications</p>
          <p className="text-xs text-slate-600">Get reminders, challenge updates, and squad activity.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setVisible(false)}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
          >
            Later
          </button>
          <button
            onClick={async () => {
              await requestNotificationPermission();
              setVisible(false);
            }}
            className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
          >
            Enable
          </button>
        </div>
      </div>
    </div>
  );
}


