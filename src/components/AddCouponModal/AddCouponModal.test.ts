import React from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import AddCouponModal from "./AddCouponModal";

describe("AddCouponModal", () => {
  it("returns empty markup when closed", () => {
    const html = renderToString(
      React.createElement(AddCouponModal, {
        isOpen: false,
        onClose: vi.fn(),
        onAdd: vi.fn(),
      }),
    );

    expect(html).toBe("");
  });

  it("renders form content when open", () => {
    const html = renderToString(
      React.createElement(AddCouponModal, {
        isOpen: true,
        onClose: vi.fn(),
        onAdd: vi.fn(),
      }),
    );

    expect(html).toContain("Add New Coupon");
    expect(html).toContain("Save Coupon");
  });
});
