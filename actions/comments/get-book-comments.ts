'use server';

import { supabase } from '@/lib/supabase';
import type { TComment } from '@/types/comment';

export async function getBookComments(bookSlug: string) {
  try {
    const bookRes = await supabase
      .from('books')
      .select('id')
      .eq('slug', bookSlug)
      .limit(1)
      .single();
    if (bookRes.error || !bookRes.data) {
      return { success: true, data: [] as TComment[] } as const;
    }

    const res = await supabase
      .from('comments')
      .select('full_name, text, rating, created_at')
      .eq('book_id', bookRes.data.id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    if (res.error) {
      return {
        success: false,
        error: res.error.message,
        data: [] as TComment[],
      } as const;
    }
    type Row = Pick<TComment, 'text' | 'rating' | 'createdAt'> & {
      full_name: string;
      created_at: string;
    };
    const mapped: TComment[] = ((res.data as Row[]) || []).map((c) => ({
      id: '',
      bookSlug,
      fullName: c.full_name,
      text: c.text,
      rating: c.rating,
      status: 'approved' as const,
      createdAt: c.created_at,
    }));
    return { success: true, data: mapped } as const;
  } catch {
    return {
      success: false,
      error: 'خطا در دریافت نظرات',
      data: [] as TComment[],
    } as const;
  }
}
