"use server";

import redis from "@/lib/upstash";

export async function updateAuthor(oldSlug: string, formData: FormData) {
  try {
    const fullName = formData.get("fullName") as string;
    const slug = formData.get("slug") as string;

    if (!fullName || !slug) {
      return {
        success: false,
        error: "تمام فیلدها الزامی هستند",
      };
    }

    // Check if author exists
    const existingAuthor = await redis.get(`author:${oldSlug}`);
    if (!existingAuthor) {
      return {
        success: false,
        error: "نویسنده یافت نشد",
      };
    }

    // If slug changed, check if new slug is available
    if (oldSlug !== slug) {
      const slugExists = await redis.get(`author:${slug}`);
      if (slugExists) {
        return {
          success: false,
          error: "این اسلاگ قبلاً استفاده شده است",
        };
      }
    }

    // Get existing author data
    const authorData =
      typeof existingAuthor === "string"
        ? JSON.parse(existingAuthor)
        : existingAuthor;

    const updatedAuthor = {
      ...authorData,
      fullName,
      slug,
      updatedAt: new Date().toISOString(),
    };

    // If slug changed, delete old entry and create new one
    if (oldSlug !== slug) {
      await redis.del(`author:${oldSlug}`);
      await redis.zrem("authors:list", oldSlug);
      await redis.set(`author:${slug}`, updatedAuthor);
      await redis.zadd("authors:list", {
        score: Date.now(),
        member: slug,
      });
    } else {
      // Just update the existing entry
      await redis.set(`author:${slug}`, updatedAuthor);
    }

    return {
      success: true,
      message: "نویسنده با موفقیت به‌روزرسانی شد",
    };
  } catch (error) {
    console.error("Error updating author:", error);
    return {
      success: false,
      error: "خطا در به‌روزرسانی نویسنده",
    };
  }
}
