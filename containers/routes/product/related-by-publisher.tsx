import { getBooks } from "@/actions/dashboard/manage-books/get-books";
import { ProductCart } from "@/components/product-cart";
import type { TBook } from "@/types/book";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

interface RelatedByPublisherProps {
  book: TBook;
}

export const RelatedByPublisher = async ({ book }: RelatedByPublisherProps) => {
  const res = await getBooks();
  const books = res.success ? res.data : [];
  const pubSlug = book.publisher?.slug;
  const related = books
    .filter((b) => b.id !== book.id)
    .filter((b) => b.publisher?.slug === pubSlug)
    .slice(0, 6);

  if (related.length === 0) return null;

  return (
    <section>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">کتاب های دیگر از این ناشر</h2>
          <Link href="/books" className="flex items-center gap-2 group">
            <span className="group-hover:text-primary transition-colors">
              مشاهده همه
            </span>
            <ArrowLeftIcon className="size-4 group-hover:text-primary shrink-0" />
          </Link>
        </div>
        <div className="lg:hidden overflow-x-auto snap-x snap-mandatory">
          <div className="flex gap-4">
            {related.map((item) => (
              <div
                key={item.id}
                className="min-w-[200px] max-w-[200px] snap-start shrink-0"
              >
                <ProductCart book={item} />
              </div>
            ))}
          </div>
        </div>
        <div className="hidden lg:grid grid-cols-6 gap-4">
          {related.slice(0, 6).map((item) => (
            <ProductCart key={item.id} book={item} />
          ))}
        </div>
      </div>
    </section>
  );
};
