"use server";

import { supabase } from "@/lib/supabase";

export async function createTranslator(formData: FormData) {
  try {
    const fullName = formData.get("fullName") as string;
    const slug = formData.get("slug") as string;

    if (!fullName || !slug) {
      return {
        success: false,
        error: "تمام فیلدها الزامی هستند",
      };
    }

    const dup = await supabase
      .from("translators")
      .select("id")
      .eq("slug", slug)
      .limit(1)
      .maybeSingle();
    if (dup.error) return { success: false, error: dup.error.message } as const;
    if (dup.data)
      return {
        success: false,
        error: "این اسلاگ قبلاً استفاده شده است",
      } as const;

    const ins = await supabase
      .from("translators")
      .insert({
        full_name: fullName,
        slug,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (ins.error || !ins.data)
      return { success: false, error: ins.error?.message || "" } as const;
    const id = ins.data.id as string;

    return {
      success: true,
      message: "مترجم با موفقیت افزوده شد",
      id,
    };
  } catch {
    return { success: false, error: "خطا در افزودن مترجم" } as const;
  }
}
