"use server";

import redis from "@/lib/upstash";

export async function getAuthors() {
  try {
    const slugs =
      (await redis.zrange<string[]>("authors:list", 0, -1, {
        rev: true,
      })) || [];

    if (!slugs || slugs.length === 0) {
      return {
        success: true,
        data: [],
      };
    }

    const authors = await Promise.all(
      slugs.map(async (slug) => {
        const authorData = await redis.get(`author:${slug}`);
        if (authorData) {
          if (typeof authorData === "string") {
            return JSON.parse(authorData);
          }
          return authorData;
        }
        return null;
      })
    );

    const validAuthors = authors.filter((a) => a !== null) as Array<
      import("@/types/author").TAuthor
    >;

    return {
      success: true,
      data: validAuthors,
    };
  } catch (error) {
    console.error("Error fetching authors:", error);
    return {
      success: false,
      error: "خطا در دریافت نویسندگان",
      data: [],
    };
  }
}
