"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ChevronLeft, Clock3, MapPin, ShieldCheck, Star } from "lucide-react";
import {
  useBusiness,
  useServicesForBusiness,
  useSlot,
  useSlots,
} from "@/app-state/hooks";
import { CategoryArt } from "@/components/shared/CategoryArt";
import { BusinessActions } from "@/components/customer/BusinessActions";
import { SlotCard } from "@/components/customer/SlotCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { canBookSlot, deriveEffectiveStatus } from "@/domain/rules";
import { formatCountdown, formatDateTimeLabel } from "@/domain/time";
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
  const allSlots = useSlots();
  const service = useMemo(
    () => services.find((s) => s.id === slot?.serviceId),
    [services, slot],
  );

  // Other live slots at the same business. Real inventory the customer can
  // act on, which is also what fills the screen below the fold — a map or a
  // review block would be invented content.
  const alsoHere = allSlots.filter(
    (s) =>
      s.businessId === slot?.businessId &&
      s.id !== slotId &&
      deriveEffectiveStatus(s) === "active",
  );

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
  const discount = calculateDiscountPercentage(slot.normalPrice, slot.kenovuPrice);

  return (
    <div className="pb-36 md:pb-32">
      {/* Full-bleed hero. The sheet of content below is lifted over its
          bottom edge so the screen reads as two layers, not two blocks. */}
      <div className="relative h-72 w-full md:h-80">
        <CategoryArt
          category={business.category}
          imageKey={`${business.imageKey}-${service.id}`}
          className="h-full w-full"
          sizes="100vw"
          priority
        />
        {/* Scrim only at the top, where the floating control sits — a
            full-height gradient would grey out the photograph. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-28"
          style={{
            background:
              "linear-gradient(to bottom, rgba(20,18,14,0.38), rgba(20,18,14,0))",
          }}
        />
        <div
          className="absolute inset-x-0 top-0 px-3"
          style={{ paddingTop: "calc(var(--safe-top) + 0.5rem)" }}
        >
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="press material-thick flex h-11 w-11 items-center justify-center rounded-full text-foreground shadow-e2"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
          </button>
        </div>
        {discount > 0 && (
          <span className="absolute bottom-10 left-4 rounded-full bg-accent px-2.5 py-1.5 text-[12px] font-bold leading-none text-accent-foreground shadow-e2">
            {discount}% less today
          </span>
        )}
      </div>

      <div className="relative -mt-6 rounded-t-[var(--radius-xl)] bg-background pt-5">
        <div className="mx-auto max-w-xl px-4">
          <h1 className="t-title text-foreground">{service.name}</h1>
          <p className="t-body mt-1.5 font-semibold text-primary">{business.name}</p>
          <div className="t-subhead mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-current text-foreground" />
              <span className="font-semibold text-foreground">{business.rating.toFixed(1)}</span>
              <span>· {business.reviewCount} reviews</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {business.location.area} · {business.location.distanceKm.toFixed(1)} km
            </span>
          </div>

          <div className="mt-4">
            <BusinessActions business={business} slotUrl={`/discover/${slot.id}`} />
          </div>

          <p className="t-body mt-5 text-foreground">{service.description}</p>

          <div className="mt-4 rounded-[var(--radius-lg)] bg-surface p-4 shadow-e1">
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

        {alsoHere.length > 0 && (
          <section className="mt-7">
            <h2 className="t-headline mx-auto mb-2.5 max-w-xl px-4 text-foreground">
              Also at {business.name}
            </h2>
            <div className="no-scrollbar mx-auto flex max-w-xl snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
              {alsoHere.map((other) => {
                const otherService = services.find((s) => s.id === other.serviceId);
                if (!otherService) return null;
                return (
                  <div key={other.id} className="w-64 shrink-0 snap-start">
                    <SlotCard slot={other} business={business} service={otherService} />
                  </div>
                );
              })}
            </div>
          </section>
        )}
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
