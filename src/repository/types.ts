import type {
  Booking,
  Business,
  BusinessService,
  CustomerPreferences,
  CustomerProfile,
  KenovuSlot,
  NotificationPreferences,
  ServiceCategory,
} from "@/domain/types";

export interface CreateSlotInput {
  businessId: string;
  serviceId: string;
  startTimeIso: string;
  normalPrice: number;
  kenovuPrice: number;
}

export interface CreateServiceInput {
  businessId: string;
  name: string;
  description: string;
  durationMinutes: number;
  normalPrice: number;
  category: ServiceCategory;
}

export type BookSlotResult =
  | { ok: true; booking: Booking }
  | { ok: false; message: string };

export type CreateSlotResult =
  | { ok: true; slot: KenovuSlot }
  | { ok: false; message: string };

/**
 * Storage-agnostic interface the whole app depends on. The only
 * implementation today is the localStorage-backed repository in
 * `./local`; a future Supabase repository implements this same interface.
 */
export interface KenovuRepository {
  // Reads
  getBusinesses(): Business[];
  getBusiness(id: string): Business | undefined;
  getServices(businessId: string): BusinessService[];
  getService(id: string): BusinessService | undefined;
  getSlots(): KenovuSlot[];
  getSlot(id: string): KenovuSlot | undefined;
  getBookingsForCustomer(customerId: string): Booking[];
  getBookingsForBusiness(businessId: string): Booking[];
  getBooking(id: string): Booking | undefined;
  getFavoriteBusinessIds(customerId: string): string[];
  getCustomerProfile(): CustomerProfile;

  // Writes
  createService(input: CreateServiceInput): BusinessService;
  updateService(
    id: string,
    patch: Partial<Pick<BusinessService, "name" | "description" | "durationMinutes" | "normalPrice" | "active">>,
  ): BusinessService | undefined;
  createAndPublishSlot(input: CreateSlotInput): CreateSlotResult;
  cancelSlot(id: string): void;
  bookSlot(id: string, customerId: string, customerName: string): BookSlotResult;
  toggleFavorite(customerId: string, businessId: string): void;
  updateCustomerPreferences(patch: Partial<CustomerPreferences>): void;
  updateNotificationPreferences(patch: Partial<NotificationPreferences>): void;

  // Lifecycle
  resetToSeed(): void;
  subscribe(listener: () => void): () => void;
  getVersion(): number;
}
