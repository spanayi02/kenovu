"use client";

import { Bell, Heart, MapPin } from "lucide-react";
import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { CategoryArt } from "@/components/shared/CategoryArt";
import { RatingLine } from "@/components/shared/RatingLine";
import { useBusinesses, useFavorites, useRepository } from "@/app-state/hooks";
import { CURRENT_CUSTOMER } from "@/domain/constants";

export default function SavedPage() {
  const favorites = useFavorites();
  const businesses = useBusinesses();
  const repository = useRepository();
  const saved = businesses.filter((b) => favorites.includes(b.id));

  return (
    <div>
      <ScreenHeader title="Saved" subtitle={saved.length > 0 ? `${saved.length} businesses` : undefined} />
      <div className="mx-auto max-w-6xl px-4 pt-4 pb-8">
        {saved.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="You haven't saved any businesses yet."
            description="Tap the heart on a business or slot to save it here."
          />
        ) : (
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
            {saved.map((business) => (
              <div
                key={business.id}
                className="flex gap-3 rounded-[var(--radius-lg)] border border-border bg-surface p-3"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius-md)]">
                  <CategoryArt category={business.category} imageKey={business.imageKey} className="h-full w-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-[15px] font-semibold text-foreground">{business.name}</p>
                    <button
                      type="button"
                      onClick={() => repository.toggleFavorite(CURRENT_CUSTOMER.id, business.id)}
                      aria-label="Remove from saved"
                      className="text-accent"
                    >
                      <Heart className="h-4.5 w-4.5 fill-accent" />
                    </button>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[13px] text-muted-foreground">
                    <span className="inline-flex items-center gap-0.5">
                      <MapPin className="h-3 w-3" />
                      {business.location.area}
                    </span>
                  </div>
                  <RatingLine rating={business.rating} reviewCount={business.reviewCount} className="mt-0.5" />
                  <p className="mt-1.5 inline-flex items-center gap-1 text-[12px] text-muted-foreground">
                    <Bell className="h-3 w-3" />
                    Get notified when this business has a last-minute opening
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
