"use server";

import { supabase } from "@/lib/supabase";

export async function deletePublisher(slug: string) {
  try {
    const find = await supabase
      .from("publishers")
      .select("id")
      .eq("slug", slug)
      .limit(1)
      .single();
    if (find.error || !find.data)
      return { success: false, error: "ناشر یافت نشد" } as const;
    const res = await supabase
      .from("publishers")
      .delete()
      .eq("id", find.data.id);
    if (res.error) return { success: false, error: res.error.message } as const;
    return { success: true, message: "ناشر با موفقیت حذف شد" } as const;
  } catch {
    return { success: false, error: "خطا در حذف ناشر" } as const;
  }
}
