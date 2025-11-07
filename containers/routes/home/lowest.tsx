import { getBooks } from '@/actions/dashboard/manage-books/get-books';
import { ProductCart } from '@/components/product-cart';
import { ArrowLeftIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const Lowest = async () => {
  const result = await getBooks();
  const books = result.success ? result.data : [];
  const effectivePrice = (price: number, discount?: number) =>
    discount ? price * (1 - discount / 100) : price;
  const sorted = books
    .slice()
    .sort(
      (a, b) =>
        effectivePrice(a.price, a.discount) -
        effectivePrice(b.price, b.discount),
    );

  return (
    <section>
      <div className="container flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">ارزان ترین کتاب ها</h2>
          <Link href="/explore" className="group flex items-center gap-2">
            <span className="group-hover:text-primary transition-colors">
              مشاهده همه
            </span>
            <ArrowLeftIcon className="group-hover:text-primary size-4 shrink-0" />
          </Link>
        </div>
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-6 py-10">
            <Image
              src="/images/global/not-found.png"
              alt="empty"
              width={200}
              height={200}
            />
            <p className="text-muted-foreground">کتابی برای نمایش وجود ندارد</p>
          </div>
        ) : (
          <>
            <div className="snap-x snap-mandatory overflow-x-auto lg:hidden">
              <div className="flex gap-4">
                {sorted.map((item) => (
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
              {sorted.slice(0, 6).map((item) => (
                <ProductCart key={item.id} book={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
