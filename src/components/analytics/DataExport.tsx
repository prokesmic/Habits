"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, FileJson, FileText, Calendar, CheckCircle, Loader2, Shield, Database } from "lucide-react";
import { cn } from "@/lib/utils";

type ExportPeriod = "30d" | "90d" | "year" | "all";
type ExportFormat = "csv" | "json" | "pdf";

const periodOptions: { value: ExportPeriod; label: string; description: string }[] = [
  { value: "30d", label: "Last 30 days", description: "Recent activity" },
  { value: "90d", label: "Last 90 days", description: "Quarterly data" },
  { value: "year", label: "This year", description: "Year to date" },
  { value: "all", label: "All time", description: "Complete history" },
];

const formatOptions: { value: ExportFormat; label: string; description: string; icon: React.ElementType }[] = [
  { value: "csv", label: "CSV Spreadsheet", description: "Open in Excel, Google Sheets, etc.", icon: FileSpreadsheet },
  { value: "json", label: "JSON Data", description: "For developers & integrations", icon: FileJson },
  { value: "pdf", label: "PDF Report", description: "Visual summary with charts", icon: FileText },
];

export function DataExport() {
  const [period, setPeriod] = useState<ExportPeriod>("30d");
  const [exporting, setExporting] = useState<ExportFormat | null>(null);
  const [success, setSuccess] = useState<ExportFormat | null>(null);

  async function handleExport(format: ExportFormat) {
    setExporting(format);
    setSuccess(null);

    try {
      const res = await fetch(`/api/analytics/export?format=${format}&period=${period}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `habitio-export-${period}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      setSuccess(format);
      setTimeout(() => setSuccess(null), 3000);
    } catch (e) {
      console.error("Export failed:", e);
    } finally {
      setExporting(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-indigo-100 p-2.5">
          <Download className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Export Your Data</h2>
          <p className="text-xs text-slate-500">Download your habit data in various formats</p>
        </div>
      </div>

      {/* Time Period Selection */}
      <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm p-4 md:p-5 hover:shadow-md transition-all duration-200">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-indigo-600" />
          <h3 className="text-sm font-semibold text-slate-900">Select Time Period</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setPeriod(option.value)}
              className={cn(
                "rounded-xl p-3 text-left transition-all duration-200",
                period === option.value
                  ? "bg-indigo-50 border-2 border-indigo-500 shadow-sm"
                  : "bg-slate-50 border-2 border-transparent hover:border-slate-200 hover:bg-white"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={cn(
                  "text-sm font-semibold",
                  period === option.value ? "text-indigo-700" : "text-slate-900"
                )}>
                  {option.label}
                </span>
                {period === option.value && (
                  <CheckCircle className="h-4 w-4 text-indigo-600" />
                )}
              </div>
              <span className="text-xs text-slate-500">{option.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Export Format Selection */}
      <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm p-4 md:p-5 hover:shadow-md transition-all duration-200">
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-4 w-4 text-indigo-600" />
          <h3 className="text-sm font-semibold text-slate-900">Choose Format & Download</h3>
        </div>

        <div className="space-y-3">
          {formatOptions.map((option) => {
            const Icon = option.icon;
            const isExporting = exporting === option.value;
            const isSuccess = success === option.value;

            return (
              <button
                key={option.value}
                onClick={() => handleExport(option.value)}
                disabled={exporting !== null}
                className={cn(
                  "w-full rounded-xl border-2 p-4 text-left transition-all duration-200",
                  "hover:shadow-md hover:-translate-y-[1px] active:scale-[0.99]",
                  "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0",
                  isSuccess
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "rounded-xl p-3 transition-colors",
                    isSuccess ? "bg-emerald-100" : "bg-slate-100"
                  )}>
                    {isExporting ? (
                      <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
                    ) : isSuccess ? (
                      <CheckCircle className="h-6 w-6 text-emerald-600" />
                    ) : (
                      <Icon className={cn(
                        "h-6 w-6",
                        option.value === "csv" && "text-emerald-600",
                        option.value === "json" && "text-amber-600",
                        option.value === "pdf" && "text-rose-600"
                      )} />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{option.label}</span>
                      {isSuccess && (
                        <span className="text-xs font-medium text-emerald-600">Downloaded!</span>
                      )}
                    </div>
                    <span className="text-sm text-slate-500">{option.description}</span>
                  </div>

                  <div className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                    isExporting
                      ? "bg-indigo-100 text-indigo-600"
                      : isSuccess
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                  )}>
                    {isExporting ? "Exporting..." : isSuccess ? "Done" : "Download"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-blue-100 p-2 flex-shrink-0">
            <Shield className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-1">Your Data, Your Control</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              All exports contain your personal habit data. Files are generated securely and downloaded directly to your device.
              We recommend storing exports in a safe location and not sharing them publicly.
            </p>
          </div>
        </div>
      </div>

      {/* What's Included */}
      <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm p-4 md:p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">What's Included</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { label: "Habits", description: "All your habits with settings", icon: "📋" },
            { label: "Check-ins", description: "Complete history & proofs", icon: "✅" },
            { label: "Streaks", description: "Current & historical streaks", icon: "🔥" },
            { label: "Analytics", description: "Performance metrics", icon: "📊" },
            { label: "Squads", description: "Squad memberships", icon: "👥" },
            { label: "Stakes", description: "Financial activity", icon: "💰" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <span className="text-xl">{item.icon}</span>
              <div>
                <div className="text-sm font-medium text-slate-900">{item.label}</div>
                <div className="text-xs text-slate-500">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
