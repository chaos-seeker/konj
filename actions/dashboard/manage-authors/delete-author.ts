'use server';

import { supabase } from '@/lib/supabase';

export async function deleteAuthor(slug: string) {
  try {
    const find = await supabase
      .from('authors')
      .select('id')
      .eq('slug', slug)
      .limit(1)
      .single();
    if (find.error || !find.data)
      return { success: false, error: 'نویسنده یافت نشد' } as const;
    const res = await supabase.from('authors').delete().eq('id', find.data.id);
    if (res.error) return { success: false, error: res.error.message } as const;
    return { success: true, message: 'نویسنده با موفقیت حذف شد' } as const;
  } catch {
    return { success: false, error: 'خطا در حذف نویسنده' } as const;
  }
}
