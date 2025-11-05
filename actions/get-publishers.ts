"use server";

import redis from "@/lib/upstash";

export async function getPublishers() {
  try {
    const slugs =
      (await redis.zrange<string[]>("publishers:list", 0, -1, {
        rev: true,
      })) || [];
    if (!slugs || slugs.length === 0) {
      return {
        success: true,
        data: [],
      };
    }
    const publishers = await Promise.all(
      slugs.map(async (slug) => {
        const publisherData = await redis.get(`publisher:${slug}`);
        if (publisherData) {
          if (typeof publisherData === "string") {
            return JSON.parse(publisherData);
          }
          return publisherData;
        }
        return null;
      })
    );
    const validPublishers = publishers.filter((p) => p !== null) as Array<{
      id: string;
      name: string;
      slug: string;
      image: string;
      createdAt: string;
      updatedAt: string;
    }>;
    return {
      success: true,
      data: validPublishers,
    };
  } catch (error) {
    console.error("Error fetching publishers:", error);
    return {
      success: false,
      error: "خطا در دریافت ناشران",
      data: [],
    };
  }
}
