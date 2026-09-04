import type { Business, BusinessService, KenovuSlot, ServiceCategory } from "./types";
import {
  calculateDiscountPercentage,
} from "./pricing";
import { isAfterHour, isAfternoon, isMorning, isWithinBucket } from "./time";

export type QuickFilter = "now" | "today" | "tomorrow" | "nearby" | "bigSaving";
export type SortOption =
  | "recommended"
  | "startingSoon"
  | "nearest"
  | "biggestSaving"
  | "lowestPrice";

export interface DiscoverFilters {
  query: string;
  categories: ServiceCategory[];
  quickFilters: QuickFilter[];
  sort: SortOption;
}

export interface JoinedSlot {
  slot: KenovuSlot;
  business: Business;
  service: BusinessService;
}

export function joinSlots(
  slots: KenovuSlot[],
  businesses: Business[],
  services: BusinessService[],
): JoinedSlot[] {
  const businessMap = new Map(businesses.map((b) => [b.id, b]));
  const serviceMap = new Map(services.map((s) => [s.id, s]));
  const joined: JoinedSlot[] = [];
  for (const slot of slots) {
    const business = businessMap.get(slot.businessId);
    const service = serviceMap.get(slot.serviceId);
    if (business && service) joined.push({ slot, business, service });
  }
  return joined;
}

export function filterAndSortSlots(
  joined: JoinedSlot[],
  filters: DiscoverFilters,
  now: Date = new Date(),
): JoinedSlot[] {
  const query = filters.query.trim().toLowerCase();

  let result = joined.filter(({ slot }) => slot.status === "active");

  if (query) {
    result = result.filter(
      ({ business, service }) =>
        business.name.toLowerCase().includes(query) ||
        service.name.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query),
    );
  }

  if (filters.categories.length > 0) {
    result = result.filter(({ service }) => filters.categories.includes(service.category));
  }

  for (const qf of filters.quickFilters) {
    result = result.filter(({ slot, business }) => {
      switch (qf) {
        case "now":
          return isWithinBucket(slot.startTime, "now", now);
        case "today":
          return isWithinBucket(slot.startTime, "today", now);
        case "tomorrow":
          return isWithinBucket(slot.startTime, "tomorrow", now);
        case "nearby":
          return business.location.distanceKm <= 3;
        case "bigSaving":
          return calculateDiscountPercentage(slot.normalPrice, slot.kenovuPrice) >= 20;
        default:
          return true;
      }
    });
  }

  const sorted = [...result];
  switch (filters.sort) {
    case "startingSoon":
      sorted.sort(
        (a, b) => new Date(a.slot.startTime).getTime() - new Date(b.slot.startTime).getTime(),
      );
      break;
    case "nearest":
      sorted.sort((a, b) => a.business.location.distanceKm - b.business.location.distanceKm);
      break;
    case "biggestSaving":
      sorted.sort(
        (a, b) =>
          calculateDiscountPercentage(b.slot.normalPrice, b.slot.kenovuPrice) -
          calculateDiscountPercentage(a.slot.normalPrice, a.slot.kenovuPrice),
      );
      break;
    case "lowestPrice":
      sorted.sort((a, b) => a.slot.kenovuPrice - b.slot.kenovuPrice);
      break;
    case "recommended":
    default:
      // Transparent, simple heuristic: soonest-starting slots with the
      // strongest discount and best rating bubble up first — no ML, no
      // "AI" claim, just a readable weighted sort.
      sorted.sort((a, b) => {
        const soonA = new Date(a.slot.startTime).getTime();
        const soonB = new Date(b.slot.startTime).getTime();
        const scoreA =
          calculateDiscountPercentage(a.slot.normalPrice, a.slot.kenovuPrice) +
          a.business.rating * 4 -
          (soonA - now.getTime()) / (1000 * 60 * 60);
        const scoreB =
          calculateDiscountPercentage(b.slot.normalPrice, b.slot.kenovuPrice) +
          b.business.rating * 4 -
          (soonB - now.getTime()) / (1000 * 60 * 60);
        return scoreB - scoreA;
      });
      break;
  }

  return sorted;
}

export function matchesCustomerAvailability(
  startTimeIso: string,
  availability: "any" | "morning" | "afternoon" | "after17",
): boolean {
  if (availability === "any") return true;
  if (availability === "morning") return isMorning(startTimeIso);
  if (availability === "afternoon") return isAfternoon(startTimeIso);
  return isAfterHour(startTimeIso, 17);
}
