"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function approveComment(commentId: string) {
  try {
    if (!commentId || commentId.trim() === "") {
      return { success: false, error: "شناسه نظر معتبر نیست" } as const;
    }
    const res = await supabase
      .from("comments")
      .update({ status: "approved" })
      .eq("id", commentId);
    if (res.error) {
      return { success: false, error: res.error.message } as const;
    }
    revalidatePath("/dashboard/manage-comments");
    return { success: true, message: "نظر با موفقیت تایید شد" } as const;
  } catch {
    return { success: false, error: "خطا در تایید نظر" } as const;
  }
}
