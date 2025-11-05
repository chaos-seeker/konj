"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { getPublishers } from "@/actions/dashboard/manage-publishers/get-publishers";
import { deletePublisher } from "@/actions/dashboard/manage-publishers/delete-publisher";
import Image from "next/image";
import { Loader2, Edit, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/ui/button";
import { ModalEditPublisher } from "./modal-edit-publisher";
import type { TPublisher } from "@/types/publisher";

export function ListPublisher() {
  const queryClient = useQueryClient();
  const [editingPublisher, setEditingPublisher] = useState<Pick<
    TPublisher,
    "id" | "name" | "slug"
  > | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchedData = useQuery({
    queryKey: ["publishers"],
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
        throw new Error(result.error || "خطا در حذف ناشر");
      }

      await queryClient.invalidateQueries({ queryKey: ["publishers"] });
      toast.success(result.message || "ناشر با موفقیت حذف شد");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در حذف ناشر");
    }
  };

  const handleEdit = (publisher: TPublisher) => {
    setEditingPublisher(publisher);
    setIsEditModalOpen(true);
  };

  if (fetchedData.isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
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
        <p className="text-muted-foreground">ناشری یافت نشد!</p>
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
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {publisher.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    {new Date(publisher.updatedAt).toLocaleDateString("fa-IR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(publisher)}
                      >
                        <Edit className="h-4 w-4 text-info" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDelete(publisher.slug, publisher.name)
                        }
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
      <ModalEditPublisher
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        publisher={editingPublisher}
      />
    </section>
  );
}
