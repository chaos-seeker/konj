"use server";

import { supabase } from "@/lib/supabase";
import type { TCategory } from "@/types/category";

export async function getCategories(searchText?: string) {
  try {
    let query = supabase
      .from("categories")
      .select("id, name, slug")
      .order("name");
    if (searchText && searchText.trim()) {
      const s = searchText.trim();
      query = query.ilike("name", `%${s}%`);
    }
    const res = await query;
    if (res.error) {
      return {
        success: false,
        error: res.error.message,
        data: [] as TCategory[],
      } as const;
    }
    type Row = Pick<TCategory, "id" | "name" | "slug"> & {
      created_at?: string;
      updated_at?: string;
    };
    const rows = (res.data as Row[]) || [];
    const data: TCategory[] = rows.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      createdAt: c.created_at || "",
      updatedAt: c.updated_at || "",
    }));
    return { success: true, data } as const;
  } catch {
    return {
      success: false,
      error: "خطا در دریافت دسته‌بندی‌ها",
      data: [] as TCategory[],
    } as const;
  }
}
