"use server";

import { supabase } from "@/lib/supabase";
import type { TBook } from "@/types/book";
import type { TCategory } from "@/types/category";
import type { TPublisher } from "@/types/publisher";

export async function getBooks() {
  try {
    const res = await supabase
      .from("books")
      .select(
        "id,name,slug,image,price,discount,description,pages,publication_year,created_at,updated_at,sold_count, categories:category_id(id,name,slug), publishers:publisher_id(id,name,slug)"
      )
      .order("created_at", { ascending: false });
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
      categories: CategoryRow | null;
      publishers: PublisherRow | null;
    };
    const data = (res.data as unknown as BookRow[]) || [];
    const mapped: TBook[] = data
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
        authors: [],
        translators: [],
        pages: Number(r.pages),
        publicationYear: Number(r.publication_year),
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        soldCount: Number(r.sold_count || 0),
        comments: [],
      }));

    return { success: true, data: mapped } as const;
  } catch {
    return {
      success: false,
      error: "خطا در دریافت کتاب‌ها",
      data: [] as TBook[],
    } as const;
  }
}
