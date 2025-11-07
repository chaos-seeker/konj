'use client';

import { ModalAddAuthor } from '@/containers/routes/dashboard/manage-authors/modal-add-author';
import { ModalAddCategory } from '@/containers/routes/dashboard/manage-categories/modal-add-category';
import { ModalAddPublisher } from '@/containers/routes/dashboard/manage-publishers/modal-add-publisher';
import { ModalAddTranslator } from '@/containers/routes/dashboard/manage-translators/modal-add-translator';
import { Button } from '@/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function Header() {
  const pathname = usePathname();
  const [isPublisherModalOpen, setIsPublisherModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);
  const [isTranslatorModalOpen, setIsTranslatorModalOpen] = useState(false);

  return (
    <header>
      <div className="container flex flex-col gap-4 border border-slate-200 bg-white py-4 lg:flex-row">
        <div className="flex w-full items-center justify-between gap-4">
          <Logo />
          {pathname.includes('/manage-books') && (
            <Button asChild>
              <Link href="/dashboard/manage-books/add">افزودن کتاب</Link>
            </Button>
          )}
          {pathname.includes('/manage-categories') && (
            <Button onClick={() => setIsCategoryModalOpen(true)}>
              افزودن دسته بندی
            </Button>
          )}
          {pathname.includes('/manage-authors') && (
            <Button onClick={() => setIsAuthorModalOpen(true)}>
              افزودن نویسنده
            </Button>
          )}
          {pathname.includes('/manage-translators') && (
            <Button onClick={() => setIsTranslatorModalOpen(true)}>
              افزودن مترجم
            </Button>
          )}
          {pathname.includes('/manage-publishers') && (
            <Button onClick={() => setIsPublisherModalOpen(true)}>
              افزودن ناشر
            </Button>
          )}
        </div>
      </div>
      <div className="container rounded-b-xl border-b border-slate-200 bg-white py-4">
        <Tabs />
      </div>
      <ModalAddPublisher
        open={isPublisherModalOpen}
        onOpenChange={setIsPublisherModalOpen}
      />
      <ModalAddCategory
        open={isCategoryModalOpen}
        onOpenChange={setIsCategoryModalOpen}
      />
      <ModalAddAuthor
        open={isAuthorModalOpen}
        onOpenChange={setIsAuthorModalOpen}
      />
      <ModalAddTranslator
        open={isTranslatorModalOpen}
        onOpenChange={setIsTranslatorModalOpen}
      />
    </header>
  );
}

function Logo() {
  return (
    <div>
      <button onClick={() => (window.location.href = '/')}>
        <Image
          src="/images/layout/logo.png"
          unoptimized
          alt="logo"
          width={60}
          height={60}
          className="lg:w-[80px]"
        />
      </button>
    </div>
  );
}

export const Tabs = () => {
  const pathname = usePathname();
  const activeTabRef = useRef<HTMLAnchorElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const data = [
    {
      label: 'مدیریت کتاب ها',
      href: '/dashboard/manage-books',
    },
    {
      label: 'مدیریت دسته بندی ها',
      href: '/dashboard/manage-categories',
    },
    {
      label: 'مدیریت نویسندگان',
      href: '/dashboard/manage-authors',
    },
    {
      label: 'مدیریت مترجمین',
      href: '/dashboard/manage-translators',
    },
    {
      label: 'مدیریت ناشرین',
      href: '/dashboard/manage-publishers',
    },
    {
      label: 'مدیریت سفارش ها',
      href: '/dashboard/manage-orders',
    },
    {
      label: 'مدیریت کاربران',
      href: '/dashboard/manage-users',
    },
    {
      label: 'مدیریت نظرات',
      href: '/dashboard/manage-comments',
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
          behavior: 'smooth',
        });
      }
    }
  }, [pathname]);

  return (
    <div
      ref={containerRef}
      className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth lg:justify-center lg:overflow-x-visible"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {data.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link
            ref={isActive ? activeTabRef : null}
            href={item.href}
            key={item.href}
            className="shrink-0 snap-center"
          >
            <Button variant={isActive ? 'default' : 'ghost'}>
              {item.label}
            </Button>
          </Link>
        );
      })}
    </div>
  );
};
