import { Coupon, CouponFormData } from "@/types";

const API_BASE = "/api/coupons";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function getCoupons(): Promise<Coupon[]> {
  const response = await fetch(API_BASE, { cache: "no-store" });
  return parseResponse<Coupon[]>(response);
}

export async function addCoupon(data: CouponFormData): Promise<Coupon> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return parseResponse<Coupon>(response);
}

export async function updateCoupon(coupon: Coupon): Promise<Coupon> {
  const response = await fetch(`${API_BASE}/${coupon.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(coupon),
  });

  return parseResponse<Coupon>(response);
}

export async function deleteCoupon(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });

  await parseResponse<void>(response);
}
