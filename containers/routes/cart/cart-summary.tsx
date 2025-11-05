"use client";

import { useState } from "react";
import { useKillua } from "killua";
import { cartSlice } from "@/slices/cart";
import { userSlice } from "@/slices/user";
import type { TBook } from "@/types/book";
import { Button } from "@/ui/button";
import { createOrder } from "@/actions/orders/create-order";
import { ModalLogin } from "@/containers/layout/base/modal-login";
import toast from "react-hot-toast";

export function CartSummary() {
  const cart = useKillua(cartSlice);
  const user = useKillua(userSlice);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const items = cart.get() || [];

  const totalOriginalPrice = items.reduce((sum: number, book: TBook) => {
    return sum + book.price;
  }, 0);

  const totalDiscountPrice = items.reduce((sum: number, book: TBook) => {
    const discountPrice = book.discount
      ? Math.round(book.price * (1 - book.discount / 100))
      : book.price;
    return sum + discountPrice;
  }, 0);

  const totalDiscount = totalOriginalPrice - totalDiscountPrice;
  const isAuthenticated = user.selectors.isAuthenticated();

  const handleCompleteOrder = async () => {
    if (!isAuthenticated) {
      toast.error("برای تکمیل سفارش باید ابتدا وارد شوید");
      setLoginOpen(true);
      return;
    }

    if (items.length === 0) {
      toast.error("سبد خرید خالی استًً");
      return;
    }

    const token = user.selectors.getToken();
    const fullName = user.selectors.getFullName();

    if (!token || !fullName) {
      toast.error("لطفاً دوباره وارد شوید");
      setLoginOpen(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const orderItems = items.map((book: TBook) => ({
        bookSlug: book.slug,
        bookName: book.name,
        price: book.price,
        discount: book.discount || 0,
      }));

      const result = await createOrder({
        fullName,
        totalPrice: totalOriginalPrice,
        totalDiscount,
        token,
        items: orderItems,
      });

      if (!result.success) {
        toast.error(result.error || "خطا در ثبت سفارش");
        return;
      }

      toast.success(result.message || "سفارش با موفقیت ثبت شد");
      cart.reducers.clearCart();
    } catch {
      toast.error("خطا در ثبت سفارش");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <section className="rounded-xl border bg-white border-slate-200 p-4">
        <h2 className="text-lg font-bold mb-4">خلاصه سفارش</h2>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">قیمت کل:</span>
            <span className="text-sm font-medium">
              {totalOriginalPrice.toLocaleString()} تومان
            </span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">تخفیف:</span>
              <span className="text-sm font-medium text-success">
                -{totalDiscount.toLocaleString()} تومان
              </span>
            </div>
          )}
          <div className="border-t pt-3 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-base font-bold">قیمت نهایی:</span>
              <span className="text-lg font-bold text-primary">
                {totalDiscountPrice.toLocaleString()} تومان
              </span>
            </div>
          </div>
          <Button
            className="w-full h-12"
            onClick={handleCompleteOrder}
            disabled={isSubmitting}
          >
            {isSubmitting ? "در حال ثبت سفارش..." : "تکمیل سفارش"}
          </Button>
        </div>
      </section>
      <ModalLogin open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
