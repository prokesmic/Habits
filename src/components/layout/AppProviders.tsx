"use client";

import { ReactNode, useEffect, useState } from "react";
import { initAnalytics } from "@/lib/analytics";
import { measurePerformance } from "@/lib/perf/web-vitals";

export function AppProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Initialize analytics and performance monitoring, but don't block rendering
    try {
      initAnalytics();
      measurePerformance();
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("Initialization failed:", error);
      }
    }
  }, []);

  return <>{children}</>;
}

