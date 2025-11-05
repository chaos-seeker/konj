"use server";

import redis from "@/lib/upstash";
import type { TTranslator } from "@/types/translator";

export async function getTranslators(searchText?: string) {
  try {
    const allTranslatorSlugs = await redis.zrange("translators:list", 0, -1);
    if (!allTranslatorSlugs || allTranslatorSlugs.length === 0) {
      return { success: true, data: [] as TTranslator[] } as const;
    }

    const allTranslators = await Promise.all(
      allTranslatorSlugs.map(async (slug) => {
        const transStr = await redis.get(`translator:${slug}`);
        if (!transStr) return null;
        return typeof transStr === "string" ? JSON.parse(transStr) : transStr;
      })
    );

    let translators = allTranslators.filter((trans): trans is TTranslator => trans !== null);

    // Search by text
    if (searchText && searchText.trim()) {
      const searchLower = searchText.toLowerCase().trim();
      translators = translators.filter((trans) =>
        trans.fullName?.toLowerCase().includes(searchLower)
      );
    }

    return { success: true, data: translators } as const;
  } catch (error) {
    console.error("Error fetching translators:", error);
    return { success: false, error: "خطا در دریافت مترجمین", data: [] as TTranslator[] } as const;
  }
}

