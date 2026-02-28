import { afterEach, describe, expect, it, vi } from "vitest";
import { buildCoupon, buildCouponFormData } from "@/test/fixtures/coupons";
import {
  addCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon,
} from "@/services/coupons-api";

describe("coupons-api service", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches coupons with no-store cache", async () => {
    const expectedCoupons = [buildCoupon()];
    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify(expectedCoupons), { status: 200 }),
      );

    const result = await getCoupons();

    expect(fetchSpy).toHaveBeenCalledWith("/api/coupons", {
      cache: "no-store",
    });
    expect(result).toEqual(expectedCoupons);
  });

  it("creates coupon with POST and JSON payload", async () => {
    const payload = buildCouponFormData();
    const createdCoupon = buildCoupon();

    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify(createdCoupon), { status: 201 }),
      );

    const result = await addCoupon(payload);

    expect(fetchSpy).toHaveBeenCalledWith("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    expect(result).toEqual(createdCoupon);
  });

  it("updates coupon via PUT endpoint", async () => {
    const coupon = buildCoupon({ id: "coupon-42" });
    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response(JSON.stringify(coupon), { status: 200 }));

    const result = await updateCoupon(coupon);

    expect(fetchSpy).toHaveBeenCalledWith("/api/coupons/coupon-42", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(coupon),
    });
    expect(result).toEqual(coupon);
  });

  it("handles successful 204 delete responses", async () => {
    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response(null, { status: 204 }));

    await expect(deleteCoupon("coupon-1")).resolves.toBeUndefined();
    expect(fetchSpy).toHaveBeenCalledWith("/api/coupons/coupon-1", {
      method: "DELETE",
    });
  });

  it("throws response text for non-ok responses", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response("Validation failed", {
        status: 400,
        statusText: "Bad Request",
      }),
    );

    await expect(getCoupons()).rejects.toThrow("Validation failed");
  });
});
