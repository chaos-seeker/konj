'use server';

import { supabase } from '@/lib/supabase';
import type { TAuthor } from '@/types/author';

export async function getAuthors(searchText?: string) {
  try {
    let query = supabase.from('authors').select('id, full_name, slug');
    if (searchText && searchText.trim()) {
      const s = searchText.trim();
      query = query.ilike('full_name', `%${s}%`);
    }
    const res = await query.order('full_name');
    if (res.error) {
      return {
        success: false,
        error: res.error.message,
        data: [] as TAuthor[],
      } as const;
    }
    type Row = Pick<TAuthor, 'id' | 'slug'> & {
      full_name: string;
      created_at?: string;
      updated_at?: string;
    };
    const rows = (res.data as Row[]) || [];
    const data: TAuthor[] = rows.map((a) => ({
      id: a.id,
      fullName: a.full_name,
      slug: a.slug,
      createdAt: a.created_at || '',
      updatedAt: a.updated_at || '',
    }));
    return { success: true, data } as const;
  } catch {
    return {
      success: false,
      error: 'خطا در دریافت نویسندگان',
      data: [] as TAuthor[],
    } as const;
  }
}
