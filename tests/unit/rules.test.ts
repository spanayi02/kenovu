import { describe, expect, it } from "vitest";
import { canBookSlot, validateSlotCreation, validateSlotPrices, validateSlotStartTime } from "@/domain/rules";
import type { KenovuSlot } from "@/domain/types";

const NOW = new Date("2026-09-03T12:00:00.000Z");

function makeSlot(overrides: Partial<KenovuSlot> = {}): KenovuSlot {
  return {
    id: "slot-1",
    businessId: "biz-1",
    serviceId: "svc-1",
    startTime: new Date(NOW.getTime() + 60 * 60_000).toISOString(),
    normalPrice: 55,
    kenovuPrice: 38,
    status: "active",
    createdAt: NOW.toISOString(),
    publishedAt: NOW.toISOString(),
    bookingId: null,
    ...overrides,
  };
}

describe("validateSlotPrices", () => {
  it("rejects a normal price of zero or below", () => {
    expect(validateSlotPrices(0, 10).valid).toBe(false);
    expect(validateSlotPrices(-5, 10).valid).toBe(false);
  });

  it("rejects a Kenovu price of zero or below", () => {
    expect(validateSlotPrices(50, 0).valid).toBe(false);
    expect(validateSlotPrices(50, -1).valid).toBe(false);
  });

  it("rejects a Kenovu price above the normal price", () => {
    const result = validateSlotPrices(50, 60);
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/higher/i);
  });

  it("accepts a valid discount", () => {
    expect(validateSlotPrices(55, 38).valid).toBe(true);
  });

  it("accepts Kenovu price equal to normal price", () => {
    expect(validateSlotPrices(50, 50).valid).toBe(true);
  });
});

describe("validateSlotStartTime", () => {
  it("rejects a time in the past", () => {
    const past = new Date(NOW.getTime() - 60_000).toISOString();
    expect(validateSlotStartTime(past, NOW).valid).toBe(false);
  });

  it("rejects an invalid date string", () => {
    expect(validateSlotStartTime("not-a-date", NOW).valid).toBe(false);
  });

  it("accepts a future time", () => {
    const future = new Date(NOW.getTime() + 60_000).toISOString();
    expect(validateSlotStartTime(future, NOW).valid).toBe(true);
  });
});

describe("validateSlotCreation", () => {
  it("requires a service", () => {
    const result = validateSlotCreation({
      serviceId: null,
      normalPrice: 50,
      kenovuPrice: 30,
      startTimeIso: new Date(NOW.getTime() + 60_000).toISOString(),
      now: NOW,
    });
    expect(result.valid).toBe(false);
  });
});

describe("canBookSlot", () => {
  it("allows booking an active future slot", () => {
    expect(canBookSlot(makeSlot(), NOW).valid).toBe(true);
  });

  it("rejects a missing slot", () => {
    expect(canBookSlot(undefined, NOW).valid).toBe(false);
  });

  it("rejects an already booked slot", () => {
    expect(canBookSlot(makeSlot({ status: "booked" }), NOW).valid).toBe(false);
  });

  it("rejects a cancelled slot", () => {
    expect(canBookSlot(makeSlot({ status: "cancelled" }), NOW).valid).toBe(false);
  });

  it("rejects an expired slot", () => {
    expect(canBookSlot(makeSlot({ status: "expired" }), NOW).valid).toBe(false);
  });

  it("rejects a slot whose start time has already passed even if still marked active", () => {
    const slot = makeSlot({ startTime: new Date(NOW.getTime() - 60_000).toISOString() });
    expect(canBookSlot(slot, NOW).valid).toBe(false);
  });
});
