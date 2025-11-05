"use server";

import redis from "@/lib/upstash";
import type { TOrder } from "./get-orders";

export async function getUserOrders(fullName: string) {
  try {
    if (!fullName) {
      return {
        success: false,
        error: "نام کاربری یافت نشد",
        data: [] as TOrder[],
      } as const;
    }

    // Get all order IDs from the sorted set
    const orderIds = await redis.zrange("orders:list", 0, -1);

    if (!orderIds || orderIds.length === 0) {
      return {
        success: true,
        data: [] as TOrder[],
      } as const;
    }

    // Fetch all order data
    const orders = await Promise.all(
      orderIds.map(async (orderId) => {
        const orderStr = await redis.get(`order:${orderId}`);
        if (!orderStr) return null;
        const order = typeof orderStr === "string" ? JSON.parse(orderStr) : orderStr;
        return order;
      })
    );

    const validOrders = orders.filter((o): o is TOrder => o !== null);

    // Filter by user's fullName
    const userOrders = validOrders.filter(
      (order) => order.fullName?.toLowerCase() === fullName.toLowerCase()
    );

    // Sort by creation date (newest first)
    userOrders.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      success: true,
      data: userOrders,
    } as const;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return {
      success: false,
      error: "خطا در دریافت سفارش‌های شما",
      data: [] as TOrder[],
    } as const;
  }
}

