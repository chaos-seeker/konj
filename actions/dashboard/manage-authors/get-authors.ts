"use server";

import { supabase } from "@/lib/supabase";
import type { TAuthor } from "@/types/author";

export async function getAuthors() {
  try {
    const res = await supabase
      .from("authors")
      .select("id, full_name, slug, created_at, updated_at")
      .order("full_name");
    if (res.error)
      return { success: false, error: res.error.message, data: [] } as const;
    type Row = Pick<TAuthor, "id" | "slug"> & {
      full_name: string;
      created_at: string;
      updated_at: string;
    };
    const data = ((res.data as Row[]) || []).map((a) => ({
      id: a.id,
      fullName: a.full_name,
      slug: a.slug,
      createdAt: a.created_at,
      updatedAt: a.updated_at,
    }));
    return { success: true, data } as const;
  } catch {
    return {
      success: false,
      error: "خطا در دریافت نویسندگان",
      data: [],
    } as const;
  }
}
