import type { Booking } from "./types";
import { isPast } from "./time";

export type BookingBucket = "upcoming" | "past" | "cancelled";

export function bucketForBooking(booking: Booking, now: Date = new Date()): BookingBucket {
  if (booking.status === "cancelled") return "cancelled";
  return isPast(booking.startTime, now) ? "past" : "upcoming";
}

export function groupBookings(
  bookings: Booking[],
  now: Date = new Date(),
): Record<BookingBucket, Booking[]> {
  const groups: Record<BookingBucket, Booking[]> = {
    upcoming: [],
    past: [],
    cancelled: [],
  };
  for (const booking of bookings) {
    groups[bucketForBooking(booking, now)].push(booking);
  }
  groups.upcoming.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  );
  groups.past.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  return groups;
}
