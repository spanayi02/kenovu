import { describe, expect, it } from "vitest";
import { filterAndSortSlots, joinSlots, type DiscoverFilters } from "@/domain/discover";
import type { Business, BusinessService, KenovuSlot } from "@/domain/types";

const NOW = new Date("2026-09-03T12:00:00.000Z");

const business: Business = {
  id: "biz-1",
  name: "Serenity Wellness",
  category: "massage",
  description: "",
  location: { area: "Engomi", addressLine: "", distanceKm: 2 },
  rating: 4.8,
  reviewCount: 126,
  imageKey: "massage-1",
  createdAt: NOW.toISOString(),
};

const farBusiness: Business = {
  ...business,
  id: "biz-2",
  name: "Riverside Hair Co.",
  category: "hair",
  location: { area: "Strovolos", addressLine: "", distanceKm: 8 },
};

const service: BusinessService = {
  id: "svc-1",
  businessId: "biz-1",
  name: "Deep Tissue Massage",
  description: "",
  durationMinutes: 60,
  normalPrice: 55,
  category: "massage",
  active: true,
};

const hairService: BusinessService = {
  ...service,
  id: "svc-2",
  businessId: "biz-2",
  name: "Balayage",
  category: "hair",
  normalPrice: 110,
};

function makeSlot(overrides: Partial<KenovuSlot>): KenovuSlot {
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

const baseFilters: DiscoverFilters = {
  query: "",
  categories: [],
  quickFilters: [],
  sort: "recommended",
};

describe("filterAndSortSlots", () => {
  it("excludes non-active slots", () => {
    const slots = [makeSlot({ id: "a", status: "booked" }), makeSlot({ id: "b", status: "active" })];
    const joined = joinSlots(slots, [business], [service]);
    const result = filterAndSortSlots(joined, baseFilters, NOW);
    expect(result.map((r) => r.slot.id)).toEqual(["b"]);
  });

  it("filters by category", () => {
    const slots = [
      makeSlot({ id: "a" }),
      makeSlot({ id: "b", businessId: "biz-2", serviceId: "svc-2" }),
    ];
    const joined = joinSlots(slots, [business, farBusiness], [service, hairService]);
    const result = filterAndSortSlots(joined, { ...baseFilters, categories: ["hair"] }, NOW);
    expect(result.map((r) => r.slot.id)).toEqual(["b"]);
  });

  it("filters by search query across business and service name", () => {
    const slots = [
      makeSlot({ id: "a" }),
      makeSlot({ id: "b", businessId: "biz-2", serviceId: "svc-2" }),
    ];
    const joined = joinSlots(slots, [business, farBusiness], [service, hairService]);
    const result = filterAndSortSlots(joined, { ...baseFilters, query: "balayage" }, NOW);
    expect(result.map((r) => r.slot.id)).toEqual(["b"]);
  });

  it("applies the nearby quick filter (<=3km)", () => {
    const slots = [
      makeSlot({ id: "a" }),
      makeSlot({ id: "b", businessId: "biz-2", serviceId: "svc-2" }),
    ];
    const joined = joinSlots(slots, [business, farBusiness], [service, hairService]);
    const result = filterAndSortSlots(joined, { ...baseFilters, quickFilters: ["nearby"] }, NOW);
    expect(result.map((r) => r.slot.id)).toEqual(["a"]);
  });

  it("applies the 20%+ saving quick filter", () => {
    const slots = [
      makeSlot({ id: "a", normalPrice: 55, kenovuPrice: 50 }), // ~9% off
      makeSlot({ id: "b", normalPrice: 55, kenovuPrice: 38 }), // ~31% off
    ];
    const joined = joinSlots(slots, [business], [service]);
    const result = filterAndSortSlots(joined, { ...baseFilters, quickFilters: ["bigSaving"] }, NOW);
    expect(result.map((r) => r.slot.id)).toEqual(["b"]);
  });

  it("sorts by lowest price", () => {
    const slots = [
      makeSlot({ id: "a", kenovuPrice: 40 }),
      makeSlot({ id: "b", kenovuPrice: 20 }),
    ];
    const joined = joinSlots(slots, [business], [service]);
    const result = filterAndSortSlots(joined, { ...baseFilters, sort: "lowestPrice" }, NOW);
    expect(result.map((r) => r.slot.id)).toEqual(["b", "a"]);
  });
});
