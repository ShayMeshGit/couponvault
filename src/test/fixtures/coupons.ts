import { Coupon, CouponFormData } from "@/types";

export interface CouponDbRecord {
  id: string;
  storeName: string;
  code: string | null;
  originalAmount: number;
  amountLeft: number;
  currency: string;
  expiryDate: string;
  description: string;
  category: string;
  status: string;
  createdAt: Date;
}

export function buildCoupon(overrides: Partial<Coupon> = {}): Coupon {
  return {
    id: "coupon-1",
    storeName: "Test Store",
    code: "SAVE10",
    originalAmount: 100,
    amountLeft: 80,
    currency: "$",
    expiryDate: "2027-02-01",
    description: "Test coupon",
    category: "Other",
    status: "active",
    createdAt: 1738368000000,
    ...overrides,
  };
}

export function buildCouponFormData(
  overrides: Partial<CouponFormData> = {},
): CouponFormData {
  return {
    storeName: "Test Store",
    code: "SAVE10",
    originalAmount: 100,
    currency: "$",
    expiryDate: "2027-02-01",
    description: "Test coupon",
    category: "Other",
    ...overrides,
  };
}

export function buildCouponDbRecord(
  overrides: Partial<CouponDbRecord> = {},
): CouponDbRecord {
  return {
    id: "coupon-1",
    storeName: "Test Store",
    code: "SAVE10",
    originalAmount: 100,
    amountLeft: 80,
    currency: "$",
    expiryDate: "2027-02-01",
    description: "Test coupon",
    category: "Other",
    status: "active",
    createdAt: new Date("2026-02-01T00:00:00.000Z"),
    ...overrides,
  };
}