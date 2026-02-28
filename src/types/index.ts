export type CouponCategory = 'Groceries' | 'Clothing' | 'Dining' | 'Electronics' | 'Home Goods' | 'Other';
export type CouponFilter = 'all' | 'active' | 'redeemed' | 'expired';

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

export type CouponApiResponse = Coupon & {
  amount?: number;
};

export interface CouponCardProps {
  coupon: Coupon;
  onDelete: (id: string) => void;
  onUpdate: (coupon: Coupon) => void;
}

export interface AddCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: CouponFormData) => void;
}
