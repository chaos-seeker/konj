"use server";

import redis from "@/lib/upstash";

export async function updateCategory(oldSlug: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;

    if (!name || !slug) {
      return {
        success: false,
        error: "نام و اسلاگ الزامی هستند",
      };
    }

    // Check if category exists
    const existingCategory = await redis.get(`category:${oldSlug}`);
    if (!existingCategory) {
      return {
        success: false,
        error: "دسته بندی یافت نشد",
      };
    }

    // If slug changed, check if new slug is available
    if (oldSlug !== slug) {
      const slugExists = await redis.get(`category:${slug}`);
      if (slugExists) {
        return {
          success: false,
          error: "این اسلاگ قبلاً استفاده شده است",
        };
      }
    }

    // Get existing category data
    const categoryData =
      typeof existingCategory === "string"
        ? JSON.parse(existingCategory)
        : existingCategory;

    const updatedCategory = {
      ...categoryData,
      name,
      slug,
      updatedAt: new Date().toISOString(),
    };

    // If slug changed, delete old entry and create new one
    if (oldSlug !== slug) {
      await redis.del(`category:${oldSlug}`);
      await redis.zrem("categories:list", oldSlug);
      await redis.set(`category:${slug}`, updatedCategory);
      await redis.zadd("categories:list", {
        score: Date.now(),
        member: slug,
      });
    } else {
      // Just update the existing entry
      await redis.set(`category:${slug}`, updatedCategory);
    }

    return {
      success: true,
      message: "دسته بندی با موفقیت به‌روزرسانی شد",
    };
  } catch (error) {
    console.error("Error updating category:", error);
    return {
      success: false,
      error: "خطا در به‌روزرسانی دسته بندی",
    };
  }
}

