"use server";

import redis from "@/lib/upstash";
import { revalidatePath } from "next/cache";

export async function rejectComment(commentId: string) {
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

    // Update comment status
    const updatedComment = {
      ...comment,
      status: "rejected" as const,
      updatedAt: new Date().toISOString(),
    };

    await redis.set(`comment:${commentId}`, JSON.stringify(updatedComment));

    // Remove from pending lists
    await redis.zrem(`book:${comment.bookSlug}:comments:pending`, commentId);
    await redis.zrem("comments:pending", commentId);

    revalidatePath("/dashboard/manage-comments");

    return {
      success: true,
      message: "نظر با موفقیت رد شد",
    } as const;
  } catch (error) {
    console.error("Error rejecting comment:", error);
    return {
      success: false,
      error: "خطا در رد نظر",
    } as const;
  }
}

