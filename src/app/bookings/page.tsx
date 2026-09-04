"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarX, MapPin } from "lucide-react";
import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { useBusiness, useCustomerBookings, useRepository } from "@/app-state/hooks";
import { groupBookings, type BookingBucket } from "@/domain/bookings";
import { formatDateTimeLabel } from "@/domain/time";
import { formatPrice } from "@/domain/pricing";
import { cn } from "@/lib/utils";
import type { Booking } from "@/domain/types";

const TABS: { id: BookingBucket; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
  { id: "cancelled", label: "Cancelled" },
];

export default function BookingsPage() {
  const bookings = useCustomerBookings();
  const groups = useMemo(() => groupBookings(bookings), [bookings]);
  const [tab, setTab] = useState<BookingBucket>("upcoming");
  const items = groups[tab];

  return (
    <div>
      <ScreenHeader title="My Bookings" />
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div className="flex gap-1.5 rounded-full bg-surface-muted p-1 md:w-fit">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex-1 rounded-full px-4 py-2 text-[13.5px] font-medium transition-colors",
                tab === t.id ? "bg-surface text-foreground shadow-sm" : "text-muted-foreground",
              )}
            >
              {t.label} {groups[t.id].length > 0 && `(${groups[t.id].length})`}
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon={CalendarX}
            title={
              tab === "upcoming"
                ? "No upcoming bookings."
                : tab === "past"
                  ? "No past bookings yet."
                  : "No cancelled bookings."
            }
            description={tab === "upcoming" ? "Book a last-minute slot from Discover." : undefined}
          />
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-2.5 pb-8 md:grid-cols-2 xl:grid-cols-3">
            {items.map((booking) => (
              <BookingRow key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BookingRow({ booking }: { booking: Booking }) {
  const business = useBusiness(booking.businessId);
  const repository = useRepository();
  const service = repository.getService(booking.serviceId);

  return (
    <Link
      href={`/bookings/${booking.id}`}
      className="flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-border bg-surface p-4"
    >
      <div className="min-w-0">
        <p className="truncate text-[15px] font-semibold text-foreground">{business?.name}</p>
        <p className="truncate text-[13.5px] text-muted-foreground">{service?.name}</p>
        <div className="mt-1.5 flex items-center gap-2 text-[13px] text-muted-foreground">
          <span>{formatDateTimeLabel(booking.startTime)}</span>
          {business && (
            <span className="inline-flex items-center gap-0.5">
              <MapPin className="h-3 w-3" />
              {business.location.area}
            </span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="font-semibold text-foreground">{formatPrice(booking.pricePaid)}</span>
        <Badge tone={booking.status === "cancelled" ? "danger" : "success"}>
          {booking.status === "confirmed" ? "Confirmed" : booking.status === "completed" ? "Completed" : "Cancelled"}
        </Badge>
      </div>
    </Link>
  );
}
