"use server";

import redis from "@/lib/upstash";

export async function getTranslators() {
  try {
    const slugs =
      (await redis.zrange<string[]>("translators:list", 0, -1, {
        rev: true,
      })) || [];

    if (!slugs || slugs.length === 0) {
      return {
        success: true,
        data: [],
      };
    }

    const translators = await Promise.all(
      slugs.map(async (slug) => {
        const translatorData = await redis.get(`translator:${slug}`);
        if (translatorData) {
          if (typeof translatorData === "string") {
            return JSON.parse(translatorData);
          }
          return translatorData;
        }
        return null;
      })
    );

    const validTranslators = translators.filter((t) => t !== null) as Array<{
      id: string;
      fullName: string;
      slug: string;
      createdAt: string;
      updatedAt: string;
    }>;

    return {
      success: true,
      data: validTranslators,
    };
  } catch (error) {
    console.error("Error fetching translators:", error);
    return {
      success: false,
      error: "خطا در دریافت مترجمین",
      data: [],
    };
  }
}
