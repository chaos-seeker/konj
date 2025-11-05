"use server";

import redis from "@/lib/upstash";

export async function createAuthor(formData: FormData) {
  try {
    const fullName = formData.get("fullName") as string;
    const slug = formData.get("slug") as string;

    if (!fullName || !slug) {
      return {
        success: false,
        error: "تمام فیلدها الزامی هستند",
      };
    }

    const existingAuthor = await redis.get(`author:${slug}`);

    if (existingAuthor) {
      return {
        success: false,
        error: "این اسلاگ قبلاً استفاده شده است",
      };
    }

    const id = `aut_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const author = {
      id,
      fullName,
      slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await redis.set(`author:${slug}`, author);

    await redis.zadd("authors:list", {
      score: Date.now(),
      member: slug,
    });

    return {
      success: true,
      message: "نویسنده با موفقیت افزوده شد",
      id,
    };
  } catch (error) {
    console.error("Error adding author:", error);
    return {
      success: false,
      error: "خطا در افزودن نویسنده",
    };
  }
}
