'use client';

import { ModalEditTranslator } from './modal-edit-translator';
import { deleteTranslator } from '@/actions/dashboard/manage-translators/delete-translator';
import { getTranslators } from '@/actions/dashboard/manage-translators/get-translators';
import type { TTranslator } from '@/types/translator';
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

export function ListTranslator() {
  const queryClient = useQueryClient();
  const [editingTranslator, setEditingTranslator] = useState<Pick<
    TTranslator,
    'id' | 'fullName' | 'slug'
  > | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchedData = useQuery({
    queryKey: ['translators'],
    queryFn: async () => {
      const result = await getTranslators();
      if (!result.success) {
        toast.error(result.error!);
      }
      return result.data;
    },
  });

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`آیا از حذف مترجم "${name}" اطمینان دارید؟`)) {
      return;
    }

    try {
      const result = await deleteTranslator(slug);
      if (!result.success) {
        throw new Error(result.error || 'خطا در حذف مترجم');
      }

      await queryClient.invalidateQueries({ queryKey: ['translators'] });
      toast.success(result.message || 'مترجم با موفقیت حذف شد');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'خطا در حذف مترجم');
    }
  };

  const handleEdit = (translator: TTranslator) => {
    setEditingTranslator(translator);
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
        <p className="text-muted-foreground">مترجمی یافت نشد!</p>
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
              {fetchedData.data.map((translator) => (
                <TableRow key={translator.id}>
                  <TableCell className="font-medium">
                    {translator.fullName}
                  </TableCell>
                  <TableCell>
                    <code className="bg-muted rounded px-2 py-1 text-sm">
                      {translator.slug}
                    </code>
                  </TableCell>
                  <TableCell>{formatDate(translator.updatedAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(translator)}
                      >
                        <Edit className="text-info h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDelete(translator.slug, translator.fullName)
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
      <ModalEditTranslator
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        translator={editingTranslator}
      />
    </section>
  );
}
