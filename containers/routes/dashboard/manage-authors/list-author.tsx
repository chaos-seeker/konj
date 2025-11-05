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
import { getAuthors } from "@/actions/dashboard/manage-authors/get-authors";
import { deleteAuthor } from "@/actions/dashboard/manage-authors/delete-author";
import Image from "next/image";
import { Loader2, Edit, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/ui/button";
import { ModalEditAuthor } from "./modal-edit-author";

export function ListAuthor() {
  const queryClient = useQueryClient();
  const [editingAuthor, setEditingAuthor] = useState<{
    id: string;
    fullName: string;
    slug: string;
  } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchedData = useQuery({
    queryKey: ["authors"],
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
        throw new Error(result.error || "خطا در حذف نویسنده");
      }

      await queryClient.invalidateQueries({ queryKey: ["authors"] });
      toast.success(result.message || "نویسنده با موفقیت حذف شد");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "خطا در حذف نویسنده"
      );
    }
  };

  const handleEdit = (author: {
    id: string;
    fullName: string;
    slug: string;
  }) => {
    setEditingAuthor(author);
    setIsEditModalOpen(true);
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
        <p className="text-muted-foreground">نویسنده‌ای یافت نشد!</p>
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
                <TableHead>تاریخ ایجاد</TableHead>
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
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {author.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    {new Date(author.createdAt).toLocaleDateString("fa-IR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(author)}
                      >
                        <Edit className="h-4 w-4 text-info" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDelete(author.slug, author.fullName)
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
      <ModalEditAuthor
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        author={editingAuthor}
      />
    </section>
  );
}
