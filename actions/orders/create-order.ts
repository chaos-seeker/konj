"use server";

import redis from "@/lib/upstash";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

export interface CreateOrderData {
  fullName: string;
  totalPrice: number;
  totalDiscount: number;
  token: string;
  items: Array<{
    bookSlug: string;
    bookName: string;
    price: number;
    discount: number;
  }>;
}

export async function createOrder(data: CreateOrderData) {
  try {
    const { fullName, totalPrice, totalDiscount, token, items } = data;

    if (!fullName || !token || !items || items.length === 0) {
      return {
        success: false,
        error: "تمام فیلدهای الزامی را پر کنید",
      } as const;
    }

    // Verify token
    const userTokenData = await redis.get(`token:${token}`);
    if (!userTokenData) {
      return {
        success: false,
        error: "کاربر احراز هویت نشده است. لطفاً دوباره وارد شوید.",
      } as const;
    }

    const orderId = randomUUID();
    const orderData = {
      id: orderId,
      fullName,
      totalPrice,
      totalDiscount,
      finalPrice: totalPrice - totalDiscount,
      items,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Store the order
    await redis.set(`order:${orderId}`, JSON.stringify(orderData));

    // Add to orders list sorted by date
    await redis.zadd("orders:list", {
      score: Date.now(),
      member: orderId,
    });

    // Clear the cart (we'll need to handle this on the client side)
    revalidatePath("/cart");

    return {
      success: true,
      message: "سفارش با موفقیت ثبت شد",
      data: { orderId },
    } as const;
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      error: "خطا در ثبت سفارش",
    } as const;
  }
}

