import { KENOVU_COMMISSION_RATE } from "./constants";

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateDiscountPercentage(
  normalPrice: number,
  kenovuPrice: number,
): number {
  if (normalPrice <= 0) return 0;
  const raw = ((normalPrice - kenovuPrice) / normalPrice) * 100;
  return Math.max(0, Math.round(raw));
}

export function calculateCommission(kenovuPrice: number): number {
  return round2(kenovuPrice * KENOVU_COMMISSION_RATE);
}

export function calculateBusinessPayout(kenovuPrice: number): number {
  return round2(kenovuPrice - calculateCommission(kenovuPrice));
}

export function formatPrice(amount: number): string {
  const rounded = round2(amount);
  const isWhole = Number.isInteger(rounded);
  return `€${rounded.toLocaleString("en-IE", {
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function quickDiscountPrice(
  normalPrice: number,
  percentOff: number,
): number {
  return round2(normalPrice * (1 - percentOff / 100));
}
