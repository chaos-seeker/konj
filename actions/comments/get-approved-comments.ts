"use server";

import redis from "@/lib/upstash";
import type { TComment } from "@/types/comment";
import { getBook } from "@/actions/dashboard/manage-books/get-book";

export async function getApprovedComments() {
  try {
    // Get all approved comment IDs
    const approvedCommentIds = await redis.zrange(
      "comments:approved",
      0,
      -1
    );

    if (!approvedCommentIds || approvedCommentIds.length === 0) {
      return {
        success: true,
        data: [] as TComment[],
      } as const;
    }

    // Fetch all comment data with book names
    const comments = await Promise.all(
      approvedCommentIds.map(async (commentId) => {
        const commentStr = await redis.get(`comment:${commentId}`);
        if (!commentStr) return null;
        const comment = typeof commentStr === "string"
          ? JSON.parse(commentStr)
          : commentStr;
        
        // Get book name
        const bookResult = await getBook(comment.bookSlug);
        if (bookResult.success && bookResult.data) {
          comment.bookName = bookResult.data.name;
        }
        
        return comment;
      })
    );

    const validComments = comments.filter(
      (c): c is TComment => c !== null && c.status === "approved"
    );

    // Sort by creation date (newest first)
    validComments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      success: true,
      data: validComments,
    } as const;
  } catch (error) {
    console.error("Error fetching approved comments:", error);
    return {
      success: false,
      error: "خطا در دریافت نظرات",
      data: [] as TComment[],
    } as const;
  }
}

