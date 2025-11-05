"use server";

import redis from "@/lib/upstash";

export async function getCategories() {
  try {
    const slugs =
      (await redis.zrange<string[]>("categories:list", 0, -1, {
        rev: true,
      })) || [];

    if (!slugs || slugs.length === 0) {
      return {
        success: true,
        data: [],
      };
    }

    const categories = await Promise.all(
      slugs.map(async (slug) => {
        const categoryData = await redis.get(`category:${slug}`);
        if (categoryData) {
          if (typeof categoryData === "string") {
            return JSON.parse(categoryData);
          }
          return categoryData;
        }
        return null;
      })
    );

    const validCategories = categories.filter((c) => c !== null) as Array<
      import("@/types/category").TCategory
    >;

    return {
      success: true,
      data: validCategories,
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      error: "خطا در دریافت دسته بندی‌ها",
      data: [],
    };
  }
}
