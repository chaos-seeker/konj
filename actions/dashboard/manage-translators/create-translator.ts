"use server";

import redis from "@/lib/upstash";

export async function createTranslator(formData: FormData) {
  try {
    const fullName = formData.get("fullName") as string;
    const slug = formData.get("slug") as string;

    if (!fullName || !slug) {
      return {
        success: false,
        error: "تمام فیلدها الزامی هستند",
      };
    }

    // Check if slug already exists
    const existingTranslator = await redis.get(`translator:${slug}`);

    if (existingTranslator) {
      return {
        success: false,
        error: "این اسلاگ قبلاً استفاده شده است",
      };
    }

    const id = `tra_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const translator = {
      id,
      fullName,
      slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store translator by slug
    await redis.set(`translator:${slug}`, translator);

    // Add to translators list (sorted set by timestamp)
    await redis.zadd("translators:list", {
      score: Date.now(),
      member: slug,
    });

    return {
      success: true,
      message: "مترجم با موفقیت افزوده شد",
      id,
    };
  } catch (error) {
    console.error("Error adding translator:", error);
    return {
      success: false,
      error: "خطا در افزودن مترجم",
    };
  }
}
