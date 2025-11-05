"use server";

import redis from "@/lib/upstash";
import { getBook } from "@/actions/dashboard/manage-books/get-book";
import { revalidatePath } from "next/cache";

export async function deleteComment(commentId: string) {
  try {
    // Get comment
    const commentStr = await redis.get(`comment:${commentId}`);
    if (!commentStr) {
      return {
        success: false,
        error: "نظر یافت نشد",
      } as const;
    }

    const comment =
      typeof commentStr === "string" ? JSON.parse(commentStr) : commentStr;

    // Delete comment
    await redis.del(`comment:${commentId}`);

    // Remove from lists
    if (comment.status === "pending") {
      await redis.zrem(`book:${comment.bookSlug}:comments:pending`, commentId);
      await redis.zrem("comments:pending", commentId);
    } else if (comment.status === "approved") {
      await redis.zrem(`book:${comment.bookSlug}:comments:approved`, commentId);
      await redis.zrem("comments:approved", commentId);

      // Update book's comments array - remove this comment
      const bookResult = await getBook(comment.bookSlug);
      if (bookResult.success && bookResult.data) {
        const book = bookResult.data;
        const updatedComments = (book.comments || []).filter(
          (c) =>
            !(
              c.fullName === comment.fullName &&
              c.text === comment.text &&
              c.rating === comment.rating
            )
        );

        await redis.set(
          `book:${comment.bookSlug}`,
          JSON.stringify({
            ...book,
            comments: updatedComments,
          })
        );
      }
    }

    revalidatePath("/dashboard/manage-comments");
    revalidatePath(`/product/${comment.bookSlug}`);

    return {
      success: true,
      message: "نظر با موفقیت حذف شد",
    } as const;
  } catch (error) {
    console.error("Error deleting comment:", error);
    return {
      success: false,
      error: "خطا در حذف نظر",
    } as const;
  }
}

