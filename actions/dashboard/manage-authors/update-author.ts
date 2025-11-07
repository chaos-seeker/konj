'use server';

import { supabase } from '@/lib/supabase';

export async function updateAuthor(oldSlug: string, formData: FormData) {
  try {
    const fullName = formData.get('fullName') as string;
    const slug = formData.get('slug') as string;

    if (!fullName || !slug) {
      return {
        success: false,
        error: 'تمام فیلدها الزامی هستند',
      };
    }

    const existing = await supabase
      .from('authors')
      .select('id')
      .eq('slug', oldSlug)
      .limit(1)
      .single();
    if (existing.error || !existing.data) {
      return {
        success: false,
        error: 'نویسنده یافت نشد',
      };
    }

    if (oldSlug !== slug) {
      const dup = await supabase
        .from('authors')
        .select('id')
        .eq('slug', slug)
        .limit(1)
        .maybeSingle();
      if (dup.error)
        return { success: false, error: dup.error.message } as const;
      if (dup.data) {
        return {
          success: false,
          error: 'این اسلاگ قبلاً استفاده شده است',
        };
      }
    }

    const upd = await supabase
      .from('authors')
      .update({
        full_name: fullName,
        slug,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.data.id);
    if (upd.error) return { success: false, error: upd.error.message } as const;

    return {
      success: true,
      message: 'نویسنده با موفقیت به‌روزرسانی شد',
    };
  } catch {
    return { success: false, error: 'خطا در به‌روزرسانی نویسنده' } as const;
  }
}
