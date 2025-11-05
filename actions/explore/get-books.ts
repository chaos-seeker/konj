"use server";

import redis from "@/lib/upstash";
import type { TBook } from "@/types/book";

interface GetBooksParams {
  searchText?: string;
  categories?: string[];
  publishers?: string[];
  translators?: string[];
  authors?: string[];
}

export async function getBooks(params: GetBooksParams = {}) {
  try {
    const {
      searchText,
      categories = [],
      publishers = [],
      translators = [],
      authors = [],
    } = params;

    // Get all books
    const allBookSlugs = await redis.zrange("books:list", 0, -1);
    if (!allBookSlugs || allBookSlugs.length === 0) {
      return { success: true, data: [] as TBook[] } as const;
    }

    const allBooks = await Promise.all(
      allBookSlugs.map(async (slug) => {
        const bookStr = await redis.get(`book:${slug}`);
        if (!bookStr) return null;
        return typeof bookStr === "string" ? JSON.parse(bookStr) : bookStr;
      })
    );

    let filteredBooks = allBooks.filter((book): book is TBook => book !== null);

    // Search by text (in name, description, or author/translator names)
    if (searchText && searchText.trim()) {
      const searchLower = searchText.toLowerCase().trim();
      filteredBooks = filteredBooks.filter((book) => {
        const nameMatch = book.name?.toLowerCase().includes(searchLower);
        const descMatch = book.description?.toLowerCase().includes(searchLower);
        const authorMatch = book.authors?.some((a) =>
          a.fullName?.toLowerCase().includes(searchLower)
        );
        const translatorMatch = book.translators?.some((t) =>
          t.fullName?.toLowerCase().includes(searchLower)
        );
        return nameMatch || descMatch || authorMatch || translatorMatch;
      });
    }

    // Filter by categories
    if (categories.length > 0) {
      filteredBooks = filteredBooks.filter((book) =>
        categories.includes(book.category?.slug || "")
      );
    }

    // Filter by publishers
    if (publishers.length > 0) {
      filteredBooks = filteredBooks.filter((book) =>
        publishers.includes(book.publisher?.slug || "")
      );
    }

    // Filter by translators
    if (translators.length > 0) {
      filteredBooks = filteredBooks.filter((book) =>
        book.translators?.some((t) => translators.includes(t.slug))
      );
    }

    // Filter by authors
    if (authors.length > 0) {
      filteredBooks = filteredBooks.filter((book) =>
        book.authors?.some((a) => authors.includes(a.slug))
      );
    }

    return { success: true, data: filteredBooks } as const;
  } catch (error) {
    console.error("Error fetching books:", error);
    return {
      success: false,
      error: "خطا در دریافت کتاب‌ها",
      data: [] as TBook[],
    } as const;
  }
}
