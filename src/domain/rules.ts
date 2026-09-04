import type { KenovuSlot, ValidationResult } from "./types";
import { isPast } from "./time";

function ok(): ValidationResult {
  return { valid: true };
}
function fail(message: string): ValidationResult {
  return { valid: false, message };
}

export function validateSlotPrices(
  normalPrice: number,
  kenovuPrice: number,
): ValidationResult {
  if (!Number.isFinite(normalPrice) || normalPrice <= 0) {
    return fail("Normal price must be greater than €0.");
  }
  if (!Number.isFinite(kenovuPrice) || kenovuPrice <= 0) {
    return fail("Kenovu price must be greater than €0.");
  }
  if (kenovuPrice > normalPrice) {
    return fail("Kenovu price can't be higher than the normal price.");
  }
  return ok();
}

export function validateSlotStartTime(
  startTimeIso: string,
  now: Date = new Date(),
): ValidationResult {
  const start = new Date(startTimeIso);
  if (Number.isNaN(start.getTime())) {
    return fail("Pick a valid date and time.");
  }
  if (start.getTime() <= now.getTime()) {
    return fail("Start time must be in the future.");
  }
  return ok();
}

export function validateSlotCreation(input: {
  serviceId: string | null;
  normalPrice: number;
  kenovuPrice: number;
  startTimeIso: string;
  now?: Date;
}): ValidationResult {
  if (!input.serviceId) {
    return fail("Choose a service first.");
  }
  const priceCheck = validateSlotPrices(input.normalPrice, input.kenovuPrice);
  if (!priceCheck.valid) return priceCheck;
  return validateSlotStartTime(input.startTimeIso, input.now);
}

/**
 * A slot is bookable only if it is `active`, and its start time hasn't
 * passed. Any other state (booked/cancelled/expired/draft/reserved) or a
 * start time that has already passed returns a specific, human-readable
 * reason.
 */
export function canBookSlot(
  slot: KenovuSlot | undefined | null,
  now: Date = new Date(),
): ValidationResult {
  if (!slot) {
    return fail("This slot is no longer available.");
  }
  if (slot.status === "booked") {
    return fail("This slot was just booked by someone else.");
  }
  if (slot.status === "cancelled") {
    return fail("This slot was cancelled by the business.");
  }
  if (slot.status === "expired") {
    return fail("This slot has expired.");
  }
  if (slot.status !== "active") {
    return fail("This slot isn't available right now.");
  }
  if (isPast(slot.startTime, now)) {
    return fail("This slot has already started and can no longer be booked.");
  }
  return ok();
}

/** Derives the effective status a slot should show right now, without
 * mutating stored data — expiry is a read-time projection driven by the
 * clock, not a background job the prototype needs to run. */
export function deriveEffectiveStatus(
  slot: KenovuSlot,
  now: Date = new Date(),
): KenovuSlot["status"] {
  if (slot.status === "active" && isPast(slot.startTime, now)) {
    return "expired";
  }
  return slot.status;
}
