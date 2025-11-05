"use server";

import redis from "@/lib/upstash";
import type { TBook } from "@/types/book";
import { revalidatePath } from "next/cache";

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

    const existingBook = await redis.get(`book:${oldSlug}`);
    if (!existingBook) {
      return {
        success: false,
        error: "کتاب یافت نشد",
      };
    }

    if (oldSlug !== slug) {
      const slugExists = await redis.get(`book:${slug}`);
      if (slugExists) {
        return {
          success: false,
          error: "این اسلاگ قبلاً استفاده شده است",
        };
      }
    }

    const category = await redis.get(`category:${categorySlug}`);
    if (!category) {
      return {
        success: false,
        error: "دسته بندی یافت نشد",
      };
    }

    const publisher = await redis.get(`publisher:${publisherSlug}`);
    if (!publisher) {
      return {
        success: false,
        error: "ناشر یافت نشد",
      };
    }

    const authorSlugArray = JSON.parse(authorSlugs) as string[];
    const authors = await Promise.all(
      authorSlugArray.map(async (authorSlug) => {
        const author = await redis.get(`author:${authorSlug}`);
        return author;
      })
    );
    if (authors.some((a) => !a)) {
      return {
        success: false,
        error: "یکی از نویسندگان یافت نشد",
      };
    }

    const translatorSlugArray = JSON.parse(translatorSlugs) as string[];
    const translators = await Promise.all(
      translatorSlugArray.map(async (translatorSlug) => {
        const translator = await redis.get(`translator:${translatorSlug}`);
        return translator;
      })
    );
    if (translators.some((t) => !t)) {
      return {
        success: false,
        error: "یکی از مترجمین یافت نشد",
      };
    }

    const bookData =
      typeof existingBook === "string" ? JSON.parse(existingBook) : existingBook;

    const updatedBook: TBook = {
      ...bookData,
      name,
      slug,
      image: image || bookData.image || undefined,
      price: parseFloat(price),
      discount: discount ? parseFloat(discount) : 0,
      description: description || "",
      category:
        typeof category === "string" ? JSON.parse(category) : category,
      publisher:
        typeof publisher === "string" ? JSON.parse(publisher) : publisher,
      authors: authors.map((a) =>
        typeof a === "string" ? JSON.parse(a) : a
      ) as any[],
      translators: translators.map((t) =>
        typeof t === "string" ? JSON.parse(t) : t
      ) as any[],
      pages: parseInt(pages),
      publicationYear: parseInt(publicationYear),
      updatedAt: new Date().toISOString(),
    };

    if (oldSlug !== slug) {
      await redis.del(`book:${oldSlug}`);
      await redis.zrem("books:list", oldSlug);
      await redis.set(`book:${slug}`, updatedBook);
      await redis.zadd("books:list", {
        score: Date.now(),
        member: slug,
      });
    } else {
      await redis.set(`book:${slug}`, updatedBook);
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
  } catch (error) {
    console.error("Error updating book:", error);
    return {
      success: false,
      error: "خطا در به‌روزرسانی کتاب",
    };
  }
}

