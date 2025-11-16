"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import type { ChallengeType } from "@/data/mockChallenges";

type FilterOption = "starting_soon" | "high_stakes" | "friends" | "1v1" | "group" | "all";
type ChallengeFilterType = ChallengeType | "group" | "all"; // group maps to squad, "all" shows all types

type ChallengeFiltersProps = {
  onFilterChange?: (filter: FilterOption) => void;
  onTypeChange?: (type: ChallengeFilterType) => void;
};

export function ChallengeFilters({ onFilterChange, onTypeChange }: ChallengeFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");
  const [activeType, setActiveType] = useState<ChallengeFilterType>("all");

  const filters: { id: FilterOption; label: string }[] = [
    { id: "starting_soon", label: "Starting Soon" },
    { id: "high_stakes", label: "High Stakes" },
    { id: "friends", label: "Friends" },
    { id: "1v1", label: "1v1" },
    { id: "group", label: "Group" },
    { id: "all", label: "All" },
  ];

  const handleFilterClick = (filter: FilterOption) => {
    setActiveFilter(filter);
    onFilterChange?.(filter);
  };

  const handleTypeClick = (type: ChallengeFilterType) => {
    setActiveType(type);
    onTypeChange?.(type);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Filter className="h-4 w-4" />
        <span>Filter:</span>
      </div>
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => handleFilterClick(filter.id)}
          className={`rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition ${
            activeFilter === filter.id
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

