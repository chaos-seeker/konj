"use server";

import redis from "@/lib/upstash";

export async function deleteCategory(slug: string) {
  try {

    const category = await redis.get(`category:${slug}`);
    if (!category) {
      return {
        success: false,
        error: "دسته بندی یافت نشد",
      };
    }


    await redis.del(`category:${slug}`);


    await redis.zrem("categories:list", slug);

    return {
      success: true,
      message: "دسته بندی با موفقیت حذف شد",
    };
  } catch (error) {
    console.error("Error deleting category:", error);
    return {
      success: false,
      error: "خطا در حذف دسته بندی",
    };
  }
}

