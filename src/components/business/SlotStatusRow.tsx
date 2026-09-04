import { Ban } from "lucide-react";
import type { Booking, BusinessService, KenovuSlot } from "@/domain/types";
import { Badge } from "@/components/ui/Badge";
import { formatDateTimeLabel } from "@/domain/time";
import { formatPrice } from "@/domain/pricing";
import { Button } from "@/components/ui/Button";

const STATUS_TONE: Record<KenovuSlot["status"], "primary" | "success" | "neutral" | "danger"> = {
  draft: "neutral",
  active: "primary",
  reserved: "primary",
  booked: "success",
  expired: "neutral",
  cancelled: "danger",
};

const STATUS_LABEL: Record<KenovuSlot["status"], string> = {
  draft: "Draft",
  active: "Active",
  reserved: "Reserved",
  booked: "Booked",
  expired: "Expired",
  cancelled: "Cancelled",
};

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
    <div className="flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-border bg-surface p-4">
      <div className="min-w-0">
        <p className="truncate text-[15px] font-semibold text-foreground">{service.name}</p>
        <p className="text-[13.5px] text-muted-foreground">{formatDateTimeLabel(slot.startTime)}</p>
        <p className="mt-1 text-[13.5px] text-foreground">
          {formatPrice(slot.normalPrice)} <span className="text-muted-foreground">→</span>{" "}
          <span className="font-medium text-accent">{formatPrice(slot.kenovuPrice)}</span>
        </p>
        {booking && (
          <p className="mt-1 text-[13px] text-muted-foreground">Customer: {booking.customerName}</p>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <Badge tone={STATUS_TONE[slot.status]}>{STATUS_LABEL[slot.status]}</Badge>
        {slot.status === "active" && onCancel && (
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" onClick={() => onCancel(slot.id)}>
            <Ban className="h-3.5 w-3.5" /> Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
