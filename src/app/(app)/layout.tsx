import Link from "next/link";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/habits", label: "Habits" },
  { href: "/squads", label: "Squads" },
  { href: "/challenges", label: "Challenges" },
  { href: "/profile", label: "Profile" },
  { href: "/settings", label: "Settings" },
];

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900">
            Habit Tracker
          </Link>
          <nav className="flex flex-wrap gap-2 text-sm text-slate-600">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {user?.email}
          </div>
        </div>
      </header>
      <main className="mx-auto flex max-w-6xl flex-1 flex-col px-4 py-8">{children}</main>
    </div>
  );
}
