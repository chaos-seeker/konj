"use server";

import redis from "@/lib/upstash";

export async function deletePublisher(slug: string) {
  try {
    // Check if publisher exists
    const publisher = await redis.get(`publisher:${slug}`);
    if (!publisher) {
      return {
        success: false,
        error: "ناشر یافت نشد",
      };
    }

    // Delete publisher
    await redis.del(`publisher:${slug}`);

    // Remove from publishers list
    await redis.zrem("publishers:list", slug);

    return {
      success: true,
      message: "ناشر با موفقیت حذف شد",
    };
  } catch (error) {
    console.error("Error deleting publisher:", error);
    return {
      success: false,
      error: "خطا در حذف ناشر",
    };
  }
}

