"use client";

import { useState } from "react";
import type { TBook } from "@/types/book";
import { Star } from "lucide-react";
import { Button } from "@/ui/button";
import { Textarea } from "@/ui/textarea";
import { cn } from "@/utils/cn";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/ui/form";
import { useKillua } from "killua";
import { userSlice } from "@/slices/user";
import { ModalLogin } from "@/containers/layout/base/modal-login";
import toast from "react-hot-toast";
import { addComment } from "@/actions/comments/add-comment";
import { useQueryClient } from "@tanstack/react-query";

interface AddNewCommentProps {
  book: TBook;
}

const commentSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "متن نظر الزامی است")
    .max(500, "حداکثر ۵۰۰ کاراکتر"),
  rating: z.number().min(1, "امتیاز را انتخاب کنید").max(5, "امتیاز نامعتبر"),
});

type CommentFormValues = z.infer<typeof commentSchema>;

export function AddNewComment({ book }: AddNewCommentProps) {
  const user = useKillua(userSlice);
  const isAuthenticated = user.selectors.isAuthenticated();
  const [loginOpen, setLoginOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    mode: "onChange",
    defaultValues: { text: "", rating: 0 },
  });

  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const textValue = useWatch({ control: form.control, name: "text" });
  const ratingValue = useWatch({ control: form.control, name: "rating" });
  const maxLength = 500;

  const onSubmit = async (values: CommentFormValues) => {
    if (!isAuthenticated) {
      toast.error("باید برای نظر گذاشتن ابتدا وارد شوید!");
      setLoginOpen(true);
      return;
    }

    const token = user.selectors.getToken();
    const fullName = user.selectors.getFullName();

    if (!token || !fullName) {
      toast.error("لطفاً دوباره وارد شوید");
      setLoginOpen(true);
      return;
    }

    try {
      const result = await addComment({
        bookSlug: book.slug,
        fullName,
        text: values.text,
        rating: values.rating,
        token,
      });

      if (!result.success) {
        toast.error(result.error || "خطا در ثبت نظر");
        return;
      }

      toast.success(result.message || "نظر شما با موفقیت ثبت شد");
      form.reset({ text: "", rating: 0 });
      // Invalidate comments cache to refresh the list after admin approval
      await queryClient.invalidateQueries({
        queryKey: ["book-comments", book.slug],
      });
    } catch {
      toast.error("خطا در ثبت نظر");
    }
  };

  return (
    <section>
      <div>
        <div className="p-4 rounded-xl bg-white">
          <h2 className="text-mdp font-bold mb-4">نظر شما درباره ی کتاب</h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          {...field}
                          className="w-full min-h-[120px] p-3 resize-none"
                          maxLength={maxLength}
                        />
                        <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">
                          {(textValue || "").length}/{maxLength}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const displayRating =
                              hoveredStar || ratingValue || 0;
                            const isActive = star <= displayRating;
                            return (
                              <button
                                key={star}
                                type="button"
                                onClick={() => {
                                  field.onChange(star);
                                  form.trigger("rating");
                                }}
                                onMouseEnter={() => setHoveredStar(star)}
                                onMouseLeave={() => setHoveredStar(null)}
                                className="focus:outline-none"
                              >
                                <Star
                                  className={cn("size-5 transition-colors", {
                                    "fill-warning text-warning": isActive,
                                    "text-muted-foreground": !isActive,
                                  })}
                                />
                              </button>
                            );
                          })}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          امتیاز شما به این کتاب
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
                className="w-full h-12 bg-primary text-primary-foreground"
              >
                {form.formState.isSubmitting ? "در حال ثبت..." : "ثبت نظر"}
              </Button>
            </form>
          </Form>
          <ModalLogin open={loginOpen} onOpenChange={setLoginOpen} />
        </div>
      </div>
    </section>
  );
}
