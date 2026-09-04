import type {
  Booking,
  Business,
  BusinessService,
  CustomerProfile,
  Favorite,
  KenovuSlot,
} from "@/domain/types";
import { CURRENT_CUSTOMER, DEMO_STORAGE_VERSION } from "@/domain/constants";
import { buildBusinessesAndServices } from "./businesses";
import { buildSeedSlots } from "./slots";

export interface StoreShape {
  version: number;
  businesses: Business[];
  services: BusinessService[];
  slots: KenovuSlot[];
  bookings: Booking[];
  favorites: Favorite[];
  customerProfile: CustomerProfile;
}

export function buildSeedStore(now: Date = new Date()): StoreShape {
  const { businesses, services } = buildBusinessesAndServices();
  const slots = buildSeedSlots(services, now);

  const customerProfile: CustomerProfile = {
    userId: CURRENT_CUSTOMER.id,
    name: CURRENT_CUSTOMER.name,
    avatarInitials: CURRENT_CUSTOMER.avatarInitials,
    homeArea: "Engomi",
    preferences: {
      categories: [],
      maxDistanceKm: null,
      availability: "any",
      minSavingPercent: 0,
    },
    notificationPreferences: {
      enabled: false,
      categories: [],
      maxDistanceKm: 5,
      afterHour: 17,
      minSavingPercent: 20,
    },
  };

  const favorites: Favorite[] = [
    {
      customerId: CURRENT_CUSTOMER.id,
      businessId: "biz-serenity-wellness",
      createdAt: now.toISOString(),
    },
  ];

  return {
    version: DEMO_STORAGE_VERSION,
    businesses,
    services,
    slots,
    bookings: [],
    favorites,
    customerProfile,
  };
}
