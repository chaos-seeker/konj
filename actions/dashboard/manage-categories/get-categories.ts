'use server';

import { supabase } from '@/lib/supabase';
import type { TCategory } from '@/types/category';

export async function getCategories() {
  try {
    const res = await supabase
      .from('categories')
      .select('id, name, slug, created_at, updated_at')
      .order('name');
    if (res.error)
      return { success: false, error: res.error.message, data: [] } as const;
    type Row = Pick<TCategory, 'id' | 'name' | 'slug'> & {
      created_at: string;
      updated_at: string;
    };
    const data = ((res.data as Row[]) || []).map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
    }));
    return { success: true, data } as const;
  } catch {
    return {
      success: false,
      error: 'خطا در دریافت دسته بندی‌ها',
      data: [],
    } as const;
  }
}
