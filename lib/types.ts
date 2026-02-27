export type CouponCategory = 'Groceries' | 'Clothing' | 'Dining' | 'Electronics' | 'Home Goods' | 'Other';

export interface Coupon {
  id: string;
  storeName: string;
  code?: string;
  originalAmount: number;
  amountLeft: number;
  currency: string;
  expiryDate: string;
  description: string;
  category: CouponCategory;
  status: 'active' | 'used' | 'expired' | 'redeemed';
  createdAt: number;
}

export type CouponFormData = Omit<Coupon, 'id' | 'status' | 'createdAt' | 'amountLeft'>;
