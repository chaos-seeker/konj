"use server";

import redis from "@/lib/upstash";
import type { TBook } from "@/types/book";

export async function getBook(slug: string) {
  try {
    const n = decodeURIComponent(slug || "").trim();
    const l = n.toLowerCase();

    const readKey = async (s: string) => {
      const data = await redis.get(`book:${s}`);
      if (!data) return null;
      return (typeof data === "string" ? JSON.parse(data) : data) as TBook;
    };

    const direct = (await readKey(n)) || (l !== n ? await readKey(l) : null);
    if (direct) {
      return { success: true, data: direct } as const;
    }

    const slugs =
      (await redis.zrange<string[]>("books:list", 0, -1, { rev: true })) || [];
    const matched = slugs.find((s) => {
      const sn = String(s || "").trim();
      return sn === n || sn.toLowerCase() === l;
    });
    if (matched) {
      const variants = [matched, matched.toLowerCase()].filter(
        (v, i, a) => a.indexOf(v) === i
      );
      for (const v of variants) {
        const fromList = await readKey(v);
        if (fromList) {
          return { success: true, data: fromList } as const;
        }
      }
    }

    return { success: false, error: "کتاب یافت نشد" } as const;
  } catch (error) {
    console.error("Error fetching book:", error);
    return { success: false, error: "خطا در دریافت کتاب" } as const;
  }
}
