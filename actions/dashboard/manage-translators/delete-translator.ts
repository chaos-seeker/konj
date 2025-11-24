'use server';

import { supabase } from '@/lib/supabase';

export async function deleteTranslator(slug: string) {
  if (process.env.NODE_ENV !== 'development') {
    return {
      success: false,
      error: 'دسترسی محدود شده است!',
    } as const;
  }

  try {
    const find = await supabase
      .from('translators')
      .select('id')
      .eq('slug', slug)
      .limit(1)
      .single();
    if (find.error || !find.data)
      return { success: false, error: 'مترجم یافت نشد' } as const;
    const res = await supabase
      .from('translators')
      .delete()
      .eq('id', find.data.id);
    if (res.error) return { success: false, error: res.error.message } as const;
    return { success: true, message: 'مترجم با موفقیت حذف شد' } as const;
  } catch {
    return { success: false, error: 'خطا در حذف مترجم' } as const;
  }
}
