"use server";

import redis from "@/lib/upstash";

export async function deleteBook(slug: string) {
  try {
    // Check if book exists
    const existingBook = await redis.get(`book:${slug}`);
    if (!existingBook) {
      return {
        success: false,
        error: "کتاب یافت نشد",
      };
    }

    // Delete book
    await redis.del(`book:${slug}`);

    // Remove from books list
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

