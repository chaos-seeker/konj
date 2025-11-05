"use server";

import redis from "@/lib/upstash";

export async function createPublisher(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const image = formData.get("image") as File;
    if (!name || !slug || !image) {
      return {
        success: false,
        error: "تمام فیلدها الزامی هستند",
      };
    }
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");
    const imageDataUrl = `data:${image.type};base64,${base64Image}`;
    const existingPublisher = await redis.get(`publisher:${slug}`);
    if (existingPublisher) {
      return {
        success: false,
        error: "این اسلاگ قبلاً استفاده شده است",
      };
    }
    const id = `pub_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const publisher = {
      id,
      name,
      slug,
      image: imageDataUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await redis.set(`publisher:${slug}`, JSON.stringify(publisher));
    await redis.zadd("publishers:list", {
      score: Date.now(),
      member: slug,
    });

    return {
      success: true,
      message: "ناشر با موفقیت افزوده شد",
      id,
    };
  } catch (error) {
    console.error("Error adding publisher:", error);
    return {
      success: false,
      error: "خطا در افزودن ناشر",
    };
  }
}
