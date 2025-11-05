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
import { getTranslators } from "@/actions/dashboard/manage-translators/get-translators";
import { deleteTranslator } from "@/actions/dashboard/manage-translators/delete-translator";
import Image from "next/image";
import { Loader2, Edit, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/ui/button";
import { ModalEditTranslator } from "./modal-edit-translator";

export function ListTranslator() {
  const queryClient = useQueryClient();
  const [editingTranslator, setEditingTranslator] = useState<{
    id: string;
    fullName: string;
    slug: string;
  } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchedData = useQuery({
    queryKey: ["translators"],
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
        throw new Error(result.error || "خطا در حذف مترجم");
      }

      await queryClient.invalidateQueries({ queryKey: ["translators"] });
      toast.success(result.message || "مترجم با موفقیت حذف شد");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "خطا در حذف مترجم");
    }
  };

  const handleEdit = (translator: {
    id: string;
    fullName: string;
    slug: string;
  }) => {
    setEditingTranslator(translator);
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
        <p className="text-muted-foreground">مترجمی یافت نشد!</p>
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
              {fetchedData.data.map((translator) => (
                <TableRow key={translator.id}>
                  <TableCell className="font-medium">
                    {translator.fullName}
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {translator.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    {new Date(translator.createdAt).toLocaleDateString("fa-IR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(translator)}
                      >
                        <Edit className="h-4 w-4 text-info" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDelete(translator.slug, translator.fullName)
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
      <ModalEditTranslator
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        translator={editingTranslator}
      />
    </section>
  );
}
