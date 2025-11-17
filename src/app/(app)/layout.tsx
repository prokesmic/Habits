import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";

export default async function AppLayout({ children }: { children: ReactNode }) {
  let user = null;
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch (error) {
    // Silently fail if auth check fails - allows page to render
    console.error("Auth check failed in layout:", error);
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Top Navigation */}
      <TopNavigation userEmail={user?.email} userAvatar={null} />

      {/* Main Content */}
      <main className="flex-1 pb-24 md:pb-8">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
      <InstallPrompt />
    </div>
  );
}
