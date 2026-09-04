"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CategoryArt } from "@/components/shared/CategoryArt";
import { PriceTag } from "@/components/shared/PriceTag";
import { RatingLine } from "@/components/shared/RatingLine";
import { useBusiness, useDemoMode, useRepository, useServicesForBusiness } from "@/app-state/hooks";
import { CURRENT_BUSINESS_ID } from "@/domain/constants";
import { formatDateTimeLabel } from "@/domain/time";
import { formatPrice, quickDiscountPrice } from "@/domain/pricing";
import { validateSlotCreation } from "@/domain/rules";
import { cn } from "@/lib/utils";
import type { BusinessService } from "@/domain/types";

type Step = "service" | "time" | "price" | "preview" | "success";

const QUICK_DISCOUNTS = [10, 20, 30, 40];

function nextValidTimeToday(hour: number, minute: number): Date {
  const now = new Date();
  const candidate = new Date(now);
  candidate.setHours(hour, minute, 0, 0);
  if (candidate.getTime() <= now.getTime() + 15 * 60_000) {
    candidate.setTime(now.getTime() + 60 * 60_000);
    candidate.setMinutes(Math.ceil(candidate.getMinutes() / 15) * 15, 0, 0);
  }
  return candidate;
}

export default function CreateSlotPage() {
  const router = useRouter();
  const repository = useRepository();
  const business = useBusiness(CURRENT_BUSINESS_ID);
  const services = useServicesForBusiness(CURRENT_BUSINESS_ID).filter((s) => s.active);
  const { setMode } = useDemoMode();

  const [step, setStep] = useState<Step>("service");
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [day, setDay] = useState<"today" | "tomorrow">("today");
  const [time, setTime] = useState(() => {
    const suggested = nextValidTimeToday(new Date().getHours(), 30);
    return `${String(suggested.getHours()).padStart(2, "0")}:${String(suggested.getMinutes()).padStart(2, "0")}`;
  });
  const [kenovuPrice, setKenovuPrice] = useState<number | null>(null);
  const [publishedSlotId, setPublishedSlotId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedService = services.find((s) => s.id === selectedServiceId) ?? null;

  const startTimeIso = useMemo(() => {
    const [h, m] = time.split(":").map(Number);
    const base = new Date();
    if (day === "tomorrow") base.setDate(base.getDate() + 1);
    base.setHours(h, m, 0, 0);
    return base.toISOString();
  }, [day, time]);

  const effectiveKenovuPrice =
    kenovuPrice ?? (selectedService ? quickDiscountPrice(selectedService.normalPrice, 20) : 0);

  const validation = selectedService
    ? validateSlotCreation({
        serviceId: selectedService.id,
        normalPrice: selectedService.normalPrice,
        kenovuPrice: effectiveKenovuPrice,
        startTimeIso,
      })
    : { valid: false, message: "Choose a service first." };

  function handlePublish() {
    if (!selectedService) return;
    const result = repository.createAndPublishSlot({
      businessId: CURRENT_BUSINESS_ID,
      serviceId: selectedService.id,
      startTimeIso,
      normalPrice: selectedService.normalPrice,
      kenovuPrice: effectiveKenovuPrice,
    });
    if (result.ok) {
      setPublishedSlotId(result.slot.id);
      setStep("success");
    } else {
      setErrorMessage(result.message);
    }
  }

  function goBack() {
    if (step === "service") {
      router.back();
    } else if (step === "time") {
      setStep("service");
    } else if (step === "price") {
      setStep("time");
    } else if (step === "preview") {
      setStep("price");
    }
  }

  if (step === "success" && publishedSlotId && selectedService && business) {
    return (
      <SuccessStep
        slotId={publishedSlotId}
        service={selectedService}
        kenovuPrice={effectiveKenovuPrice}
        onViewAsCustomer={() => {
          setMode("customer");
          router.push(`/discover/${publishedSlotId}`);
        }}
        onDone={() => router.push("/business")}
      />
    );
  }

  return (
    <div className="pb-10">
      <div
        className="mx-auto flex max-w-xl items-center gap-2 px-4"
        style={{ paddingTop: "calc(var(--safe-top) + 1rem)" }}
      >
        <button type="button" onClick={goBack} className="text-muted-foreground" aria-label="Back">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Create Kenovu Slot</h1>
      </div>
      <StepDots step={step} />

      <div className="mx-auto max-w-xl px-4 pt-5">
        {step === "service" && (
          <div className="flex flex-col gap-2.5">
            <p className="text-[13.5px] text-muted-foreground">Which service became free?</p>
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => {
                  setSelectedServiceId(service.id);
                  setKenovuPrice(null);
                  setStep("time");
                }}
                className="flex items-center justify-between rounded-[var(--radius-lg)] border border-border-strong bg-surface p-4 text-left hover:border-primary"
              >
                <div>
                  <p className="text-[15px] font-semibold text-foreground">{service.name}</p>
                  <p className="text-[13px] text-muted-foreground">{service.durationMinutes} min</p>
                </div>
                <span className="text-[15px] font-semibold text-foreground">
                  {formatPrice(service.normalPrice)}
                </span>
              </button>
            ))}
          </div>
        )}

        {step === "time" && selectedService && (
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-[13.5px] text-muted-foreground">When is the slot?</p>
              <div className="flex gap-2">
                {(["today", "tomorrow"] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDay(d)}
                    className={cn(
                      "flex-1 rounded-[var(--radius-md)] border px-4 py-2.5 text-[14px] font-medium capitalize",
                      day === d
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border-strong bg-surface text-foreground",
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[13.5px] text-muted-foreground">Start time (24h)</p>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-11 w-full rounded-[var(--radius-md)] border border-border-strong bg-surface px-3.5 text-[15px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            {!validation.valid && (
              <p className="text-[13px] text-danger">{validation.message}</p>
            )}
            <Button className="w-full" size="lg" disabled={!validation.valid} onClick={() => setStep("price")}>
              Continue
            </Button>
          </div>
        )}

        {step === "price" && selectedService && (
          <div className="space-y-5">
            <div className="rounded-[var(--radius-lg)] border border-border bg-surface-muted p-4">
              <p className="text-[13px] text-muted-foreground">Normal price</p>
              <p className="text-2xl font-bold text-foreground">{formatPrice(selectedService.normalPrice)}</p>
            </div>

            <div className="flex gap-2">
              {QUICK_DISCOUNTS.map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setKenovuPrice(quickDiscountPrice(selectedService.normalPrice, pct))}
                  className="flex-1 rounded-[var(--radius-md)] border border-border-strong bg-surface py-2 text-[13.5px] font-medium text-foreground hover:border-primary"
                >
                  -{pct}%
                </button>
              ))}
            </div>

            <div>
              <p className="mb-2 text-[13.5px] text-muted-foreground">Kenovu price</p>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] text-muted-foreground">
                  €
                </span>
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={effectiveKenovuPrice}
                  onChange={(e) => setKenovuPrice(Number(e.target.value))}
                  className="h-12 w-full rounded-[var(--radius-md)] border border-border-strong bg-surface pl-8 pr-3.5 text-[17px] font-semibold focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              {!validation.valid && (
                <p className="mt-2 text-[13px] text-danger">{validation.message}</p>
              )}
            </div>

            {validation.valid && (
              <PriceTag normalPrice={selectedService.normalPrice} kenovuPrice={effectiveKenovuPrice} size="lg" />
            )}

            <Button className="w-full" size="lg" disabled={!validation.valid} onClick={() => setStep("preview")}>
              Preview
            </Button>
          </div>
        )}

        {step === "preview" && selectedService && business && (
          <div className="space-y-5">
            <p className="text-[13.5px] text-muted-foreground">This is what customers will see:</p>
            <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface">
              <div className="h-32 w-full">
                <CategoryArt category={business.category} imageKey={business.imageKey} className="h-full w-full" />
              </div>
              <div className="p-4">
                <p className="text-[15px] font-semibold text-foreground">{selectedService.name}</p>
                <p className="text-[13.5px] text-muted-foreground">{business.name}</p>
                <RatingLine rating={business.rating} reviewCount={business.reviewCount} className="mt-1" />
                <p className="mt-2 text-[13.5px] font-medium text-foreground">
                  {formatDateTimeLabel(startTimeIso)}
                </p>
                <PriceTag
                  normalPrice={selectedService.normalPrice}
                  kenovuPrice={effectiveKenovuPrice}
                  size="lg"
                  className="mt-2"
                />
              </div>
            </div>

            {errorMessage && <p className="text-[13px] text-danger">{errorMessage}</p>}

            <Button className="w-full" size="lg" variant="accent" onClick={handlePublish}>
              Publish
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function StepDots({ step }: { step: Step }) {
  const order: Step[] = ["service", "time", "price", "preview"];
  const idx = order.indexOf(step);
  return (
    <div className="mx-auto mt-3 flex max-w-xl gap-1.5 px-4">
      {order.map((s, i) => (
        <span
          key={s}
          className={cn(
            "h-1 flex-1 rounded-full",
            i <= idx && idx >= 0 ? "bg-primary" : "bg-border",
          )}
        />
      ))}
    </div>
  );
}

function SuccessStep({
  slotId,
  service,
  kenovuPrice,
  onViewAsCustomer,
  onDone,
}: {
  slotId: string;
  service: BusinessService;
  kenovuPrice: number;
  onViewAsCustomer: () => void;
  onDone: () => void;
}) {
  return (
    <div className="flex min-h-[80dvh] flex-col items-center justify-center px-6 text-center">
      <CheckCircle2 className="h-12 w-12 text-success" />
      <p className="mt-4 text-2xl font-bold text-foreground">Your Kenovu Slot is live.</p>
      <p className="mt-1.5 text-[14.5px] text-muted-foreground">
        {service.name} · {formatPrice(kenovuPrice)}
      </p>
      <div className="mt-8 flex w-full max-w-xs flex-col gap-2.5">
        <Button size="lg" onClick={onViewAsCustomer} data-testid={`view-as-customer-${slotId}`}>
          View as customer
        </Button>
        <Button size="lg" variant="secondary" onClick={onDone}>
          Back to Today
        </Button>
      </div>
    </div>
  );
}
