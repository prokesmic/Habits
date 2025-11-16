"use client";

import { generateQRDataUrl } from "./qrcode";

export type ShareCard = {
  type: "streak" | "money" | "challenge" | "milestone";
  user: { name: string; avatar: string };
  data: {
    streak?: number;
    amount?: number;
    habit: string;
    message?: string;
    opponent?: { name: string; avatar: string };
  };
  gradient: { from: string; to: string };
  size: "1080x1080" | "1200x630";
};

export const GRADIENTS = {
  streak: { from: "#8B5CF6", to: "#3B82F6" },
  money: { from: "#10B981", to: "#F59E0B" },
  challenge: { from: "#F59E0B", to: "#F97316" },
  milestone: { from: "#EC4899", to: "#8B5CF6" },
};

export async function generateShareCard(card: ShareCard): Promise<Blob> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  if (card.size === "1080x1080") {
    canvas.width = 1080;
    canvas.height = 1080;
  } else {
    canvas.width = 1200;
    canvas.height = 630;
  }
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, card.gradient.from);
  gradient.addColorStop(1, card.gradient.to);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Load avatar
  const avatarImg = await loadImage(card.user.avatar);
  const avatarSize = 200;
  const avatarX = (canvas.width - avatarSize) / 2;
  const avatarY = 150;

  // Draw circular avatar with white border
  ctx.save();
  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2 + 5, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.clip();
  ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
  ctx.restore();

  // Text
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";

  if (card.type === "streak") {
    ctx.font = "bold 80px Arial";
    ctx.fillText(`🔥 ${card.data.streak}-DAY STREAK 🔥`, canvas.width / 2, 450);
    ctx.font = "48px Arial";
    ctx.fillText(card.data.habit, canvas.width / 2, 540);
    ctx.font = "italic 36px Arial";
    if (card.data.message) ctx.fillText(`"${card.data.message}"`, canvas.width / 2, 620);
  } else if (card.type === "money") {
    ctx.font = "bold 80px Arial";
    ctx.fillText(`💰 WON $${card.data.amount} 💰`, canvas.width / 2, 450);
    ctx.font = "44px Arial";
    ctx.fillText(card.data.habit, canvas.width / 2, 540);
    ctx.font = "italic 36px Arial";
    if (card.data.message) ctx.fillText(`"${card.data.message}"`, canvas.width / 2, 620);
  } else if (card.type === "challenge") {
    ctx.font = "bold 76px Arial";
    ctx.fillText(`🏆 CHALLENGE WON! 🏆`, canvas.width / 2, 450);
    ctx.font = "44px Arial";
    ctx.fillText(`Beat ${card.data.opponent?.name} in ${card.data.habit}`, canvas.width / 2, 540);
    ctx.font = "italic 36px Arial";
    if (card.data.message) ctx.fillText(`"${card.data.message}"`, canvas.width / 2, 620);
  }

  // Logo placeholder
  ctx.font = "32px Arial";
  ctx.fillText("habittracker.app", canvas.width / 2, 850);

  // QR Code
  const url = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/share/${card.type}/${encodeURIComponent(
    card.user.name,
  )}`;
  const qrDataUrl = await generateQRDataUrl(url);
  const qrImg = await loadImage(qrDataUrl);
  ctx.drawImage(qrImg, canvas.width - 180, canvas.height - 180, 150, 150);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/png");
  });
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}


