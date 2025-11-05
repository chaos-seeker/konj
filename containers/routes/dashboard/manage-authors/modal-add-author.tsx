"use client";

import { useState } from "react";
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
import { createAuthor } from "@/actions/dashboard/manage-authors/create-author";

const authorSchema = z.object({
  fullName: z
    .string()
    .min(1, "نام الزامی است")
    .regex(/^[\u0600-\u06FF\s]+$/, "نام باید فارسی باشد"),
  slug: z
    .string()
    .min(1, "اسلاگ الزامی است")
    .regex(/^[a-z0-9-]+$/, "اسلاگ باید انگلیسی و بدون فاصله باشد"),
});

type AuthorFormValues = z.infer<typeof authorSchema>;

interface ModalAddAuthorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModalAddAuthor({ open, onOpenChange }: ModalAddAuthorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<AuthorFormValues>({
    resolver: zodResolver(authorSchema),
    defaultValues: {
      fullName: "",
      slug: "",
    },
  });

  const onSubmit = async (data: AuthorFormValues) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("slug", data.slug);
      const result = await createAuthor(formData);
      if (!result.success) {
        throw new Error(result.error || "خطا در افزودن نویسنده");
      }
      await queryClient.invalidateQueries({ queryKey: ["authors"] });
      toast.success(result.message || "نویسنده با موفقیت افزوده شد");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "خطا در افزودن نویسنده"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>افزودن نویسنده</DialogTitle>
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
                {isSubmitting ? "در حال افزودن..." : "افزودن"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
