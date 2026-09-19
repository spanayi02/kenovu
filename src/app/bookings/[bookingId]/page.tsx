"use client";

import { use } from "react";
import Link from "next/link";
import { CalendarPlus, CheckCircle2, ChevronLeft, MapPin } from "lucide-react";
import { useBusiness, useRepository } from "@/app-state/hooks";
import { formatDateTimeLabel } from "@/domain/time";
import { formatPrice } from "@/domain/pricing";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { AlertTriangle } from "lucide-react";

export default function BookingDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ bookingId: string }>;
  searchParams: Promise<{ justBooked?: string }>;
}) {
  const { bookingId } = use(params);
  const { justBooked } = use(searchParams);
  const repository = useRepository();
  const booking = repository.getBooking(bookingId);
  const business = useBusiness(booking?.businessId);
  const service = booking ? repository.getService(booking.serviceId) : undefined;

  if (!booking || !business || !service) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Booking not found."
        action={
          <Link href="/bookings">
            <Button size="sm">Back to Bookings</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="pb-10">
      <div className="mx-auto max-w-xl px-4" style={{ paddingTop: "calc(var(--safe-top) + 1rem)" }}>
        <Link
          href="/bookings"
          className="t-subhead press inline-flex h-11 items-center gap-1 font-semibold text-muted-foreground"
        >
          <ChevronLeft className="h-4 w-4" /> My Bookings
        </Link>
      </div>

      <div className="mx-auto max-w-xl px-4 pt-2">
        {justBooked === "1" && (
          <div className="animate-sheet mb-4 flex flex-col items-center gap-2 rounded-[var(--radius-xl)] bg-success-tint px-4 py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-success" strokeWidth={1.8} />
            <p className="t-title mt-1 text-foreground">You&apos;re booked!</p>
            <p className="t-subhead text-muted-foreground">
              Booking reference{" "}
              <span className="font-bold tabular-nums text-foreground">{booking.reference}</span>
            </p>
          </div>
        )}

        <div className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-e1">
          <p className="t-headline text-foreground">{service.name}</p>
          <p className="t-subhead text-muted-foreground">{business.name}</p>
          <div className="t-subhead mt-3 space-y-1.5 text-muted-foreground">
            <p className="font-semibold tabular-nums text-foreground">{formatDateTimeLabel(booking.startTime)}</p>
            <p className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {business.location.area} · {business.location.addressLine}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-[var(--radius-lg)] bg-surface-muted p-4">
          <span className="t-body text-muted-foreground">You paid</span>
          <span className="text-[19px] font-extrabold tabular-nums tracking-[-0.02em] text-foreground">{formatPrice(booking.pricePaid)}</span>
        </div>

        {!justBooked && (
          <p className="mt-4 text-center text-[13px] text-muted-foreground">
            Reference {booking.reference}
          </p>
        )}

        <Button variant="secondary" size="lg" className="mt-5 w-full gap-2">
          <CalendarPlus className="h-4.5 w-4.5" />
          Add to calendar
        </Button>

        <Link href="/discover" className="mt-2.5 block">
          <Button variant="ghost" size="lg" className="w-full">
            Keep browsing
          </Button>
        </Link>
      </div>
    </div>
  );
}
