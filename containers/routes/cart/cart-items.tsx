'use client';

import { cartSlice } from '@/slices/cart';
import type { TBook } from '@/types/book';
import { Button } from '@/ui/button';
import { useKillua } from 'killua';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

export function CartItems() {
  const cart = useKillua(cartSlice);
  const items = cart.get() || [];

  const handleRemove = (slug: string, name: string) => {
    cart.reducers.removeFromCart(slug);
    toast.success(`${name} از سبد خرید حذف شد`);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="mb-4 text-lg font-bold">محصولات سبد خرید</h2>
      <div className="flex flex-col gap-4">
        {items.map((book: TBook) => {
          const discountPrice = book.discount
            ? Math.round(book.price * (1 - book.discount / 100))
            : book.price;

          return (
            <div
              key={book.slug}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex gap-4">
                <div>
                  <div className="flex shrink-0 items-center justify-center gap-3">
                    <div className="relative h-44 w-32 overflow-hidden rounded border">
                      <Image
                        src={book.image}
                        alt={book.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-3">
                      <h3 className="font-medium">{book.name}</h3>
                      <div className="flex flex-col gap-1">
                        <p className="text-smp text-muted-foreground">
                          نویسنده:
                          {book.authors && book.authors.length > 0 ? (
                            <>
                              {book.authors.map((a, idx) => (
                                <span key={a.slug}>
                                  {' '}
                                  <Link
                                    href={`/authors/${a.slug}`}
                                    className="text-primary hover:underline"
                                  >
                                    {a.fullName}
                                  </Link>
                                  {idx < book.authors.length - 1 ? '،' : ''}
                                </span>
                              ))}
                            </>
                          ) : (
                            <span> - </span>
                          )}
                        </p>
                        <p className="text-smp text-muted-foreground">
                          مترجم:
                          {book.translators && book.translators.length > 0 ? (
                            <>
                              {book.translators.map((t, idx) => (
                                <span key={t.slug}>
                                  {' '}
                                  <Link
                                    href={`/translators/${t.slug}`}
                                    className="text-primary hover:underline"
                                  >
                                    {t.fullName}
                                  </Link>
                                  {idx < book.translators.length - 1 ? '،' : ''}
                                </span>
                              ))}
                            </>
                          ) : (
                            <span> - </span>
                          )}
                        </p>
                        <p className="text-smp text-muted-foreground">
                          ناشر:{' '}
                          {book.publisher && book.publisher.name ? (
                            <Link
                              href={`/publishers/${book.publisher.slug}`}
                              className="text-primary hover:underline"
                            >
                              {book.publisher.name}
                            </Link>
                          ) : (
                            <span> - </span>
                          )}
                        </p>
                        <p className="text-smp text-muted-foreground">
                          دسته بندی:{' '}
                          {book.category ? (
                            <Link
                              href={`/categories/${book.category.slug}`}
                              className="text-primary hover:underline"
                            >
                              {book.category.name}
                            </Link>
                          ) : (
                            <span> - </span>
                          )}
                        </p>
                        <p className="text-smp text-muted-foreground">
                          سال انتشار: {book.publicationYear}
                        </p>
                        <p className="text-smp text-muted-foreground">
                          تعداد صفحات: {book.pages}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleRemove(book.slug, book.name)}
                        className="text-error border-error hover:bg-error w-[120px] hover:text-white"
                      >
                        <Trash2 className="ml-2 size-4" />
                        حذف
                      </Button>
                    </div>
                    <div className="flex items-center gap-1 lg:hidden">
                      {book.discount && book.discount > 0 && (
                        <p className="text-xsp bg-error h-5.5 w-fit rounded-lg px-2 py-1 text-white">
                          {book.discount}%
                        </p>
                      )}
                      <div className="text-center">
                        <p className="text-smp font-medium">
                          {discountPrice.toLocaleString()} تومان
                        </p>
                        {book.discount && book.discount > 0 && (
                          <p className="text-muted-foreground text-sm line-through">
                            {book.price.toLocaleString()} تومان
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden items-center gap-1 lg:flex">
                {book.discount && book.discount > 0 ? (
                  <p className="text-xsp bg-error h-5.5 w-fit rounded-lg px-2 py-1 text-white">
                    {book.discount}%
                  </p>
                ) : null}
                <div className="text-center">
                  <p className="text-smp font-medium">
                    {discountPrice.toLocaleString()} تومان
                  </p>
                  {book.discount
                    ? book.discount > 0 && (
                        <p className="text-muted-foreground text-sm line-through">
                          {book.price.toLocaleString()} تومان
                        </p>
                      )
                    : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
