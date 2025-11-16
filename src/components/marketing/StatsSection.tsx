"use client";

import { TrendingUp, Users, DollarSign } from "lucide-react";

const stats = [
  {
    icon: DollarSign,
    value: "$127,450",
    label: "in stakes active right now",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    icon: Users,
    value: "94%",
    label: "of users with squads succeed",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    icon: TrendingUp,
    value: "$83",
    label: "average payout per person",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
];

export function StatsSection() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`rounded-2xl border-2 ${stat.borderColor} ${stat.bgColor} p-6 text-center transition-all hover:shadow-lg`}
          >
            <div className={`mx-auto mb-3 rounded-full bg-white p-3 ${stat.color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <p className={`text-3xl font-bold ${stat.color} sm:text-4xl`}>
              {stat.value}
            </p>
            <p className="mt-2 text-sm font-medium text-slate-700">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}

