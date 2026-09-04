"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ListChecks } from "lucide-react";
import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/Button";
import { SlotStatusRow } from "@/components/business/SlotStatusRow";
import {
  useBusinessBookings,
  useRepository,
  useServicesForBusiness,
  useSlots,
} from "@/app-state/hooks";
import { CURRENT_BUSINESS_ID } from "@/domain/constants";
import type { SlotStatus } from "@/domain/types";
import { cn } from "@/lib/utils";

const TABS: { id: SlotStatus; label: string }[] = [
  { id: "active", label: "Active" },
  { id: "booked", label: "Booked" },
  { id: "expired", label: "Expired" },
  { id: "cancelled", label: "Cancelled" },
];

export default function BusinessSlotsPage() {
  const repository = useRepository();
  const slots = useSlots().filter((s) => s.businessId === CURRENT_BUSINESS_ID);
  const bookings = useBusinessBookings(CURRENT_BUSINESS_ID);
  const services = useServicesForBusiness(CURRENT_BUSINESS_ID);
  const serviceMap = useMemo(() => new Map(services.map((s) => [s.id, s])), [services]);
  const bookingBySlot = useMemo(() => new Map(bookings.map((b) => [b.slotId, b])), [bookings]);

  const [tab, setTab] = useState<SlotStatus>("active");
  const filtered = slots
    .filter((s) => s.status === tab)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  return (
    <div>
      <ScreenHeader title="Slots" />
      <div className="mx-auto max-w-6xl px-4 pt-4 pb-8">
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto rounded-full bg-surface-muted p-1 md:w-fit">
          {TABS.map((t) => {
            const count = slots.filter((s) => s.status === t.id).length;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex-1 whitespace-nowrap rounded-full px-3 py-2 text-[13.5px] font-medium transition-colors",
                  tab === t.id ? "bg-surface text-foreground shadow-sm" : "text-muted-foreground",
                )}
              >
                {t.label} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title={`No ${tab} Kenovu Slots.`}
            action={
              tab === "active" ? (
                <Link href="/business/create">
                  <Button size="sm">Create a slot</Button>
                </Link>
              ) : undefined
            }
          />
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((slot) => {
              const service = serviceMap.get(slot.serviceId);
              if (!service) return null;
              return (
                <SlotStatusRow
                  key={slot.id}
                  slot={slot}
                  service={service}
                  booking={bookingBySlot.get(slot.id)}
                  onCancel={tab === "active" ? (id) => repository.cancelSlot(id) : undefined}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
