"use server";

import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";

export async function addComment(data: {
  bookSlug: string;
  fullName: string;
  text: string;
  rating: number;
  token: string;
}) {
  try {
    const bookSlug = data.bookSlug;
    const fullName = data.fullName;
    const text = data.text;
    const rating = data.rating;
    const token = data.token;

    if (!bookSlug || !fullName || !text || !rating || !token) {
      return {
        success: false,
        error: "تمام فیلدهای الزامی را پر کنید",
      } as const;
    }

    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const res = await supabase.from("comments").insert({
      id: id,
      book_id: null,
      full_name: fullName,
      text: text,
      rating: rating,
      status: "pending",
      created_at: createdAt,
    });
    if (res.error) {
      return { success: false, error: res.error.message } as const;
    }

    return {
      success: true,
      message: "نظر شما با موفقیت ثبت شد و در انتظار تایید است",
      data: {
        id,
        bookSlug,
        fullName,
        text,
        rating,
        createdAt,
        status: "pending",
      },
    } as const;
  } catch {
    return {
      success: false,
      error: "خطا در ثبت نظر",
    } as const;
  }
}
