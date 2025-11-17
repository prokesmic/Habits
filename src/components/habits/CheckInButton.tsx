"use client";

import { useState, useRef } from "react";
import { Camera, Image as ImageIcon, Check } from "lucide-react";

interface CheckInButtonProps {
  habitId: string;
  habitName: string;
  onCheckIn: (proof?: CheckInProof) => Promise<void>;
  requiresProof?: boolean;
}

interface CheckInProof {
  type: "simple" | "photo" | "note" | "integration";
  photoUrl?: string;
  note?: string;
  integrationData?: unknown;
}

export const CheckInButton = ({
  habitId,
  habitName,
  onCheckIn,
  requiresProof = false,
}: CheckInButtonProps) => {
  const [showProofOptions, setShowProofOptions] = useState(false);
  const [proofType, setProofType] = useState<"simple" | "photo" | "note">("simple");
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleSimpleCheckIn = async () => {
    await onCheckIn({ type: "simple" });
    setShowProofOptions(false);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setProofType("photo");
    }
  };

  const handleCheckInWithProof = async () => {
    setIsUploading(true);

    try {
      const proof: CheckInProof = { type: proofType };

      if (proofType === "photo" && photo) {
        // Upload photo
        const formData = new FormData();
        formData.append("photo", photo);
        formData.append("habitId", habitId);

        const response = await fetch("/api/upload-proof", {
          method: "POST",
          body: formData,
        });

        const { url } = await response.json();
        proof.photoUrl = url;
      }

      if (proofType === "note") {
        proof.note = note;
      }

      await onCheckIn(proof);

      // Reset state
      setShowProofOptions(false);
      setPhoto(null);
      setPhotoPreview(null);
      setNote("");
      setProofType("simple");
    } catch (error) {
      console.error("Check-in failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!showProofOptions) {
    return (
      <div className="space-y-2">
        <button
          onClick={() => setShowProofOptions(true)}
          className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
          type="button"
        >
          <Check className="w-5 h-5" />
          Check In
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-green-500 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-gray-900">Check in to {habitName}</h3>
        <button
          onClick={() => setShowProofOptions(false)}
          className="text-gray-600 hover:text-gray-700"
          type="button"
        >
          ✕
        </button>
      </div>

      {/* Proof Type Selection */}
      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          {requiresProof
            ? "Photo proof required for this habit"
            : "How do you want to check in?"}
        </p>

        {!requiresProof && (
          <button
            onClick={handleSimpleCheckIn}
            disabled={isUploading}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-green-500 transition-colors text-left flex items-center gap-3"
            type="button"
          >
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <Check className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">Simple Check-In</div>
              <div className="text-sm text-gray-500">Just mark it done</div>
            </div>
          </button>
        )}

        {/* Photo Options */}
        <div className="space-y-2">
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-green-500 transition-colors text-left flex items-center gap-3"
            type="button"
          >
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Camera className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">Take Photo</div>
              <div className="text-sm text-gray-500">Camera proof</div>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-green-500 transition-colors text-left flex items-center gap-3"
            type="button"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-900">Upload Photo</div>
              <div className="text-sm text-gray-500">From gallery</div>
            </div>
          </button>

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoSelect}
            className="hidden"
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoSelect}
            className="hidden"
          />
        </div>

        {/* Photo Preview */}
        {photoPreview && (
          <div className="relative">
            <img
              src={photoPreview}
              alt="Proof preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              onClick={() => {
                setPhoto(null);
                setPhotoPreview(null);
              }}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              type="button"
            >
              ✕
            </button>
          </div>
        )}

        {/* Note Option */}
        {!requiresProof && (
          <div className="space-y-2">
            <button
              onClick={() => setProofType("note")}
              className={`w-full px-4 py-3 border-2 rounded-lg transition-colors text-left flex items-center gap-3 ${
                proofType === "note"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-green-500"
              }`}
              type="button"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600">📝</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">Add Note</div>
                <div className="text-sm text-gray-500">Quick reflection</div>
              </div>
            </button>

            {proofType === "note" && (
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="How did it go today?"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none resize-none text-gray-900"
                rows={3}
              />
            )}
          </div>
        )}
      </div>

      {/* Submit Button */}
      {(photo || note || proofType === "simple") && (
        <button
          onClick={handleCheckInWithProof}
          disabled={isUploading}
          className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          type="button"
        >
          {isUploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              Complete Check-In
            </>
          )}
        </button>
      )}

      <p className="text-xs text-gray-500 text-center">
        {requiresProof
          ? "Photo proof is required for habits with stakes"
          : "Adding proof increases accountability and engagement"}
      </p>
    </div>
  );
};
