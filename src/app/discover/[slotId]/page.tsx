"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ChevronLeft, Clock3, Heart, MapPin, ShieldCheck } from "lucide-react";
import {
  useBusiness,
  useFavorites,
  useRepository,
  useServicesForBusiness,
  useSlot,
} from "@/app-state/hooks";
import { CategoryArt } from "@/components/shared/CategoryArt";
import { RatingLine } from "@/components/shared/RatingLine";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { canBookSlot } from "@/domain/rules";
import { formatCountdown, formatDateTimeLabel } from "@/domain/time";
import { CURRENT_CUSTOMER } from "@/domain/constants";
import { cn } from "@/lib/utils";
import { calculateDiscountPercentage, formatPrice } from "@/domain/pricing";

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
  const discount = calculateDiscountPercentage(slot.normalPrice, slot.kenovuPrice);

  return (
    <div className="pb-36 md:pb-32">
      {/* Full-bleed hero. The sheet of content below is lifted over its
          bottom edge so the screen reads as two layers, not two blocks. */}
      <div className="relative h-72 w-full md:h-80">
        <CategoryArt
          category={business.category}
          imageKey={business.imageKey}
          className="h-full w-full"
          sizes="100vw"
          priority
        />
        {/* Scrim only at the top, where the floating controls sit — a
            full-height gradient would grey out the photograph. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-28"
          style={{
            background:
              "linear-gradient(to bottom, rgba(20,18,14,0.38), rgba(20,18,14,0))",
          }}
        />
        <div
          className="absolute inset-x-0 top-0 flex items-center justify-between px-3"
          style={{ paddingTop: "calc(var(--safe-top) + 0.5rem)" }}
        >
          <HeroButton onClick={() => router.back()} label="Back">
            <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
          </HeroButton>
          <HeroButton
            onClick={() => repository.toggleFavorite(CURRENT_CUSTOMER.id, business.id)}
            label={isFavorite ? "Remove from saved" : "Save business"}
            pressed={isFavorite}
          >
            <Heart
              className={cn("h-[18px] w-[18px]", isFavorite && "fill-accent text-accent")}
              strokeWidth={2.2}
            />
          </HeroButton>
        </div>
      </div>

      <div className="relative -mt-6 rounded-t-[var(--radius-xl)] bg-background pt-5">
        <div className="mx-auto max-w-xl px-4">
          <h1 className="t-title text-foreground">{service.name}</h1>

          <p className="t-body mt-1.5 font-semibold text-primary">{business.name}</p>
          <div className="t-subhead mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
            <RatingLine rating={business.rating} reviewCount={business.reviewCount} />
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {business.location.area} · {business.location.distanceKm.toFixed(1)} km
            </span>
          </div>

          <p className="t-body mt-4 text-foreground">{service.description}</p>

          <div className="mt-5 rounded-[var(--radius-lg)] bg-surface p-4 shadow-e1">
            <div className="flex items-center justify-between">
              <span className="t-body inline-flex items-center gap-2 font-semibold tabular-nums text-foreground">
                <Clock3 className="h-4 w-4 text-muted-foreground" />
                {formatDateTimeLabel(slot.startTime)}
              </span>
              <span className="t-subhead font-bold text-accent">
                {formatCountdown(slot.startTime)}
              </span>
            </div>
            <div className="t-subhead mt-2 text-muted-foreground">
              {service.durationMinutes} min · {business.location.addressLine}
            </div>
          </div>

          <div className="mt-3 flex items-start gap-2.5 rounded-[var(--radius-lg)] bg-surface-muted p-4">
            <ShieldCheck className="mt-0.5 h-[18px] w-[18px] shrink-0 text-primary" />
            <p className="t-subhead leading-relaxed text-muted-foreground">
              Pay the Kenovu price shown, no extra booking fee. This is a last-minute slot, so
              please arrive on time. The appointment cannot be rescheduled through Kenovu.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky action bar: a translucent material the content scrolls
          under, carrying the price so the decision and the tap are in the
          same place. */}
      <div
        className="material-thick fixed inset-x-0 bottom-0 z-30 px-4 pt-3"
        style={{
          paddingBottom: "calc(var(--safe-bottom) + 0.875rem)",
          borderTop: "0.5px solid var(--hairline)",
        }}
      >
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="shrink-0">
            <p className="t-caption text-muted-foreground line-through">
              {formatPrice(slot.normalPrice)}
            </p>
            <p className="text-[24px] font-extrabold leading-none tracking-[-0.03em] tabular-nums text-accent">
              {formatPrice(slot.kenovuPrice)}
            </p>
            {discount > 0 && (
              <p className="t-caption mt-1 font-bold text-accent">{discount}% less</p>
            )}
          </div>
          {bookCheck.valid ? (
            <Button
              size="lg"
              className="flex-1"
              variant="accent"
              onClick={() => router.push(`/discover/${slot.id}/confirm`)}
            >
              Book this slot
            </Button>
          ) : (
            <Button size="lg" className="flex-1" disabled>
              {bookCheck.message}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/** A floating control over photography: its own material so it stays
 * legible whatever the image behind it happens to be. */
function HeroButton({
  onClick,
  label,
  pressed,
  children,
}: {
  onClick: () => void;
  label: string;
  pressed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      className="press material-thick flex h-11 w-11 items-center justify-center rounded-full text-foreground shadow-e2"
    >
      {children}
    </button>
  );
}

function TopBackBar() {
  return (
    <div className="px-4" style={{ paddingTop: "calc(var(--safe-top) + 1rem)" }}>
      <Link
        href="/discover"
        className="t-subhead press inline-flex items-center gap-1 text-muted-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Back
      </Link>
    </div>
  );
}
