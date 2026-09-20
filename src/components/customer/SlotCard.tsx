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

/**
 * Photo-first, the way every mature local marketplace builds this card: a
 * wide image with the saving badged on it and the save control in the
 * corner, then a short meta block underneath. The earlier thumbnail-and-
 * text row scanned like a settings list; a marketplace sells the room, the
 * hands, the light, and the photograph has to carry that weight.
 */
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
        className="press absolute right-1.5 top-1.5 z-10 flex h-11 w-11 items-center justify-center"
      >
        <Heart
          className={cn(
            "h-[22px] w-[22px] drop-shadow-sm",
            isFavorite ? "fill-accent text-accent" : "fill-black/25 text-white",
          )}
          strokeWidth={1.8}
        />
      </button>

      <Link
        href={`/discover/${slot.id}`}
        className="press-soft block overflow-hidden rounded-[var(--radius-lg)] bg-surface shadow-e1 active:shadow-e2"
      >
        <div className="relative aspect-[16/9] w-full">
          <CategoryArt
            category={business.category}
            imageKey={`${business.imageKey}-${service.id}`}
            className="h-full w-full"
            sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
            priority={priority}
          />
          {discount > 0 && (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-accent px-2 py-1 text-[11px] font-bold leading-none text-accent-foreground">
              {discount}% less today
            </span>
          )}
        </div>

        <div className="p-3">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-[15px] font-bold tracking-[-0.012em] text-foreground">
              {service.name}
            </p>
            <span className="inline-flex shrink-0 items-center gap-0.5 text-[13px]">
              <Star className="h-3.5 w-3.5 fill-current text-foreground" />
              <span className="font-semibold text-foreground">{business.rating.toFixed(1)}</span>
            </span>
          </div>

          <p className="t-subhead mt-0.5 truncate text-muted-foreground">
            {business.name}
            <span className="mx-1">·</span>
            <MapPin className="mb-0.5 inline h-3 w-3" /> {business.location.area}{" "}
            {business.location.distanceKm.toFixed(1)} km
          </p>

          <div className="mt-2.5 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="t-subhead truncate font-bold tabular-nums text-foreground">
                {formatDateTimeLabel(slot.startTime)}
              </p>
              <p className="t-caption truncate text-muted-foreground">
                {formatCountdown(slot.startTime)}
              </p>
            </div>
            <p className="shrink-0 text-[19px] font-extrabold leading-none tracking-[-0.02em] tabular-nums text-accent">
              {formatPrice(slot.kenovuPrice)}
              <span className="ml-1.5 align-baseline text-[13px] font-medium text-muted-foreground line-through">
                {formatPrice(slot.normalPrice)}
              </span>
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
