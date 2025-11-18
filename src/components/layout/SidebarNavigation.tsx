"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Users, Trophy, User, Settings } from "lucide-react";
import { clsx } from "clsx";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  emoji?: string;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home, emoji: "🏠" },
  { href: "/habits", label: "Habits", icon: BarChart3, emoji: "📊" },
  { href: "/squads", label: "Squads", icon: Users, emoji: "👥" },
  { href: "/challenges", label: "Challenges", icon: Trophy, emoji: "⚔️" },
  { href: "/profile", label: "Profile", icon: User, emoji: "👤" },
  { href: "/settings", label: "Settings", icon: Settings, emoji: "⚙️" },
];

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  // For other routes, check if pathname starts with the href
  return pathname?.startsWith(href) ?? false;
}

export function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-slate-200 md:bg-white">
      <div className="flex h-full flex-col px-4 py-6">
        <Link
          href="/"
          className="mb-8 flex items-center gap-2"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
            M
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">Habitio</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const isActive = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="text-lg leading-none">{item.emoji}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

