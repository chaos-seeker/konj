"use server";

import redis from "@/lib/upstash";
import type { TBook } from "@/types/book";

export async function getBooks() {
  try {
    const slugs =
      (await redis.zrange<string[]>("books:list", 0, -1, {
        rev: true,
      })) || [];

    if (!slugs || slugs.length === 0) {
      return {
        success: true,
        data: [],
      };
    }

    const books = await Promise.all(
      slugs.map(async (slug) => {
        const bookData = await redis.get(`book:${slug}`);
        if (bookData) {
          if (typeof bookData === "string") {
            return JSON.parse(bookData);
          }
          return bookData;
        }
        return null;
      })
    );

    const validBooks = books.filter((b) => b !== null) as TBook[];

    return {
      success: true,
      data: validBooks,
    };
  } catch (error) {
    console.error("Error fetching books:", error);
    return {
      success: false,
      error: "خطا در دریافت کتاب‌ها",
      data: [],
    };
  }
}

