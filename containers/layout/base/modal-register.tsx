"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { register } from "@/actions/auth/register";

const registerSchema = z.object({
  fullName: z.string().min(1, "نام و نام خانوادگی الزامی است"),
  username: z.string().min(1, "نام کاربری الزامی است"),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface ModalRegisterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin?: () => void;
}

export function ModalRegister({
  open,
  onOpenChange,
  onSwitchToLogin,
}: ModalRegisterProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: { fullName: "", username: "", password: "" },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      const result = await register(values);
      if (!result.success) {
        toast.error(result.error || "خطا در ثبت‌نام");
        return;
      }
      toast.success(result.message || "ثبت‌نام با موفقیت انجام شد");
      form.reset();
      onOpenChange(false);
      // Switch to login modal after successful registration
      if (onSwitchToLogin) {
        setTimeout(() => {
          onSwitchToLogin();
        }, 500);
      }
    } catch {
      toast.error("خطا در ثبت‌نام");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ثبت‌نام</DialogTitle>
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
                    <Input
                      {...field}
                      placeholder="نام و نام خانوادگی خود را وارد کنید"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>نام کاربری</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="نام کاربری خود را وارد کنید"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رمز عبور</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="رمز عبور خود را وارد کنید"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex-col gap-2">
              <Button
                type="submit"
                disabled={!form.formState.isValid || isSubmitting}
                className="w-full h-11"
              >
                {isSubmitting ? "در حال ثبت‌نام..." : "ثبت‌نام"}
              </Button>
              {onSwitchToLogin && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    onSwitchToLogin();
                  }}
                  className="text-sm text-primary pt-1 hover:underline"
                >
                  قبلاً ثبت‌نام کرده‌اید؟ وارد شوید
                </button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
