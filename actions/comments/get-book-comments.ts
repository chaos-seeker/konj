"use server";

import redis from "@/lib/upstash";
import type { TComment } from "@/types/comment";

export async function getBookComments(bookSlug: string) {
  try {
    // Get approved comment IDs for this book
    const approvedCommentIds = await redis.zrange(
      `book:${bookSlug}:comments:approved`,
      0,
      -1
    );

    if (!approvedCommentIds || approvedCommentIds.length === 0) {
      return {
        success: true,
        data: [] as TComment[],
      } as const;
    }

    // Fetch all comment data
    const comments = await Promise.all(
      approvedCommentIds.map(async (commentId) => {
        const commentStr = await redis.get(`comment:${commentId}`);
        if (!commentStr) return null;
        return typeof commentStr === "string"
          ? JSON.parse(commentStr)
          : commentStr;
      })
    );

    const validComments = comments.filter(
      (c): c is TComment => c !== null && c.status === "approved"
    );

    return {
      success: true,
      data: validComments,
    } as const;
  } catch (error) {
    console.error("Error fetching book comments:", error);
    return {
      success: false,
      error: "خطا در دریافت نظرات",
      data: [] as TComment[],
    } as const;
  }
}

