import React from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import CouponCard from "./CouponCard";
import type { Coupon } from "@/types";

const coupon: Coupon = {
  id: "coupon-1",
  storeName: "Shop A",
  code: "SAVE10",
  originalAmount: 100,
  amountLeft: 75,
  currency: "$",
  expiryDate: "2027-01-01",
  description: "Discount for select items",
  category: "Other",
  status: "active",
  createdAt: Date.now(),
};

describe("CouponCard", () => {
  it("renders coupon details", () => {
    const html = renderToString(
      React.createElement(CouponCard, {
        coupon,
        onDelete: vi.fn(),
        onUpdate: vi.fn(),
      }),
    );

    expect(html).toContain("Shop A");
    expect(html).toContain("SAVE10");
  });

  it("shows delete button for active coupon", () => {
    const html = renderToString(
      React.createElement(CouponCard, {
        coupon,
        onDelete: vi.fn(),
        onUpdate: vi.fn(),
      }),
    );

    expect(html).toContain("Delete coupon");
  });

  it("hides delete button for redeemed coupon", () => {
    const redeemedCoupon: Coupon = { ...coupon, status: "redeemed" };
    const html = renderToString(
      React.createElement(CouponCard, {
        coupon: redeemedCoupon,
        onDelete: vi.fn(),
        onUpdate: vi.fn(),
      }),
    );

    expect(html).not.toContain("Delete coupon");
  });

  it("hides delete button for expired coupon", () => {
    const expiredCoupon: Coupon = { ...coupon, expiryDate: "2000-01-01", status: "expired" };
    const html = renderToString(
      React.createElement(CouponCard, {
        coupon: expiredCoupon,
        onDelete: vi.fn(),
        onUpdate: vi.fn(),
      }),
    );

    expect(html).not.toContain("Delete coupon");
  });
});
