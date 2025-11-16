"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Users, Trophy, User } from "lucide-react";
import { clsx } from "clsx";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  emoji?: string;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: Home, emoji: "🏠" },
  { href: "/habits", label: "Habits", icon: BarChart3, emoji: "📊" },
  { href: "/squads", label: "Squads", icon: Users, emoji: "👥" },
  { href: "/challenges", label: "Challenges", icon: Trophy, emoji: "⚔️" },
  { href: "/profile", label: "Profile", icon: User, emoji: "👤" },
];

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  // For other routes, check if pathname starts with the href
  return pathname?.startsWith(href) ?? false;
}

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white pb-2 shadow-lg md:hidden"
      style={{ 
        paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 active:bg-slate-50 active:text-slate-900"
              )}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="text-xl leading-none">{item.emoji}</span>
              <span className="text-[10px] font-medium leading-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

