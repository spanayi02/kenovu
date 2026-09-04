import { Ban } from "lucide-react";
import type { Booking, BusinessService, KenovuSlot } from "@/domain/types";
import { formatDateTimeLabel } from "@/domain/time";
import { formatPrice } from "@/domain/pricing";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const STATUS_BAR: Record<KenovuSlot["status"], string> = {
  draft: "bg-border-strong",
  active: "bg-primary",
  reserved: "bg-primary",
  booked: "bg-success",
  expired: "bg-border-strong",
  cancelled: "bg-danger",
};

const STATUS_TEXT: Record<KenovuSlot["status"], string> = {
  draft: "text-muted-foreground",
  active: "text-primary",
  reserved: "text-primary",
  booked: "text-success",
  expired: "text-muted-foreground",
  cancelled: "text-danger",
};

const STATUS_LABEL: Record<KenovuSlot["status"], string> = {
  draft: "Draft",
  active: "Active",
  reserved: "Reserved",
  booked: "Booked",
  expired: "Expired",
  cancelled: "Cancelled",
};

/** A dense operator-log row — this is the Business side's native unit,
 * deliberately not a marketplace card: a status bar, tabular figures, no
 * category art. Business runs on data; Customer runs on browsing. */
export function SlotStatusRow({
  slot,
  service,
  booking,
  onCancel,
}: {
  slot: KenovuSlot;
  service: BusinessService;
  booking?: Booking;
  onCancel?: (id: string) => void;
}) {
  return (
    <div className="flex items-stretch gap-3 overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface">
      <span className={cn("w-1 shrink-0", STATUS_BAR[slot.status])} aria-hidden="true" />
      <div className="flex flex-1 items-center justify-between gap-3 py-3 pr-3.5">
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold text-foreground">{service.name}</p>
          <p className="text-[12.5px] text-muted-foreground">{formatDateTimeLabel(slot.startTime)}</p>
          <p className="mt-1 text-[13px] tabular-nums text-foreground">
            {formatPrice(slot.normalPrice)} <span className="text-muted-foreground">→</span>{" "}
            <span className="font-medium text-accent">{formatPrice(slot.kenovuPrice)}</span>
          </p>
          {booking && (
            <p className="mt-1 text-[12.5px] text-muted-foreground">Customer: {booking.customerName}</p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <span className={cn("text-[11px] font-semibold uppercase tracking-wide", STATUS_TEXT[slot.status])}>
            {STATUS_LABEL[slot.status]}
          </span>
          {slot.status === "active" && onCancel && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto gap-1 px-1.5 py-0.5 text-[12px] text-muted-foreground"
              onClick={() => onCancel(slot.id)}
            >
              <Ban className="h-3 w-3" /> Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
