"use server";

import { supabase } from "@/lib/supabase";
import type { TBook } from "@/types/book";
import type { TCategory } from "@/types/category";
import type { TPublisher } from "@/types/publisher";

export async function getBook(slug: string) {
  try {
    const decoded = decodeURIComponent(slug || "").trim();
    const res = await supabase
      .from("books")
      .select(
        "id,name,slug,image,price,discount,description,pages,publication_year,created_at,updated_at,sold_count,author_ids,translator_ids, categories:category_id(id,name,slug), publishers:publisher_id(id,name,slug)"
      )
      .eq("slug", decoded)
      .limit(1)
      .single();
    if (res.error || !res.data) {
      return { success: false, error: "کتاب یافت نشد" } as const;
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
    const r = res.data as unknown as BookRow;
    if (!r.categories || !r.publishers) {
      return { success: false, error: "کتاب یافت نشد" } as const;
    }

    // Parse JSON strings to arrays
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

    const authorsRes =
      authorIds.length > 0
        ? await supabase
            .from("authors")
            .select("id, full_name, slug")
            .in("id", authorIds)
        : { data: [], error: null };

    const translatorsRes =
      translatorIds.length > 0
        ? await supabase
            .from("translators")
            .select("id, full_name, slug")
            .in("id", translatorIds)
        : { data: [], error: null };

    const authors = (authorsRes.data || []).map((a) => ({
      id: a.id,
      fullName: a.full_name,
      slug: a.slug,
      createdAt: "",
      updatedAt: "",
    }));

    const translators = (translatorsRes.data || []).map((t) => ({
      id: t.id,
      fullName: t.full_name,
      slug: t.slug,
      createdAt: "",
      updatedAt: "",
    }));

    // Fetch approved comments for this book
    const commentsRes = await supabase
      .from("comments")
      .select("id, full_name, text, rating, created_at")
      .eq("book_id", r.id)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    const comments = (commentsRes.data || []).map((c) => ({
      id: c.id,
      bookSlug: decoded,
      fullName: c.full_name,
      text: c.text,
      rating: c.rating,
      status: "approved" as const,
      createdAt: c.created_at,
    }));

    const data: TBook = {
      id: r.id,
      name: r.name,
      slug: r.slug,
      image: r.image,
      price: Number(r.price),
      discount: Number(r.discount || 0),
      description: r.description,
      category: {
        id: r.categories.id,
        name: r.categories.name,
        slug: r.categories.slug,
        createdAt: "",
        updatedAt: "",
      },
      publisher: {
        id: r.publishers.id,
        name: r.publishers.name,
        slug: r.publishers.slug,
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
      comments,
    };
    return { success: true, data } as const;
  } catch {
    return { success: false, error: "خطا در دریافت کتاب" } as const;
  }
}
