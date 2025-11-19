"use client";

import { useEffect, useState } from "react";

export function GDPRBanner() {
  const [consent, setConsent] = useState<boolean | null>(null);
  const userRegion = "EU"; // placeholder

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("gdpr-consent") : null;
    setConsent(saved === "true" ? true : saved === "false" ? false : null);
  }, []);

  if (consent !== null || userRegion !== "EU") return null;

  const accept = () => {
    localStorage.setItem("gdpr-consent", "true");
    setConsent(true);
  };
  const decline = () => {
    localStorage.setItem("gdpr-consent", "false");
    setConsent(false);
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 z-[51] border-t bg-white p-6 shadow-lg md:bottom-0">
      <div className="mx-auto max-w-4xl">
        <h3 className="mb-2 font-semibold">🍪 Cookie Consent</h3>
        <p className="mb-4 text-sm text-gray-600">
          We use cookies to improve your experience. By clicking "Accept", you consent to our use of cookies. Read our{" "}
          <a href="/privacy" className="text-violet-600 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
        <div className="flex gap-4">
          <button onClick={accept} className="rounded-lg bg-violet-600 px-6 py-2 text-white">
            Accept All
          </button>
          <button onClick={decline} className="rounded-lg border px-6 py-2">
            Essential Only
          </button>
        </div>
      </div>
    </div>
  );
}


