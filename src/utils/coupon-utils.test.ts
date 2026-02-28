import { afterEach, describe, expect, it, vi } from "vitest";
import { CouponApiResponse } from "@/types";
import {
  getDefaultCouponFormData,
  normalizeCoupon,
} from "@/utils/coupon-utils";

describe("normalizeCoupon", () => {
  it("normalizes missing fields and maps status used -> redeemed", () => {
    const input = {
      id: "coupon-1",
      storeName: "Coffee Shop",
      originalAmount: undefined,
      amountLeft: undefined,
      amount: 25,
      currency: "",
      expiryDate: "2027-01-01",
      description: "",
      category: "Other",
      status: "used",
      createdAt: 1738368000000,
    } as unknown as CouponApiResponse;

    const result = normalizeCoupon(input);

    expect(result.originalAmount).toBe(25);
    expect(result.amountLeft).toBe(25);
    expect(result.currency).toBe("₪");
    expect(result.category).toBe("Other");
    expect(result.status).toBe("redeemed");
  });

  it("keeps explicit values when present", () => {
    const input: CouponApiResponse = {
      id: "coupon-2",
      storeName: "Book Store",
      originalAmount: 50,
      amountLeft: 10,
      amount: 5,
      currency: "€",
      expiryDate: "2027-01-01",
      description: "",
      category: "Electronics",
      status: "active",
      createdAt: 1738368000000,
    };

    const result = normalizeCoupon(input);

    expect(result.originalAmount).toBe(50);
    expect(result.amountLeft).toBe(10);
    expect(result.currency).toBe("€");
    expect(result.category).toBe("Electronics");
    expect(result.status).toBe("active");
  });
});

describe("getDefaultCouponFormData", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns stable defaults and expiry date one year ahead", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-02-28T10:00:00.000Z"));

    const defaults = getDefaultCouponFormData();

    expect(defaults).toEqual({
      storeName: "",
      code: "",
      originalAmount: 0,
      currency: "₪",
      expiryDate: "2027-02-28",
      description: "",
      category: "Other",
    });
  });
});
