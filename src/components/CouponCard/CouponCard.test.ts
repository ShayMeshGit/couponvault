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
});
