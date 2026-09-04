// All "now"-relative formatting lives here. Never hardcode dates elsewhere —
// generate them relative to Date.now() so the demo always looks current.

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isTomorrow(date: Date, now: Date): boolean {
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  return isSameCalendarDay(date, tomorrow);
}

export function formatTime24(date: Date): string {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatDayLabel(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  if (isSameCalendarDay(date, now)) return "Today";
  if (isTomorrow(date, now)) return "Tomorrow";
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatDateTimeLabel(
  iso: string,
  now: Date = new Date(),
): string {
  return `${formatDayLabel(iso, now)} · ${formatTime24(new Date(iso))}`;
}

/** "Starts in 45 min" / "Starts in 2h 15m" / "Started" for past times. */
export function formatCountdown(iso: string, now: Date = new Date()): string {
  const diffMs = new Date(iso).getTime() - now.getTime();
  if (diffMs <= 0) return "Starting now";
  const totalMinutes = Math.round(diffMs / MINUTE);
  if (totalMinutes < 60) return `Starts in ${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (minutes === 0) return `Starts in ${hours}h`;
  return `Starts in ${hours}h ${minutes}m`;
}

export function isPast(iso: string, now: Date = new Date()): boolean {
  return new Date(iso).getTime() <= now.getTime();
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * MINUTE);
}

export function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * HOUR);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY);
}

export function isWithinBucket(
  iso: string,
  bucket: "now" | "today" | "tomorrow",
  now: Date = new Date(),
): boolean {
  const date = new Date(iso);
  if (bucket === "now") {
    const diffMs = date.getTime() - now.getTime();
    return diffMs > 0 && diffMs <= 2 * HOUR;
  }
  if (bucket === "today") return isSameCalendarDay(date, now);
  return isTomorrow(date, now);
}

export function isAfterHour(iso: string, hour: number): boolean {
  return new Date(iso).getHours() >= hour;
}

export function isMorning(iso: string): boolean {
  const h = new Date(iso).getHours();
  return h >= 6 && h < 12;
}

export function isAfternoon(iso: string): boolean {
  const h = new Date(iso).getHours();
  return h >= 12 && h < 17;
}
