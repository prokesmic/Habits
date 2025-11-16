"use client";

import { useState } from "react";

export function DataExport() {
  const [period, setPeriod] = useState<"30d" | "90d" | "year" | "all">("30d");
  const [exporting, setExporting] = useState(false);
  async function handleExport(format: "csv" | "json" | "pdf") {
    setExporting(true);
    try {
      const res = await fetch(`/api/analytics/export?format=${format}&period=${period}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `habit-tracker-${period}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Failed to export data");
    } finally {
      setExporting(false);
    }
  }
  return (
    <div className="rounded-lg border bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Export Your Data</h3>
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">Time Period:</label>
        <select value={period} onChange={(e) => setPeriod(e.target.value as any)} className="rounded-lg border px-4 py-2">
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="year">This year</option>
          <option value="all">All time</option>
        </select>
      </div>
      <div className="space-y-3">
        <button
          onClick={() => handleExport("csv")}
          disabled={exporting}
          className="w-full rounded-lg border px-4 py-3 text-left hover:bg-gray-50 disabled:opacity-50"
        >
          <div className="font-medium">Export as CSV</div>
          <div className="text-sm text-gray-600">Spreadsheet-compatible format</div>
        </button>
        <button
          onClick={() => handleExport("json")}
          disabled={exporting}
          className="w-full rounded-lg border px-4 py-3 text-left hover:bg-gray-50 disabled:opacity-50"
        >
          <div className="font-medium">Export as JSON</div>
          <div className="text-sm text-gray-600">Developer-friendly format</div>
        </button>
        <button
          onClick={() => handleExport("pdf")}
          disabled={exporting}
          className="w-full rounded-lg border px-4 py-3 text-left hover:bg-gray-50 disabled:opacity-50"
        >
          <div className="font-medium">Generate PDF Report</div>
          <div className="text-sm text-gray-600">Comprehensive visual report</div>
        </button>
      </div>
    </div>
  );
}


