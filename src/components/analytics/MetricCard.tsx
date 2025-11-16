"use client";

export function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon,
}: {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: string;
}) {
  const isPositive = typeof change === "number" && change > 0;
  const isNegative = typeof change === "number" && change < 0;
  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      </div>
      <div className="mb-2 text-3xl font-bold">{value}</div>
      {typeof change === "number" && (
        <div
          className={`flex items-center gap-1 text-sm ${
            isPositive ? "text-green-600" : isNegative ? "text-red-600" : "text-gray-600"
          }`}
        >
          {isPositive && "↗️"}
          {isNegative && "↘️"}
          {change > 0 && "+"}
          {change.toFixed(1)} {changeLabel}
        </div>
      )}
    </div>
  );
}


