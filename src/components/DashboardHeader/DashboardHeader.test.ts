import React from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import DashboardHeader from "./DashboardHeader";

describe("DashboardHeader", () => {
  it("renders app title and actions", () => {
    const html = renderToString(
      React.createElement(DashboardHeader, {
        alertCount: 2,
        onToggleNotifications: vi.fn(),
        onOpenAddModal: vi.fn(),
      }),
    );

    expect(html).toContain("CouponVault");
    expect(html).toContain("Add Coupon");
  });
});
