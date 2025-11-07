'use server';

import { supabase } from '@/lib/supabase';

export async function deleteBook(slug: string) {
  try {
    const find = await supabase
      .from('books')
      .select('id')
      .eq('slug', slug)
      .limit(1)
      .single();
    if (find.error || !find.data) {
      return { success: false, error: 'کتاب یافت نشد' } as const;
    }
    const res = await supabase.from('books').delete().eq('id', find.data.id);
    if (res.error) {
      return { success: false, error: res.error.message } as const;
    }
    return { success: true, message: 'کتاب با موفقیت حذف شد' } as const;
  } catch {
    return { success: false, error: 'خطا در حذف کتاب' } as const;
  }
}
