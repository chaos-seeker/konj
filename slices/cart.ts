import { slice } from "killua";
import type { TBook } from "@/types/book";

export const cartSlice = slice({
  key: "cart",
  defaultClient: [] as TBook[],
  defaultServer: [] as TBook[],
  selectors: {
    cartIsEmpty: (value: TBook[]) => value.length === 0,
    isItemInCart: (value: TBook[], slug: string) =>
      value.some((b) => b.slug === slug),
    totalCount: (value: TBook[]) => value.length,
    totalPrice: (value: TBook[]) =>
      value.reduce(
        (sum, b) =>
          sum +
          (b.discount ? Math.round(b.price * (1 - b.discount / 100)) : b.price),
        0
      ),
  },
  reducers: {
    addToCart: (value: TBook[], payload: TBook) =>
      value.some((b) => b.slug === payload.slug) ? value : [...value, payload],
    removeFromCart: (value: TBook[], slug: string) =>
      value.filter((b) => b.slug !== slug),
    clearCart: () => [],
  },
});
