"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { SearchIcon, ShoppingBag, UserIcon } from "lucide-react";
import { useKillua } from "killua";
import { cartSlice } from "@/slices/cart";
import { userSlice } from "@/slices/user";
import { ModalLogin } from "./modal-login";
import { ModalRegister } from "./modal-register";

export function Header() {
  return (
    <header>
      <div className="flex flex-col gap-4 lg:flex-row bg-white py-4 border border-slate-200 container">
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
      <div className="container bg-white py-4 border-b border-slate-200 rounded-b-xl">
        <Tabs />
      </div>
    </header>
  );
}

function Tabs() {
  const pathname = usePathname();
  const activeTabRef = useRef<HTMLAnchorElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const data = [
    {
      label: "صفحه اصلی",
      href: "/",
    },
    {
      label: "آرشیو",
      href: "/explore",
    },
    {
      label: "سبد خرید",
      href: "/cart",
    },
    {
      label: "پروفایل",
      href: "/profile",
    },
    {
      label: "داشبورد",
      href: "/dashboard/manage-books",
    },
  ];

  useEffect(() => {
    if (activeTabRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeTab = activeTabRef.current;
      const containerRect = container.getBoundingClientRect();
      if (window.innerWidth < 1024) {
        const tabRect = activeTab.getBoundingClientRect();
        const scrollLeft =
          activeTab.offsetLeft - containerRect.width / 2 + tabRect.width / 2;
        container.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      }
    }
  }, [pathname]);

  return (
    <div
      ref={containerRef}
      className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth lg:justify-center lg:overflow-x-visible lg:px-0"
    >
      {data.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            ref={isActive ? activeTabRef : null}
            href={item.href}
            key={item.href}
            className="snap-start shrink-0"
          >
            <Button variant={isActive ? "default" : "ghost"} className="px-2">
              {item.label}
            </Button>
          </Link>
        );
      })}
    </div>
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
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const user = useKillua(userSlice);
  const isAuthenticated = user.selectors.isAuthenticated();

  if (isAuthenticated) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="hover:bg-primary lg:size-10 hover:text-white hover:border-primary"
        asChild
      >
        <Link href="/profile">
          <UserIcon className="size-5 lg:size-6" />
        </Link>
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="hover:bg-primary lg:size-10 hover:text-white hover:border-primary"
        onClick={() => setLoginOpen(true)}
      >
        <UserIcon className="size-5 lg:size-6" />
      </Button>
      <ModalLogin
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSwitchToRegister={() => setRegisterOpen(true)}
      />
      <ModalRegister
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onSwitchToLogin={() => setLoginOpen(true)}
      />
    </>
  );
};

const Search = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = searchText.trim();
    if (trimmedText) {
      router.push(`/explore?text=${encodeURIComponent(trimmedText)}`);
    } else {
      router.push("/explore");
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="border focus-within:border-primary focus-visible:ring-ring/50 lg:p-2 max-w-[150px] sm:max-w-[300px] flex items-center gap-2 justify-between focus-visible:ring-[3px] rounded-md px-2 py-1 w-full shrink-0"
    >
      <input
        type="text"
        placeholder="جستجو کنید ..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="flex-1 outline-none w-full"
      />
      <button type="submit">
        <SearchIcon className="size-4 lg:size-5 hover:text-primary transition-colors text-muted-foreground shrink-0" />
      </button>
    </form>
  );
};
