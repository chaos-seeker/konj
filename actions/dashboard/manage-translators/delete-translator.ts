"use server";

import redis from "@/lib/upstash";

export async function deleteTranslator(slug: string) {
  try {
    // Check if translator exists
    const translator = await redis.get(`translator:${slug}`);
    if (!translator) {
      return {
        success: false,
        error: "مترجم یافت نشد",
      };
    }

    // Delete translator
    await redis.del(`translator:${slug}`);

    // Remove from translators list
    await redis.zrem("translators:list", slug);

    return {
      success: true,
      message: "مترجم با موفقیت حذف شد",
    };
  } catch (error) {
    console.error("Error deleting translator:", error);
    return {
      success: false,
      error: "خطا در حذف مترجم",
    };
  }
}

