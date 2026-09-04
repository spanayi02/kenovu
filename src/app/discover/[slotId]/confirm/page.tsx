"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MapPin } from "lucide-react";
import { useBusiness, useServicesForBusiness, useSlot } from "@/app-state/hooks";
import { useRepository } from "@/app-state/hooks";
import { formatDateTimeLabel } from "@/domain/time";
import { formatPrice } from "@/domain/pricing";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { AlertTriangle } from "lucide-react";
import { canBookSlot } from "@/domain/rules";
import { CURRENT_CUSTOMER } from "@/domain/constants";

export default function ConfirmBookingPage({
  params,
}: {
  params: Promise<{ slotId: string }>;
}) {
  const { slotId } = use(params);
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
    <div className="pb-10">
      <div className="mx-auto max-w-xl px-4" style={{ paddingTop: "calc(var(--safe-top) + 1rem)" }}>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="mt-3 text-xl font-bold text-foreground">Confirm booking</h1>
      </div>

      <div className="mx-auto max-w-xl px-4 pt-4">
        <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-4">
          <p className="text-[15px] font-semibold text-foreground">{service.name}</p>
          <p className="text-[13.5px] text-muted-foreground">{business.name}</p>
          <div className="mt-3 space-y-1.5 text-[13.5px] text-muted-foreground">
            <p>{formatDateTimeLabel(slot.startTime)}</p>
            <p className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {business.location.area} · {business.location.addressLine}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2 rounded-[var(--radius-lg)] border border-border p-4 text-[14px]">
          <div className="flex justify-between text-muted-foreground">
            <span>Normal price</span>
            <span className="line-through">{formatPrice(slot.normalPrice)}</span>
          </div>
          <div className="flex justify-between font-semibold text-foreground">
            <span>You pay</span>
            <span>{formatPrice(slot.kenovuPrice)}</span>
          </div>
        </div>

        <p className="mt-4 text-[12.5px] leading-relaxed text-muted-foreground">
          By confirming, you agree to attend this appointment at the time above. This is a
          last-minute booking and cannot be rescheduled through Kenovu.
        </p>

        {state === "error" && (
          <div className="mt-4 rounded-[var(--radius-md)] border border-danger/30 bg-danger-tint px-3.5 py-3 text-[13.5px] text-danger">
            {errorMessage}
          </div>
        )}

        <Button
          size="lg"
          variant="accent"
          className="mt-5 w-full"
          disabled={!bookCheck.valid || state === "processing"}
          onClick={handleConfirm}
        >
          {state === "processing" ? "Confirming…" : `Confirm booking · ${formatPrice(slot.kenovuPrice)}`}
        </Button>
      </div>
    </div>
  );
}
