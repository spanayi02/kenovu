// Core domain types for Kenovu. Keep this the single source of truth for
// shapes shared across the app — UI components should import from here,
// never redeclare inline shapes for these concepts.

export type ServiceCategory = "hair" | "nails" | "beauty" | "massage";

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  "hair",
  "nails",
  "beauty",
  "massage",
];

export type SlotStatus =
  | "draft"
  | "active"
  | "reserved"
  | "booked"
  | "expired"
  | "cancelled";

export type BookingStatus = "confirmed" | "completed" | "cancelled";

export type NicosiaArea =
  | "Engomi"
  | "Strovolos"
  | "Acropolis"
  | "Aglantzia"
  | "Lakatamia"
  | "Dasoupolis"
  | "Nicosia Centre";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface CustomerProfile {
  userId: string;
  name: string;
  avatarInitials: string;
  homeArea: NicosiaArea;
  preferences: CustomerPreferences;
  notificationPreferences: NotificationPreferences;
}

export interface CustomerPreferences {
  categories: ServiceCategory[];
  maxDistanceKm: number | null; // null = "any"
  availability: "any" | "morning" | "afternoon" | "after17";
  minSavingPercent: 0 | 10 | 20 | 30;
}

export interface NotificationPreferences {
  enabled: boolean;
  categories: ServiceCategory[];
  maxDistanceKm: number | null;
  afterHour: number | null; // e.g. 17 for "after 17:00"
  minSavingPercent: number;
}

export interface BusinessLocation {
  area: NicosiaArea;
  addressLine: string;
  distanceKm: number; // approximate, demo-only
}

export interface Business {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  location: BusinessLocation;
  rating: number; // 1-5
  reviewCount: number;
  imageKey: string; // key into local placeholder image set
  createdAt: string;
}

export interface BusinessService {
  id: string;
  businessId: string;
  name: string;
  description: string;
  durationMinutes: number;
  normalPrice: number;
  category: ServiceCategory;
  active: boolean;
}

export interface KenovuSlot {
  id: string;
  businessId: string;
  serviceId: string;
  startTime: string; // ISO timestamp
  normalPrice: number;
  kenovuPrice: number;
  status: SlotStatus;
  createdAt: string;
  publishedAt: string | null;
  bookingId: string | null;
}

export interface Booking {
  id: string;
  reference: string; // e.g. KNV-1842
  slotId: string;
  businessId: string;
  serviceId: string;
  customerId: string;
  customerName: string;
  pricePaid: number;
  normalPrice: number;
  commission: number;
  businessPayout: number;
  startTime: string;
  status: BookingStatus;
  createdAt: string;
}

export interface Review {
  id: string;
  businessId: string;
  customerName: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface Favorite {
  customerId: string;
  businessId: string;
  createdAt: string;
}

export type DemoMode = "customer" | "business";

export interface ValidationResult {
  valid: boolean;
  message?: string;
}
