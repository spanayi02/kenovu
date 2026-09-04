import type { Booking, BusinessService } from "./types";

export interface BusinessMetrics {
  bookingCount: number;
  revenueRecovered: number;
  emptyTimeFilledHours: number;
}

export function calculateBusinessMetrics(
  bookings: Booking[],
  services: BusinessService[],
): BusinessMetrics {
  const serviceMap = new Map(services.map((s) => [s.id, s]));
  const revenueRecovered = bookings.reduce((sum, b) => sum + b.businessPayout, 0);
  const totalMinutes = bookings.reduce((sum, b) => {
    const service = serviceMap.get(b.serviceId);
    return sum + (service?.durationMinutes ?? 0);
  }, 0);

  return {
    bookingCount: bookings.length,
    revenueRecovered: Math.round(revenueRecovered * 100) / 100,
    emptyTimeFilledHours: Math.round((totalMinutes / 60) * 10) / 10,
  };
}
