import type { BusinessService, KenovuSlot } from "@/domain/types";
import { quickDiscountPrice, round2 } from "@/domain/pricing";
import { addDays, addHours, addMinutes } from "@/domain/time";

// Offsets from "now" used to build a realistic, always-fresh spread of
// slots. Expressed as minutes-from-now, or as a tomorrow hour marker.
type Offset =
  | { kind: "minutes"; value: number }
  | { kind: "tomorrow"; hour: number; minute: number };

const OFFSETS: Offset[] = [
  { kind: "minutes", value: 45 },
  { kind: "minutes", value: 90 },
  { kind: "minutes", value: 130 },
  { kind: "minutes", value: 180 },
  { kind: "minutes", value: 240 },
  { kind: "minutes", value: 320 },
  { kind: "minutes", value: 60 },
  { kind: "minutes", value: 200 },
  { kind: "minutes", value: 30 },
  { kind: "minutes", value: 400 },
  { kind: "tomorrow", hour: 10, minute: 30 },
  { kind: "tomorrow", hour: 14, minute: 0 },
  { kind: "tomorrow", hour: 9, minute: 0 },
  { kind: "tomorrow", hour: 17, minute: 30 },
  { kind: "tomorrow", hour: 11, minute: 15 },
  { kind: "tomorrow", hour: 16, minute: 0 },
  { kind: "minutes", value: 150 },
  { kind: "minutes", value: 270 },
  { kind: "minutes", value: 500 },
  { kind: "tomorrow", hour: 12, minute: 30 },
];

const DISCOUNTS = [15, 20, 25, 30, 35, 40];

function resolveOffset(offset: Offset, now: Date): Date {
  if (offset.kind === "minutes") return addMinutes(now, offset.value);
  const tomorrow = addDays(now, 1);
  tomorrow.setHours(offset.hour, offset.minute, 0, 0);
  return tomorrow;
}

/**
 * Deterministic-looking but simple pseudo-random pick, seeded off index so
 * the same "shape" of demo data appears each reset without needing a real
 * seeded RNG library for a prototype.
 */
function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

export function buildSeedSlots(
  services: BusinessService[],
  now: Date = new Date(),
): KenovuSlot[] {
  const slots: KenovuSlot[] = [];
  const activeServices = services.filter((s) => s.active);

  OFFSETS.forEach((offset, i) => {
    const service = pick(activeServices, i * 7 + 3);
    const startTime = resolveOffset(offset, now);
    // Skip anything that lands in the past relative to "now" for tomorrow
    // slots when offset hour has already passed today's equivalent — not
    // applicable since these are always tomorrow, but guard anyway.
    if (startTime.getTime() <= now.getTime()) return;

    const discount = pick(DISCOUNTS, i * 5 + 1);
    const kenovuPrice = quickDiscountPrice(service.normalPrice, discount);

    slots.push({
      id: `slot-seed-${i}`,
      businessId: service.businessId,
      serviceId: service.id,
      startTime: startTime.toISOString(),
      normalPrice: round2(service.normalPrice),
      kenovuPrice,
      status: "active",
      createdAt: addHours(now, -1).toISOString(),
      publishedAt: addHours(now, -1).toISOString(),
      bookingId: null,
    });
  });

  return slots;
}
