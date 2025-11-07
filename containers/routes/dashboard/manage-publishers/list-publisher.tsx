'use client';

import { ModalEditPublisher } from './modal-edit-publisher';
import { deletePublisher } from '@/actions/dashboard/manage-publishers/delete-publisher';
import { getPublishers } from '@/actions/dashboard/manage-publishers/get-publishers';
import type { TPublisher } from '@/types/publisher';
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

export function ListPublisher() {
  const queryClient = useQueryClient();
  const [editingPublisher, setEditingPublisher] = useState<Pick<
    TPublisher,
    'id' | 'name' | 'slug'
  > | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchedData = useQuery({
    queryKey: ['publishers'],
    queryFn: async () => {
      const result = await getPublishers();
      if (!result.success) {
        toast.error(result.error!);
      }
      return result.data;
    },
  });

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`آیا از حذف ناشر "${name}" اطمینان دارید؟`)) {
      return;
    }

    try {
      const result = await deletePublisher(slug);
      if (!result.success) {
        throw new Error(result.error || 'خطا در حذف ناشر');
      }

      await queryClient.invalidateQueries({ queryKey: ['publishers'] });
      toast.success(result.message || 'ناشر با موفقیت حذف شد');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'خطا در حذف ناشر');
    }
  };

  const handleEdit = (publisher: TPublisher) => {
    setEditingPublisher(publisher);
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
        <p className="text-muted-foreground">ناشری یافت نشد!</p>
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
              {fetchedData.data.map((publisher) => (
                <TableRow key={publisher.id}>
                  <TableCell className="font-medium">
                    {publisher.name}
                  </TableCell>
                  <TableCell>
                    <code className="bg-muted rounded px-2 py-1 text-sm">
                      {publisher.slug}
                    </code>
                  </TableCell>
                  <TableCell>{formatDate(publisher.updatedAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(publisher)}
                      >
                        <Edit className="text-info h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDelete(publisher.slug, publisher.name)
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
      <ModalEditPublisher
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        publisher={editingPublisher}
      />
    </section>
  );
}
