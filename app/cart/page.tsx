"use client";

import { useKillua } from "killua";
import { cartSlice } from "@/slices/cart";
import { CartItems } from "@/containers/routes/cart/cart-items";
import { CartSummary } from "@/containers/routes/cart/cart-summary";
import Image from "next/image";

export default function CartPage() {
  const cart = useKillua(cartSlice);
  const items = cart.get() || [];
  const isEmpty = !items || items.length === 0;

  if (isEmpty) {
    return (
      <>
        <div className="container">
          <div className="items-center flex flex-col gap-6 justify-center py-10">
            <Image
              src="/images/global/not-found.png"
              alt="empty"
              width={200}
              height={200}
            />
            <p className="text-muted-foreground">سبد خرید خالی است!</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CartItems />
          </div>
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      </div>
    </>
  );
}
