"use client";

import { ReactNode, useEffect } from "react";
import { initAnalytics } from "@/lib/analytics";

export function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    initAnalytics();
  }, []);

  return <>{children}</>;
}

