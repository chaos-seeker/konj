"use server";

import redis from "@/lib/upstash";
import type { TPublisher } from "@/types/publisher";

export async function getPublishers(searchText?: string) {
  try {
    const allPublisherSlugs = await redis.zrange("publishers:list", 0, -1);
    if (!allPublisherSlugs || allPublisherSlugs.length === 0) {
      return { success: true, data: [] as TPublisher[] } as const;
    }

    const allPublishers = await Promise.all(
      allPublisherSlugs.map(async (slug) => {
        const pubStr = await redis.get(`publisher:${slug}`);
        if (!pubStr) return null;
        return typeof pubStr === "string" ? JSON.parse(pubStr) : pubStr;
      })
    );

    let publishers = allPublishers.filter((pub): pub is TPublisher => pub !== null);

    if (searchText && searchText.trim()) {
      const searchLower = searchText.toLowerCase().trim();
      publishers = publishers.filter((pub) =>
        pub.name?.toLowerCase().includes(searchLower)
      );
    }

    return { success: true, data: publishers } as const;
  } catch (error) {
    console.error("Error fetching publishers:", error);
    return { success: false, error: "خطا در دریافت ناشرین", data: [] as TPublisher[] } as const;
  }
}

