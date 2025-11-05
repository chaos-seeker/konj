"use server";

import redis from "@/lib/upstash";

export async function deleteTranslator(slug: string) {
  try {

    const translator = await redis.get(`translator:${slug}`);
    if (!translator) {
      return {
        success: false,
        error: "مترجم یافت نشد",
      };
    }


    await redis.del(`translator:${slug}`);


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

