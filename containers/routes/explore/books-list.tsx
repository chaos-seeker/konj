"use client";

import { useQuery } from "@tanstack/react-query";
import { getBooks } from "@/actions/explore/get-books";
import type { TBook } from "@/types/book";
import { ProductCart } from "@/components/product-cart";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface BooksListProps {
  searchText?: string;
  categories: string[];
  publishers: string[];
  translators: string[];
  authors: string[];
}

export function BooksList({
  searchText,
  categories,
  publishers,
  translators,
  authors,
}: BooksListProps) {
  const { data: books = [], isLoading } = useQuery<TBook[]>({
    queryKey: ["explore-books", searchText, categories, publishers, translators, authors],
    queryFn: async () => {
      const result = await getBooks({
        searchText,
        categories: categories.length > 0 ? categories : undefined,
        publishers: publishers.length > 0 ? publishers : undefined,
        translators: translators.length > 0 ? translators : undefined,
        authors: authors.length > 0 ? authors : undefined,
      });
      return result.success ? result.data : [];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="items-center flex flex-col gap-6 justify-center py-10">
        <Image
          src="/images/global/not-found.png"
          alt="empty"
          width={200}
          height={200}
        />
        <p className="text-muted-foreground">کتابی یافت نشد!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {books.map((book) => (
        <ProductCart key={book.id} book={book} />
      ))}
    </div>
  );
}

