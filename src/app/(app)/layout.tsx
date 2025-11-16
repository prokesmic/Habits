import type { ReactNode } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { SidebarNavigation } from "@/components/layout/SidebarNavigation";
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
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Mobile Header - only visible on mobile */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-slate-900"
          >
            Habit Tracker
          </Link>
          {user?.email && (
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {user.email.split("@")[0]}
            </div>
          )}
        </div>
      </header>

      {/* Desktop Header - only visible on desktop */}
      <header className="hidden border-b border-slate-200 bg-white md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight text-slate-900"
          >
            Habit Tracker
          </Link>
          {user?.email && (
            <div className="text-sm font-medium text-slate-600">{user.email}</div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Desktop Sidebar */}
        <SidebarNavigation />

        {/* Main Content */}
        <main className="flex-1 pb-24 md:pb-8">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
      <InstallPrompt />
    </div>
  );
}
