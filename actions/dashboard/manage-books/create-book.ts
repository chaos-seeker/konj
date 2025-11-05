"use server";

import redis from "@/lib/upstash";
import type { TBook } from "@/types/book";
import type { TAuthor } from "@/types/author";
import type { TTranslator } from "@/types/translator";
import { revalidatePath } from "next/cache";

export async function createBook(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const price = formData.get("price") as string;
    const discount = formData.get("discount") as string;
    const description = formData.get("description") as string;
    const categorySlug = formData.get("categorySlug") as string;
    const publisherSlug = formData.get("publisherSlug") as string;
    const authorSlugs = formData.get("authorSlugs") as string; // JSON array
    const translatorSlugs = formData.get("translatorSlugs") as string; // JSON array
    const pages = formData.get("pages") as string;
    const publicationYear = formData.get("publicationYear") as string;
    const image = formData.get("image") as string | null; // base64

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
        error: "تمام فیلدهای الزامی را پر کنید",
      };
    }

    // Check if slug already exists
    const existingBook = await redis.get(`book:${slug}`);
    if (existingBook) {
      return {
        success: false,
        error: "این اسلاگ قبلاً استفاده شده است",
      };
    }

    // Verify category exists
    const category = await redis.get(`category:${categorySlug}`);
    if (!category) {
      return {
        success: false,
        error: "دسته بندی یافت نشد",
      };
    }

    // Verify publisher exists
    const publisher = await redis.get(`publisher:${publisherSlug}`);
    if (!publisher) {
      return {
        success: false,
        error: "ناشر یافت نشد",
      };
    }

    // Verify authors exist
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

    // Verify translators exist
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

    const id = `book_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const book: TBook = {
      id,
      name,
      slug,
      image: image || "",
      price: parseFloat(price),
      discount: discount ? parseFloat(discount) : 0,
      description: description || "",
      category:
        typeof category === "string" ? JSON.parse(category) : category,
      publisher:
        typeof publisher === "string" ? JSON.parse(publisher) : publisher,
      authors: (authors.map((a) => (typeof a === "string" ? JSON.parse(a) : a)) as unknown) as TAuthor[],
      translators: (translators.map((t) => (typeof t === "string" ? JSON.parse(t) : t)) as unknown) as TTranslator[],
      pages: parseInt(pages),
      publicationYear: parseInt(publicationYear),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      soldCount: 0,
      comments: [],
    };

    // Store book by slug
    await redis.set(`book:${slug}`, book);

    // Add to books list (sorted set by timestamp)
    await redis.zadd("books:list", {
      score: Date.now(),
      member: slug,
    });

    // Revalidate listing and add page
    revalidatePath("/dashboard/manage-books");
    revalidatePath("/dashboard/manage-books/add");

    return {
      success: true,
      message: "کتاب با موفقیت افزوده شد",
      id,
    };
  } catch (error) {
    console.error("Error adding book:", error);
    return {
      success: false,
      error: "خطا در افزودن کتاب",
    };
  }
}
