import { Coupon } from './types';
import { differenceInDays, parseISO } from 'date-fns';

export interface ExpiryAlert {
  couponId: string;
  storeName: string;
  daysRemaining: number;
  message: string;
}

export const checkExpiringCoupons = (coupons: Coupon[]): ExpiryAlert[] => {
  const alerts: ExpiryAlert[] = [];
  const today = new Date();

  coupons.forEach(coupon => {
    if (coupon.status === 'redeemed' || coupon.status === 'expired') return;

    const expiryDate = parseISO(coupon.expiryDate);
    const daysRemaining = differenceInDays(expiryDate, today);

    if (daysRemaining === 3 || daysRemaining === 1) {
      alerts.push({
        couponId: coupon.id,
        storeName: coupon.storeName,
        daysRemaining,
        message: `${coupon.storeName} coupon expires in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}! Remaining balance: ${coupon.currency}${(coupon.amountLeft ?? 0).toFixed(2)}`,
      });
    }
  });

  return alerts;
};
