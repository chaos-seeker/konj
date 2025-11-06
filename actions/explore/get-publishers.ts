"use server";

import { supabase } from "@/lib/supabase";
import type { TPublisher } from "@/types/publisher";

export async function getPublishers(searchText?: string) {
  try {
    let query = supabase
      .from("publishers")
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
        data: [] as TPublisher[],
      } as const;
    }
    type Row = Pick<TPublisher, "id" | "name" | "slug"> & {
      created_at?: string;
      updated_at?: string;
    };
    const rows = (res.data as Row[]) || [];
    const data: TPublisher[] = rows.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      createdAt: p.created_at || "",
      updatedAt: p.updated_at || "",
    }));
    return { success: true, data } as const;
  } catch {
    return {
      success: false,
      error: "خطا در دریافت ناشرین",
      data: [] as TPublisher[],
    } as const;
  }
}
