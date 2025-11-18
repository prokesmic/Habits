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
    <div className="fixed bottom-20 left-4 right-4 z-50 rounded-xl border-2 border-orange-500 bg-white p-6 shadow-2xl md:left-auto md:right-4 md:w-96">
      <button
        onClick={() => setShowPrompt(false)}
        className="absolute right-2 top-2 text-gray-600 hover:text-gray-700"
        aria-label="Close"
      >
        ✕
      </button>
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-blue-500 flex items-center justify-center text-white text-2xl flex-shrink-0">
          H
        </div>
        <div className="flex-1">
          <h3 className="mb-1 font-bold">Install Habitio</h3>
          <p className="mb-4 text-sm text-gray-600">Get the app for quicker check-ins and push notifications!</p>
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="flex-1 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 py-2 font-semibold text-white text-sm"
            >
              Install
            </button>
            <button
              onClick={() => setShowPrompt(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium"
            >
              Not Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


