"use server";

import redis from "@/lib/upstash";
import type { TComment } from "@/types/comment";
import { getBook } from "@/actions/dashboard/manage-books/get-book";

export async function getPendingComments() {
  try {
    const pendingCommentIds = await redis.zrange("comments:pending", 0, -1);

    if (!pendingCommentIds || pendingCommentIds.length === 0) {
      return {
        success: true,
        data: [] as TComment[],
      } as const;
    }

    const comments = await Promise.all(
      pendingCommentIds.map(async (commentId) => {
        const commentStr = await redis.get(`comment:${commentId}`);
        if (!commentStr) return null;
        const comment =
          typeof commentStr === "string" ? JSON.parse(commentStr) : commentStr;

        const bookResult = await getBook(comment.bookSlug);
        if (bookResult.success && bookResult.data) {
          comment.bookName = bookResult.data.name;
        }

        return comment;
      })
    );

    const validComments = comments.filter(
      (c): c is TComment => c !== null && c.status === "pending"
    );

    validComments.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      success: true,
      data: validComments,
    } as const;
  } catch (error) {
    console.error("Error fetching pending comments:", error);
    return {
      success: false,
      error: "خطا در دریافت نظرات",
      data: [] as TComment[],
    } as const;
  }
}
