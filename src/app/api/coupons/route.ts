import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Coupon, CouponFormData } from "@/types";

function serializeCoupon(coupon: {
  id: string;
  storeName: string;
  code: string | null;
  originalAmount: number;
  amountLeft: number;
  currency: string;
  expiryDate: string;
  description: string;
  category: string;
  status: string;
  createdAt: Date;
}): Coupon {
  return {
    id: coupon.id,
    storeName: coupon.storeName,
    code: coupon.code ?? undefined,
    originalAmount: coupon.originalAmount,
    amountLeft: coupon.amountLeft,
    currency: coupon.currency,
    expiryDate: coupon.expiryDate,
    description: coupon.description,
    category: coupon.category as Coupon["category"],
    status: coupon.status as Coupon["status"],
    createdAt: coupon.createdAt.getTime(),
  };
}

export async function GET() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(coupons.map(serializeCoupon));
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CouponFormData;

  const createdCoupon = await prisma.coupon.create({
    data: {
      storeName: body.storeName,
      code: body.code || null,
      originalAmount: body.originalAmount,
      amountLeft: body.originalAmount,
      currency: body.currency || "₪",
      expiryDate: body.expiryDate,
      description: body.description || "",
      category: body.category || "Other",
      status: "active",
    },
  });

  return NextResponse.json(serializeCoupon(createdCoupon), { status: 201 });
}
