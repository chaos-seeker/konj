"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import type { TAuthor } from "@/types/author";
import type { TTranslator } from "@/types/translator";

export async function updateBook(oldSlug: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const price = formData.get("price") as string;
    const discount = formData.get("discount") as string;
    const description = formData.get("description") as string;
    const categorySlug = formData.get("categorySlug") as string;
    const publisherSlug = formData.get("publisherSlug") as string;
    const authorSlugs = formData.get("authorSlugs") as string;
    const translatorSlugs = formData.get("translatorSlugs") as string;
    const pages = formData.get("pages") as string;
    const publicationYear = formData.get("publicationYear") as string;
    const image = formData.get("image") as string | null;

    if (
      !name ||
      !slug ||
      !price ||
      !categorySlug ||
      !publisherSlug ||
      !authorSlugs ||
      !translatorSlugs ||
      !pages ||
      !publicationYear
    ) {
      return {
        success: false,
        error: "تمام فیلدهای الزامی را پر کنید",
      };
    }

    const existing = await supabase
      .from("books")
      .select("id")
      .eq("slug", oldSlug)
      .limit(1)
      .single();
    if (existing.error || !existing.data) {
      return {
        success: false,
        error: "کتاب یافت نشد",
      };
    }

    if (oldSlug !== slug) {
      const dup = await supabase
        .from("books")
        .select("id")
        .eq("slug", slug)
        .limit(1)
        .maybeSingle();
      if (dup.error)
        return { success: false, error: dup.error.message } as const;
      if (dup.data)
        return {
          success: false,
          error: "این اسلاگ قبلاً استفاده شده است",
        } as const;
    }

    const catRes = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .limit(1)
      .single();
    if (catRes.error || !catRes.data) {
      return {
        success: false,
        error: "دسته بندی یافت نشد",
      };
    }

    const pubRes = await supabase
      .from("publishers")
      .select("id")
      .eq("slug", publisherSlug)
      .limit(1)
      .single();
    if (pubRes.error || !pubRes.data) {
      return {
        success: false,
        error: "ناشر یافت نشد",
      };
    }

    const authorSlugArray = JSON.parse(authorSlugs) as string[];
    const authRes = await supabase
      .from("authors")
      .select("id, slug")
      .in("slug", authorSlugArray);
    if (authRes.error) {
      return { success: false, error: authRes.error.message } as const;
    }
    if (!authRes.data || authRes.data.length !== authorSlugArray.length) {
      return {
        success: false,
        error: "یکی از نویسندگان یافت نشد",
      };
    }

    const translatorSlugArray = JSON.parse(translatorSlugs) as string[];
    const transRes = await supabase
      .from("translators")
      .select("id, slug")
      .in("slug", translatorSlugArray);
    if (transRes.error) {
      return { success: false, error: transRes.error.message } as const;
    }
    if (!transRes.data || transRes.data.length !== translatorSlugArray.length) {
      return {
        success: false,
        error: "یکی از مترجمین یافت نشد",
      };
    }
    const bookId = existing.data.id as string;
    const upd = await supabase
      .from("books")
      .update({
        name: name,
        slug: slug,
        image: image || null,
        price: Number(price),
        discount: discount ? Number(discount) : 0,
        description: description || "",
        category_id: catRes.data.id,
        publisher_id: pubRes.data.id,
        pages: Number(pages),
        publication_year: Number(publicationYear),
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookId);
    if (upd.error) {
      return { success: false, error: upd.error.message } as const;
    }
    await supabase.from("book_authors").delete().eq("book_id", bookId);
    await supabase.from("book_translators").delete().eq("book_id", bookId);
    type AuthorRow = Pick<TAuthor, "id" | "slug">;
    type TranslatorRow = Pick<TTranslator, "id" | "slug">;
    if (authRes.data.length > 0) {
      await supabase.from("book_authors").insert(
        (authRes.data as AuthorRow[]).map((a) => ({
          book_id: bookId,
          author_id: a.id,
        }))
      );
    }
    if (transRes.data.length > 0) {
      await supabase.from("book_translators").insert(
        (transRes.data as TranslatorRow[]).map((t) => ({
          book_id: bookId,
          translator_id: t.id,
        }))
      );
    }

    revalidatePath("/dashboard/manage-books");
    revalidatePath(`/dashboard/manage-books/${slug}/edit`);
    if (oldSlug !== slug) {
      revalidatePath(`/dashboard/manage-books/${oldSlug}/edit`);
    }

    return {
      success: true,
      message: "کتاب با موفقیت به‌روزرسانی شد",
    };
  } catch {
    return { success: false, error: "خطا در به‌روزرسانی کتاب" } as const;
  }
}
