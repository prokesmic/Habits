import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { TriforceInfo } from "@/types/triforce";

interface TriforceBadgesProps {
  info: TriforceInfo;
  /** Display style: inline for cards, stacked for detail views */
  variant?: "inline" | "stacked" | "compact";
  /** Additional className for the container */
  className?: string;
  /** Show labels next to icons */
  showLabels?: boolean;
}

/**
 * TriforceBadges - Visual representation of Squad/Challenge/Stakes
 *
 * Displays the "triforce" of:
 * - Squad (social group)
 * - Challenge (time-bound commitment)
 * - Stakes (optional money)
 */
export function TriforceBadges({
  info,
  variant = "inline",
  className,
  showLabels = true,
}: TriforceBadgesProps) {
  const { hasSquad, hasChallenge, hasStake, squadName, memberCount, challengeDays, stakeAmount, totalPool } = info;

  // If nothing to show
  if (!hasSquad && !hasChallenge && !hasStake) {
    return null;
  }

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-1.5 text-xs", className)}>
        {hasSquad && (
          <span className="inline-flex items-center gap-0.5 text-slate-600" title={squadName || "Squad"}>
            <span>&#x1F465;</span>
            {memberCount && <span className="text-[10px]">{memberCount}</span>}
          </span>
        )}
        {hasChallenge && (
          <span className="inline-flex items-center gap-0.5 text-slate-600" title={`${challengeDays} days`}>
            <span>&#x1F3C1;</span>
            {challengeDays && <span className="text-[10px]">{challengeDays}d</span>}
          </span>
        )}
        {hasStake && (
          <span className="inline-flex items-center gap-0.5 text-emerald-600" title={`$${stakeAmount} stake`}>
            <span>&#x1F4B0;</span>
            {stakeAmount && <span className="text-[10px]">${stakeAmount}</span>}
          </span>
        )}
      </div>
    );
  }

  if (variant === "stacked") {
    return (
      <div className={cn("space-y-2 text-sm", className)}>
        {hasSquad && (
          <div className="flex items-center gap-2 text-slate-700">
            <span className="text-base">&#x1F465;</span>
            <div>
              <span className="font-medium">Squad</span>
              {squadName && <span className="text-slate-500"> · {squadName}</span>}
              {memberCount && <span className="text-slate-500"> · {memberCount} members</span>}
            </div>
          </div>
        )}
        {hasChallenge && (
          <div className="flex items-center gap-2 text-slate-700">
            <span className="text-base">&#x1F3C1;</span>
            <div>
              <span className="font-medium">Challenge</span>
              {challengeDays && <span className="text-slate-500"> · {challengeDays} days</span>}
            </div>
          </div>
        )}
        {hasStake && (
          <div className="flex items-center gap-2 text-emerald-700">
            <span className="text-base">&#x1F4B0;</span>
            <div>
              <span className="font-medium">${stakeAmount} stake</span>
              {totalPool && <span className="text-emerald-600"> · ${totalPool} pool</span>}
            </div>
          </div>
        )}
        {!hasSquad && !hasChallenge && !hasStake && (
          <div className="text-slate-500">No commitment yet</div>
        )}
      </div>
    );
  }

  // Default: inline variant
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-xs", className)}>
      {hasSquad && (
        <span className="inline-flex items-center gap-1 text-slate-600">
          <span>&#x1F465;</span>
          {showLabels && (
            <span>
              {squadName || "Squad"}
              {memberCount && ` (${memberCount})`}
            </span>
          )}
        </span>
      )}
      {hasChallenge && (
        <span className="inline-flex items-center gap-1 text-slate-600">
          <span>&#x1F3C1;</span>
          {showLabels && <span>{challengeDays} days</span>}
        </span>
      )}
      {hasStake && (
        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
          <span>&#x1F4B0;</span>
          {showLabels && <span>${stakeAmount} stake</span>}
        </span>
      )}
    </div>
  );
}

/**
 * TriforceMetaLine - A single-line summary of the triforce
 * For use in card headers or list items
 */
export function TriforceMetaLine({
  info,
  className,
}: {
  info: TriforceInfo;
  className?: string;
}) {
  const parts: ReactNode[] = [];

  if (info.hasSquad) {
    parts.push(
      <span key="squad" className="inline-flex items-center gap-1">
        <span>&#x1F465;</span>
        <span>{info.squadName || "Squad"}</span>
      </span>
    );
  }

  if (info.hasChallenge && info.challengeDays) {
    parts.push(
      <span key="challenge" className="inline-flex items-center gap-1">
        <span>&#x1F3C1;</span>
        <span>{info.challengeDays} days</span>
      </span>
    );
  }

  if (info.hasStake && info.stakeAmount) {
    parts.push(
      <span key="stake" className="inline-flex items-center gap-1 text-emerald-600 font-medium">
        <span>&#x1F4B0;</span>
        <span>${info.stakeAmount} stake</span>
      </span>
    );
  }

  // Join with separators
  const elements: ReactNode[] = [];
  parts.forEach((part, i) => {
    if (i > 0) {
      elements.push(
        <span key={`sep-${i}`} className="text-slate-300">
          ·
        </span>
      );
    }
    elements.push(part);
  });

  if (elements.length === 0) {
    return (
      <span className={cn("text-xs text-slate-500", className)}>
        Squad only
      </span>
    );
  }

  return (
    <div className={cn("flex items-center gap-2 text-xs text-slate-600", className)}>
      {elements}
    </div>
  );
}

/**
 * TriforceChip - Small badge showing what's included
 * For use in list items or compact views
 */
export function TriforceChip({
  info,
  className,
}: {
  info: TriforceInfo;
  className?: string;
}) {
  // Determine the "level" of commitment
  let label: string;
  let bgColor: string;
  let textColor: string;

  if (info.hasStake) {
    label = `$${info.stakeAmount}`;
    bgColor = "bg-emerald-50";
    textColor = "text-emerald-700";
  } else if (info.hasChallenge) {
    label = `${info.challengeDays}d`;
    bgColor = "bg-amber-50";
    textColor = "text-amber-700";
  } else if (info.hasSquad) {
    label = "Squad";
    bgColor = "bg-slate-100";
    textColor = "text-slate-600";
  } else {
    return null;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        bgColor,
        textColor,
        className
      )}
    >
      {info.hasStake && <span>&#x1F4B0;</span>}
      {!info.hasStake && info.hasChallenge && <span>&#x1F3C1;</span>}
      {!info.hasStake && !info.hasChallenge && info.hasSquad && <span>&#x1F465;</span>}
      {label}
    </span>
  );
}

/**
 * Quick helper to create TriforceInfo for common cases
 */
export function createQuickTriforceInfo(params: {
  squadName?: string;
  memberCount?: number;
  challengeDays?: number;
  stakeAmount?: number;
  totalPool?: number;
}): TriforceInfo {
  return {
    hasSquad: !!(params.squadName || params.memberCount),
    squadName: params.squadName,
    memberCount: params.memberCount,
    hasChallenge: !!params.challengeDays,
    challengeDays: params.challengeDays,
    hasStake: !!params.stakeAmount,
    stakeAmount: params.stakeAmount,
    totalPool: params.totalPool,
    currency: "USD",
  };
}
