"use client";

import { Button } from "@/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function Header() {
  const pathname = usePathname();
  return (
    <header>
      <div className="flex flex-col gap-4 lg:flex-row bg-white py-4 border border-slate-200 container">
        <div className="flex gap-4 w-full items-center justify-between">
          <Logo />
          {pathname.includes("/books") && <Button>افزودن کتاب</Button>}
          {pathname.includes("/categories") && (
            <Button>افزودن دسته بندی</Button>
          )}
          {pathname.includes("/authors") && <Button>افزودن نویسنده</Button>}
          {pathname.includes("/translators") && <Button>افزودن مترجم</Button>}
          {pathname.includes("/publishers") && <Button>افزودن ناشر</Button>}
        </div>
      </div>
      <div className="container bg-white py-4 border-b border-slate-200 rounded-b-xl">
        <Tabs />
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

export const Tabs = () => {
  const pathname = usePathname();
  const activeTabRef = useRef<HTMLAnchorElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const data = [
    {
      label: "مدیریت کتاب ها",
      href: "/dashboard/books",
    },
    {
      label: "مدیریت دسته بندی ها",
      href: "/dashboard/categories",
    },
    {
      label: "مدیریت نویسندگان",
      href: "/dashboard/authors",
    },
    {
      label: "مدیریت مترجمین",
      href: "/dashboard/translators",
    },
    {
      label: "مدیریت ناشرین",
      href: "/dashboard/publishers",
    },
    {
      label: "مدیریت سفارش ها",
      href: "/dashboard/orders",
    },
    {
      label: "مدیریت کاربران",
      href: "/dashboard/users",
    },
    {
      label: "مدیریت نظرات",
      href: "/dashboard/comments",
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
      className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth lg:justify-center lg:overflow-x-visible"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {data.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            ref={isActive ? activeTabRef : null}
            href={item.href}
            key={item.href}
            className="snap-center shrink-0"
          >
            <Button variant={isActive ? "default" : "ghost"}>
              {item.label}
            </Button>
          </Link>
        );
      })}
    </div>
  );
};
