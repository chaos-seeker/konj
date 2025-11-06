"use server";

import { supabase } from "@/lib/supabase";
import type { TBook } from "@/types/book";
import type { TCategory } from "@/types/category";
import type { TPublisher } from "@/types/publisher";
import type { TComment } from "@/types/comment";

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

    let query = supabase
      .from("books")
      .select(
        "id,name,slug,image,price,discount,description,pages,publication_year,created_at,updated_at,sold_count,author_ids,translator_ids, categories:category_id(id,name,slug), publishers:publisher_id(id,name,slug)"
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
      author_ids: string[] | string;
      translator_ids: string[] | string;
      categories: CategoryRow | null;
      publishers: PublisherRow | null;
    };
    const rows = (res.data as unknown as BookRow[]) || [];

    // Collect all author and translator IDs
    const allAuthorIds = new Set<string>();
    const allTranslatorIds = new Set<string>();
    rows.forEach((r) => {
      let authorIds: string[] = [];
      let translatorIds: string[] = [];

      try {
        if (typeof r.author_ids === "string") {
          authorIds = JSON.parse(r.author_ids);
        } else if (Array.isArray(r.author_ids)) {
          authorIds = r.author_ids;
        }
      } catch {
        authorIds = [];
      }

      try {
        if (typeof r.translator_ids === "string") {
          translatorIds = JSON.parse(r.translator_ids);
        } else if (Array.isArray(r.translator_ids)) {
          translatorIds = r.translator_ids;
        }
      } catch {
        translatorIds = [];
      }

      authorIds.forEach((id) => allAuthorIds.add(id));
      translatorIds.forEach((id) => allTranslatorIds.add(id));
    });

    // Fetch all authors and translators in one query
    const authorsRes =
      allAuthorIds.size > 0
        ? await supabase
            .from("authors")
            .select("id, full_name, slug")
            .in("id", Array.from(allAuthorIds))
        : { data: [], error: null };

    const translatorsRes =
      allTranslatorIds.size > 0
        ? await supabase
            .from("translators")
            .select("id, full_name, slug")
            .in("id", Array.from(allTranslatorIds))
        : { data: [], error: null };

    const authorsMap = new Map((authorsRes.data || []).map((a) => [a.id, a]));
    const translatorsMap = new Map(
      (translatorsRes.data || []).map((t) => [t.id, t])
    );

    // Collect all book IDs and fetch comments
    const bookIds = rows.map((r) => r.id);
    const commentsRes =
      bookIds.length > 0
        ? await supabase
            .from("comments")
            .select("id, book_id, full_name, text, rating, created_at")
            .in("book_id", bookIds)
            .eq("status", "approved")
        : { data: [], error: null };

    // Create a map of book_id to comments
    type CommentRow = Pick<TComment, "id" | "text" | "rating"> & {
      book_id: string | null;
      full_name: string;
      created_at: string;
    };
    const commentsMap = new Map<string, CommentRow[]>();
    (commentsRes.data || []).forEach((comment: CommentRow) => {
      if (comment.book_id) {
        if (!commentsMap.has(comment.book_id)) {
          commentsMap.set(comment.book_id, []);
        }
        commentsMap.get(comment.book_id)!.push(comment);
      }
    });

    let mapped: TBook[] = rows
      .filter((r) => r.categories && r.publishers)
      .map((r) => {
        let authorIds: string[] = [];
        let translatorIds: string[] = [];

        try {
          if (typeof r.author_ids === "string") {
            authorIds = JSON.parse(r.author_ids);
          } else if (Array.isArray(r.author_ids)) {
            authorIds = r.author_ids;
          }
        } catch {
          authorIds = [];
        }

        try {
          if (typeof r.translator_ids === "string") {
            translatorIds = JSON.parse(r.translator_ids);
          } else if (Array.isArray(r.translator_ids)) {
            translatorIds = r.translator_ids;
          }
        } catch {
          translatorIds = [];
        }

        const authors = authorIds
          .map((id) => authorsMap.get(id))
          .filter((a): a is NonNullable<typeof a> => a !== undefined)
          .map((a) => ({
            id: a.id,
            fullName: a.full_name,
            slug: a.slug,
            createdAt: "",
            updatedAt: "",
          }));

        const translators = translatorIds
          .map((id) => translatorsMap.get(id))
          .filter((t): t is NonNullable<typeof t> => t !== undefined)
          .map((t) => ({
            id: t.id,
            fullName: t.full_name,
            slug: t.slug,
            createdAt: "",
            updatedAt: "",
          }));

        return {
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
          authors,
          translators,
          pages: Number(r.pages),
          publicationYear: Number(r.publication_year),
          createdAt: r.created_at,
          updatedAt: r.updated_at,
          soldCount: Number(r.sold_count || 0),
          comments: (commentsMap.get(r.id) || []).map((c) => ({
            id: c.id,
            bookSlug: r.slug,
            fullName: c.full_name,
            text: c.text,
            rating: c.rating,
            status: "approved" as const,
            createdAt: c.created_at,
          })),
        };
      });

    if (params.translators && params.translators.length > 0) {
      mapped = mapped.filter((b) =>
        b.translators.some((t) => params.translators!.includes(t.slug))
      );
    }
    if (params.authors && params.authors.length > 0) {
      mapped = mapped.filter((b) =>
        b.authors.some((a) => params.authors!.includes(a.slug))
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
