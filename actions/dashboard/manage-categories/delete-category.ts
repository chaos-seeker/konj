"use server";

import { supabase } from "@/lib/supabase";

export async function deleteCategory(slug: string) {
  try {
    const find = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .limit(1)
      .single();
    if (find.error || !find.data)
      return { success: false, error: "دسته بندی یافت نشد" } as const;
    const res = await supabase
      .from("categories")
      .delete()
      .eq("id", find.data.id);
    if (res.error) return { success: false, error: res.error.message } as const;
    return { success: true, message: "دسته بندی با موفقیت حذف شد" } as const;
  } catch {
    return { success: false, error: "خطا در حذف دسته بندی" } as const;
  }
}
