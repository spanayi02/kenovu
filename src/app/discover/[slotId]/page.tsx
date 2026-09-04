"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Clock3, Heart, MapPin, ShieldCheck } from "lucide-react";
import { useBusiness, useFavorites, useRepository, useServicesForBusiness, useSlot } from "@/app-state/hooks";
import { CategoryArt } from "@/components/shared/CategoryArt";
import { RatingLine } from "@/components/shared/RatingLine";
import { PriceTag } from "@/components/shared/PriceTag";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { canBookSlot } from "@/domain/rules";
import { formatCountdown, formatDateTimeLabel } from "@/domain/time";
import { CURRENT_CUSTOMER } from "@/domain/constants";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/domain/constants";
import { AlertTriangle } from "lucide-react";
import { formatPrice } from "@/domain/pricing";

export default function SlotDetailsPage({
  params,
}: {
  params: Promise<{ slotId: string }>;
}) {
  const { slotId } = use(params);
  const router = useRouter();
  const slot = useSlot(slotId);
  const business = useBusiness(slot?.businessId);
  const services = useServicesForBusiness(slot?.businessId);
  const service = useMemo(
    () => services.find((s) => s.id === slot?.serviceId),
    [services, slot],
  );
  const repository = useRepository();
  const favorites = useFavorites();

  if (!slot || !business || !service) {
    return (
      <div>
        <TopBackBar />
        <EmptyState
          icon={AlertTriangle}
          title="This slot isn't available anymore."
          description="It may have been booked, cancelled, or the link is out of date."
          action={
            <Link href="/discover">
              <Button size="sm">Back to Discover</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const bookCheck = canBookSlot(slot);
  const isFavorite = favorites.includes(business.id);

  return (
    <div className="pb-44 md:pb-28">
      <div className="relative h-56 w-full">
        <CategoryArt category={business.category} imageKey={business.imageKey} className="h-full w-full" />
        <div
          className="absolute inset-x-0 top-0 flex items-center justify-between px-3"
          style={{ paddingTop: "calc(var(--safe-top) + 0.5rem)" }}
        >
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-foreground shadow-sm"
            aria-label="Back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => repository.toggleFavorite(CURRENT_CUSTOMER.id, business.id)}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? "Remove from saved" : "Save business"}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-foreground shadow-sm"
          >
            <Heart className={cn("h-4.5 w-4.5", isFavorite && "fill-accent text-accent")} />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-4 pt-4">
        <p className="text-[13px] font-medium uppercase tracking-wide text-muted-foreground">
          {CATEGORY_LABELS[service.category]}
        </p>
        <h1 className="mt-0.5 text-2xl font-bold leading-tight text-foreground">{service.name}</h1>

        <p className="mt-1.5 text-[15px] font-medium text-primary">{business.name}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted-foreground">
          <RatingLine rating={business.rating} reviewCount={business.reviewCount} />
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {business.location.area} · {business.location.distanceKm.toFixed(1)} km
          </span>
        </div>

        <p className="mt-4 text-[14.5px] leading-relaxed text-foreground">{service.description}</p>

        <div className="mt-5 rounded-[var(--radius-lg)] border border-border bg-surface-muted p-4">
          <div className="flex items-center justify-between text-[14.5px]">
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
              <Clock3 className="h-4 w-4 text-muted-foreground" />
              {formatDateTimeLabel(slot.startTime)}
            </span>
            <span className="text-accent font-medium">{formatCountdown(slot.startTime)}</span>
          </div>
          <div className="mt-2 text-[13.5px] text-muted-foreground">
            {service.durationMinutes} min · {business.location.addressLine}
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2.5 rounded-[var(--radius-lg)] border border-border p-4">
          <ShieldCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" />
          <p className="text-[13.5px] leading-relaxed text-muted-foreground">
            Pay the Kenovu price shown, no extra booking fee. This is a last-minute slot — please
            arrive on time as the appointment cannot be rescheduled through Kenovu.
          </p>
        </div>

        <div className="mt-6">
          <p className="text-[13px] text-muted-foreground">Normal price</p>
          <PriceTag normalPrice={slot.normalPrice} kenovuPrice={slot.kenovuPrice} size="lg" />
        </div>
      </div>

      <div
        className="fixed inset-x-0 bottom-[calc(4.25rem+var(--safe-bottom))] z-30 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur md:bottom-0"
      >
        <div className="mx-auto max-w-xl">
          {bookCheck.valid ? (
            <Button
              size="lg"
              className="w-full"
              variant="accent"
              onClick={() => router.push(`/discover/${slot.id}/confirm`)}
            >
              Book for {formatPrice(slot.kenovuPrice)}
            </Button>
          ) : (
            <Button size="lg" className="w-full" disabled>
              {bookCheck.message}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function TopBackBar() {
  return (
    <div className="px-4 pt-4" style={{ paddingTop: "calc(var(--safe-top) + 1rem)" }}>
      <Link href="/discover" className="inline-flex items-center gap-1 text-sm text-muted-foreground">
        <ChevronLeft className="h-4 w-4" /> Back
      </Link>
    </div>
  );
}
