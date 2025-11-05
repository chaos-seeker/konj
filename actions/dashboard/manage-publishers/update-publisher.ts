"use server";

import redis from "@/lib/upstash";

export async function updatePublisher(
  oldSlug: string,
  formData: FormData
) {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;

    if (!name || !slug) {
      return {
        success: false,
        error: "نام و اسلاگ الزامی هستند",
      };
    }


    const existingPublisher = await redis.get(`publisher:${oldSlug}`);
    if (!existingPublisher) {
      return {
        success: false,
        error: "ناشر یافت نشد",
      };
    }


    if (oldSlug !== slug) {
      const slugExists = await redis.get(`publisher:${slug}`);
      if (slugExists) {
        return {
          success: false,
          error: "این اسلاگ قبلاً استفاده شده است",
        };
      }
    }


    const publisherData =
      typeof existingPublisher === "string"
        ? JSON.parse(existingPublisher)
        : existingPublisher;

    const updatedPublisher = {
      ...publisherData,
      name,
      slug,
      updatedAt: new Date().toISOString(),
    };


    if (oldSlug !== slug) {
      await redis.del(`publisher:${oldSlug}`);
      await redis.zrem("publishers:list", oldSlug);
      await redis.set(`publisher:${slug}`, updatedPublisher);
      await redis.zadd("publishers:list", {
        score: Date.now(),
        member: slug,
      });
    } else {

      await redis.set(`publisher:${slug}`, updatedPublisher);
    }

    return {
      success: true,
      message: "ناشر با موفقیت به‌روزرسانی شد",
    };
  } catch (error) {
    console.error("Error updating publisher:", error);
    return {
      success: false,
      error: "خطا در به‌روزرسانی ناشر",
    };
  }
}

