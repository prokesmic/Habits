'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StreakMilestoneProps {
  habitName: string;
  habitEmoji: string;
  days: number;
  userName: string;
  onClose: () => void;
}

export const StreakMilestone = ({
  habitName,
  habitEmoji,
  days,
  userName,
  onClose
}: StreakMilestoneProps) => {

  useEffect(() => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const getMilestoneMessage = (days: number) => {
    if (days === 7) return "First Week Complete!";
    if (days === 30) return "One Month Strong!";
    if (days === 90) return "Quarter-Year Champion!";
    if (days === 180) return "Half-Year Hero!";
    if (days === 365) return "FULL YEAR!";
    return `${days}-Day Streak!`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${days}-Day Streak!`,
        text: `I just completed ${days} days of ${habitName}!`,
        url: window.location.href
      });
    }
  };

  const handleDownload = () => {
    // Generate shareable image
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d')!;

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#f97316');
    gradient.addColorStop(1, '#3b82f6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 120px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(habitEmoji, 600, 200);

    ctx.font = 'bold 80px sans-serif';
    ctx.fillText(`${days}-Day Streak!`, 600, 350);

    ctx.font = '40px sans-serif';
    ctx.fillText(habitName, 600, 450);

    ctx.font = '30px sans-serif';
    ctx.fillText(`- ${userName}`, 600, 520);

    // Download
    const link = document.createElement('a');
    link.download = `${days}-day-streak.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl p-8 max-w-md w-full text-white text-center shadow-2xl"
      >
        <div className="text-8xl mb-6 animate-bounce">🔥</div>

        <h2 className="text-4xl font-bold mb-2">{getMilestoneMessage(days)}</h2>

        <div className="text-6xl my-6">{habitEmoji}</div>

        <div className="text-2xl font-semibold mb-8">{habitName}</div>

        <div className="bg-white/20 rounded-xl p-6 mb-6">
          <div className="text-5xl font-bold mb-2">{days}</div>
          <div className="text-lg opacity-90">consecutive days</div>
        </div>

        <p className="text-lg opacity-90 mb-8">
          You&apos;re crushing it! Keep the momentum going!
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 px-6 py-3 bg-white text-orange-600 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download
          </button>
          <button
            onClick={handleShare}
            className="flex-1 px-6 py-3 bg-white text-orange-600 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            Share
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 text-white/80 hover:text-white font-medium"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
};
