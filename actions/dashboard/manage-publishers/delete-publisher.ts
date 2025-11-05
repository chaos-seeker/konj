"use server";

import redis from "@/lib/upstash";

export async function deletePublisher(slug: string) {
  try {

    const publisher = await redis.get(`publisher:${slug}`);
    if (!publisher) {
      return {
        success: false,
        error: "ناشر یافت نشد",
      };
    }


    await redis.del(`publisher:${slug}`);


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

