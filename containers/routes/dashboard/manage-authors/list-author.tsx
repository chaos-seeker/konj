'use client';

import { ModalEditAuthor } from './modal-edit-author';
import { deleteAuthor } from '@/actions/dashboard/manage-authors/delete-author';
import { getAuthors } from '@/actions/dashboard/manage-authors/get-authors';
import type { TAuthor } from '@/types/author';
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
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export function ListAuthor() {
  const queryClient = useQueryClient();
  const [editingAuthor, setEditingAuthor] = useState<Pick<
    TAuthor,
    'id' | 'fullName' | 'slug'
  > | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchedData = useQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      const result = await getAuthors();
      if (!result.success) {
        toast.error(result.error!);
      }
      return result.data;
    },
  });

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`آیا از حذف نویسنده "${name}" اطمینان دارید؟`)) {
      return;
    }

    try {
      const result = await deleteAuthor(slug);
      if (!result.success) {
        throw new Error(result.error || 'خطا در حذف نویسنده');
      }

      await queryClient.invalidateQueries({ queryKey: ['authors'] });
      toast.success(result.message || 'نویسنده با موفقیت حذف شد');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'خطا در حذف نویسنده',
      );
    }
  };

  const handleEdit = (author: TAuthor) => {
    setEditingAuthor(author);
    setIsEditModalOpen(true);
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
        <p className="text-muted-foreground">نویسنده‌ای یافت نشد!</p>
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
                <TableHead>نام</TableHead>
                <TableHead>اسلاگ</TableHead>
                <TableHead>تاریخ</TableHead>
                <TableHead className="w-[100px]">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fetchedData.data.map((author) => (
                <TableRow key={author.id}>
                  <TableCell className="font-medium">
                    {author.fullName}
                  </TableCell>
                  <TableCell>
                    <code className="bg-muted rounded px-2 py-1 text-sm">
                      {author.slug}
                    </code>
                  </TableCell>
                  <TableCell>{formatDate(author.updatedAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(author)}
                      >
                        <Edit className="text-info h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDelete(author.slug, author.fullName)
                        }
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
      <ModalEditAuthor
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        author={editingAuthor}
      />
    </section>
  );
}
