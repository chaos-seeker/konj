"use server";

import redis from "@/lib/upstash";

export async function deleteBook(slug: string) {
  try {
    const existingBook = await redis.get(`book:${slug}`);
    if (!existingBook) {
      return {
        success: false,
        error: "کتاب یافت نشد",
      };
    }

    await redis.del(`book:${slug}`);

    await redis.zrem("books:list", slug);

    return {
      success: true,
      message: "کتاب با موفقیت حذف شد",
    };
  } catch (error) {
    console.error("Error deleting book:", error);
    return {
      success: false,
      error: "خطا در حذف کتاب",
    };
  }
}

