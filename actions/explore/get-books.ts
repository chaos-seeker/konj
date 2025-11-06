"use server";

import { supabase } from "@/lib/supabase";
import type { TBook } from "@/types/book";
import type { TCategory } from "@/types/category";
import type { TPublisher } from "@/types/publisher";
import type { TAuthor } from "@/types/author";
import type { TTranslator } from "@/types/translator";

interface GetBooksParams {
  searchText?: string;
  categories?: string[];
  publishers?: string[];
  translators?: string[];
  authors?: string[];
}

export async function getBooks(params: GetBooksParams = {}) {
  try {
    const searchText = params.searchText;
    const categories = params.categories || [];
    const publishers = params.publishers || [];
    const translators = params.translators || [];
    const authors = params.authors || [];

    let query = supabase
      .from("books")
      .select(
        "id,name,slug,image,price,discount,description,pages,publication_year,created_at,updated_at,sold_count, categories:category_id(id,name,slug), publishers:publisher_id(id,name,slug), book_authors(author:authors(id,full_name,slug)), book_translators(translator:translators(id,full_name,slug))"
      );

    if (searchText && searchText.trim()) {
      const s = searchText.trim();
      query = query.or(`name.ilike.%${s}%,description.ilike.%${s}%`);
    }
    if (categories.length > 0) {
      query = query.in("categories.slug", categories);
    }
    if (publishers.length > 0) {
      query = query.in("publishers.slug", publishers);
    }

    const res = await query;
    if (res.error) {
      return {
        success: false,
        error: res.error.message,
        data: [] as TBook[],
      } as const;
    }
    type CategoryRow = Pick<TCategory, "id" | "name" | "slug">;
    type PublisherRow = Pick<TPublisher, "id" | "name" | "slug">;
    type AuthorRow = {
      author: Pick<TAuthor, "id" | "slug"> & {
        full_name: string;
      };
    };
    type TranslatorRow = {
      translator: Pick<TTranslator, "id" | "slug"> & {
        full_name: string;
      };
    };
    type BookRow = {
      id: string;
      name: string;
      slug: string;
      image: string;
      price: number;
      discount: number;
      description: string;
      pages: number;
      publication_year: number;
      created_at: string;
      updated_at: string;
      sold_count: number;
      categories: CategoryRow | null;
      publishers: PublisherRow | null;
      book_authors: AuthorRow[];
      book_translators: TranslatorRow[];
    };
    const rows = (res.data as unknown as BookRow[]) || [];
    let mapped: TBook[] = rows
      .filter((r) => r.categories && r.publishers)
      .map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        image: r.image,
        price: Number(r.price),
        discount: Number(r.discount || 0),
        description: r.description,
        category: {
          id: r.categories!.id,
          name: r.categories!.name,
          slug: r.categories!.slug,
          createdAt: "",
          updatedAt: "",
        },
        publisher: {
          id: r.publishers!.id,
          name: r.publishers!.name,
          slug: r.publishers!.slug,
          createdAt: "",
          updatedAt: "",
        },
        authors: Array.isArray(r.book_authors)
          ? r.book_authors.map((x) => ({
              id: x.author.id,
              fullName: x.author.full_name,
              slug: x.author.slug,
              createdAt: "",
              updatedAt: "",
            }))
          : [],
        translators: Array.isArray(r.book_translators)
          ? r.book_translators.map((x) => ({
              id: x.translator.id,
              fullName: x.translator.full_name,
              slug: x.translator.slug,
              createdAt: "",
              updatedAt: "",
            }))
          : [],
        pages: Number(r.pages),
        publicationYear: Number(r.publication_year),
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        soldCount: Number(r.sold_count || 0),
        comments: [],
      }));

    if (translators.length > 0) {
      mapped = mapped.filter((b) =>
        b.translators.some((t) => translators.includes(t.slug))
      );
    }
    if (authors.length > 0) {
      mapped = mapped.filter((b) =>
        b.authors.some((a) => authors.includes(a.slug))
      );
    }

    return { success: true, data: mapped } as const;
  } catch {
    return {
      success: false,
      error: "خطا در دریافت کتاب‌ها",
      data: [] as TBook[],
    } as const;
  }
}
