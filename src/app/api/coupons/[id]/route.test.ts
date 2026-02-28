import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { buildCoupon, buildCouponDbRecord } from "@/test/fixtures/coupons";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    coupon: {
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/lib/prisma", () => ({
  default: prismaMock,
}));

import { DELETE, PUT } from "@/app/api/coupons/[id]/route";

describe("/api/coupons/[id] route", () => {
  it("PUT updates coupon by id and returns serialized response", async () => {
    const payload = buildCoupon({
      id: "coupon-5",
      status: "redeemed",
      code: undefined,
    });
    const updated = buildCouponDbRecord({
      id: "coupon-5",
      status: "redeemed",
      code: null,
      createdAt: new Date("2026-02-10T00:00:00.000Z"),
    });

    prismaMock.coupon.update.mockResolvedValueOnce(updated);

    const request = new NextRequest("http://localhost/api/coupons/coupon-5", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const response = await PUT(request, {
      params: Promise.resolve({ id: "coupon-5" }),
    });
    const json = await response.json();

    expect(prismaMock.coupon.update).toHaveBeenCalledWith({
      where: { id: "coupon-5" },
      data: {
        storeName: payload.storeName,
        code: null,
        originalAmount: payload.originalAmount,
        amountLeft: payload.amountLeft,
        currency: payload.currency,
        expiryDate: payload.expiryDate,
        description: payload.description,
        category: payload.category,
        status: payload.status,
      },
    });

    expect(response.status).toBe(200);
    expect(json).toEqual({
      ...updated,
      code: undefined,
      createdAt: updated.createdAt.getTime(),
    });
  });

  it("DELETE removes coupon by id and returns 204", async () => {
    prismaMock.coupon.delete.mockResolvedValueOnce(undefined);

    const request = new NextRequest("http://localhost/api/coupons/coupon-8", {
      method: "DELETE",
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "coupon-8" }),
    });

    expect(prismaMock.coupon.delete).toHaveBeenCalledWith({
      where: { id: "coupon-8" },
    });
    expect(response.status).toBe(204);
  });
});
