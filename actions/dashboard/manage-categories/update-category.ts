"use server";

import { supabase } from "@/lib/supabase";

export async function updateCategory(oldSlug: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;

    if (!name || !slug) {
      return {
        success: false,
        error: "نام و اسلاگ الزامی هستند",
      };
    }

    const existing = await supabase
      .from("categories")
      .select("id")
      .eq("slug", oldSlug)
      .limit(1)
      .single();
    if (existing.error || !existing.data) {
      return {
        success: false,
        error: "دسته بندی یافت نشد",
      };
    }

    if (oldSlug !== slug) {
      const dup = await supabase
        .from("categories")
        .select("id")
        .eq("slug", slug)
        .limit(1)
        .maybeSingle();
      if (dup.error)
        return { success: false, error: dup.error.message } as const;
      if (dup.data)
        return {
          success: false,
          error: "این اسلاگ قبلاً استفاده شده است",
        } as const;
    }

    const upd = await supabase
      .from("categories")
      .update({
        name: name,
        slug: slug,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.data.id);
    if (upd.error) return { success: false, error: upd.error.message } as const;

    return {
      success: true,
      message: "دسته بندی با موفقیت به‌روزرسانی شد",
    };
  } catch {
    return { success: false, error: "خطا در به‌روزرسانی دسته بندی" } as const;
  }
}
