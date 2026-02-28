import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import {
  buildCouponDbRecord,
  buildCouponFormData,
} from "@/test/fixtures/coupons";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    coupon: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("@/lib/prisma", () => ({
  default: prismaMock,
}));

import { GET, POST } from "@/app/api/coupons/route";

describe("/api/coupons route", () => {
  it("GET returns coupons ordered by creation date and serialized fields", async () => {
    const dbCoupon = buildCouponDbRecord({
      code: null,
      createdAt: new Date("2026-02-01T00:00:00.000Z"),
    });
    prismaMock.coupon.findMany.mockResolvedValueOnce([dbCoupon]);

    const response = await GET();
    const json = await response.json();

    expect(prismaMock.coupon.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
    });
    expect(response.status).toBe(200);
    expect(json).toEqual([
      {
        ...dbCoupon,
        code: undefined,
        createdAt: dbCoupon.createdAt.getTime(),
      },
    ]);
  });

  it("POST creates coupon with defaults and returns 201", async () => {
    const requestBody = buildCouponFormData({
      code: "",
      currency: "",
      description: "",
      category: "Other",
    });

    const created = buildCouponDbRecord({
      id: "created-1",
      code: null,
      currency: "₪",
      amountLeft: requestBody.originalAmount,
      description: "",
      category: "Other",
    });

    prismaMock.coupon.create.mockResolvedValueOnce(created);

    const request = new NextRequest("http://localhost/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(prismaMock.coupon.create).toHaveBeenCalledWith({
      data: {
        storeName: requestBody.storeName,
        code: null,
        originalAmount: requestBody.originalAmount,
        amountLeft: requestBody.originalAmount,
        currency: "₪",
        expiryDate: requestBody.expiryDate,
        description: "",
        category: "Other",
        status: "active",
      },
    });
    expect(response.status).toBe(201);
    expect(json).toEqual({
      ...created,
      code: undefined,
      createdAt: created.createdAt.getTime(),
    });
  });
});
