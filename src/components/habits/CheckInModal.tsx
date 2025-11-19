"use client";

import { useState, useRef } from "react";
import {
  X,
  Camera,
  Image as ImageIcon,
  MessageSquare,
  Users,
  Check,
  Sparkles,
  Flame
} from "lucide-react";

type CheckInModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CheckInData) => Promise<void>;
  habit: {
    id: string;
    name: string;
    emoji: string;
    currentStreak: number;
    squadName?: string;
  };
};

export type CheckInData = {
  habitId: string;
  note?: string;
  photoUrl?: string;
  shareWithSquad: boolean;
};

export function CheckInModal({ isOpen, onClose, onSubmit, habit }: CheckInModalProps) {
  const [note, setNote] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [shareWithSquad, setShareWithSquad] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        habitId: habit.id,
        note: note || undefined,
        photoUrl: photoPreview || undefined,
        shareWithSquad,
      });
      setShowConfetti(true);
      setTimeout(() => {
        onClose();
        setShowConfetti(false);
        setNote("");
        setPhotoPreview(null);
      }, 1500);
    } catch (error) {
      console.error("Check-in failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!isOpen) return null;

  const newStreak = habit.currentStreak + 1;
  const isMilestone = newStreak % 7 === 0 || newStreak === 1 || newStreak === 30 || newStreak === 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Success State */}
        {showConfetti && (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600 flex flex-col items-center justify-center text-white z-10">
            <div className="text-6xl mb-4">
              {isMilestone ? "🎉" : "✅"}
            </div>
            <h2 className="text-2xl font-bold mb-2">Nice work!</h2>
            <div className="flex items-center gap-2 text-lg">
              <Flame className="w-5 h-5" />
              <span>{newStreak}-day streak</span>
            </div>
            {isMilestone && (
              <div className="mt-3 px-4 py-2 bg-white/20 rounded-full text-sm font-medium">
                Milestone reached!
              </div>
            )}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-xl">
              {habit.emoji}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Check in</h2>
              <p className="text-sm text-gray-500">{habit.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Streak Preview */}
          <div className="flex items-center justify-center gap-3 py-3 px-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">
              This will be day <span className="font-bold text-orange-600">{newStreak}</span> of your streak!
            </span>
            {isMilestone && <Sparkles className="w-4 h-4 text-amber-500" />}
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add a photo <span className="text-gray-400">(optional)</span>
            </label>

            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Check-in preview"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button
                  onClick={removePhoto}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <Camera className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Take photo</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Choose file</span>
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Add a note <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How did it go? Any thoughts or reflections..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none text-sm"
            />
          </div>

          {/* Share with Squad Toggle */}
          {habit.squadName && (
            <label className="flex items-center justify-between p-4 rounded-xl bg-indigo-50 cursor-pointer">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-indigo-600" />
                <div>
                  <div className="font-medium text-gray-900 text-sm">Share with squad</div>
                  <div className="text-xs text-gray-500">Your squad will see this check-in</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={shareWithSquad}
                onChange={(e) => setShareWithSquad(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          )}

          {/* Encouragement */}
          {(photoPreview || note) && shareWithSquad && habit.squadName && (
            <div className="text-xs text-center text-gray-500">
              Photos and notes get <span className="font-medium text-indigo-600">3x more reactions</span> from your squad!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                "Saving..."
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Check in
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Quick check-in inline component for cards
export function InlineCheckIn({
  onQuickCheckIn,
  onDetailedCheckIn,
  isLoading = false
}: {
  onQuickCheckIn: () => void;
  onDetailedCheckIn: () => void;
  isLoading?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onQuickCheckIn}
        disabled={isLoading}
        className="flex-1 py-2 px-4 bg-emerald-500 text-white text-sm font-semibold rounded-full hover:bg-emerald-600 transition-colors disabled:opacity-50"
      >
        {isLoading ? "..." : "Quick check-in"}
      </button>
      <button
        onClick={onDetailedCheckIn}
        className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
        title="Add details"
      >
        <Camera className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
}
