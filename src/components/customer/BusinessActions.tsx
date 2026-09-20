"use client";

import { useState } from "react";
import { Check, Heart, MapPin, Phone, Share2 } from "lucide-react";
import type { Business } from "@/domain/types";
import { useFavorites, useRepository } from "@/app-state/hooks";
import { CURRENT_CUSTOMER } from "@/domain/constants";
import { cn } from "@/lib/utils";

/**
 * The action row every mature local-business listing carries: call, route,
 * save, share. For a slot that starts in under an hour these are the real
 * next steps, and putting them in one row is what turns the screen from a
 * product page into a listing you can act on.
 */
export function BusinessActions({ business, slotUrl }: { business: Business; slotUrl: string }) {
  const repository = useRepository();
  const favorites = useFavorites();
  const isFavorite = favorites.includes(business.id);
  const [shared, setShared] = useState(false);

  const mapsQuery = encodeURIComponent(
    `${business.name}, ${business.location.addressLine}, ${business.location.area}, Nicosia, Cyprus`,
  );

  async function handleShare() {
    const url = typeof window === "undefined" ? slotUrl : new URL(slotUrl, window.location.origin).href;
    const payload = { title: business.name, text: `${business.name} on Kenovu`, url };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(payload);
        return;
      }
      await navigator.clipboard.writeText(url);
      setShared(true);
      window.setTimeout(() => setShared(false), 2000);
    } catch {
      // A dismissed share sheet and a blocked clipboard both land here and
      // neither is an error the customer needs to see.
    }
  }

  return (
    <div className="flex items-stretch gap-2">
      <ActionItem as="a" href={`tel:${business.phone.replace(/\s/g, "")}`} label="Call">
        <Phone className="h-[18px] w-[18px]" />
      </ActionItem>

      <ActionItem
        as="a"
        href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
        target="_blank"
        rel="noreferrer"
        label="Directions"
      >
        <MapPin className="h-[18px] w-[18px]" />
      </ActionItem>

      <ActionItem
        onClick={() => repository.toggleFavorite(CURRENT_CUSTOMER.id, business.id)}
        label={isFavorite ? "Saved" : "Save"}
        active={isFavorite}
      >
        <Heart className={cn("h-[18px] w-[18px]", isFavorite && "fill-current")} />
      </ActionItem>

      <ActionItem onClick={handleShare} label={shared ? "Copied" : "Share"} active={shared}>
        {shared ? <Check className="h-[18px] w-[18px]" /> : <Share2 className="h-[18px] w-[18px]" />}
      </ActionItem>
    </div>
  );
}

function ActionItem({
  as,
  label,
  active,
  children,
  ...props
}: {
  as?: "a";
  label: string;
  active?: boolean;
  children: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement> &
  React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const className = cn(
    "press flex flex-1 flex-col items-center justify-center gap-1.5 rounded-[var(--radius-md)]",
    "bg-surface py-2.5 shadow-e1",
    active ? "text-accent" : "text-primary",
  );

  const content = (
    <>
      {children}
      <span className="t-caption font-semibold text-foreground">{label}</span>
    </>
  );

  if (as === "a") {
    return (
      <a className={className} {...props}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" className={className} {...props}>
      {content}
    </button>
  );
}
