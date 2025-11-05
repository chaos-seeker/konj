"use server";

import redis from "@/lib/upstash";

export async function deleteAuthor(slug: string) {
  try {
    const author = await redis.get(`author:${slug}`);
    if (!author) {
      return {
        success: false,
        error: "نویسنده یافت نشد",
      };
    }

    await redis.del(`author:${slug}`);

    await redis.zrem("authors:list", slug);

    return {
      success: true,
      message: "نویسنده با موفقیت حذف شد",
    };
  } catch (error) {
    console.error("Error deleting author:", error);
    return {
      success: false,
      error: "خطا در حذف نویسنده",
    };
  }
}

