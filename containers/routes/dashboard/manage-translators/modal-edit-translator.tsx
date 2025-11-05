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
import { updateTranslator } from "@/actions/dashboard/manage-translators/update-translator";
import type { TTranslator } from "@/types/translator";

const translatorSchema = z.object({
  fullName: z
    .string()
    .min(1, "نام الزامی است")
    .regex(/^[\u0600-\u06FF\s]+$/, "نام باید فارسی باشد"),
  slug: z
    .string()
    .min(1, "اسلاگ الزامی است")
    .regex(/^[a-z0-9-]+$/, "اسلاگ باید انگلیسی و بدون فاصله باشد"),
});

type TranslatorFormValues = z.infer<typeof translatorSchema>;

interface ModalEditTranslatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  translator: Pick<TTranslator, "id" | "fullName" | "slug"> | null;
}

export function ModalEditTranslator({
  open,
  onOpenChange,
  translator,
}: ModalEditTranslatorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<TranslatorFormValues>({
    resolver: zodResolver(translatorSchema),
    defaultValues: {
      fullName: "",
      slug: "",
    },
  });
  useEffect(() => {
    if (translator && open) {
      form.reset({
        fullName: translator.fullName,
        slug: translator.slug,
      });
    }
  }, [translator, open, form]);
  const onSubmit = async (data: TranslatorFormValues) => {
    if (!translator) return;
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("slug", data.slug);
      const result = await updateTranslator(translator.slug, formData);
      if (!result.success) {
        throw new Error(result.error || "خطا در به‌روزرسانی مترجم");
      }
      await queryClient.invalidateQueries({ queryKey: ["translators"] });
      toast.success(result.message || "مترجم با موفقیت به‌روزرسانی شد");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "خطا در به‌روزرسانی مترجم"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>ویرایش مترجم</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام و نام خانوادگی</FormLabel>
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
