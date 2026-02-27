-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "storeName" TEXT NOT NULL,
    "code" TEXT,
    "originalAmount" DOUBLE PRECISION NOT NULL,
    "amountLeft" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT '₪',
    "expiryDate" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);
