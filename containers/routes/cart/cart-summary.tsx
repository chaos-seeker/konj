'use client';

import { createOrder } from '@/actions/orders/create-order';
import { ModalLogin } from '@/containers/layout/base/modal-login';
import { cartSlice } from '@/slices/cart';
import { userSlice } from '@/slices/user';
import type { TBook } from '@/types/book';
import { Button } from '@/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import { useKillua } from 'killua';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function CartSummary() {
  const cart = useKillua(cartSlice);
  const user = useKillua(userSlice);
  const queryClient = useQueryClient();
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
      toast.error('برای تکمیل سفارش باید ابتدا وارد شوید');
      setLoginOpen(true);
      return;
    }

    if (items.length === 0) {
      toast.error('سبد خرید خالی استًً');
      return;
    }

    const token = user.selectors.getToken();
    const fullName = user.selectors.getFullName();
    const username = user.selectors.getUsername();

    try {
      setIsSubmitting(true);
      const result = await createOrder({
        fullName: fullName || '',
        username: username || '',
        totalPrice: totalOriginalPrice,
        totalDiscount,
        token: token || '',
      });

      if (!result.success) {
        toast.error(result.error || 'خطا در ثبت سفارش');
        return;
      }

      toast.success(result.message || 'سفارش با موفقیت ثبت شد');
      // Revalidate client-side cache so profile orders update immediately
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
      cart.reducers.clearCart();
    } catch {
      toast.error('خطا در ثبت سفارش');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-4 text-lg font-bold">خلاصه سفارش</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">قیمت کل:</span>
            <span className="text-sm font-medium">
              {totalOriginalPrice.toLocaleString()} تومان
            </span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">تخفیف:</span>
              <span className="text-success text-sm font-medium">
                -{totalDiscount.toLocaleString()} تومان
              </span>
            </div>
          )}
          <div className="mt-2 border-t pt-3">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold">قیمت نهایی:</span>
              <span className="text-primary text-lg font-bold">
                {totalDiscountPrice.toLocaleString()} تومان
              </span>
            </div>
          </div>
          <Button
            className="h-12 w-full"
            onClick={handleCompleteOrder}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'در حال ثبت سفارش...' : 'تکمیل سفارش'}
          </Button>
        </div>
      </section>
      <ModalLogin open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
