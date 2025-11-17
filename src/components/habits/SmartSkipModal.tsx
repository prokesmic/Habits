"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Plane, Thermometer, Heart, Clock, AlertTriangle } from "lucide-react";

interface SmartSkipModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitName: string;
  currentStreak: number;
  onConfirmSkip: (reason: string, note?: string) => void;
}

const skipReasons = [
  {
    id: "sick",
    label: "Sick or unwell",
    icon: Thermometer,
    description: "Health comes first. Your streak stays protected.",
    preservesStreak: true,
  },
  {
    id: "travel",
    label: "Traveling",
    icon: Plane,
    description: "On the road or in the air. Skip without penalty.",
    preservesStreak: true,
  },
  {
    id: "emergency",
    label: "Family emergency",
    icon: Heart,
    description: "Life happens. We've got your back.",
    preservesStreak: true,
  },
  {
    id: "rest",
    label: "Rest day (planned)",
    icon: Calendar,
    description: "Strategic rest is part of the journey.",
    preservesStreak: true,
  },
  {
    id: "busy",
    label: "Too busy today",
    icon: Clock,
    description: "This will break your streak. Consider a streak freeze instead.",
    preservesStreak: false,
  },
];

export function SmartSkipModal({
  isOpen,
  onClose,
  habitName,
  currentStreak,
  onConfirmSkip,
}: SmartSkipModalProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  const selectedReasonData = skipReasons.find((r) => r.id === selectedReason);

  const handleConfirm = async () => {
    if (!selectedReason) return;

    setIsConfirming(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    onConfirmSkip(selectedReason, note);
    setIsConfirming(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Smart Skip</h2>
              <p className="text-sm text-slate-500">{habitName}</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="mb-4 text-sm text-slate-600">
              Sometimes you need to skip a day. Select a reason to protect your{" "}
              <span className="font-semibold text-amber-600">
                {currentStreak}-day streak
              </span>
              .
            </p>

            {/* Reasons */}
            <div className="mb-4 space-y-2">
              {skipReasons.map((reason) => {
                const Icon = reason.icon;
                const isSelected = selectedReason === reason.id;

                return (
                  <button
                    key={reason.id}
                    onClick={() => setSelectedReason(reason.id)}
                    className={`flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition ${
                      isSelected
                        ? reason.preservesStreak
                          ? "border-emerald-400 bg-emerald-50"
                          : "border-amber-400 bg-amber-50"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isSelected
                          ? reason.preservesStreak
                            ? "bg-emerald-500 text-white"
                            : "bg-amber-500 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">
                          {reason.label}
                        </span>
                        {reason.preservesStreak ? (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                            STREAK SAFE
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                            BREAKS STREAK
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-600">
                        {reason.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Optional note */}
            {selectedReason && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
              >
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Add a note (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Any details you want to remember..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                  rows={2}
                />
              </motion.div>
            )}

            {/* Warning for streak-breaking skip */}
            {selectedReasonData && !selectedReasonData.preservesStreak && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-xl bg-amber-50 p-3"
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
                  <div className="text-sm text-amber-900">
                    <p className="font-semibold">This will break your streak</p>
                    <p className="mt-1 text-xs">
                      Consider using a streak freeze instead to protect your{" "}
                      {currentStreak}-day streak.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedReason || isConfirming}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition active:scale-95 disabled:opacity-50 ${
                selectedReasonData?.preservesStreak
                  ? "bg-emerald-500 hover:bg-emerald-600"
                  : "bg-amber-500 hover:bg-amber-600"
              }`}
            >
              {isConfirming ? "Confirming..." : "Confirm Skip"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
