"use server";

import redis from "@/lib/upstash";
import { getBook } from "@/actions/dashboard/manage-books/get-book";
import { revalidatePath } from "next/cache";

export async function approveComment(commentId: string) {
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

    if (comment.status !== "pending") {
      return {
        success: false,
        error: "این نظر قبلاً پردازش شده است",
      } as const;
    }

    // Update comment status
    const updatedComment = {
      ...comment,
      status: "approved" as const,
      updatedAt: new Date().toISOString(),
    };

    await redis.set(`comment:${commentId}`, JSON.stringify(updatedComment));

    // Remove from pending lists
    await redis.zrem(`book:${comment.bookSlug}:comments:pending`, commentId);
    await redis.zrem("comments:pending", commentId);

    // Add to approved lists
    await redis.zadd(`book:${comment.bookSlug}:comments:approved`, {
      score: Date.now(),
      member: commentId,
    });
    await redis.zadd("comments:approved", {
      score: Date.now(),
      member: commentId,
    });

    // Update book's comments array
    const bookResult = await getBook(comment.bookSlug);
    if (bookResult.success && bookResult.data) {
      const book = bookResult.data;
      const updatedComments = [
        ...(book.comments || []),
        {
          fullName: comment.fullName,
          text: comment.text,
          rating: comment.rating,
        },
      ];
      
      await redis.set(
        `book:${comment.bookSlug}`,
        JSON.stringify({
          ...book,
          comments: updatedComments,
        })
      );
    }

    revalidatePath("/dashboard/manage-comments");
    revalidatePath(`/product/${comment.bookSlug}`);

    return {
      success: true,
      message: "نظر با موفقیت تایید شد",
    } as const;
  } catch (error) {
    console.error("Error approving comment:", error);
    return {
      success: false,
      error: "خطا در تایید نظر",
    } as const;
  }
}

