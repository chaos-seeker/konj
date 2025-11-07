import { getBooks } from '@/actions/dashboard/manage-books/get-books';
import { ProductCart } from '@/components/product-cart';
import type { TBook } from '@/types/book';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';

interface RelatedByAuthorProps {
  book: TBook;
}

export const RelatedByAuthor = async ({ book }: RelatedByAuthorProps) => {
  const res = await getBooks();
  const books = res.success ? res.data : [];
  const authorSlugs = (book.authors || []).map((a) => a.slug);
  const related = books
    .filter((b) => b.id !== book.id)
    .filter((b) => (b.authors || []).some((a) => authorSlugs.includes(a.slug)))
    .slice(0, 6);

  if (related.length === 0) return null;

  return (
    <section>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">کتاب های دیگر از این نویسنده</h2>
          <Link href="/explore" className="group flex items-center gap-2">
            <span className="group-hover:text-primary transition-colors">
              مشاهده همه
            </span>
            <ArrowLeftIcon className="group-hover:text-primary size-4 shrink-0" />
          </Link>
        </div>
        <div className="snap-x snap-mandatory overflow-x-auto lg:hidden">
          <div className="flex gap-4">
            {related.map((item) => (
              <div
                key={item.id}
                className="max-w-[200px] min-w-[200px] shrink-0 snap-start"
              >
                <ProductCart book={item} />
              </div>
            ))}
          </div>
        </div>
        <div className="hidden grid-cols-6 gap-4 lg:grid">
          {related.slice(0, 6).map((item) => (
            <ProductCart key={item.id} book={item} />
          ))}
        </div>
      </div>
    </section>
  );
};
