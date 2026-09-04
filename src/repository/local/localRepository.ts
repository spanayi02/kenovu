import type {
  Booking,
  BusinessService,
  CustomerPreferences,
  KenovuSlot,
  NotificationPreferences,
} from "@/domain/types";
import { DEMO_STORAGE_KEY, DEMO_STORAGE_VERSION } from "@/domain/constants";
import { calculateBusinessPayout, calculateCommission } from "@/domain/pricing";
import { canBookSlot, deriveEffectiveStatus, validateSlotCreation } from "@/domain/rules";
import { buildSeedStore, type StoreShape } from "../seed";
import type {
  BookSlotResult,
  CreateServiceInput,
  CreateSlotInput,
  CreateSlotResult,
  KenovuRepository,
} from "../types";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function safeParse(raw: string | null): StoreShape | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoreShape;
    if (!parsed || parsed.version !== DEMO_STORAGE_VERSION) return null;
    if (!Array.isArray(parsed.businesses) || !Array.isArray(parsed.slots)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

let bookingCounter = 1000;

export class LocalKenovuRepository implements KenovuRepository {
  private store: StoreShape;
  private listeners = new Set<() => void>();
  private version = 0;

  constructor() {
    this.store = this.load();
  }

  getVersion() {
    return this.version;
  }

  private load(): StoreShape {
    if (!isBrowser()) return buildSeedStore();
    const existing = safeParse(window.localStorage.getItem(DEMO_STORAGE_KEY));
    if (existing) return existing;
    const fresh = buildSeedStore();
    this.persist(fresh);
    return fresh;
  }

  private persist(store: StoreShape) {
    this.store = store;
    if (isBrowser()) {
      try {
        window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(store));
      } catch {
        // Storage unavailable (private mode / quota) — keep working in
        // memory for this session rather than crashing the app.
      }
    }
  }

  private notify() {
    this.version += 1;
    for (const l of this.listeners) l();
  }

  private mutate(fn: (draft: StoreShape) => StoreShape) {
    const next = fn(this.store);
    this.persist(next);
    this.notify();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // ---- Reads ----

  getBusinesses() {
    return this.store.businesses;
  }
  getBusiness(id: string) {
    return this.store.businesses.find((b) => b.id === id);
  }
  getServices(businessId: string) {
    return this.store.services.filter((s) => s.businessId === businessId);
  }
  getService(id: string) {
    return this.store.services.find((s) => s.id === id);
  }
  getSlots(): KenovuSlot[] {
    const now = new Date();
    return this.store.slots.map((s) => ({
      ...s,
      status: deriveEffectiveStatus(s, now),
    }));
  }
  getSlot(id: string) {
    return this.getSlots().find((s) => s.id === id);
  }
  getBookingsForCustomer(customerId: string) {
    return this.store.bookings.filter((b) => b.customerId === customerId);
  }
  getBookingsForBusiness(businessId: string) {
    return this.store.bookings.filter((b) => b.businessId === businessId);
  }
  getBooking(id: string) {
    return this.store.bookings.find((b) => b.id === id);
  }
  getFavoriteBusinessIds(customerId: string) {
    return this.store.favorites
      .filter((f) => f.customerId === customerId)
      .map((f) => f.businessId);
  }
  getCustomerProfile() {
    return this.store.customerProfile;
  }

  // ---- Writes ----

  createService(input: CreateServiceInput): BusinessService {
    const service: BusinessService = {
      id: `svc-${crypto.randomUUID()}`,
      businessId: input.businessId,
      name: input.name,
      description: input.description,
      durationMinutes: input.durationMinutes,
      normalPrice: input.normalPrice,
      category: input.category,
      active: true,
    };
    this.mutate((s) => ({ ...s, services: [...s.services, service] }));
    return service;
  }

  updateService(
    id: string,
    patch: Partial<Pick<BusinessService, "name" | "description" | "durationMinutes" | "normalPrice" | "active">>,
  ) {
    let updated: BusinessService | undefined;
    this.mutate((s) => ({
      ...s,
      services: s.services.map((svc) => {
        if (svc.id !== id) return svc;
        updated = { ...svc, ...patch };
        return updated;
      }),
    }));
    return updated;
  }

  createAndPublishSlot(input: CreateSlotInput): CreateSlotResult {
    const validation = validateSlotCreation({
      serviceId: input.serviceId,
      normalPrice: input.normalPrice,
      kenovuPrice: input.kenovuPrice,
      startTimeIso: input.startTimeIso,
    });
    if (!validation.valid) {
      return { ok: false, message: validation.message ?? "Invalid slot." };
    }

    const now = new Date().toISOString();
    const slot: KenovuSlot = {
      id: `slot-${crypto.randomUUID()}`,
      businessId: input.businessId,
      serviceId: input.serviceId,
      startTime: input.startTimeIso,
      normalPrice: input.normalPrice,
      kenovuPrice: input.kenovuPrice,
      status: "active",
      createdAt: now,
      publishedAt: now,
      bookingId: null,
    };
    this.mutate((s) => ({ ...s, slots: [...s.slots, slot] }));
    return { ok: true, slot };
  }

  cancelSlot(id: string) {
    this.mutate((s) => ({
      ...s,
      slots: s.slots.map((slot) =>
        slot.id === id && slot.status === "active"
          ? { ...slot, status: "cancelled" as const }
          : slot,
      ),
    }));
  }

  bookSlot(id: string, customerId: string, customerName: string): BookSlotResult {
    const current = this.getSlot(id);
    const check = canBookSlot(current);
    if (!check.valid) {
      return { ok: false, message: check.message ?? "This slot can't be booked." };
    }
    const slot = current!;
    const commission = calculateCommission(slot.kenovuPrice);
    const businessPayout = calculateBusinessPayout(slot.kenovuPrice);
    bookingCounter += 1;
    const booking: Booking = {
      id: `booking-${crypto.randomUUID()}`,
      reference: `KNV-${bookingCounter}`,
      slotId: slot.id,
      businessId: slot.businessId,
      serviceId: slot.serviceId,
      customerId,
      customerName,
      pricePaid: slot.kenovuPrice,
      normalPrice: slot.normalPrice,
      commission,
      businessPayout,
      startTime: slot.startTime,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    let bookingFailed = false;
    this.mutate((s) => {
      const target = s.slots.find((sl) => sl.id === id);
      const effective = target ? deriveEffectiveStatus(target) : undefined;
      if (!target || effective !== "active") {
        bookingFailed = true;
        return s;
      }
      return {
        ...s,
        slots: s.slots.map((sl) =>
          sl.id === id ? { ...sl, status: "booked" as const, bookingId: booking.id } : sl,
        ),
        bookings: [...s.bookings, booking],
      };
    });

    if (bookingFailed) {
      return { ok: false, message: "This slot was just booked by someone else." };
    }
    return { ok: true, booking };
  }

  toggleFavorite(customerId: string, businessId: string) {
    this.mutate((s) => {
      const exists = s.favorites.some(
        (f) => f.customerId === customerId && f.businessId === businessId,
      );
      return {
        ...s,
        favorites: exists
          ? s.favorites.filter(
              (f) => !(f.customerId === customerId && f.businessId === businessId),
            )
          : [
              ...s.favorites,
              { customerId, businessId, createdAt: new Date().toISOString() },
            ],
      };
    });
  }

  updateCustomerPreferences(patch: Partial<CustomerPreferences>) {
    this.mutate((s) => ({
      ...s,
      customerProfile: {
        ...s.customerProfile,
        preferences: { ...s.customerProfile.preferences, ...patch },
      },
    }));
  }

  updateNotificationPreferences(patch: Partial<NotificationPreferences>) {
    this.mutate((s) => ({
      ...s,
      customerProfile: {
        ...s.customerProfile,
        notificationPreferences: {
          ...s.customerProfile.notificationPreferences,
          ...patch,
        },
      },
    }));
  }

  resetToSeed() {
    this.persist(buildSeedStore());
    this.notify();
  }
}
