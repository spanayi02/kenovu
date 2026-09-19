"use client";

import Link from "next/link";
import { Heart, MapPin, Star } from "lucide-react";
import type { Business, BusinessService, KenovuSlot } from "@/domain/types";
import { CategoryArt } from "@/components/shared/CategoryArt";
import { formatCountdown, formatDateTimeLabel } from "@/domain/time";
import { calculateDiscountPercentage, formatPrice } from "@/domain/pricing";
import { cn } from "@/lib/utils";
import { useFavorites, useRepository } from "@/app-state/hooks";
import { CURRENT_CUSTOMER } from "@/domain/constants";

export function SlotCard({
  slot,
  business,
  service,
  priority = false,
}: {
  slot: KenovuSlot;
  business: Business;
  service: BusinessService;
  /** Set on the cards above the fold so the first screen's photography is
   * the LCP it should be, not a late pop-in. */
  priority?: boolean;
}) {
  const repository = useRepository();
  const favorites = useFavorites();
  const isFavorite = favorites.includes(business.id);
  const discount = calculateDiscountPercentage(slot.normalPrice, slot.kenovuPrice);

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
        className="press absolute right-1 top-1 z-10 flex h-11 w-11 items-center justify-center text-muted-foreground"
      >
        <Heart
          className={cn("h-[18px] w-[18px]", isFavorite && "fill-accent text-accent")}
          strokeWidth={2}
        />
      </button>

      <Link
        href={`/discover/${slot.id}`}
        className="press-soft flex gap-3 rounded-[var(--radius-lg)] bg-surface p-2.5 shadow-e1 active:shadow-e2"
      >
        <div className="relative h-[5.5rem] w-[5.5rem] shrink-0 overflow-hidden rounded-[var(--radius-md)]">
          <CategoryArt
            category={business.category}
            imageKey={business.imageKey}
            className="h-full w-full"
            priority={priority}
          />
          {discount > 0 && (
            <span className="absolute left-1.5 top-1.5 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold leading-none text-accent-foreground">
              -{discount}%
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          <div className="min-w-0">
            <p className="t-headline truncate pr-9 text-foreground">{service.name}</p>
            <p className="t-subhead truncate text-muted-foreground">{business.name}</p>
            <div className="t-caption mt-1 flex items-center gap-2 text-muted-foreground">
              <span className="inline-flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-current text-foreground" />
                <span className="font-semibold text-foreground">
                  {business.rating.toFixed(1)}
                </span>
              </span>
              <span className="inline-flex items-center gap-0.5">
                <MapPin className="h-3 w-3" />
                {business.location.area} · {business.location.distanceKm.toFixed(1)} km
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="t-subhead truncate font-semibold tabular-nums text-foreground">
                {formatDateTimeLabel(slot.startTime)}
              </p>
              <p className="t-caption truncate text-muted-foreground">
                {formatCountdown(slot.startTime)}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="t-caption text-muted-foreground line-through">
                {formatPrice(slot.normalPrice)}
              </p>
              <p className="text-[19px] font-extrabold leading-none tracking-[-0.02em] tabular-nums text-accent">
                {formatPrice(slot.kenovuPrice)}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
