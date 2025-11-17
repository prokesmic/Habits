import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/layout/AppProviders";
import { ClientWrapper } from "@/components/layout/ClientWrapper";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Habitee – Build Better Habits Together",
    template: "%s | Habitee",
  },
  description:
    "Track habits with friends. Stay accountable. Build lasting streaks together.",
  manifest: "/manifest.json",
  applicationName: "Habitee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-50 text-slate-900 antialiased`}
      >
        <ClientWrapper>
          <AppProviders>{children}</AppProviders>
        </ClientWrapper>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
