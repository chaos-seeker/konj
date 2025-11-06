"use server";

import { supabase } from "@/lib/supabase";
import type { TOrder } from "@/types/order";

export async function getOrders() {
  try {
    const res = await supabase
      .from("orders")
      .select(
        "id, full_name, username, total_price, total_discount, final_price, created_at"
      )
      .order("created_at", { ascending: false });
    if (res.error) throw res.error;
    type Row = Pick<TOrder, "id" | "username" | "createdAt"> & {
      full_name: string;
      total_price: number;
      total_discount: number;
      final_price: number;
      created_at: string;
    };
    const mapped: TOrder[] = ((res.data as Row[]) || []).map((o) => ({
      id: o.id,
      fullName: o.full_name,
      username: o.username,
      totalPrice: o.total_price,
      totalDiscount: o.total_discount,
      finalPrice: o.final_price,
      createdAt: o.created_at,
    }));

    return { success: true, data: mapped } as const;
  } catch {
    return {
      success: false,
      error: "خطا در دریافت سفارش‌ها",
      data: [] as TOrder[],
    } as const;
  }
}
