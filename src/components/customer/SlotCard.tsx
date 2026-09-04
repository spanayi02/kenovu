"use client";

import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import type { Business, BusinessService, KenovuSlot } from "@/domain/types";
import { CategoryArt } from "@/components/shared/CategoryArt";
import { PriceTag } from "@/components/shared/PriceTag";
import { RatingLine } from "@/components/shared/RatingLine";
import { formatCountdown, formatDateTimeLabel } from "@/domain/time";
import { cn } from "@/lib/utils";
import { useFavorites, useRepository } from "@/app-state/hooks";
import { CURRENT_CUSTOMER } from "@/domain/constants";

export function SlotCard({
  slot,
  business,
  service,
}: {
  slot: KenovuSlot;
  business: Business;
  service: BusinessService;
}) {
  const repository = useRepository();
  const favorites = useFavorites();
  const isFavorite = favorites.includes(business.id);

  return (
    <div className="relative">
      {/* The favorite button is a sibling, not a descendant, of the link —
          nesting a <button> inside an <a> is invalid HTML and pollutes the
          link's accessible name with the button's label. */}
      <button
        type="button"
        onClick={() => repository.toggleFavorite(CURRENT_CUSTOMER.id, business.id)}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? "Remove from saved" : "Save business"}
        className="absolute right-2.5 top-2.5 z-10 text-muted-foreground transition-colors hover:text-accent"
      >
        <Heart className={cn("h-4.5 w-4.5", isFavorite && "fill-accent text-accent")} />
      </button>

      <Link
        href={`/discover/${slot.id}`}
        className="group flex gap-3 rounded-[var(--radius-lg)] border border-border bg-surface p-2.5 transition-shadow hover:shadow-sm"
      >
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[var(--radius-md)]">
          <CategoryArt
            category={business.category}
            imageKey={business.imageKey}
            className="h-full w-full"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          <div>
            <p className="truncate pr-6 text-[15px] font-semibold leading-snug text-foreground">
              {service.name}
            </p>
            <p className="truncate text-[13px] text-muted-foreground">{business.name}</p>
            <div className="mt-1 flex items-center gap-2 text-[13px] text-muted-foreground">
              <span className="inline-flex items-center gap-0.5">
                <MapPin className="h-3 w-3" />
                {business.location.area} · {business.location.distanceKm.toFixed(1)} km
              </span>
            </div>
            <RatingLine rating={business.rating} reviewCount={business.reviewCount} className="mt-0.5" />
          </div>

          <div className="mt-1.5 flex items-end justify-between gap-2">
            <div>
              <p className="text-[13px] font-medium text-foreground">
                {formatDateTimeLabel(slot.startTime)}
              </p>
              <p className="text-[12px] text-muted-foreground">{formatCountdown(slot.startTime)}</p>
            </div>
            <PriceTag normalPrice={slot.normalPrice} kenovuPrice={slot.kenovuPrice} size="md" />
          </div>
        </div>
      </Link>
    </div>
  );
}
