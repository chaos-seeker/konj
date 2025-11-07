'use server';

import { supabase } from '@/lib/supabase';
import type { TComment } from '@/types/comment';

export async function getPendingComments() {
  try {
    const res = await supabase
      .from('comments')
      .select('id, book_id, full_name, text, rating, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (res.error) {
      return {
        success: false,
        error: res.error.message,
        data: [] as TComment[],
      } as const;
    }
    type Row = Pick<TComment, 'text' | 'rating' | 'createdAt'> & {
      id: string;
      book_id: string | null;
      full_name: string;
      created_at: string;
    };
    const mapped: TComment[] = ((res.data as Row[]) || []).map((c) => ({
      id: c.id,
      bookSlug: '',
      fullName: c.full_name,
      text: c.text,
      rating: c.rating,
      status: 'pending' as const,
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
