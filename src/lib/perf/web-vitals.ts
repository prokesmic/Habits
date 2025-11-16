export const measurePerformance = () => {
  if (typeof window === "undefined") return;
  try {
    // FCP
    const fcpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-contentful-paint") {
          reportMetric("FCP", entry.startTime);
        }
      }
    });
    fcpObserver.observe({ entryTypes: ["paint"] });

    // LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1] as PerformanceEntry | undefined;
      if (last) reportMetric("LCP", last.startTime);
    });
    lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

    // CLS
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any) {
        if (!entry.hadRecentInput) clsValue += entry.value;
      }
      reportMetric("CLS", clsValue);
    });
    clsObserver.observe({ entryTypes: ["layout-shift"] });
  } catch {
    // ignore if PerformanceObserver not available
  }
};

function reportMetric(name: string, value: number) {
  try {
    void fetch("/api/analytics/performance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, value, id: String(Math.random()), timestamp: Date.now() }),
      keepalive: true,
    });
  } catch {
    // no-op
  }
}


