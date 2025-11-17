"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import {
  Calendar,
  Users,
  Compass,
  Trophy,
  Plus,
  Bell,
  User,
  TrendingUp,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

type Props = {
  userEmail?: string | null;
  userAvatar?: string | null;
};

const mainNavItems = [
  {
    label: "Today",
    href: "/dashboard",
    icon: Calendar,
    description: "Today's habits and progress",
  },
  {
    label: "Squads",
    href: "/squads",
    icon: Users,
    description: "Your accountability squads",
  },
  {
    label: "Discover",
    href: "/discover",
    icon: Compass,
    description: "Find habits and challenges",
  },
  {
    label: "Challenges",
    href: "/challenges",
    icon: Trophy,
    description: "Compete and win",
  },
];

export function TopNavigation({ userEmail, userAvatar }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const isActivePath = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname?.startsWith(href) ?? false;
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* LEFT: Logo + Nav Items */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                H
              </div>
              <span className="font-bold text-xl text-gray-900">Habitee</span>
            </Link>

            {/* Nav Links - Desktop only */}
            <div className="hidden md:flex items-center gap-1">
              {mainNavItems.map((item) => {
                const isActive = isActivePath(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive
                        ? "bg-orange-50 text-orange-600"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    title={item.description}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Actions + User Menu */}
          <div className="flex items-center gap-3">
            {/* New Habit Button */}
            <button
              onClick={() => router.push("/habits/new")}
              className="hidden sm:flex px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden lg:inline">New Habit</span>
            </button>

            {/* Notifications */}
            <button
              onClick={() => router.push("/notifications")}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              type="button"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* User Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-2 transition-colors"
                type="button"
              >
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-blue-400 flex items-center justify-center text-white font-semibold text-sm">
                    {userEmail?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  />

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border z-50 py-2">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b">
                      <div className="font-semibold text-gray-900">
                        {userEmail?.split("@")[0] || "User"}
                      </div>
                      <div className="text-sm text-gray-600 truncate">
                        {userEmail}
                      </div>
                    </div>

                    {/* Menu Items */}
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        router.push("/profile");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </button>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        router.push("/analytics");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Analytics
                    </button>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        router.push("/settings");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>

                    <div className="border-t border-gray-100 my-1" />

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
