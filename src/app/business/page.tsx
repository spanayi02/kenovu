"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/Button";
import { SlotStatusRow } from "@/components/business/SlotStatusRow";
import {
  useBusiness,
  useBusinessBookings,
  useRepository,
  useServicesForBusiness,
  useSlots,
} from "@/app-state/hooks";
import { CURRENT_BUSINESS_ID } from "@/domain/constants";
import { calculateBusinessMetrics } from "@/domain/businessMetrics";
import { formatPrice } from "@/domain/pricing";
import { isWithinBucket } from "@/domain/time";
import { cn } from "@/lib/utils";

export default function BusinessTodayPage() {
  const business = useBusiness(CURRENT_BUSINESS_ID);
  const repository = useRepository();
  const allSlots = useSlots();
  const bookings = useBusinessBookings(CURRENT_BUSINESS_ID);
  const services = useServicesForBusiness(CURRENT_BUSINESS_ID);

  const businessSlots = useMemo(
    () => allSlots.filter((s) => s.businessId === CURRENT_BUSINESS_ID),
    [allSlots],
  );
  const todaysActive = businessSlots.filter(
    (s) => s.status === "active" && isWithinBucket(s.startTime, "today"),
  );
  const todaysBooked = businessSlots.filter(
    (s) => s.status === "booked" && isWithinBucket(s.startTime, "today"),
  );
  const metrics = useMemo(() => calculateBusinessMetrics(bookings, services), [bookings, services]);
  const serviceMap = useMemo(() => new Map(services.map((s) => [s.id, s])), [services]);
  const bookingBySlot = useMemo(() => new Map(bookings.map((b) => [b.slotId, b])), [bookings]);

  if (!business) return null;

  return (
    <div>
      <ScreenHeader title="Today" subtitle={business.name} dense />
      <div className="mx-auto max-w-5xl px-4 pt-4 pb-8">
        <div className="md:max-w-2xl">
          <div className="flex divide-x divide-border rounded-[var(--radius-md)] border border-border bg-surface">
            <StatTile label="Bookings" value={String(metrics.bookingCount)} />
            <StatTile
              label="Recovered"
              value={formatPrice(metrics.revenueRecovered)}
              tone="accent"
            />
            <StatTile label="Time filled" value={`${metrics.emptyTimeFilledHours}h`} />
          </div>

        </div>

        <section className="mt-6">
          <h2 className="t-headline mb-2.5 text-foreground">Today&apos;s Kenovu Slots</h2>
          {todaysActive.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title="No active Kenovu Slots today."
              description="When you have a cancellation or a gap, publish it here."
              action={
                <Link href="/business/create">
                  <Button size="sm">Create a slot</Button>
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
              {todaysActive.map((slot) => {
                const service = serviceMap.get(slot.serviceId);
                if (!service) return null;
                return (
                  <SlotStatusRow
                    key={slot.id}
                    slot={slot}
                    service={service}
                    onCancel={(id) => repository.cancelSlot(id)}
                  />
                );
              })}
            </div>
          )}
        </section>

        {todaysBooked.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-2.5 text-[15px] font-semibold text-foreground">Booked today</h2>
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
              {todaysBooked.map((slot) => {
                const service = serviceMap.get(slot.serviceId);
                if (!service) return null;
                return (
                  <SlotStatusRow
                    key={slot.id}
                    slot={slot}
                    service={service}
                    booking={bookingBySlot.get(slot.id)}
                  />
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "accent";
}) {
  return (
    <div className="flex-1 px-3.5 py-3">
      <p className={cn("text-[22px] font-extrabold tabular-nums tracking-[-0.02em]", tone === "accent" ? "text-accent" : "text-foreground")}>
        {value}
      </p>
      <p className="t-caption mt-1 text-muted-foreground">{label}</p>
    </div>
  );
}
