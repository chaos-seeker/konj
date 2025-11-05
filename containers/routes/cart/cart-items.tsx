"use client";

import { useKillua } from "killua";
import { cartSlice } from "@/slices/cart";
import type { TBook } from "@/types/book";
import { Button } from "@/ui/button";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export function CartItems() {
  const cart = useKillua(cartSlice);
  const items = cart.get() || [];

  const handleRemove = (slug: string, name: string) => {
    cart.reducers.removeFromCart(slug);
    toast.success(`${name} از سبد خرید حذف شد`);
  };

  return (
    <section className="rounded-xl border bg-white border-slate-200 p-4">
      <h2 className="text-lg font-bold mb-4">محصولات سبد خرید</h2>
      <div className="flex flex-col gap-4">
        {items.map((book: TBook) => {
          const discountPrice = book.discount
            ? Math.round(book.price * (1 - book.discount / 100))
            : book.price;

          return (
            <div
              key={book.slug}
              className="flex p-4 border rounded-lg items-center justify-between"
            >
              <div className="flex gap-4">
                <div>
                  <div className="flex gap-3 shrink-0 items-center justify-center">
                    <div className="relative w-32 h-44 overflow-hidden border rounded">
                      <Image
                        src={book.image}
                        alt={book.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-3">
                      <h3 className="font-medium">{book.name}</h3>
                      <div className="flex flex-col gap-1">
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
                    </div>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <div className="flex flex-col items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleRemove(book.slug, book.name)}
                        className="text-error border-error hover:bg-error hover:text-white w-[120px]"
                      >
                        <Trash2 className="size-4 ml-2" />
                        حذف
                      </Button>
                    </div>
                    <div className="items-center gap-1 flex lg:hidden">
                      {book.discount && book.discount > 0 && (
                        <p className="text-xsp bg-error text-white px-2 py-1 rounded-lg w-fit h-5.5">
                          {book.discount}%
                        </p>
                      )}
                      <div className="text-center">
                        <p className="text-smp font-medium">
                          {discountPrice.toLocaleString()} تومان
                        </p>
                        {book.discount && book.discount > 0 && (
                          <p className="text-sm text-muted-foreground line-through">
                            {book.price.toLocaleString()} تومان
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="items-center gap-1 lg:flex hidden">
                {book.discount && book.discount > 0 && (
                  <p className="text-xsp bg-error text-white px-2 py-1 rounded-lg w-fit h-5.5">
                    {book.discount}%
                  </p>
                )}
                <div className="text-center">
                  <p className="text-smp font-medium">
                    {discountPrice.toLocaleString()} تومان
                  </p>
                  {book.discount && book.discount > 0 && (
                    <p className="text-sm text-muted-foreground line-through">
                      {book.price.toLocaleString()} تومان
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
