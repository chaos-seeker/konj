"use server";

import { supabase } from "@/lib/supabase";

export async function updatePublisher(oldSlug: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;

    if (!name || !slug) {
      return {
        success: false,
        error: "نام و اسلاگ الزامی هستند",
      } as const;
    }

    const existing = await supabase
      .from("publishers")
      .select("id")
      .eq("slug", oldSlug)
      .limit(1)
      .single();
    if (existing.error || !existing.data) {
      return {
        success: false,
        error: "ناشر یافت نشد",
      } as const;
    }

    if (oldSlug !== slug) {
      const dup = await supabase
        .from("publishers")
        .select("id")
        .eq("slug", slug)
        .limit(1)
        .maybeSingle();
      if (dup.error)
        return { success: false, error: dup.error.message } as const;
      if (dup.data) {
        return {
          success: false,
          error: "این اسلاگ قبلاً استفاده شده است",
        } as const;
      }
    }

    const upd = await supabase
      .from("publishers")
      .update({ name: name, slug: slug, updated_at: new Date().toISOString() })
      .eq("id", existing.data.id);
    if (upd.error) return { success: false, error: upd.error.message } as const;

    return {
      success: true,
      message: "ناشر با موفقیت به‌روزرسانی شد",
    } as const;
  } catch {
    return { success: false, error: "خطا در به‌روزرسانی ناشر" } as const;
  }
}
