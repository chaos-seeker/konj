"use client";

import Image from "next/image";
import type { TBook } from "@/types/book";
import { StarIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/ui/button";
import { cartSlice } from "@/slices/cart";
import { useKillua } from "killua";
import toast from "react-hot-toast";

interface IBoxProps { book: TBook };

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
      toast.success("از سبد خرید حذف شد");
    } else {
      cart.reducers.addToCart(book);
      toast.success("به سبد خرید اضافه شد");
    }
  };

  return (
    <section className="container flex justify-center">
      <div className=" p-4 bg-white flex flex-col gap-4 rounded-xl border w-full border-slate-200">
        <div className="w-full flex justify-center">
          <div className="relative aspect-3/4 w-[200px] overflow-hidden border bg-white">
            <Image
              src={book.image}
              alt={book.name}
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex justify-between gap-3 pb-4 border-b">
          <h1 className="font-medium truncate">{book.name}</h1>
          <div className="flex items-center gap-1">
            <StarIcon className="w-4 h-4 text-warning fill-warning" />
            <p className="text-sm pt-1">{rating}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1 border-b pb-4">
          <p className="text-smp text-muted-foreground">
            نویسنده:
            {book.authors && book.authors.length > 0 ? (
              <>
                {book.authors.map((a, idx) => (
                  <span key={a.slug}>
                    {" "}
                    <Link
                      href={`/authors/${a.slug}`}
                      className="text-primary hover:underline"
                    >
                      {a.fullName}
                    </Link>
                    {idx < book.authors.length - 1 ? "،" : ""}
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
                    {" "}
                    <Link
                      href={`/translators/${t.slug}`}
                      className="text-primary hover:underline"
                    >
                      {t.fullName}
                    </Link>
                    {idx < book.translators.length - 1 ? "،" : ""}
                  </span>
                ))}
              </>
            ) : (
              <span> - </span>
            )}
          </p>
          <p className="text-smp text-muted-foreground">
            ناشر:{" "}
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
            دسته بندی:{" "}
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
        <div className="flex justify-between items-center">
          <p>قیمت نهایی</p>
          <div className="flex items-center gap-2">
            {book.discount && book.discount > 0 && (
              <p className="text-xsp bg-error text-white px-2 py-1 rounded-lg w-fit h-5.5">
                {book.discount}%
              </p>
            )}
            <div>
              <p className="text-smp">{discountPrice.toLocaleString()} تومان</p>
              <p className="text-sm text-muted-foreground line-through">
                {book.price.toLocaleString()} تومان
              </p>
            </div>
          </div>
        </div>
        <Button
          className={`w-full h-13 text-mdp text-white ${
            isInCart ? "bg-error hover:bg-error/90" : ""
          }`}
          onClick={handleAddToCart}
        >
          <p>{isInCart ? "حذف از سبد خرید" : "افزودن به سبد خرید"}</p>
        </Button>
      </div>
    </section>
  );
}
