'use server';

import { supabase } from '@/lib/supabase';
import type { TTranslator } from '@/types/translator';

export async function getTranslators() {
  try {
    const res = await supabase
      .from('translators')
      .select('id, full_name, slug, created_at, updated_at')
      .order('full_name');
    if (res.error)
      return { success: false, error: res.error.message, data: [] } as const;
    type Row = Pick<TTranslator, 'id' | 'slug'> & {
      full_name: string;
      created_at: string;
      updated_at: string;
    };
    const data = ((res.data as Row[]) || []).map((t) => ({
      id: t.id,
      fullName: t.full_name,
      slug: t.slug,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    }));
    return { success: true, data } as const;
  } catch {
    return {
      success: false,
      error: 'خطا در دریافت مترجمین',
      data: [],
    } as const;
  }
}
