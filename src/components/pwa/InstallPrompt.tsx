"use client";

import { useEffect, useState } from "react";

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowPrompt(true), 30000);
    };
    window.addEventListener("beforeinstallprompt", handler as any);
    return () => window.removeEventListener("beforeinstallprompt", handler as any);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 rounded-xl border-2 border-violet-500 bg-white p-4 shadow-2xl md:hidden">
      <button
        onClick={() => setShowPrompt(false)}
        className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
        aria-label="Close"
      >
        ✕
      </button>
      <div className="flex gap-3">
        <div className="text-4xl">📱</div>
        <div className="flex-1">
          <h3 className="mb-1 font-semibold">Install Habit Tracker</h3>
          <p className="mb-3 text-sm text-gray-600">Add to home screen for quick access and offline support</p>
          <button onClick={handleInstall} className="w-full rounded-lg bg-violet-600 py-2 font-semibold text-white">
            Install App
          </button>
        </div>
      </div>
    </div>
  );
}


