import React from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import CouponFilters from "./CouponFilters";

describe("CouponFilters", () => {
  it("renders search field and filters", () => {
    const html = renderToString(
      React.createElement(CouponFilters, {
        searchQuery: "",
        filter: "all",
        onSearchChange: vi.fn(),
        onFilterChange: vi.fn(),
      }),
    );

    expect(html).toContain("Search by name, category, or date");
  });
});
