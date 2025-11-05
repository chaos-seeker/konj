"use server";

import redis from "@/lib/upstash";
import type { TAuthor } from "@/types/author";

export async function getAuthors(searchText?: string) {
  try {
    const allAuthorSlugs = await redis.zrange("authors:list", 0, -1);
    if (!allAuthorSlugs || allAuthorSlugs.length === 0) {
      return { success: true, data: [] as TAuthor[] } as const;
    }

    const allAuthors = await Promise.all(
      allAuthorSlugs.map(async (slug) => {
        const authStr = await redis.get(`author:${slug}`);
        if (!authStr) return null;
        return typeof authStr === "string" ? JSON.parse(authStr) : authStr;
      })
    );

    let authors = allAuthors.filter((auth): auth is TAuthor => auth !== null);

    // Search by text
    if (searchText && searchText.trim()) {
      const searchLower = searchText.toLowerCase().trim();
      authors = authors.filter((auth) =>
        auth.fullName?.toLowerCase().includes(searchLower)
      );
    }

    return { success: true, data: authors } as const;
  } catch (error) {
    console.error("Error fetching authors:", error);
    return { success: false, error: "خطا در دریافت نویسندگان", data: [] as TAuthor[] } as const;
  }
}

