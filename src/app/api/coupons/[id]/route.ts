import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Coupon } from "@/types";

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

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body = (await request.json()) as Partial<Coupon>;

  const updatedCoupon = await prisma.coupon.update({
    where: { id },
    data: {
      storeName: body.storeName,
      code: body.code ?? null,
      originalAmount: body.originalAmount,
      amountLeft: body.amountLeft,
      currency: body.currency,
      expiryDate: body.expiryDate,
      description: body.description,
      category: body.category,
      status: body.status,
    },
  });

  return NextResponse.json(serializeCoupon(updatedCoupon));
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  await prisma.coupon.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
