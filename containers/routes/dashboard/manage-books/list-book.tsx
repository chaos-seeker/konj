'use client';

import { deleteBook } from '@/actions/dashboard/manage-books/delete-book';
import { getBooks } from '@/actions/dashboard/manage-books/get-books';
import type { TBook } from '@/types/book';
import { Button } from '@/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table';
import { formatDate } from '@/utils/format-date';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Loader2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export function ListBook() {
  const queryClient = useQueryClient();

  const fetchedData = useQuery({
    queryKey: ['books'],
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
        throw new Error(result.error || 'خطا در حذف کتاب');
      }

      await queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success(result.message || 'کتاب با موفقیت حذف شد');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'خطا در حذف کتاب');
    }
  };

  if (fetchedData.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!fetchedData.data || fetchedData.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-10">
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
        <div className="rounded-xl border border-slate-200 bg-white">
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
                      <div className="bg-muted h-[50px] w-[50px] rounded" />
                    )}
                  </TableCell>
                  <TableCell>{book.name}</TableCell>
                  <TableCell>{book.category.name}</TableCell>
                  <TableCell>{book.publisher.name}</TableCell>
                  <TableCell>
                    {book.discount ? (
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm line-through">
                          {book.price.toLocaleString()} تومان
                        </span>
                        <span>
                          {(
                            book.price *
                            (1 - book.discount / 100)
                          ).toLocaleString()}{' '}
                          تومان ({book.discount}%)
                        </span>
                      </div>
                    ) : (
                      <span>{book.price.toLocaleString()} تومان</span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(book.updatedAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link
                          href={`/dashboard/manage-books/${book.slug}/edit`}
                        >
                          <Edit className="text-info h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(book.slug, book.name)}
                      >
                        <Trash2 className="text-error h-4 w-4" />
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
