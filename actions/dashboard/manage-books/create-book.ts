'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function createBook(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const price = formData.get('price') as string;
    const discount = formData.get('discount') as string;
    const description = formData.get('description') as string;
    const categorySlug = formData.get('categorySlug') as string;
    const publisherSlug = formData.get('publisherSlug') as string;
    const authorSlugs = formData.get('authorSlugs') as string;
    const translatorSlugs = formData.get('translatorSlugs') as string;
    const pages = formData.get('pages') as string;
    const publicationYear = formData.get('publicationYear') as string;
    const image = formData.get('image') as string | null;

    if (
      !name ||
      !slug ||
      !price ||
      !categorySlug ||
      !publisherSlug ||
      !authorSlugs ||
      !translatorSlugs ||
      !pages ||
      !publicationYear ||
      !image
    ) {
      return {
        success: false,
        error: 'تمام فیلدهای الزامی را پر کنید',
      };
    }

    const dup = await supabase
      .from('books')
      .select('id')
      .eq('slug', slug)
      .limit(1)
      .maybeSingle();
    if (dup.error) {
      return { success: false, error: dup.error.message } as const;
    }
    if (dup.data) {
      return {
        success: false,
        error: 'این اسلاگ قبلاً استفاده شده است',
      } as const;
    }

    const catRes = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .limit(1)
      .single();
    if (catRes.error || !catRes.data) {
      return {
        success: false,
        error: 'دسته بندی یافت نشد',
      };
    }

    const pubRes = await supabase
      .from('publishers')
      .select('id')
      .eq('slug', publisherSlug)
      .limit(1)
      .single();
    if (pubRes.error || !pubRes.data) {
      return {
        success: false,
        error: 'ناشر یافت نشد',
      };
    }

    const authorSlugArray = JSON.parse(authorSlugs) as string[];
    const authRes = await supabase
      .from('authors')
      .select('id, slug')
      .in('slug', authorSlugArray);
    if (authRes.error) {
      return { success: false, error: authRes.error.message } as const;
    }
    if (!authRes.data || authRes.data.length !== authorSlugArray.length) {
      return {
        success: false,
        error: 'یکی از نویسندگان یافت نشد',
      };
    }

    const translatorSlugArray = JSON.parse(translatorSlugs) as string[];
    const transRes = await supabase
      .from('translators')
      .select('id, slug')
      .in('slug', translatorSlugArray);
    if (transRes.error) {
      return { success: false, error: transRes.error.message } as const;
    }
    if (!transRes.data || transRes.data.length !== translatorSlugArray.length) {
      return {
        success: false,
        error: 'یکی از مترجمین یافت نشد',
      };
    }

    const authorIds = authRes.data.map((a) => a.id);
    const translatorIds = transRes.data.map((t) => t.id);

    const insertBook = await supabase
      .from('books')
      .insert({
        name,
        slug,
        image,
        price: Number(price),
        discount: discount ? Number(discount) : 0,
        description: description || '',
        category_id: catRes.data.id,
        publisher_id: pubRes.data.id,
        author_ids: JSON.stringify(authorIds),
        translator_ids: JSON.stringify(translatorIds),
        pages: Number(pages),
        publication_year: Number(publicationYear),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sold_count: 0,
      })
      .select('id')
      .single();
    if (insertBook.error || !insertBook.data) {
      return {
        success: false,
        error: insertBook.error?.message || '',
      } as const;
    }
    const bookId = insertBook.data.id as string;

    revalidatePath('/dashboard/manage-books');
    revalidatePath('/dashboard/manage-books/add');

    return {
      success: true,
      message: 'کتاب با موفقیت افزوده شد',
      id: bookId,
    } as const;
  } catch {
    return {
      success: false,
      error: 'خطا در افزودن کتاب',
    };
  }
}
