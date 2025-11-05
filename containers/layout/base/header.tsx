"use client";

import { Button } from "@/ui/button";
import Image from "next/image";
import Link from "next/link";
import { SearchIcon, ShoppingBag, UserIcon } from "lucide-react";
import { useKillua } from "killua";
import { cartSlice } from "@/slices/cart";

export function Header() {
  return (
    <header>
      <div className="flex flex-col gap-4lg:flex-row bg-white py-4 border border-slate-200 rounded-b-xl container">
        <div className="flex gap-4 w-full items-center justify-between">
          <div className="shrink-0">
            <Logo />
          </div>
          <Search />
          <div className="flex items-center gap-2 shrink-0">
            <Cart />
            <User />
          </div>
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <Link href="/">
      <Image
        src="/images/layout/logo.png"
        unoptimized
        alt="logo"
        width={60}
        height={60}
        className="lg:w-[80px]"
      />
    </Link>
  );
}

const Cart = () => {
  const cart = useKillua(cartSlice);
  const count = cart.selectors.totalCount();
  
  return (
    <Button
      variant="outline"
      size="icon"
      className="hover:bg-primary lg:size-10 hover:text-white hover:border-primary relative"
      asChild
    >
      <Link href="/cart">
        <ShoppingBag className="size-4 lg:size-5" />
        {count > 0 && (
          <span className="absolute -top-1 border border-white -right-1.5 bg-primary text-white text-[8px] rounded-full px-1.5 py-0.5 text-caption">
            {count}
          </span>
        )}
      </Link>
    </Button>
  );
};

const User = () => {
  return (
    <Button
      variant="outline"
      size="icon"
      className="hover:bg-primary lg:size-10 hover:text-white hover:border-primary"
    >
      <Link href="/profile">
        <UserIcon className="size-5 lg:size-6" />
      </Link>
    </Button>
  );
};

const Search = () => {
  return (
    <div className="border focus-within:border-primary focus-visible:ring-ring/50 lg:p-2 max-w-[200px] sm:max-w-[300px] flex items-center gap-2 justify-between focus-visible:ring-[3px] rounded-md px-2 py-1 w-full flex-shrink-0">
      <input
        type="text"
        placeholder="جستجو کنید ..."
        className="flex-1 outline-none !w-full"
      />
      <button>
        <SearchIcon className="size-4 lg:size-5 hover:text-primary transition-colors text-muted-foreground flex-shrink-0" />
      </button>
    </div>
  );
};
