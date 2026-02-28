import React from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import CouponDashboard from "./CouponDashboard";

describe("CouponDashboard", () => {
  it("renders empty-state content", () => {
    const html = renderToString(React.createElement(CouponDashboard));

    expect(html).toContain("No coupons found");
  });
});
