"use client";

import { useState } from "react";
import { Filter, ArrowUpDown } from "lucide-react";
import type { SquadCategory } from "@/data/mockSquadsFull";

type FilterType = "trending" | "new" | "friends" | "local" | "high_stakes" | "beginner_friendly";
type SortType = "most_active" | "highest_payouts" | "best_success_rate";

type FiltersAndSortProps = {
  onFilterChange?: (filter: FilterType | null) => void;
  onSortChange?: (sort: SortType) => void;
};

export function FiltersAndSort({ onFilterChange, onSortChange }: FiltersAndSortProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);
  const [activeSort, setActiveSort] = useState<SortType>("most_active");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const filters: { id: FilterType; label: string }[] = [
    { id: "trending", label: "Trending" },
    { id: "new", label: "New" },
    { id: "friends", label: "Friends" },
    { id: "local", label: "Local" },
    { id: "high_stakes", label: "High Stakes" },
    { id: "beginner_friendly", label: "Beginner Friendly" },
  ];

  const sortOptions: { id: SortType; label: string }[] = [
    { id: "most_active", label: "Most active" },
    { id: "highest_payouts", label: "Highest payouts" },
    { id: "best_success_rate", label: "Best success rate" },
  ];

  const handleFilterClick = (filter: FilterType) => {
    const newFilter = activeFilter === filter ? null : filter;
    setActiveFilter(newFilter);
    onFilterChange?.(newFilter);
  };

  const handleSortClick = (sort: SortType) => {
    setActiveSort(sort);
    setShowSortMenu(false);
    onSortChange?.(sort);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
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

      {/* Sort */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">Sort by:</span>
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-2 rounded-full border-2 border-slate-300 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            <ArrowUpDown className="h-4 w-4" />
            {sortOptions.find((opt) => opt.id === activeSort)?.label}
          </button>
          {showSortMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowSortMenu(false)}
                data-testid="sort-menu-backdrop"
              />
              <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg">
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSortClick(option.id)}
                    className={`w-full px-4 py-2 text-left text-sm transition ${
                      activeSort === option.id
                        ? "bg-blue-50 font-semibold text-blue-600"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

