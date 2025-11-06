"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function rejectComment(commentId: string) {
  try {
    const res = await supabase
      .from("comments")
      .update({ status: "rejected" })
      .eq("id", commentId);
    if (res.error) {
      return { success: false, error: res.error.message } as const;
    }
    revalidatePath("/dashboard/manage-comments");
    return { success: true, message: "نظر با موفقیت رد شد" } as const;
  } catch {
    return { success: false, error: "خطا در رد نظر" } as const;
  }
}
