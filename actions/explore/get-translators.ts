'use server';

import { supabase } from '@/lib/supabase';
import type { TTranslator } from '@/types/translator';

export async function getTranslators(searchText?: string) {
  try {
    let query = supabase
      .from('translators')
      .select('id, full_name, slug')
      .order('full_name');
    if (searchText && searchText.trim()) {
      const s = searchText.trim();
      query = query.ilike('full_name', `%${s}%`);
    }
    const res = await query;
    if (res.error) {
      return {
        success: false,
        error: res.error.message,
        data: [] as TTranslator[],
      } as const;
    }
    type Row = Pick<TTranslator, 'id' | 'slug'> & {
      full_name: string;
      created_at?: string;
      updated_at?: string;
    };
    const rows = (res.data as Row[]) || [];
    const data: TTranslator[] = rows.map((t) => ({
      id: t.id,
      fullName: t.full_name,
      slug: t.slug,
      createdAt: t.created_at || '',
      updatedAt: t.updated_at || '',
    }));
    return { success: true, data } as const;
  } catch {
    return {
      success: false,
      error: 'خطا در دریافت مترجمین',
      data: [] as TTranslator[],
    } as const;
  }
}
