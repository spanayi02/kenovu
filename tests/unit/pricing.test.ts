import { describe, expect, it } from "vitest";
import {
  calculateBusinessPayout,
  calculateCommission,
  calculateDiscountPercentage,
  formatPrice,
  quickDiscountPrice,
  round2,
} from "@/domain/pricing";

describe("calculateDiscountPercentage", () => {
  it("matches the spec example (55 -> 38 is ~31% off)", () => {
    expect(calculateDiscountPercentage(55, 38)).toBe(31);
  });

  it("returns 0 for no discount", () => {
    expect(calculateDiscountPercentage(50, 50)).toBe(0);
  });

  it("never returns a negative percentage", () => {
    expect(calculateDiscountPercentage(50, 60)).toBe(0);
  });

  it("handles a zero normal price without dividing by zero", () => {
    expect(calculateDiscountPercentage(0, 0)).toBe(0);
  });
});

describe("commission math", () => {
  it("matches the spec example (12% of 38 = 4.56)", () => {
    expect(calculateCommission(38)).toBe(4.56);
  });

  it("business payout is Kenovu price minus commission", () => {
    expect(calculateBusinessPayout(38)).toBe(round2(38 - 4.56));
    expect(calculateBusinessPayout(38)).toBeCloseTo(33.44, 2);
  });
});

describe("formatPrice", () => {
  it("formats whole numbers without decimals", () => {
    expect(formatPrice(38)).toBe("€38");
  });

  it("formats fractional amounts with 2 decimals", () => {
    expect(formatPrice(33.44)).toBe("€33.44");
  });
});

describe("quickDiscountPrice", () => {
  it("applies a percentage off the normal price", () => {
    expect(quickDiscountPrice(55, 20)).toBe(44);
  });
});
