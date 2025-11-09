import { describe, expect, it } from "vitest";

function calculatePlatformFee(amountCents: number, feePercent: number) {
  return Math.floor(amountCents * (feePercent / 100));
}

describe("stakes platform fee", () => {
  it("calculates platform fee correctly", () => {
    const fee = calculatePlatformFee(10000, 7.5);
    expect(fee).toBe(750);
  });
});

