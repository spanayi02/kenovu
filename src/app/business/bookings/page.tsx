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
      <ScreenHeader title="Bookings" subtitle={bookings.length > 0 ? `${bookings.length} total` : undefined} />
      <div className="mx-auto max-w-6xl px-4 pt-4 pb-8">
        {sorted.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="No Kenovu bookings yet."
            description="Bookings will appear here as soon as a customer books one of your slots."
          />
        ) : (
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
            {sorted.map((booking) => {
              const service = serviceMap.get(booking.serviceId);
              return (
                <div
                  key={booking.id}
                  className="rounded-[var(--radius-lg)] border border-border bg-surface p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[15px] font-semibold text-foreground">{service?.name}</p>
                      <p className="text-[13.5px] text-muted-foreground">
                        {formatDateTimeLabel(booking.startTime)} · {booking.customerName}
                      </p>
                    </div>
                    <span className="text-[15px] font-semibold text-foreground">
                      {formatPrice(booking.pricePaid)}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5 text-[12.5px] text-muted-foreground">
                    <span>Kenovu commission ({formatPrice(booking.commission)})</span>
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
