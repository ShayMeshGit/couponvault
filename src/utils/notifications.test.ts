import { afterEach, describe, expect, it, vi } from "vitest";
import { addDays, format } from "date-fns";
import { buildCoupon } from "@/test/fixtures/coupons";
import { checkExpiringCoupons } from "@/utils/notifications";

describe("checkExpiringCoupons", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns alerts only for active coupons expiring in 3 or 1 days", () => {
    vi.useFakeTimers();
    const baseDate = new Date(2026, 1, 28, 0, 0, 0);
    vi.setSystemTime(baseDate);

    const coupons = [
      buildCoupon({
        id: "c-3",
        storeName: "Store A",
        expiryDate: format(addDays(baseDate, 3), "yyyy-MM-dd"),
      }),
      buildCoupon({
        id: "c-1",
        storeName: "Store B",
        expiryDate: format(addDays(baseDate, 1), "yyyy-MM-dd"),
      }),
      buildCoupon({
        id: "c-2",
        storeName: "Store C",
        expiryDate: format(addDays(baseDate, 2), "yyyy-MM-dd"),
      }),
      buildCoupon({
        id: "c-r",
        status: "redeemed",
        expiryDate: format(addDays(baseDate, 1), "yyyy-MM-dd"),
      }),
      buildCoupon({
        id: "c-e",
        status: "expired",
        expiryDate: format(addDays(baseDate, 3), "yyyy-MM-dd"),
      }),
    ];

    const alerts = checkExpiringCoupons(coupons);

    expect(alerts).toHaveLength(2);
    expect(alerts.map((alert) => alert.couponId)).toEqual(["c-3", "c-1"]);
    expect(alerts[0].daysRemaining).toBe(3);
    expect(alerts[0].message).toContain("3 days");
    expect(alerts[1].daysRemaining).toBe(1);
    expect(alerts[1].message).toContain("1 day");
    expect(alerts[1].message).toContain("$80.00");
  });

  it("returns no alerts for invalid or non-targeted dates", () => {
    vi.useFakeTimers();
    const baseDate = new Date(2026, 1, 28, 0, 0, 0);
    vi.setSystemTime(baseDate);

    const coupons = [
      buildCoupon({ id: "invalid", expiryDate: "not-a-date" }),
      buildCoupon({ id: "today", expiryDate: format(baseDate, "yyyy-MM-dd") }),
      buildCoupon({
        id: "future",
        expiryDate: format(addDays(baseDate, 10), "yyyy-MM-dd"),
      }),
    ];

    const alerts = checkExpiringCoupons(coupons);

    expect(alerts).toEqual([]);
  });
});
