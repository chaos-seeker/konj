'use server';

import { supabase } from '@/lib/supabase';
import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';

export interface CreateOrderData {
  fullName: string;
  username: string;
  totalPrice: number;
  totalDiscount: number;
  token: string;
}

export async function createOrder(data: CreateOrderData) {
  try {
    if (!data.fullName || !data.username || !data.token) {
      return {
        success: false,
        error: 'تمام فیلدهای الزامی را پر کنید',
      } as const;
    }
    const orderId = randomUUID();
    const createdAt = new Date().toISOString();
    const finalPrice = data.totalPrice - data.totalDiscount;
    const insertOrderRes = await supabase.from('orders').insert({
      id: orderId,
      full_name: data.fullName,
      username: data.username,
      total_price: data.totalPrice,
      total_discount: data.totalDiscount,
      final_price: finalPrice,
      status: 'pending',
      created_at: createdAt,
    });
    if (insertOrderRes.error) {
      return { success: false, error: insertOrderRes.error.message } as const;
    }
    revalidatePath('/cart');
    revalidatePath('/profile');

    return {
      success: true,
      message: 'سفارش با موفقیت ثبت شد',
      data: { orderId },
    } as const;
  } catch {
    return {
      success: false,
      error: 'خطا در ثبت سفارش',
    } as const;
  }
}
