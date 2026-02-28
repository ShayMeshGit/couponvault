import React from "react";
import { Search } from "lucide-react";
import { CouponFilter } from "@/types";
import { FILTER_OPTIONS } from "@/utils/coupon-utils";
import { styles } from "./styles";

interface CouponFiltersProps {
  searchQuery: string;
  filter: CouponFilter;
  onSearchChange: (value: string) => void;
  onFilterChange: (filter: CouponFilter) => void;
}

export default function CouponFilters({
  searchQuery,
  filter,
  onSearchChange,
  onFilterChange,
}: CouponFiltersProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.searchGroup}>
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
        <input
          suppressHydrationWarning
          type="text"
          placeholder="Search by name, category, or date (YYYY-MM-DD)..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-14 pr-6 py-4 rounded-3xl border border-zinc-200 bg-white focus:outline-none focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all shadow-sm text-sm"
        />
      </div>

      <div className={styles.chipsRow}>
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option}
            onClick={() => onFilterChange(option)}
            className={`px-6 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
              filter === option
                ? "bg-zinc-900 text-white border-zinc-900 shadow-lg shadow-zinc-900/10"
                : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300"
            }`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
