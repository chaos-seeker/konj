"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import { Input } from "@/ui/input";
import toast from "react-hot-toast";
import { updateCategory } from "@/actions/dashboard/manage-categories/update-category";
import type { TCategory } from "@/types/category";

const categorySchema = z.object({
  name: z
    .string()
    .min(1, "نام الزامی است")
    .regex(/^[\u0600-\u06FF\s]+$/, "نام باید فارسی باشد"),
  slug: z
    .string()
    .min(1, "اسلاگ الزامی است")
    .regex(/^[a-z0-9-]+$/, "اسلاگ باید انگلیسی و بدون فاصله باشد"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface ModalEditCategoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Pick<TCategory, "id" | "name" | "slug"> | null;
}

export function ModalEditCategory({
  open,
  onOpenChange,
  category,
}: ModalEditCategoryProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  useEffect(() => {
    if (category && open) {
      form.reset({
        name: category.name,
        slug: category.slug,
      });
    }
  }, [category, open, form]);

  const onSubmit = async (data: CategoryFormValues) => {
    if (!category) return;
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", data.slug);
      const result = await updateCategory(category.slug, formData);
      if (!result.success) {
        throw new Error(result.error || "خطا در به‌روزرسانی دسته بندی");
      }
      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(result.message || "دسته بندی با موفقیت به‌روزرسانی شد");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "خطا در به‌روزرسانی دسته بندی"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>ویرایش دسته بندی</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسلاگ</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^a-z0-9-]/g, "");
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11"
              >
                {isSubmitting ? "در حال ذخیره..." : "ذخیره"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
