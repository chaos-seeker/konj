"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/ui/dialog";
import { Button } from "@/ui/button";

export function ModalWelcome() {
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
  };

  const handleDashboardClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    if (typeof window !== "undefined") {
      window.location.href = href;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>خوش آمدید! 👋</DialogTitle>
          <DialogDescription>
            این یک فروشگاه فول استک آنلاین کتاب است. از لینک‌های سریع زیر برای
            دسترسی راحت‌تر استفاده کنید.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <Link
            href="/"
            onClick={handleClose}
            className="border px-3 py-2 text-center rounded-md transition-colors hover:bg-muted"
          >
            صفحه اصلی
          </Link>
          <Link
            href="/explore"
            onClick={handleClose}
            className="border px-3 py-2 text-center rounded-md transition-colors hover:bg-muted"
          >
            جستجو و فیلتر
          </Link>
          <Link
            href="/cart"
            onClick={handleClose}
            className="border px-3 py-2 text-center rounded-md transition-colors hover:bg-muted"
          >
            سبد خرید
          </Link>
          <Link
            href="/profile"
            onClick={handleClose}
            className="border px-3 py-2 text-center rounded-md transition-colors hover:bg-muted"
          >
            پروفایل
          </Link>
          <Link
            href="/dashboard/manage-books"
            onClick={(e) => handleDashboardClick(e, "/dashboard/manage-books")}
            className="border px-3 py-2 text-center rounded-md transition-colors hover:bg-muted"
          >
            مدیریت کتاب‌ها
          </Link>
          <Link
            href="/dashboard/manage-categories"
            onClick={(e) =>
              handleDashboardClick(e, "/dashboard/manage-categories")
            }
            className="border px-3 py-2 text-center rounded-md transition-colors hover:bg-muted"
          >
            مدیریت دسته‌بندی‌ها
          </Link>
          <Link
            href="/dashboard/manage-authors"
            onClick={(e) =>
              handleDashboardClick(e, "/dashboard/manage-authors")
            }
            className="border px-3 py-2 text-center rounded-md transition-colors hover:bg-muted"
          >
            مدیریت نویسندگان
          </Link>
          <Link
            href="/dashboard/manage-translators"
            onClick={(e) =>
              handleDashboardClick(e, "/dashboard/manage-translators")
            }
            className="border px-3 py-2 text-center rounded-md transition-colors hover:bg-muted"
          >
            مدیریت مترجمان
          </Link>
          <Link
            href="/dashboard/manage-publishers"
            onClick={(e) =>
              handleDashboardClick(e, "/dashboard/manage-publishers")
            }
            className="border px-3 py-2 text-center rounded-md transition-colors hover:bg-muted"
          >
            مدیریت ناشران
          </Link>
          <Link
            href="/dashboard/manage-comments"
            onClick={(e) =>
              handleDashboardClick(e, "/dashboard/manage-comments")
            }
            className="border px-3 py-2 text-center rounded-md transition-colors hover:bg-muted"
          >
            مدیریت نظرات
          </Link>
          <Link
            href="/dashboard/manage-orders"
            onClick={(e) => handleDashboardClick(e, "/dashboard/manage-orders")}
            className="border px-3 py-2 text-center rounded-md transition-colors hover:bg-muted"
          >
            مدیریت سفارش‌ها
          </Link>
          <Link
            href="/dashboard/manage-users"
            onClick={(e) => handleDashboardClick(e, "/dashboard/manage-users")}
            className="border px-3 py-2 text-center rounded-md transition-colors hover:bg-muted"
          >
            مدیریت کاربران
          </Link>
        </div>

        <div className="rounded-md border p-3 text-sm leading-6 mb-4">
          <div className="mb-2 font-medium">تکنولوژی‌های استفاده شده:</div>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
            <li>Next.js (App Router)</li>
            <li>TypeScript</li>
            <li>Tailwind CSS</li>
            <li>Supabase</li>
            <li>@tanstack/react-query</li>
            <li>nuqs (مدیریت query parameters)</li>
            <li>killua (state management)</li>
            <li>react-hook-form + zod</li>
            <li>shadcn/ui</li>
            <li>framer-motion</li>
            <li>react-hot-toast</li>
          </ul>
        </div>

        <DialogFooter>
          <Button onClick={handleClose} className="w-full">
            شروع کنید
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
