import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Bell, CheckCircle, Users, Trophy, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">
          Sign in to view notifications.{" "}
          <Link href="/auth/sign-in" className="font-semibold text-blue-600">
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  // TODO: Fetch real notifications from database
  // For now, showing placeholder UI
  const notifications: Array<{
    id: string;
    type: "check_in" | "squad" | "challenge" | "message";
    title: string;
    message: string;
    time: string;
    read: boolean;
  }> = [];

  const getIcon = (type: string) => {
    switch (type) {
      case "check_in":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "squad":
        return <Users className="h-5 w-5 text-indigo-600" />;
      case "challenge":
        return <Trophy className="h-5 w-5 text-amber-600" />;
      case "message":
        return <MessageCircle className="h-5 w-5 text-blue-600" />;
      default:
        return <Bell className="h-5 w-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 p-6 text-white shadow-sm shadow-slate-900/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
              <Bell className="h-3 w-3" />
              <span>Stay Updated</span>
            </div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="mt-1 text-sm opacity-90">
              Keep track of your squad activity and achievements
            </p>
          </div>
        </div>
      </section>

      {/* Notifications List */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
          {notifications.length > 0 && (
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex gap-4 rounded-xl border p-4 transition hover:bg-slate-50 ${
                  notification.read
                    ? "border-slate-200 bg-white"
                    : "border-blue-200 bg-blue-50"
                }`}
              >
                <div className="flex-shrink-0">{getIcon(notification.type)}</div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{notification.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                  <p className="mt-2 text-xs text-slate-500">{notification.time}</p>
                </div>
                {!notification.read && (
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-blue-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Bell className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              No notifications yet
            </h3>
            <p className="max-w-sm text-sm text-slate-600">
              You'll see notifications here when your squad members check in, when you
              win challenges, or when you receive messages.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                href="/squads"
                className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Join a Squad
              </Link>
              <Link
                href="/challenges"
                className="rounded-full border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Browse Challenges
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Notification Settings */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Notification Preferences
        </h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Squad Check-ins</p>
              <p className="text-sm text-slate-600">
                Get notified when your squad members check in
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Challenge Updates</p>
              <p className="text-sm text-slate-600">
                Get notified about challenge results and new challenges
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Messages</p>
              <p className="text-sm text-slate-600">
                Get notified when you receive new messages
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900">Daily Reminders</p>
              <p className="text-sm text-slate-600">
                Get a daily reminder to check in on your habits
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>
      </section>
    </div>
  );
}
