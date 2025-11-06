"use server";

import redis from "@/lib/upstash";

export type TOrder = {
  id: string;
  fullName: string;
  username: string;
  totalPrice: number;
  totalDiscount: number;
  finalPrice: number;
  items: Array<{
    bookSlug: string;
    bookName: string;
    price: number;
    discount: number;
  }>;
  status: string;
  createdAt: string;
};

export async function getOrders() {
  try {
    const orderIds = await redis.zrange("orders:list", 0, -1);

    if (!orderIds || orderIds.length === 0) {
      return {
        success: true,
        data: [] as TOrder[],
      } as const;
    }

    const orders = await Promise.all(
      orderIds.map(async (orderId) => {
        const orderStr = await redis.get(`order:${orderId}`);
        if (!orderStr) return null;
        const order =
          typeof orderStr === "string" ? JSON.parse(orderStr) : orderStr;
        return order;
      })
    );

    const validOrders = orders.filter((o): o is TOrder => o !== null);

    validOrders.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      success: true,
      data: validOrders,
    } as const;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      success: false,
      error: "خطا در دریافت سفارش‌ها",
      data: [] as TOrder[],
    } as const;
  }
}
