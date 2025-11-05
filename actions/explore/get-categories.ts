"use server";

import redis from "@/lib/upstash";
import type { TCategory } from "@/types/category";

export async function getCategories(searchText?: string) {
  try {
    const allCategorySlugs = await redis.zrange("categories:list", 0, -1);
    if (!allCategorySlugs || allCategorySlugs.length === 0) {
      return { success: true, data: [] as TCategory[] } as const;
    }

    const allCategories = await Promise.all(
      allCategorySlugs.map(async (slug) => {
        const catStr = await redis.get(`category:${slug}`);
        if (!catStr) return null;
        return typeof catStr === "string" ? JSON.parse(catStr) : catStr;
      })
    );

    let categories = allCategories.filter(
      (cat): cat is TCategory => cat !== null
    );

    // Search by text
    if (searchText && searchText.trim()) {
      const searchLower = searchText.toLowerCase().trim();
      categories = categories.filter((cat) =>
        cat.name?.toLowerCase().includes(searchLower)
      );
    }

    return { success: true, data: categories } as const;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      error: "خطا در دریافت دسته‌بندی‌ها",
      data: [] as TCategory[],
    } as const;
  }
}
