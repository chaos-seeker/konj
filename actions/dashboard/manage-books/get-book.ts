"use server";

import redis from "@/lib/upstash";
import type { TBook } from "@/types/book";

export async function getBook(slug: string) {
  try {
    const bookData = await redis.get(`book:${slug}`);
    if (!bookData) {
      return {
        success: false,
        error: "کتاب یافت نشد",
      };
    }

    const book =
      typeof bookData === "string" ? JSON.parse(bookData) : bookData;

    return {
      success: true,
      data: book as TBook,
    };
  } catch (error) {
    console.error("Error fetching book:", error);
    return {
      success: false,
      error: "خطا در دریافت کتاب",
    };
  }
}

