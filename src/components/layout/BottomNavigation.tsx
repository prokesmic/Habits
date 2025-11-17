"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Users, Compass, Trophy, User, Plus } from "lucide-react";
import { clsx } from "clsx";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isFab?: boolean;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Today", icon: Calendar },
  { href: "/challenges", label: "Challenges", icon: Trophy },
  { href: "/habits/new", label: "Add", icon: Plus, isFab: true },
  { href: "/squads", label: "Squads", icon: Users },
  { href: "/profile", label: "Profile", icon: User },
];

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  if (href === "/habits/new") {
    return false; // FAB is never "active"
  }
  return pathname?.startsWith(href) ?? false;
}

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white shadow-lg md:hidden"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = isActivePath(pathname, item.href);
          const Icon = item.icon;

          // FAB (Floating Action Button) for "Add"
          if (item.isFab) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center shadow-lg -mt-8 active:scale-95 transition-transform"
                aria-label={item.label}
              >
                <Icon className="w-6 h-6" />
              </Link>
            );
          }

          // Regular nav items
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex min-h-[44px] min-w-[60px] flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-colors active:scale-95",
                isActive
                  ? "text-orange-600"
                  : "text-slate-600 active:text-slate-900"
              )}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={clsx("w-5 h-5", isActive && "stroke-[2.5]")}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
