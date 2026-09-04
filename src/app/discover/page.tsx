"use client";

import { useState } from "react";
import { SearchX } from "lucide-react";
import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { DiscoverControls } from "@/components/customer/DiscoverControls";
import { SlotCard } from "@/components/customer/SlotCard";
import { Button } from "@/components/ui/Button";
import { useBusinesses, useRepository, useSlots } from "@/app-state/hooks";
import { filterAndSortSlots, joinSlots, type DiscoverFilters } from "@/domain/discover";

const DEFAULT_FILTERS: DiscoverFilters = {
  query: "",
  categories: [],
  quickFilters: [],
  sort: "recommended",
};

export default function DiscoverPage() {
  const slots = useSlots();
  const businesses = useBusinesses();
  const repository = useRepository();
  const services = businesses.flatMap((b) => repository.getServices(b.id));
  const [filters, setFilters] = useState<DiscoverFilters>(DEFAULT_FILTERS);

  const joined = joinSlots(slots, businesses, services);
  const results = filterAndSortSlots(joined, filters);

  return (
    <div>
      <ScreenHeader title="Discover" subtitle="Nicosia · Available today" />
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div className="md:max-w-2xl">
          <DiscoverControls filters={filters} onChange={setFilters} />
        </div>

        <div className="mt-5 flex items-baseline justify-between">
          <h2 className="text-[15px] font-semibold text-foreground">
            {results.length === joined.length
              ? "Available today near you"
              : `${results.length} available`}
          </h2>
        </div>

        {results.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No Kenovu Slots match your filters right now."
            description="Try widening your filters or check back a little later — new slots appear as businesses publish them."
            action={
              <Button variant="secondary" size="sm" onClick={() => setFilters(DEFAULT_FILTERS)}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-2.5 pb-8 md:grid-cols-2 xl:grid-cols-3">
            {results.map(({ slot, business, service }) => (
              <SlotCard key={slot.id} slot={slot} business={business} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
