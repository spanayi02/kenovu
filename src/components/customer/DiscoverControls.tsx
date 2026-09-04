"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { CATEGORY_LABELS } from "@/domain/constants";
import { SERVICE_CATEGORIES, type ServiceCategory } from "@/domain/types";
import type { DiscoverFilters, QuickFilter, SortOption } from "@/domain/discover";
import { cn } from "@/lib/utils";

const QUICK_FILTERS: { id: QuickFilter; label: string }[] = [
  { id: "now", label: "Now" },
  { id: "today", label: "Today" },
  { id: "tomorrow", label: "Tomorrow" },
  { id: "nearby", label: "Nearby" },
  { id: "bigSaving", label: "20%+ less" },
];

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "recommended", label: "Recommended" },
  { id: "startingSoon", label: "Starting soon" },
  { id: "nearest", label: "Nearest" },
  { id: "biggestSaving", label: "Biggest saving" },
  { id: "lowestPrice", label: "Lowest price" },
];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border-strong bg-surface text-foreground hover:bg-surface-muted",
      )}
    >
      {children}
    </button>
  );
}

export function DiscoverControls({
  filters,
  onChange,
}: {
  filters: DiscoverFilters;
  onChange: (next: DiscoverFilters) => void;
}) {
  function toggleCategory(category: ServiceCategory) {
    const has = filters.categories.includes(category);
    onChange({
      ...filters,
      categories: has
        ? filters.categories.filter((c) => c !== category)
        : [...filters.categories, category],
    });
  }

  function toggleQuick(id: QuickFilter) {
    const has = filters.quickFilters.includes(id);
    onChange({
      ...filters,
      quickFilters: has
        ? filters.quickFilters.filter((f) => f !== id)
        : [...filters.quickFilters, id],
    });
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          placeholder="Search massage, nails, haircut…"
          className="h-11 w-full rounded-[var(--radius-md)] border border-border-strong bg-surface pl-9 pr-3.5 text-[15px] placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {SERVICE_CATEGORIES.map((category) => (
          <Chip
            key={category}
            active={filters.categories.includes(category)}
            onClick={() => toggleCategory(category)}
          >
            {CATEGORY_LABELS[category]}
          </Chip>
        ))}
      </div>

      <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4">
        {QUICK_FILTERS.map((qf) => (
          <Chip key={qf.id} active={filters.quickFilters.includes(qf.id)} onClick={() => toggleQuick(qf.id)}>
            {qf.label}
          </Chip>
        ))}
        <div className="mx-1 h-4 w-px shrink-0 bg-border-strong" />
        <label className="flex shrink-0 items-center gap-1.5 rounded-full border border-border-strong bg-surface px-3 py-1.5 text-[13px] font-medium text-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
          <select
            value={filters.sort}
            onChange={(e) => onChange({ ...filters, sort: e.target.value as SortOption })}
            className="bg-transparent outline-none"
            aria-label="Sort"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
