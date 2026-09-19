"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, MapPin, X } from "lucide-react";
import { useBusiness, useRepository, useServicesForBusiness, useSlot } from "@/app-state/hooks";
import { formatDateTimeLabel } from "@/domain/time";
import { formatPrice } from "@/domain/pricing";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { canBookSlot } from "@/domain/rules";
import { CURRENT_CUSTOMER } from "@/domain/constants";

/**
 * The confirm step's panel, without any positioning of its own — the route
 * decides whether it is presented as a sheet over the slot screen or as a
 * standalone page on a cold load of the URL.
 */
export function ConfirmBookingPanel({ slotId }: { slotId: string }) {
  const router = useRouter();
  const repository = useRepository();
  const slot = useSlot(slotId);
  const business = useBusiness(slot?.businessId);
  const services = useServicesForBusiness(slot?.businessId);
  const service = useMemo(() => services.find((s) => s.id === slot?.serviceId), [services, slot]);

  const [state, setState] = useState<"review" | "processing" | "error">("review");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!slot || !business || !service) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="This slot isn't available anymore."
        action={
          <Link href="/discover">
            <Button size="sm">Back to Discover</Button>
          </Link>
        }
      />
    );
  }

  const bookCheck = canBookSlot(slot);

  function handleConfirm() {
    setState("processing");
    window.setTimeout(() => {
      const result = repository.bookSlot(slotId, CURRENT_CUSTOMER.id, CURRENT_CUSTOMER.name);
      if (result.ok) {
        router.push(`/bookings/${result.booking.id}?justBooked=1`);
      } else {
        setErrorMessage(result.message);
        setState("error");
      }
    }, 900);
  }

  return (
    <>
      {/* Grabber: the affordance that says this panel came from the bottom
          edge and goes back to it. */}
      <div className="flex justify-center pt-2.5 md:hidden" aria-hidden="true">
        <span className="h-1 w-9 rounded-full bg-border-strong" />
      </div>

      <div className="flex items-center justify-between px-4 pb-2 pt-3">
        <h1 className="t-headline text-foreground">Confirm booking</h1>
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Close"
          className="press -mr-2 flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4">
        <div className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-e1">
          <p className="t-headline text-foreground">{service.name}</p>
          <p className="t-subhead text-muted-foreground">{business.name}</p>
          <div className="t-subhead mt-3 space-y-1.5 text-muted-foreground">
            <p className="font-semibold tabular-nums text-foreground">
              {formatDateTimeLabel(slot.startTime)}
            </p>
            <p className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {business.location.area} · {business.location.addressLine}
            </p>
          </div>
        </div>

        <div className="t-body mt-3 space-y-2 rounded-[var(--radius-lg)] bg-surface-muted p-4">
          <div className="flex justify-between text-muted-foreground">
            <span>Normal price</span>
            <span className="tabular-nums line-through">{formatPrice(slot.normalPrice)}</span>
          </div>
          <div className="flex items-baseline justify-between font-bold text-foreground">
            <span>You pay</span>
            <span className="text-[19px] tabular-nums tracking-[-0.02em] text-accent">
              {formatPrice(slot.kenovuPrice)}
            </span>
          </div>
        </div>

        <p className="t-caption mt-3 leading-relaxed text-muted-foreground">
          By confirming, you agree to attend this appointment at the time above. This is a
          last-minute booking and cannot be rescheduled through Kenovu.
        </p>

        {state === "error" && (
          <div className="t-subhead mt-3 rounded-[var(--radius-md)] bg-danger-tint px-3.5 py-3 text-danger">
            {errorMessage}
          </div>
        )}
      </div>

      <div className="px-4 pt-3">
        <Button
          size="lg"
          variant="accent"
          className="w-full"
          disabled={!bookCheck.valid || state === "processing"}
          onClick={handleConfirm}
        >
          {state === "processing"
            ? "Confirming…"
            : `Confirm booking · ${formatPrice(slot.kenovuPrice)}`}
        </Button>
      </div>
    </>
  );
}

/** Shared panel chrome so the sheet and the standalone page can't drift. */
export function ConfirmBookingPanelShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Confirm booking"
      className="animate-sheet relative flex max-h-[92vh] w-full flex-col rounded-t-[var(--radius-xl)] bg-background shadow-e4 md:max-w-lg md:rounded-[var(--radius-xl)]"
      style={{ paddingBottom: "calc(var(--safe-bottom) + 1rem)" }}
    >
      {children}
    </div>
  );
}
