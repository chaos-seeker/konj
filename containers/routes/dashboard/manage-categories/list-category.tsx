'use client';

import { ModalEditCategory } from './modal-edit-category';
import { deleteCategory } from '@/actions/dashboard/manage-categories/delete-category';
import { getCategories } from '@/actions/dashboard/manage-categories/get-categories';
import type { TCategory } from '@/types/category';
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

export function ListCategory() {
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<Pick<
    TCategory,
    'id' | 'name' | 'slug'
  > | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchedData = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const result = await getCategories();
      if (!result.success) {
        toast.error(result.error!);
      }
      return result.data;
    },
  });

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`آیا از حذف دسته بندی "${name}" اطمینان دارید؟`)) {
      return;
    }

    try {
      const result = await deleteCategory(slug);
      if (!result.success) {
        throw new Error(result.error || 'خطا در حذف دسته بندی');
      }

      await queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(result.message || 'دسته بندی با موفقیت حذف شد');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'خطا در حذف دسته بندی',
      );
    }
  };

  const handleEdit = (category: TCategory) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  if (fetchedData.isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
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
        <p className="text-muted-foreground">دسته بندی یافت نشد!</p>
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
              {fetchedData.data.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <code className="bg-muted rounded px-2 py-1 text-sm">
                      {category.slug}
                    </code>
                  </TableCell>
                  <TableCell>{formatDate(category.updatedAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="text-info h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDelete(category.slug, category.name)
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
      <ModalEditCategory
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        category={editingCategory}
      />
    </section>
  );
}
