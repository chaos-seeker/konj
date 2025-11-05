"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { getBooks } from "@/actions/dashboard/manage-books/get-books";
import { deleteBook } from "@/actions/dashboard/manage-books/delete-book";
import Image from "next/image";
import { Loader2, Edit, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/ui/button";
import Link from "next/link";
import type { TBook } from "@/types/book";

export function ListBook() {
  const queryClient = useQueryClient();

  const fetchedData = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const result = await getBooks();
      if (!result.success) {
        toast.error(result.error!);
      }
      return result.data;
    },
  });

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`آیا از حذف کتاب "${name}" اطمینان دارید؟`)) {
      return;
    }

    try {
      const result = await deleteBook(slug);
      if (!result.success) {
        throw new Error(result.error || "خطا در حذف کتاب");
      }

      await queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success(result.message || "کتاب با موفقیت حذف شد");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در حذف کتاب");
    }
  };

  if (fetchedData.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!fetchedData.data || fetchedData.data.length === 0) {
    return (
      <div className="items-center flex flex-col gap-6 justify-center py-10">
        <Image
          src="/images/global/not-found.png"
          alt="empty"
          width={200}
          height={200}
        />
        <p className="text-muted-foreground">کتابی یافت نشد!</p>
      </div>
    );
  }

  return (
    <section>
      <div className="container">
        <div className="rounded-xl border bg-white border-slate-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>تصویر</TableHead>
                <TableHead>نام</TableHead>
                <TableHead>دسته بندی</TableHead>
                <TableHead>ناشر</TableHead>
                <TableHead>قیمت</TableHead>
                <TableHead>تاریخ</TableHead>
                <TableHead className="w-[100px]">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fetchedData.data.map((book: TBook) => (
                <TableRow key={book.id}>
                  <TableCell>
                    {book.image ? (
                      <Image
                        src={book.image}
                        alt={book.name}
                        width={50}
                        height={50}
                        className="rounded object-cover"
                      />
                    ) : (
                      <div className="w-[50px] h-[50px] bg-muted rounded" />
                    )}
                  </TableCell>
                  <TableCell>{book.name}</TableCell>
                  <TableCell>{book.category.name}</TableCell>
                  <TableCell>{book.publisher.name}</TableCell>
                  <TableCell>
                    {book.discount ? (
                      <div className="flex flex-col">
                        <span className="line-through text-muted-foreground text-sm">
                          {book.price.toLocaleString()} تومان
                        </span>
                        <span>
                          {(
                            book.price *
                            (1 - book.discount / 100)
                          ).toLocaleString()}{" "}
                          تومان ({book.discount}%)
                        </span>
                      </div>
                    ) : (
                      <span>{book.price.toLocaleString()} تومان</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(book.updatedAt).toLocaleDateString("fa-IR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link
                          href={`/dashboard/manage-books/${book.slug}/edit`}
                        >
                          <Edit className="h-4 w-4 text-info" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(book.slug, book.name)}
                      >
                        <Trash2 className="h-4 w-4 text-error" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
