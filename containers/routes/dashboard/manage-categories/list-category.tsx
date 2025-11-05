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
import { getCategories } from "@/actions/dashboard/manage-categories/get-categories";
import { deleteCategory } from "@/actions/dashboard/manage-categories/delete-category";
import Image from "next/image";
import { Loader2, Edit, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/ui/button";
import { ModalEditCategory } from "./modal-edit-category";
import type { TCategory } from "@/types/category";
import { formatDate } from "@/utils/format-date";

export function ListCategory() {
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<Pick<
    TCategory,
    "id" | "name" | "slug"
  > | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchedData = useQuery({
    queryKey: ["categories"],
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
        throw new Error(result.error || "خطا در حذف دسته بندی");
      }

      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(result.message || "دسته بندی با موفقیت حذف شد");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "خطا در حذف دسته بندی"
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
        <p className="text-muted-foreground">دسته بندی یافت نشد!</p>
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
              {fetchedData.data.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
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
                        <Edit className="h-4 w-4 text-info" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDelete(category.slug, category.name)
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
      <ModalEditCategory
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        category={editingCategory}
      />
    </section>
  );
}
