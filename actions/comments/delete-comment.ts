'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function deleteComment(commentId: string) {
  try {
    const res = await supabase.from('comments').delete().eq('id', commentId);
    if (res.error) {
      return { success: false, error: res.error.message } as const;
    }
    revalidatePath('/dashboard/manage-comments');
    return { success: true, message: 'نظر با موفقیت حذف شد' } as const;
  } catch {
    return { success: false, error: 'خطا در حذف نظر' } as const;
  }
}
