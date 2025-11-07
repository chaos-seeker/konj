'use client';

import { cartSlice } from '@/slices/cart';
import type { TBook } from '@/types/book';
import { Button } from '@/ui/button';
import { useKillua } from 'killua';
import { StarIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface IBoxProps {
  book: TBook;
}

export function Box({ book }: IBoxProps) {
  const cart = useKillua(cartSlice);
  const isInCart = cart.selectors.isItemInCart(book.slug);
  const discountPrice = book.discount
    ? Math.round(book.price * (1 - book.discount / 100))
    : book.price;
  const rating =
    book.comments && book.comments.length > 0
      ? book.comments.reduce((s, c) => s + (c.rating || 0), 0) /
        book.comments.length
      : 3;

  const handleAddToCart = () => {
    if (isInCart) {
      cart.reducers.removeFromCart(book.slug);
      toast.success('از سبد خرید حذف شد');
    } else {
      cart.reducers.addToCart(book);
      toast.success('به سبد خرید اضافه شد');
    }
  };

  return (
    <section className="flex justify-center">
      <div className="flex w-full flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4">
        <div className="xl:flex">
          <div className="flex w-full justify-center xl:w-fit xl:pl-4">
            <div className="relative aspect-3/4 w-[200px] overflow-hidden border bg-white xl:w-[230px]">
              <Image
                src={book.image}
                alt={book.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="xl:w-full">
            <div className="flex justify-between gap-3 border-b py-4 lg:pt-0">
              <h1 className="truncate font-medium xl:pt-3">{book.name}</h1>
              <div className="flex items-center gap-1">
                <StarIcon className="text-warning fill-warning h-4 w-4" />
                <p className="pt-1 text-sm">{rating}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1 border-b py-4">
              <p className="text-smp text-muted-foreground">
                نویسنده:
                {book.authors && book.authors.length > 0 ? (
                  <>
                    {book.authors.map((a, idx) => (
                      <span key={a.slug}>
                        {' '}
                        <Link
                          href={`/explore?authors=${encodeURIComponent(
                            a.slug,
                          )}`}
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
                          href={`/explore?translators=${encodeURIComponent(
                            t.slug,
                          )}`}
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
                    href={`/explore?publishers=${encodeURIComponent(
                      book.publisher.slug,
                    )}`}
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
                    href={`/explore?categories=${encodeURIComponent(
                      book.category.slug,
                    )}`}
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
            <div className="flex items-center justify-between py-4">
              <p>قیمت نهایی</p>
              <div className="flex items-center gap-2">
                {book.discount
                  ? book.discount > 0 && (
                      <p className="text-xsp bg-error h-5.5 w-fit rounded-lg px-2 py-1 text-white">
                        {book.discount}%
                      </p>
                    )
                  : null}
                <div>
                  <p className="text-smp">
                    {discountPrice.toLocaleString()} تومان
                  </p>
                  {book.discount ? (
                    <p className="text-muted-foreground text-sm line-through">
                      {book.price.toLocaleString()} تومان
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
            <Button
              className={`text-mdp h-13 w-full text-white ${
                isInCart ? 'bg-error hover:bg-error/90' : ''
              }`}
              onClick={handleAddToCart}
            >
              <p>{isInCart ? 'حذف از سبد خرید' : 'افزودن به سبد خرید'}</p>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
