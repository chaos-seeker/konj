"use server";

import redis from "@/lib/upstash";

export async function createCategory(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;

    if (!name || !slug) {
      return {
        success: false,
        error: "تمام فیلدها الزامی هستند",
      };
    }


    const existingCategory = await redis.get(`category:${slug}`);

    if (existingCategory) {
      return {
        success: false,
        error: "این اسلاگ قبلاً استفاده شده است",
      };
    }

    const id = `cat_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const category = {
      id,
      name,
      slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };


    await redis.set(`category:${slug}`, category);


    await redis.zadd("categories:list", {
      score: Date.now(),
      member: slug,
    });

    return {
      success: true,
      message: "دسته بندی با موفقیت افزوده شد",
      id,
    };
  } catch (error) {
    console.error("Error adding category:", error);
    return {
      success: false,
      error: "خطا در افزودن دسته بندی",
    };
  }
}

