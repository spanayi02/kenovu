"use client";

import { useMemo } from "react";
import { CalendarCheck } from "lucide-react";
import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { useBusinessBookings, useServicesForBusiness } from "@/app-state/hooks";
import { CURRENT_BUSINESS_ID } from "@/domain/constants";
import { formatDateTimeLabel } from "@/domain/time";
import { formatPrice } from "@/domain/pricing";

export default function BusinessBookingsPage() {
  const bookings = useBusinessBookings(CURRENT_BUSINESS_ID);
  const services = useServicesForBusiness(CURRENT_BUSINESS_ID);
  const serviceMap = useMemo(() => new Map(services.map((s) => [s.id, s])), [services]);

  const sorted = [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div>
      <ScreenHeader
        title="Bookings"
        subtitle={bookings.length > 0 ? `${bookings.length} total` : undefined}
        dense
      />
      <div className="mx-auto max-w-5xl px-4 pt-4 pb-8">
        {sorted.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="No Kenovu bookings yet."
            description="Bookings will appear here as soon as a customer books one of your slots."
          />
        ) : (
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
            {sorted.map((booking) => {
              const service = serviceMap.get(booking.serviceId);
              return (
                <div
                  key={booking.id}
                  className="overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface"
                >
                  <div className="flex items-start justify-between gap-3 p-3.5">
                    <div>
                      <p className="text-[14px] font-semibold text-foreground">{service?.name}</p>
                      <p className="text-[12.5px] text-muted-foreground">
                        {formatDateTimeLabel(booking.startTime)} · {booking.customerName}
                      </p>
                    </div>
                    <span className="tabular-nums text-[14px] font-semibold text-foreground">
                      {formatPrice(booking.pricePaid)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border bg-surface-muted px-3.5 py-2 text-[12px] tabular-nums text-muted-foreground">
                    <span>Commission ({formatPrice(booking.commission)})</span>
                    <span className="font-medium text-success">
                      You receive {formatPrice(booking.businessPayout)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
