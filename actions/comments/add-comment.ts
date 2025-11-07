'use server';

import { supabase } from '@/lib/supabase';
import { randomUUID } from 'crypto';

export async function addComment(data: {
  bookSlug: string;
  fullName: string;
  text: string;
  rating: number;
  token: string;
}) {
  try {
    if (
      !data.bookSlug ||
      !data.fullName ||
      !data.text ||
      !data.rating ||
      !data.token
    ) {
      return {
        success: false,
        error: 'تمام فیلدهای الزامی را پر کنید',
      } as const;
    }

    const bookRes = await supabase
      .from('books')
      .select('id')
      .eq('slug', data.bookSlug)
      .limit(1)
      .single();

    if (bookRes.error || !bookRes.data) {
      return {
        success: false,
        error: 'کتاب یافت نشد',
      } as const;
    }

    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const res = await supabase.from('comments').insert({
      id,
      book_id: bookRes.data.id,
      full_name: data.fullName,
      text: data.text,
      rating: data.rating,
      status: 'pending',
      created_at: createdAt,
    });
    if (res.error) {
      return { success: false, error: res.error.message } as const;
    }

    return {
      success: true,
      message: 'نظر شما با موفقیت ثبت شد و در انتظار تایید است',
      data: {
        id,
        bookSlug: data.bookSlug,
        fullName: data.fullName,
        text: data.text,
        rating: data.rating,
        createdAt,
        status: 'pending',
      },
    } as const;
  } catch {
    return {
      success: false,
      error: 'خطا در ثبت نظر',
    } as const;
  }
}
