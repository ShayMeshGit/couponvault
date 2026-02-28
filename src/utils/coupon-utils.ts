import { addYears, format } from "date-fns";
import {
  Coupon,
  CouponApiResponse,
  CouponFilter,
  CouponFormData,
} from "@/types";

export const FILTER_OPTIONS: readonly CouponFilter[] = [
  "all",
  "active",
  "redeemed",
  "expired",
];

export const normalizeCoupon = (coupon: CouponApiResponse): Coupon => ({
  ...coupon,
  originalAmount: coupon.originalAmount ?? coupon.amount ?? 0,
  amountLeft: coupon.amountLeft ?? coupon.amount ?? 0,
  currency: coupon.currency || "₪",
  category: coupon.category ?? "Other",
  status: coupon.status === "used" ? "redeemed" : coupon.status,
});

export const getDefaultCouponFormData = (): CouponFormData => ({
  storeName: "",
  code: "",
  originalAmount: 0,
  currency: "₪",
  expiryDate: format(addYears(new Date(), 1), "yyyy-MM-dd"),
  description: "",
  category: "Other",
});
