import React from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import CouponStatsCard from "./CouponStatsCard";

describe("CouponStatsCard", () => {
  it("renders summary metrics", () => {
    const html = renderToString(
      React.createElement(CouponStatsCard, {
        activeCount: 3,
        redeemedCount: 1,
        totalLeft: 42.5,
        totalLeftCurrency: "$",
        redeemedPercent: 25,
      }),
    );

    expect(html).toContain("Total Savings");
    expect(html).toContain("3");
  });
});
